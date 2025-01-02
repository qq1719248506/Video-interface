const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '闪电优汐[盘]',
    host: 'http://1.95.79.193/',
    url: '/index.php/vod/show/id/fyclass/page/fypage.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: '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',
    cate_exclude: '网址|专题|全部影片',
    // tab_rename: {'KUAKE1': '夸克1', 'KUAKE11': '夸克2', 'YOUSEE1': 'UC1', 'YOUSEE11': 'UC2',},
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_parse: async () => {
        let classes = [{
            type_id: '1',
            type_name: '闪电电影',
        }, {
            type_id: '2',
            type_name: '闪电剧集',
        }, {
            type_id: '4',
            type_name: '闪电动漫',
        }, {
            type_id: '3',
            type_name: '闪电综艺',
        }, {
            type_id: '5',
            type_name: '闪电短剧',
        }];
        return {
            class: classes,
        }
    },
    预处理: async () => {
        return []
    },
    推荐: async () => {
        return []
    },
    一级: async function (tid, pg, filter, extend) {
        let {MY_CATE, input} = this;
        let html = (await getHtml(input)).data
        const $ = pq(html)
        let videos = []
        $('.module-items .module-item').each((index, item) => {
            const a = $(item).find('a:first')[0];
            const img = $(item).find('img:first')[0];
            const content = $(item).find('.video-text:first').text();
            videos.push({
                "vod_name": a.attribs.title,
                "vod_id": a.attribs.href,
                "vod_remarks": content,
                "vod_pic": img.attribs['data-src']
            })
        })
        return videos
    },
    二级: async function (ids) {
        let {input} = this;
        let html = (await getHtml(input)).data
        const $ = pq(html)
        let vod = {
            "vod_name": $('h1.page-title').text(),
            "vod_id": input,
            "vod_remarks": $('.video-info-item').text(),
            "vod_pic": $('.lazyload').attr('data-src'),
            "vod_content": $('p.sqjj_a').text(),
        }
        let playform = []
        let playurls = []
        for (const item of $('.module-row-title')) {
            const a = $(item).find('p:first')[0];
            let link = a.children[0].data.trim()
            if (/drive.uc.cn/.test(link)) {
                const shareData = UC.getShareData(link);
                if (shareData) {
                    const videos = await UC.getFilesByShareUrl(shareData);
                    if (videos.length > 0) {
                        playform.push('UC-' + shareData.shareId);
                        playurls.push(videos.map((v) => {
                            const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                            return v.file_name + '$' + list.join('*');
                        }).join('#'))
                    } else {
                        playform.push('UC-' + shareData.shareId);
                        playurls.push("资源已经失效，请访问其他资源")
                    }
                }
            }
            if (/pan.quark.cn/.test(link)) {
                const shareData = Quark.getShareData(link);
                if (shareData) {
                    const videos = await Quark.getFilesByShareUrl(shareData);
                    if (videos.length > 0) {
                        playform.push('Quark-' + shareData.shareId);
                        playurls.push(videos.map((v) => {
                            const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                            return v.file_name + '$' + list.join('*');
                        }).join('#'))
                    } else {
                        playform.push('Quark-' + shareData.shareId);
                        playurls.push("资源已经失效，请访问其他资源")
                    }
                }
            }
        }
        vod.vod_play_from = playform.join("$$$")
        vod.vod_play_url = playurls.join("$$$")
        return vod
    },
    搜索: async function (wd, quick, pg) {
        let {input} = this
        let html = (await getHtml(input)).data
        const $ = pq(html)
        let videos = []
        $('.module-items .module-search-item').each((index, item) => {
            const a = $(item).find('a:first')[0];
            const img = $(item).find('img:first')[0];
            const content = $(item).find('.video-text:first').text();
            videos.push({
                "vod_name": a.attribs.title,
                "vod_id": a.attribs.href,
                "vod_remarks": content,
                "vod_pic": img.attribs['data-src']
            })
        })
        return videos
    },
    lazy: async function (flag, id, flags) {
        let {input} = this;
        const ids = input.split('*');
        const urls = [];
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        if (flag.startsWith('Quark-')) {
            console.log("夸克网盘解析开始")
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
            const transcoding = (await Quark.getLiveTranscoding(ids[0], ids[1], ids[2], ids[3])).filter((t) => t.accessable);
            transcoding.forEach((t) => {
                urls.push(t.resolution === 'low' ? "流畅" : t.resolution === 'high' ? "高清" : t.resolution === 'super' ? "超清" : t.resolution, t.video_info.url)
            });
            return {
                parse: 0,
                url: urls,
                header: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'origin': 'https://pan.quark.cn',
                    'referer': 'https://pan.quark.cn/',
                    'Cookie': Quark.cookie
                }
            }
        } else if (flag.startsWith('UC-')) {
            console.log("UC网盘解析开始")
            if (!UCDownloadingCache[ids[1]]) {
                const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                if (down) UCDownloadingCache[ids[1]] = down;
            }
            downUrl = UCDownloadingCache[ids[1]].download_url;
            urls.push("UC原画", downUrl);
            return {
                parse: 0,
                url: urls,
                header: {
                    "Referer": "https://drive.uc.cn/",
                    "cookie": UC.cookie,
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch'
                },
            }
        }
    },
}
