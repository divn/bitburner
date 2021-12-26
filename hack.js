/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 08:59:34
 * @Last Modified by:   Your name
 * @Last Modified time: 2021-12-26 09:03:49
 */
/** @param {import(".").NS } ns */
export async function main(ns) {
    let target = args[0]
    let moneyThresh = getServerMaxMoney * .75;
    let securityThresh = Math.round(getServerMinSecurityLevel(target) + 5);

    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            ns.grow(target);
        } else {
            ns.hack(target);
        }
    }
}