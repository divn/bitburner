/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 09:09:25
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-26 16:43:06
 */
let baseUrl = 'https://raw.githubusercontent.com/divn/bitburner/master/';

export async function main(ns) {
    let files = ['hack.js', 'hacknet.js', 'manager.js'];
    for (let i in files) {
        await ns.wget(`${baseUrl}${files[i]}`, `${baseUrl}${files[i]}`.split('/').pop());
    }
    ns.tprint('Done updating!');
    //Remove when u get more ram on home computer
    //ns.run('hacknet.js')
    //ns.tprint('Running hacknet manager!');
    ns.run('manager.js')
    ns.tprint('Running script manager!');
}