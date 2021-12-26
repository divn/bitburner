/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 08:49:01
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-26 10:33:08
 */
/** @param {import(".").NS } ns */
export async function main(ns) {
    while (true) {
        let timesrunned = 0;
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

            if (ns.fileExists("BruteSSH.exe", "home")) {
                count++;
            }
            if (ns.fileExists("FTPCrack.exe", "home")) {
                count++;
            }
            if (ns.fileExists("relaySMTP.exe", "home")) {
                count++;
            }
            if (ns.fileExists("HTTPWorm.exe", "home")) {
                count++;
            }
            if (ns.fileExists("SQLInject.exe", "home")) {
                count++;
            }

            ns.tprint(count + " Programs found from home")
            return count;
        }

        // try to open every port we can
        function breakPorts(hostname) {
            if (ns.fileExists("BruteSSH.exe", "home")) {
                ns.tprint("Using BruteSSH.exe on" + hostname)
                ns.brutessh(hostname);
            }
            if (ns.fileExists("FTPCrack.exe", "home")) {
                ns.tprint("Using FTPCrack.exe on" + hostname)
                ns.ftpcrack(hostname);
            }
            if (ns.fileExists("relaySMTP.exe", "home")) {
                ns.tprint("Using relaySMTP.exe on" + hostname);
                ns.relaysmtp(hostname);
            }
            if (ns.fileExists("HTTPWorm.exe", "home")) {
                ns.tprint("Using HTTPWorm.exe on" + hostname)
                ns.httpworm(hostname);
            }
            if (ns.fileExists("SQLInject.exe", "home")) {
                ns.tprint("Using SQLInject.exe" + hostname)
                ns.sqlinject(hostname);
            }
        }
        let usedram = 0
        let threads = 1
        let ram = 0
        let cost = 0
        let sleeptime = 30000
        let i = 0;
        let programcount = countPrograms()

        while (i < servers.length) {

            if (servers[i] === "home") {
                i++
                ns.tprint("Skipped home")
            }

            if (await ns.getHackingLevel() >= await ns.getServerRequiredHackingLevel(servers[i])) {
                while (programcount < await ns.getServerNumPortsRequired(servers[i])) {
                    ns.tprint('Skipped ' + servers[i] + ' Not enough port hackers')
                    i++
                }

                if (!ns.hasRootAccess) {
                    await breakPorts(servers[i]);
                    await ns.nuke(servers[i]);
                    ns.tprint("Nuked " + servers[i])
                }

                if (ns.getServerMaxMoney(servers[i]) <= 0) {
                    ns.tprint("No money on " + servers[i])
                    i++
                }

                await ns.scp("hack.js", servers[i]);

                ram = await ns.getServerMaxRam(servers[i]);
                cost = await ns.getScriptRam("hack.js");
                threads = parseInt((ram - usedram) / cost)
                ns.tprint("Running hack.js on " + servers[i])
                await ns.exec("hack.js", servers[i], threads, servers[i]);

                if (threads <= 0) {
                    await ns.exec("hack.js", servers[i], threads, servers[i]);
                    ns.tprint("Not enough RAM to run hack.js on " + servers[i])
                }

                i++;
            }
            else {
                ns.tprint('Skipped ' + servers[i] + ' Not enough hacking')
                i++
            }
        }
        //Sleep for 30min and run again
        timesrunned += 1;
        ns.tprint("Runned " + timesrunned)
        ns.sleep(1800000)
    }
}