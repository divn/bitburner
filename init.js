/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 09:09:25
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-26 09:28:45
 */
let baseUrl = 'https://raw.githubusercontent.com/divn/bitburner/master/';
let url = path => `${baseUrl}${path}`;

async function get(ns, path) {
    return await ns.wget(url(path), path.split('/').pop());
}

export async function main(ns) {
    let files = ['hack.js', 'hacknet.js', 'manager.js'];
    for (let i in files)
        await get(ns, files[i]);
    ns.tprint('Done updating!');
}