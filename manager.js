/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 08:49:01
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-26 12:08:21
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
        let programcount = countPrograms()

        for (let i = 0; i < servers.length; i++) {
            await ns.sleep(1000)

            if (servers[i] === "home") {
                ns.tprint("Skipped home")
                continue
            }

            if (await ns.getHackingLevel() >= await ns.getServerRequiredHackingLevel(servers[i])) {
                if (programcount < await ns.getServerNumPortsRequired(servers[i])) {
                    ns.tprint('Skipped ' + servers[i] + ' Not enough port hackers')
                    continue
                }

                if (!ns.hasRootAccess(servers[i])) {
                    if (programcount > 0) {
                        await breakPorts(servers[i]);
                    }
                    await ns.nuke(servers[i]);
                    ns.tprint("Nuked " + servers[i])
                }

                if (ns.getServerMaxMoney(servers[i]) <= 0) {
                    ns.tprint("No money on " + servers[i])
                    continue
                }

                ram = await ns.getServerMaxRam(servers[i]);
                cost = await ns.getScriptRam("hack.js", "home");
                threads = parseInt((ram - usedram) / cost)

                if (threads <= 0) {
                    await ns.exec("hack.js", servers[i], threads, servers[i]);
                    ns.tprint("Not enough RAM to run hack.js on " + servers[i])
                    continue
                }

                await ns.scp("hack.js", servers[i]);
                ns.tprint("Running hack.js on " + servers[i])
                await ns.exec("hack.js", servers[i], threads, servers[i]);
                continue
            }
            else {
                ns.tprint('Skipped ' + servers[i] + ' Not enough hacking')
                continue
            }
        }
        //Sleep for 10min and run again
        timesrunned += 1;
        ns.tprint("Runned " + timesrunned)
        await ns.sleep(600000)
    }
}