import{Crypto,_}from"assets://js/lib/cat.js";import{log}from"./lib/utils.js";import{initAli,detailContent,playContent}from"./lib/ali.js";let siteKey="upyun",siteType=0,siteUrl="https://zyb.upyunso.com",patternAli=/(https:\/\/www\.(aliyundrive|alipan)\.com\/s\/[^"]+)/;async function request(reqUrl){return(await req(reqUrl,{method:"get",headers:{Referer:siteUrl}})).content}async function init(cfg){try{siteKey=_.isEmpty(cfg.skey)?"":cfg.skey,siteType=_.isEmpty(cfg.stype)?"":cfg.stype,await initAli(cfg)}catch(e){await log("init:"+e.message+" line:"+e.lineNumber)}}async function home(filter){return"{}"}async function homeVod(){}async function category(tid,pg,filter,extend){return"{}"}async function detail(id){try{return await detailContent(id)}catch(e){await log("detail:"+e.message+" line:"+e.lineNumber)}}async function play(flag,id,flags){try{return await playContent(flag,id,flags)}catch(e){await log("play:"+e.message+" line:"+e.lineNumber)}}async function search(wd,quick,pg){pg<=0&&(pg=1);var wd=decrypt(await request(siteUrl+"/v15/search?keyword="+encodeURIComponent(wd)+"&page="+pg+"&s_type=2")),wd=JSON.parse(wd).result.items,videos=[];for(const item of wd){var url=decrypt(item.page_url),matches=url.match(patternAli);_.isEmpty(matches)||(matches=(_.isEmpty(item.content)?item:item.content[0]).title,videos.push({vod_id:url,vod_name:matches.replaceAll(/<\/?[^>]+>/g,""),vod_pic:"https://inews.gtimg.com/newsapp_bt/0/13263837859/1000",vod_remarks:item.insert_time}))}wd=!_.isEmpty(wd)?parseInt(pg)+1:parseInt(pg);return JSON.stringify({page:parseInt(pg),pagecount:wd,limit:25,total:25*wd,list:videos})}function decrypt(text){var text={ciphertext:Crypto.enc.Hex.parse(text.toUpperCase())},key=Crypto.enc.Utf8.parse("qq1920520460qqzz"),iv=Crypto.enc.Utf8.parse("qq1920520460qqzz"),mode=Crypto.mode.CBC,padding=Crypto.pad.Pkcs7,text=Crypto.AES.decrypt(text,key,{iv:iv,mode:mode,padding:padding});return Crypto.enc.Utf8.stringify(text)}function __jsEvalReturn(){return{init:init,home:home,homeVod:homeVod,category:category,detail:detail,play:play,search:search}}export{__jsEvalReturn};