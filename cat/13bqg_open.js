import{_,load}from"assets://js/lib/cat.js";let key="13bqg",url="https://m.13bqg.com",siteKey="",siteType=0;const MOBILE_UA="Mozilla/5.0 (Linux; Android 11; M2007J3SC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045714 Mobile Safari/537.36";async function request(reqUrl){return(await req(reqUrl,{headers:{"Accept-Language":"zh-CN,zh;q=0.8","User-Agent":MOBILE_UA}})).content}async function init(cfg){siteKey=cfg.skey,siteType=cfg.stype}async function home(filter){var html=await request(url),classes=[];for(const a of load(html)('div.nav > ul > li > a[href!="/"]'))classes.push({type_id:a.attribs.href.replace(/\//g,""),type_name:a.children[0].data.trim(),tline:2});return{class:classes}}async function category(tid,pg,filter,extend){0==pg&&(pg=1);var tid=await request(url+`/${tid}/${pg}.html`),$=load(tid),books=[];for(const item of $("div.item")){var a=$(item).find("a:first")[0],img=$(a).find("img:first")[0],span=$(item).find("span:first")[0];books.push({book_id:a.attribs.href,book_name:img.attribs.alt,book_pic:img.attribs.src,book_remarks:span.children[0].data.trim()})}return{page:pg,pagecount:0<$("div.page > a:contains(>)").length?pg+1:pg,list:books}}async function detail(id){var html=await request(url+id),$=load(html),book={book_name:$("[property$=book_name]")[0].attribs.content,book_year:$("[property$=update_time]")[0].attribs.content,book_director:$("[property$=author]")[0].attribs.content,book_content:$("[property$=description]")[0].attribs.content},html=await request(url+id+"list.html"),urls=[];for(const l of($=load(html))('dl>dd>a[href*="/html/"]')){var name=$(l).text().trim(),link=l.attribs.href;urls.push(name+"$"+link)}return book.volumes="全卷",book.urls=urls.join("#"),{list:[book]}}async function play(flag,id,flags){try{for(var content="";;){var html=await request(url+id),$=load(html);if(content+=$("#chaptercontent").html().replace(/<br>|请收藏.*?<\/p>/g,"\n").trim(),(id=$("a.Readpage_down")[0].attribs.href).indexOf("_")<0)break}return{content:content+"\n\n"}}catch(e){return{content:""}}}async function search(wd,quick,pg){var cook=await req(url+"/user/hm.html?q="+encodeURIComponent(wd),{headers:{accept:"application/json","User-Agent":MOBILE_UA,Referer:url+"/s?q="+encodeURIComponent(wd)}}),cookie={};for(const c of(_.isArray(cook.headers["set-cookie"])?cook.headers["set-cookie"].join(";;;"):cook.headers["set-cookie"]).split(";;;")){var tmp=c.trim(),idx=tmp.indexOf("="),k=tmp.substr(0,idx),tmp=tmp.substr(idx+1,tmp.indexOf(";")-idx-1);cookie[k]=tmp}var cook=await req(`${url}/user/search.html?q=${encodeURIComponent(wd)}&so=undefined`,{headers:{accept:"application/json","User-Agent":MOBILE_UA,cookie:"hm="+cookie.hm,Referer:url+"/s?q="+encodeURIComponent(wd)}}),books=[];for(const book of JSON.parse(cook.content))books.push({book_id:book.url_list,book_name:book.articlename,book_pic:book.url_img,book_remarks:book.author});return{tline:2,list:books}}function __jsEvalReturn(){return{init:init,home:home,category:category,detail:detail,play:play,search:search}}export{__jsEvalReturn};