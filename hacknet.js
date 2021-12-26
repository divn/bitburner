/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 08:59:16
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-26 09:11:44
 */
/** @param {import(".").NS } ns */
export async function main(ns) {

    /* 
    ns.hacknet-auto.script for Bitburner v0.47.2
    Winners don't use copyright
    
    Latest version of this script should be at
        https://github.com/iuriguilherme/netscripts.d
    Bitburner should be at https://github.com/danielyxie/bitburner
    
    This script requires 5.70 GB of RAM to run for 1 thread(s)
    
    This script will buy a ns.hacknet Node, fully upgrade it and then buy the next
    one in an infinite loop. If the cost of the next upgrade is higher than 
    buying a new ns.hacknet Node, then a new one will be bought before the last one
    is upgraded. There is an option to set the budget limit.
*/

    // We will not buy anything if there's less money than this ammount
    var reserveMoney = 1000;
    // Number of times to upgrade (shouldn't have to change this)
    var n = 1;

    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");

    // Buy first ns.hacknetNode if there are none
    if (
        ns.hacknet.numNodes() === 0 &&
        ns.getServerMoneyAvailable("home") >= reserveMoney
    ) {
        ns.hacknet.purchaseNode();
        ns.print(
            "Purchased " +
            ns.hacknet.getNodeStats((ns.hacknet.numNodes() - 1)).name +
            " because there was none."
        );
    }

    // If there are no ns.hacknet Nodes, we can't do anything, so the script ends.
    while (ns.hacknet.numNodes() > 0) {
        // If there is not enough money, we wait for it instead of ending the loop.
        while (ns.getServerMoneyAvailable("home") >= reserveMoney) {
            for (var i = 0; i < ns.hacknet.numNodes(); i++) {
                while (
                    ns.hacknet.getLevelUpgradeCost(i, n) < Infinity &&
                    ns.hacknet.upgradeLevel(i, n)
                ) {
                    ns.print(
                        "Upgraded " +
                        ns.hacknet.getNodeStats(i).name +
                        " to level " +
                        ns.hacknet.getNodeStats(i).level
                    );
                    await ns.sleep(100);
                }
                while (
                    ns.hacknet.getRamUpgradeCost(i, n) < Infinity &&
                    ns.hacknet.upgradeRam(i, n)
                ) {
                    ns.print(
                        "Upgraded " +
                        ns.hacknet.getNodeStats(i).name +
                        " RAM to " +
                        ns.hacknet.getNodeStats(i).ram
                    );
                    await ns.sleep(100);
                }
                while (
                    ns.hacknet.getCoreUpgradeCost(i, n) < Infinity &&
                    ns.hacknet.upgradeCore(i, n)
                ) {
                    ns.print(
                        "Upgraded " +
                        ns.hacknet.getNodeStats(i).name +
                        " core to " +
                        ns.hacknet.getNodeStats(i).cores
                    );
                    await ns.sleep(100);
                }
            } // END for (i = 0; i < ns.hacknet.numNodes(); i++)
            /*
                Buy next ns.hacknet Node if the last one is already fully upgraded.
                If for some reason the last ns.hacknet Node is fully upgraded and the
                others don't, the loop above will still attempt to upgrade them all.
            */
            if (
                ns.hacknet.getLevelUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity &&
                ns.hacknet.getRamUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity &&
                ns.hacknet.getCoreUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity
            ) {
                // Only buy nodes up to 23. Past that its not really worth it.
                if (ns.hacknet.numNodes() < 23) {
                    ns.hacknet.purchaseNode();

                    ns.print(
                        "Purchased " +
                        ns.hacknet.getNodeStats((ns.hacknet.numNodes() - 1)).name +
                        " because the last one couldn't be upgraded further."
                    );
                }
            } else if (
                /*
                Or buy the next ns.hacknet Node if the next upgrade is more expensive
                than buying a new ns.hacknet Node.
                */
                ns.hacknet.getLevelUpgradeCost((ns.hacknet.numNodes() - 1), n) > ns.hacknet.getPurchaseNodeCost() &&
                ns.hacknet.getRamUpgradeCost((ns.hacknet.numNodes() - 1), n) > ns.hacknet.getPurchaseNodeCost() &&
                ns.hacknet.getCoreUpgradeCost((ns.hacknet.numNodes() - 1), n) > ns.hacknet.getPurchaseNodeCost()
            ) {
                ns.hacknet.purchaseNode();
                ns.print(
                    "Purchased " +
                    ns.hacknet.getNodeStats((ns.hacknet.numNodes() - 1)).name +
                    " because it was cheaper than next upgrade for the last one."
                );
            }
            await ns.sleep(100);
        }
        await ns.sleep(100);
    }
};