/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 08:49:01
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-28 21:53:24
 */
/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog("ALL")

    let timesrunned = 0;
    let hackscript = ns.args[0]
    let servers = [];
    let serverlist = ["home"]
    let targetserver = ''
    let targetserverscore = 0

    if (ns.args.length === 0) {
        ns.tprintf("Usage: run manager.js PATH_TO_HACK")
        return
    }

    if (!ns.fileExists(hackscript)) {
        ns.tprintf("Hack script " + hackscript + " not found")
        return
    }

    ns.tail()

    while (true) {


        for (let i = 0; i < serverlist.length; ++i) {

            let hostname = serverlist[i];
            servers.push(hostname)
            bestServer(hostname)

            let newScan = ns.scan(hostname);
            for (let j = 0; j < newScan.length; j++) {
                if (serverlist.indexOf(newScan[j]) == -1) {
                    serverlist.push(newScan[j]);
                    bestServer(hostname)
                }
            }

        }
        ns.print("Network mapped.");
        ns.print('target server is ' + targetserver + ' with score ' + targetserverscore)

        function bestServer(server) {

            let servervMaxMoney = ns.getServerMaxMoney(server);
            let servervMinSec = ns.getServerMinSecurityLevel(server);
            let servervGrowthRate = ns.getServerGrowth(server);
            let serverHackTime = ns.getHackTime(server);
            let serverScore = (100 - servervMinSec) * (servervMaxMoney * servervMaxMoney) * servervGrowthRate / serverHackTime / 1000000;
            if (targetserverscore < serverScore && ns.hasRootAccess(server)) {
                targetserver = server
                targetserverscore = serverScore
            }
        }

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

            ns.print(count + " Programs found from home")
            return count;
        }

        function breakPorts(hostname) {
            if (ns.fileExists("BruteSSH.exe", "home")) {
                ns.print("Using BruteSSH.exe on " + hostname)
                ns.brutessh(hostname);
            }
            if (ns.fileExists("FTPCrack.exe", "home")) {
                ns.print("Using FTPCrack.exe on " + hostname)
                ns.ftpcrack(hostname);
            }
            if (ns.fileExists("relaySMTP.exe", "home")) {
                ns.print("Using relaySMTP.exe on " + hostname);
                ns.relaysmtp(hostname);
            }
            if (ns.fileExists("HTTPWorm.exe", "home")) {
                ns.print("Using HTTPWorm.exe on " + hostname)
                ns.httpworm(hostname);
            }
            if (ns.fileExists("SQLInject.exe", "home")) {
                ns.print("Using SQLInject.exe " + hostname)
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
                ns.print("Skipped home")
                continue
            }

            if (await ns.getHackingLevel() >= await ns.getServerRequiredHackingLevel(servers[i])) {
                if (programcount < await ns.getServerNumPortsRequired(servers[i]) && !ns.hasRootAccess(servers[i])) {
                    ns.print('Skipped ' + servers[i] + ' Not enough port hackers')
                    continue
                }

                if (!ns.hasRootAccess(servers[i])) {
                    if (programcount > 0) {
                        await breakPorts(servers[i]);
                    }
                    await ns.nuke(servers[i]);
                    ns.print("Nuked " + servers[i])
                }

                ram = await ns.getServerMaxRam(servers[i]);
                cost = await ns.getScriptRam(hackscript, "home");
                threads = parseInt((ram - usedram) / cost)

                if (threads <= 0) {
                    ns.print("Not enough RAM to run " + hackscript + " on " + servers[i])
                    continue
                }

                if (ns.isRunning(hackscript, servers[i], targetserver)) {
                    ns.print("Hack already running with same args on " + servers[i])
                    continue
                }

                //if (ns.isRunning(hackscript, servers[i])) {
                //    ns.kill(hackscript, servers[i])
                //    ns.print("Updating target running " + hackscript)
                //    await ns.scp(hackscript, servers[i]);
                //    await ns.exec(hackscript, servers[i], threads, targetserver);
                //    continue
                //}

                ns.killall(servers[i])
                await ns.scp(hackscript, servers[i]);
                await ns.exec(hackscript, servers[i], threads, targetserver);
                ns.print("Running " + hackscript + " on " + servers[i] + " Target: " + targetserver)
                continue
            }
            else {
                //ns.print('Skipped ' + servers[i] + ' Not enough hacking')
                continue
            }
        }
        //Sleep for 10min and run again
        timesrunned += 1;
        ns.print("Executed " + timesrunned + " times")
        await ns.sleep(600000)
    }
}