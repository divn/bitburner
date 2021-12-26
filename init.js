/**
 * @Author: Juuso Takala
 * @Date:   2021-12-26 09:09:25
 * @Last Modified by:   Juuso Takala
 * @Last Modified time: 2021-12-26 09:18:50
 */
let baseUrl = 'https://github.com/divn/bitburner/blob/master/';
let url = path => `${baseUrl}${path}`;

async function get(ns, path) {
    return await ns.wget(url(path), path.split('/').pop());
}

export async function main(ns) {
    let files = ['hack.js', 'hacknet.js', 'manager.js'];
    for (let i in files)
        await get(ns, files[i]);
    ns.tprint('<span style="color:white">Done updating!</span>');
}