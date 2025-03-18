import { Crypto, load, _ } from 'assets://js/lib/cat.js';

let siteKey = '';
let siteType = 0;
const PC_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36';

let host = 'https://www.leijing1.com/';
let headers = {
    'User-Agent': PC_UA,
    'Referer': 'https://www.leijing1.com'
};
let auth = '';
let phone = '';
let pwd = '';
let COOKIE = '';

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
        //auth = await request('http://127.0.0.1:9978/file/leospring/yd.txt');
        //phone = base64Decode(auth).split(':')[1];
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
                vod_pic: pic,
                //vod_tag: 'folder',
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
                            vod_id: arr[1].trim() + '_root',
                            vod_name: arr[0].trim(),
                            vod_tag: 'folder',
                          	style: {
                              type: 'list'
                            }
                        })
                    } else if(text[i-1] && text[i-1].trim().indexOf('http') == -1) {
                        list.push({
                            vod_id: arr[1].trim() + '_root',
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
    if(tid.indexOf('_') > 0) {
        return await getSubCate(tid, pg, filter, extend);
    }
    
}

async function getSubCate(tid, pg, filter, extend) {
    let fid = tid.split('_')[0];
    let path = tid.split('_')[1];
    let ret = await getVideoInfo(fid, path || 'root');
    let list = [];
    if(ret.data.caLst) {
        _.forEach(ret.data.caLst, item => {
            list.push({
                vod_id: fid + '_' + item.path,
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
                    vod_id: fid + '_' + item.path,
                    vod_name: item.coName,
                    vod_pic: item.thumbnailURL,
                    
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
    let shareCode =  await getShareCode(id);
    let url = "https://cloud.189.cn/api/open/share/getShareInfoByCodeV2.action?noCache="+Math.random()+"&shareCode=" + shareCode;
    let res = JSON.parse(await request(url, '',
        {
            "Accept": "application/json;charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        }
    ));
    let fileId = res.fileId;
    let shareId = res.shareId;
    let shareMode = res.shareMode;
    let accessCode = res.accessCode;
    let isFolder = res.isFolder;
    let vod = {
        vod_play_from: '天意原画',
    };
    if(!isFolder && res.mediaType == 3) {
        vod.vod_play_url = res.fileName + '$' + shareId + '__' + fileId;
        
    } else {
        let nameUrlList = [];
        await getPlayNameUrlList(fileId, shareId, shareMode, accessCode, nameUrlList);
        nameUrlList.sort();
        vod.vod_play_url = nameUrlList.join('#');
    }
    const list = [vod];
    const result = { list };
    return JSON.stringify(result);

}

async function play(flag, id, flags) {
    let playUrl = 'http://127.0.0.1:9978/proxy?do=tianyi&shareId=' + id.split('__')[0] + '&fileId=' + id.split('__')[1];
  	let res = await request(playUrl);
   return res;
  	//playUrl = JSON.parse(await request(playUrl)).url;
    //return JSON.stringify({
    //    parse: 0,
    //    url: playUrl,
    //});
}

async function search(wd, quick, pg) {
    let $ = load(await request(host + 'search?keyword=' + wd));
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
            vod_pic: pic,
            //vod_tag: 'folder',
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

async function getShareCode(id) {
    let url = 'https://www.leijing1.com/' + id;
    let html = await request(url);
    const $ = load(html);
    let aDoc = $('.topicContent a');
    _.forEach(aDoc, item => {
        let href = $(item).attr('href');
        if(href && href.indexOf('https://cloud.189.cn/t/') > -1) {
            return href.split('https://cloud.189.cn/t/')[1];
        }
    });
    let content = $('.topicContent').text();
    let regexWithAccessCode = /https:\/\/cloud\.189\.cn\/t\/[a-zA-Z0-9]+[\(（]访问码[:：][^\s]+[\)）]|https:\/\/cloud\.189\.cn\/t\/[a-zA-Z0-9]+|https:\/\/cloud\.189\.cn\/web\/share\?code=[A-Za-z0-9]+[\(（]访问码[:：][^\s]+[\)）]|https:\/\/cloud\.189\.cn\/web\/share\?code=[A-Za-z0-9]+/g;
    let match = content.match(regexWithAccessCode);
    if (match) {
        return match[0].split('https://cloud.189.cn/t/')[1];
    }
}

async function getPlayNameUrlList(fileId, shareId, shareMode, accessCode, nameUrlList) {
    let url = "https://cloud.189.cn/api/open/share/listShareDir.action?noCache="+Math.random()+"&pageNum=1&pageSize=60&fileId="+ fileId +"&shareDirFileId="+ fileId +"&isFolder=true&shareId="+ shareId +"&shareMode="+ shareMode +"&iconOption=5&orderBy=lastOpTime&descending=true&accessCode=" + accessCode;
    let html = await req(url, '', {
        method: 'get',
        timeout: 10000,
        headers: {
            //"Accept": "application/json;charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
    });
    let $ = load(html.content);
    //let fileListAO = res.fileListAO;
    let fileList = $('file');
    let folderList = $('folder');
    // console.log('url', url);
    // console.log(html);
    // console.log(folderList);
    if (fileList.length > 0) {
        _.forEach(fileList, item => {
            if(3 == $(item).find('mediaType').text()) {
                nameUrlList.push($(item).find('name').text() + '$' + shareId + '__' + $(item).find('id').text());
            }
        })
    }
    if(folderList.length > 0) {
        
        for(let i = 0; i < folderList.length; i++) {
            await getPlayNameUrlList($(folderList[i]).find('id').text(), shareId, shareMode, accessCode, nameUrlList);
        }
    }
}

//console.log(await detail('thread?topicId=22618'));

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

async function refreshTYCookie() {
    let url1 = 'https://m.cloud.189.cn/udb/udb_login.jsp?pageId=1&pageKey=default&clientType=wap&redirectURL=https://m.cloud.189.cn/zhuanti/2021/shakeLottery/index.html';
    let url2 = (await request(url1)).split("'")[1];
    console.log('url2:', url2);
    let html = (await request(url2, {
        headers: {
            'User-Agent': PC_UA,
        },
    }));
    let $ = load(html);
    let url3 = $('#j-tab-login-link').attr('href');
    console.log('url3:', url3);

    let html2 = (await request(url3, {
        headers: {
            'User-Agent': PC_UA,
        },
    }));
    //console.log(html2);
    $ = load(html2);
    let rsaKey = $('#j_rsaKey').attr('value');
    console.log('rsaKey:', rsaKey);
    let captchaToken = $('input[name="captchaToken"]').attr('value');
    console.log('captchaToken:', captchaToken);
    let lt = html2.split('var lt = "')[1].split('"')[0];
    console.log('lt:', lt);
    let returnUrl = html2.split("var returnUrl= '")[1].split("'")[0];
    console.log('returnUrl:', returnUrl);
    let paramId = html2.split('var paramId = "')[1].split('"')[0];
    console.log('paramId:', paramId);
    
    //获取Cookie
    let url4 = "https://open.e.189.cn/api/logbox/oauth2/loginSubmit.do";
    let param = {
        appKey: "cloud",
        accountType: "01",
        userName: '{RSA}' + rsaHex(phone, rsaKey),
        password: '{RSA}' + rsaHex(pwd, rsaKey),
        captchaType: captchaToken,
        validateCode: '',
        captchaToken: '',
        returnUrl: returnUrl,
        mailSuffix: "@189.cn",
        paramId: paramId
    }
    let head = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36',
        'Referer': 'https://open.e.189.cn/',
        'lt': lt
    };
    let res = await req(url4, {
        headers: head,
        method: 'post',
        data: param,
        postType: 'form',
        timeout: 30000
    });
    let url5 = JSON.parse(res.content).toUrl;
    console.log('url5:', url5);
    let res2 = await req(url5, {
        headers: head,
        method: 'get',
        redirect: false,
        timeout: 30000
    });
    console.log(res2);
    res2.headers['set-cookie'].forEach(item => {
        if (item.includes('COOKIE_LOGIN_USER')) {
            COOKIE = item;
            return;
        }
    });
    console.log('COOKIE:', COOKIE);
}
//await refreshTYCookie();


function rsaHex(input, rsaKey) {
    let encData = rsaX('RSA/PKCS1', true, true, input, false, '-----BEGIN PUBLIC KEY-----\n' +rsaKey+ '\n-----END PUBLIC KEY-----', true);
    console.log('encData:', encData);
    let hexData = Crypto.enc.Hex.stringify(Crypto.enc.Base64.parse(encData));
    console.log('hexData:', hexData);
    return hexData;
}

//rsaHex('13261418545', 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDY7mpaUysvgQkbp0iIn2ezoUyhi1zPFn0HCXloLFWT7uoNkqtrphpQ/63LEcPz1VYzmDuDIf3iGxQKzeoHTiVMSmW6FlhDeqVOG094hFJvZeK4OzA6HVwzwnEW5vIZ7d+u61RV1bsFxmB68+8JXs3ycGcE4anY+YzZJcyOcEGKVQIDAQAB');
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