/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 08:59:34
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-26 09:40:06
 */
/** @param {import(".").NS } ns */
export async function main(ns) {
    let target = args[0]
    let moneyThresh = getServerMaxMoney * .75;
    let securityThresh = Math.round(await getServerMinSecurityLevel(target) + 5);

    while (true) {
        if (await ns.getServerSecurityLevel(target) > securityThresh) {
            await weaken(target);
        } else if (await ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}