/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 08:59:34
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-26 09:47:51
 */
/** @param {import(".").NS } ns */
export async function main(ns) {
    let target = ns.args[0]
    let moneyThresh = await ns.getServerMaxMoney * .75;
    let securityThresh = Math.round(await ns.getServerMinSecurityLevel(target) + 5);

    while (true) {
        if (await ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (await ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}