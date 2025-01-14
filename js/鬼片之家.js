var rule = {
    类型:'影视',
    title:'鬼片之家',
    desc:'不告诉你',
    host:'https://www.guipian360.com',
    url: '/list/fyclass-fypage.html',
    searchUrl:'/vodsearch/**----------fypage---.html',
    searchable:2,quickSearch:0,timeout:5000,play_parse:true,filterable:0,
    class_name: '鬼片大全&大陆鬼片&港台鬼片&林正英鬼片&日韩鬼片&欧美鬼片&泰国鬼片&恐怖片&电视剧&国产剧&港台剧&美剧&韩剧&日剧&泰剧&其它剧&动漫',
    class_url: '1&6&9&8&7&11&10&3&2&12&20&13&14&15&16&22&4',
    预处理: async () => {
        return []
    },
    推荐: async function (tid, pg, filter, extend) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.m-movies .u-movie');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, 'img&&src'),
                desc: pdfh(it, '.zhuangtai&&Text'),
                url: pd(it, 'a&&href'),
            })
        });
        return setResult(d)
    },
    一级: async function (tid, pg, filter, extend) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.m-movies .u-movie');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, 'img&&src'),
                desc: pdfh(it, '.zhuangtai&&Text'),
                url: pd(it, 'a&&href'),
            })
        });
        return setResult(d)
    },
    二级: async function (ids) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let VOD = {};
        VOD.vod_name = pdfh(html, 'h1&&Text');
        VOD.vod_content = pdfh(html, '.jianjie&&Text');
        let playlist = pdfa(html, '#tv_tab&&.abc');
        let tabs = pdfa(html, '#tv_tab .select');
        let playmap = {};
        tabs.map((item, i) => {
            const form = pdfh(item, 'Text');
            const list = playlist[i];
            const a = pdfa(list, 'body&&a');
            a.map((it) => {
                let title = pdfh(it, 'a&&Text');
                let urls = pd(it, 'a&&href', input);
                if (!playmap.hasOwnProperty(form)) {
                    playmap[form] = [];
                }
                playmap[form].push(title + "$" + urls);
            });
        });
        VOD.vod_play_from = Object.keys(playmap).join('$$$');
        const urls = Object.values(playmap);
        const playUrls = urls.map((urllist) => {
            return urllist.join("#");
        });
        VOD.vod_play_url = playUrls.join('$$$');
        return VOD;
    },
    搜索: async function (wd, quick, pg) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.m-movies .u-movie');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, 'img&&src'),
                desc: pdfh(it, '.zhuangtai&&Text'),
                url: pd(it, 'a&&href'),
                content: pdfh(it, '.meta&&Text'),
            })
        });
        return setResult(d);
    },
    lazy: async function (flag, id, flags) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        html = JSON.parse(html.match(/r player_.*?=(.*?)</)[1]);
        let url = html.url;
        if (html.encrypt == "1") {
            url = unescape(url)
            return {parse: 0, url: url}
        } else if (html.encrypt == "2") {
            url = unescape(base64Decode(url))
            return {parse: 0, url: url}
        }
        if (/m3u8|mp4/.test(url)) {
            input = url
            return {parse: 0, url: input}
        } else {
            return {parse: 0, url: input}
        }
    }
}