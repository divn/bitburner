/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 09:09:25
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-27 21:53:21
 */
let baseUrl = 'https://raw.githubusercontent.com/divn/bitburner/master/';

export async function main(ns) {
    let files = ['hack.js', 'hacknet.js', 'manager.js'];
    for (let i in files) {
        await ns.wget(`${baseUrl}${files[i]}`, `${baseUrl}${files[i]}`.split('/').pop());
    }
    ns.tprint('Done updating!');
}