import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let siteKey = '';
let siteType = 0;
const PC_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36';

let host = 'https://www.91panta.cn/';
let headers = {
    'User-Agent': PC_UA,
    'Referer': 'https://yun.139.com'
};
let auth = '';
let phone = '';
async function request(reqUrl, data, header, method) {
    let res = await req(reqUrl, {
        method: method || 'get',
        data: data || '',
        headers: header || headers,
        postType: method === 'post' ? 'form-data' : '',
        timeout: 10000,
    });
    return res.content;
}

async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    try {
        auth = await request('http://127.0.0.1:9978/file/leospring/yd.txt');
        phone = base64Decode(auth).split(':')[1];
    } catch (e) {
        auth = '';
    }
}

async function home(filter) {
    let $ = load(await request(host));
    let classes = _.map($('#tabNavigation > a.tab'),item =>{
        return {
            type_id: $(item).attr('href'),
            type_name: $(item).text().trim(),
        }
    });
    return JSON.stringify({
        class: classes,
    });
}

async function category(tid, pg, filter, extend) {
    if(tid.startsWith('?tagId=')) {
        let $ = load(await request(host + tid + '&page=' + pg));
        let list = _.map($('.topicList > .topicItem'), item => {
            let pic = $(item).find('a.avatarLink img').attr('src');
            let picDoc = $(item).find('.detail .tm-m-photos-thumb');
            if (picDoc.length > 0) {
                pic = $(picDoc).find('li').attr('data-src');
            }
            let contentDoc = $(item).find('.content > h2 > a');
            return {
                vod_id: contentDoc.attr('href'),
                vod_name: contentDoc.text(),
                vod_pic: host + pic,
                vod_tag: 'folder',
              	style: {
                  type: 'list'
                }
            }
        });
        return JSON.stringify({
            page: pg,
            pagecount: 9999,
            list: list,
        });
    }
    if (tid.startsWith('thread')) {
        let list = [];
        let $ = load(await request(host + tid));
        let linkDocs = $('.topicContent a');
        if(linkDocs.length == 1) {
            let fid = $(linkDocs[0]).attr('href').split('?')[1];
            return await getSubCate(fid, pg, filter, extend);
        }
        if (linkDocs.length > 1) {
            let text = $('.topicContent').text().split('\n\n');
            for (let i = 0; i < text.length; i++) {
                let line = text[i].trim();
                let arr = line.split('https://caiyun.139.com/m/i?');
                if(arr.length > 1) {
                    if(arr[0].trim()) {
                        list.push({
                            vod_id: arr[1].trim() + '__root',
                            vod_name: arr[0].trim(),
                            vod_tag: 'folder',
                          	style: {
                              type: 'list'
                            }
                        })
                    } else if(text[i-1] && text[i-1].trim().indexOf('http') == -1) {
                        list.push({
                            vod_id: arr[1].trim() + '__root',
                            vod_name: text[i-1].trim(),
                            vod_tag: 'folder',
                          	style: {
                              type: 'list'
                            }
                        })
                    }

                }
            }
        }
        return JSON.stringify({
            page: pg,
            pagecount: 1,
            list: list,
        });
    }
    if(tid.indexOf('__') > 0) {
        return await getSubCate(tid, pg, filter, extend);
    }
    
}

async function getSubCate(tid, pg, filter, extend) {
    let fid = tid.split('__')[0];
    let path = tid.split('__')[1];
    let ret = await getVideoInfo(fid, path || 'root');
    let list = [];
    if(ret.data.caLst) {
        _.forEach(ret.data.caLst, item => {
            list.push({
                vod_id: fid + '__' + item.path,
                vod_name: item.caName,
                vod_tag: 'folder',
              	style: {
                  type: 'list'
                }
            })
        })
    }
    if(ret.data.coLst) {
        _.forEach(ret.data.coLst, item => {
            if(item.coType == 2 || item.coType == 3) {
                list.push({
                    vod_id: fid + '__' + item.path,
                    vod_name: item.coName,
                    vod_pic: item.thumbnailURL,
                    style: {
                      type: 'list'
                    }
                });
            };
        })
    }
  	list.sort((a, b) => a['vod_name'].localeCompare(b['vod_name']));
    return JSON.stringify({
        page: pg,
        pagecount: 1,
        list: list,
    });
}

async function detail(id) {
    let vod = {
        vod_play_from: 'leospring',
        vod_play_url: 'YD极速$' + id,
    };
    if (phone) {
        vod.vod_play_from = 'YD原画4K$$$YD极速';
        vod.vod_play_url = 'leospring$' + id + '$$$leospring$'+id;
    }
    return JSON.stringify({
        list: [vod],
    });
}

async function play(flag, id, flags) {
    if(flag == 'YD原画4K') {
        let ret = await get4kVideoInfo(id.split('__')[0], id.split('__')[1]);
        //console.log(ret);
        id = ret.data.redrUrl;
    } else {
        let split = id.split('__')[1].split('/');
        let ret = await getQuickVideoInfo(id.split('__')[0], split[split.length - 1]);
        //console.log(ret);
        id = ret.data.contentInfo.presentURL;
    }
    return JSON.stringify({
        parse: 0,
        url: id,
    });
}

async function search(wd, quick, pg) {
    let list = [];//await searchTg(wd);
    let $ = load(await request(host + 'search?keyword=' + wd));
    _.forEach($('.topicList > .topicItem'), item => {
        let pic = $(item).find('a.avatarLink img').attr('src');
        let picDoc = $(item).find('.detail .tm-m-photos-thumb');
        if (picDoc.length > 0) {
            pic = $(picDoc).find('li').attr('data-src');
        }
        let contentDoc = $(item).find('.content > h2 > a');
        list.push({
            vod_id: contentDoc.attr('href'),
            vod_name: contentDoc.text(),
            vod_pic: host + pic,
            vod_tag: 'folder',
              style: {
              type: 'list'
            }
        });
    });
    return JSON.stringify({
        page: pg,
        pagecount: 1,
        list: list,
    });
}

async function searchTg(wd) {
    let url = 'http://tg.fish2018.us.kg?channelUsername=ydypzyfx&keyword=' + wd;
    let rets = JSON.parse(await request(url,'',{'User-Agent': 'okhttp'})).results;
    let urls = [];
    let list = [];
    _.forEach(rets, item => {
        let split = item.split('$$$')[1].split('##');
        _.forEach(split, i => {
           let playUrl = i.split('$$')[0];
           let name = i.split('$$')[1].trim();
           if(urls.indexOf(playUrl) < 0 && playUrl.indexOf('caiyun.139.com') > 0) {
                list.push({
                    vod_id: playUrl.split('?')[1] + '__root',
                    vod_name: name || wd,
                    vod_tag: 'folder',
                        style: {
                        type: 'list'
                    }
                });
                urls.push(playUrl);
            }
        });
        // let $ = load(item);
        // let name = $('strong').text();
        // _.forEach($('a'), it => {
        //     let playUrl = $(it).attr('href');
        //     if(urls.indexOf(playUrl) < 0 && playUrl.indexOf('caiyun.139.com') > 0) {
        //         list.push({
        //             vod_id: playUrl.split('?')[1] + '__root',
        //             vod_name: name,
        //             vod_tag: 'folder',
        //               style: {
        //               type: 'list'
        //             }
        //         });
        //         urls.push(playUrl);
        //     }
        // })
        
    });
    return list;
}

function D(e) {
    let x = Crypto.enc.Utf8.parse("PVGDwmcvfs1uV3d1");
    let a = JSON.stringify(e)
        , s = Crypto.enc.Utf8.parse(a);
        //var t = Crypto.lib.WordArray.random(16), n = "";
        let t = x, n = ''; 
    n = Crypto.AES.encrypt(s, x, {
        iv: t,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7
    });
    return Crypto.enc.Base64.stringify(t.concat(n.ciphertext))
}

function I(e) {
    let x = Crypto.enc.Utf8.parse("PVGDwmcvfs1uV3d1");
    let t = Crypto.enc.Base64.parse(e.replaceAll(' ',''))
        , n = t.clone()
        , i = n.words.splice(4);
    n.init(n.words),
    t.init(i);
    let o = Crypto.enc.Base64.stringify(t)
        , a = Crypto.AES.decrypt(o, x, {
        iv: n,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7
    })
        , s = a.toString(Crypto.enc.Utf8);
    return s.toString();
}

function base64Decode(text) {
    return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text));
}

async function getVideoInfo(link, fid) {
    let url = 'https://share-kd-njs.yun.139.com/yun-share/richlifeApp/devapp/IOutLink/getOutLinkInfoV6';
    let params = {
        "getOutLinkInfoReq":{
            "account":"",
            "linkID": link,
            "passwd":"",
            "caSrt":0,
            "coSrt":0,
            "srtDr":1,
            "bNum":1,
            "pCaID": fid || "root",
            "eNum":200
        }
    }
    //console.log(D(params));
    let res = await request(url, D(params), {
        'X-Deviceinfo': '||3|12.27.0|safari|13.1.2|1||macos 10.15.6|1324X381|zh-cn|||',
        'hcy-cool-flag': '1',
        'Authorization': '',
        'Content-Type': 'application/json'
    }, 'POST');
    return JSON.parse(I(res));
}

async function get4kVideoInfo(link, fid) {
    let url = 'https://share-kd-njs.yun.139.com/yun-share/richlifeApp/devapp/IOutLink/dlFromOutLinkV3';
    let params = {
        "dlFromOutLinkReqV3": {
            "linkID": link,
            "account": phone,
            "coIDLst": {
                "item": [
                    fid
                ]
            }
        },
        "commonAccountInfo": {
            "account": phone,
            "accountType": 1
        }
    }
    //console.log(D(params));
    let res = await request(url, D(params), {
        'X-Deviceinfo': '||3|12.27.0|safari|13.1.2|1||macos 10.15.6|1324X381|zh-cn|||',
        'hcy-cool-flag': '1',
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/json'
    }, 'POST');
    return JSON.parse(I(res));
}

async function getQuickVideoInfo(link, cid) {
    let url = 'https://share-kd-njs.yun.139.com/yun-share/richlifeApp/devapp/IOutLink/getContentInfoFromOutLink';
    let params = {"getContentInfoFromOutLinkReq":{"contentId":cid,"linkID":link}}
    //console.log(D(params));
    let res = await request(url, params, {}, 'POST');
    //console.log(res);
    return JSON.parse(res);
}



export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        //homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
        //validCode: validCode,
        //proxy: proxy,
    };
}