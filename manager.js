/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 08:49:01
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-26 09:11:55
 */
/** @param {import(".").NS } ns */
export async function main(ns) {
    let servers = [];
    let serverlist = ["home"]

    for (let i = 0; i < serverlist.length; ++i) {

        let hostname = serverlist[i];
        servers.push(hostname)

        let newScan = ns.scan(hostname);
        for (let j = 0; j < newScan.length; j++) {
            if (serverlist.indexOf(newScan[j]) == -1) {
                serverlist.push(newScan[j]);
            }
        }
    }
    ns.tprint("Network mapped.");

    function countPrograms() {
        var count = 0;

        if (ns.fileExists("BruteSSH.exe"))
            count++;
        if (ns.fileExists("FTPCrack.exe"))
            count++;
        if (ns.fileExists("relaySMTP.exe"))
            count++;
        if (ns.fileExists("HTTPWorm.exe"))
            count++;
        if (ns.fileExists("SQLInject.exe"))
            count++;

        return count;
    }

    // try to open every port we can
    function breakPorts(hostname) {
        if (ns.fileExists("BruteSSH.exe"))
            ns.brutessh(hostname);
        if (ns.fileExists("FTPCrack.exe"))
            ns.ftpcrack(hostname);
        if (ns.fileExists("relaySMTP.exe"))
            ns.relaysmtp(hostname);
        if (ns.fileExists("HTTPWorm.exe"))
            ns.httpworm(hostname);
        if (ns.fileExists("SQLInject.exe"))
            ns.sqlinject(hostname);
    }
    let usedram = 0
    let threads = 1
    let ram = 0
    let cost = 0
    let sleeptime = 30000
    let i = 0;

    while (i < servers.length) {

        if (await ns.getHackingLevel() >= await ns.getServerRequiredHackingLevel(servers[i])) {
            while (countPrograms() < await ns.getServerNumPortsRequired(servers[i])) {
                ns.tprint('Skipped ' + servers[i] + ' Not enough port hackers')
                i++
            }

            breakPorts(servers[i]);
            await ns.nuke(servers[i]);

            await ns.scp("hack.script", servers[i]);

            ram = await ns.getServerMaxRam(servers[i]);
            cost = await ns.getScriptRam("hack.script");
            threads = parseInt((ram - usedram) / cost)
            await ns.exec("hack.script", servers[i], threads, servers[i]);


            i++;
        }
        else {
            ns.tprint('Skipped ' + servers[i] + ' Not enough hacking')
            i++
        }
    }

}