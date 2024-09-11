import{load,_}from"assets://js/lib/cat.js";import{log}from"./lib/utils.js";import{initAli,detailContent,playContent}from"./lib/ali.js";let siteKey="pansou",siteType=0,siteUrl="https://www.alipansou.com",patternAli=/(https:\/\/www\.(aliyundrive|alipan)\.com\/s\/[^"]+)/;const UA="Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";async function requestRaw(reqUrl,headers,redirect){return await req(reqUrl,{method:"get",headers:headers||{"User-Agent":UA,Referer:siteUrl},redirect:redirect})}async function request(reqUrl){return(await requestRaw(reqUrl)).content}async function init(cfg){try{siteKey=_.isEmpty(cfg.skey)?"":cfg.skey,siteType=_.isEmpty(cfg.stype)?"":cfg.stype,await initAli(cfg)}catch(e){await log("init:"+e.message+" line:"+e.lineNumber)}}async function home(filter){return"{}"}async function homeVod(){}async function category(tid,pg,filter,extend){return"{}"}async function detail(id){try{var matches=id.match(patternAli);if(!_.isEmpty(matches))return await detailContent(matches[0]);let url=siteUrl+id.replace("/s/","/cv/");var $,data=await requestRaw(url,getHeaders(id),0),headers=data.headers,resp=data.content;return headers.hasOwnProperty("location")?(url=headers.location.replace("/redirect?visit=","https://www.aliyundrive.com/s/"),await detailContent(url)):_.isEmpty(resp)?"":($=load(resp),url=$("a:first").attr("href").replace("/redirect?visit=","https://www.aliyundrive.com/s/"),await detailContent(url))}catch(e){await log("detail:"+e.message+" line:"+e.lineNumber)}}function getHeaders(id){return{"User-Agent":UA,Referer:siteUrl+id,_bid:"6d14a5dd6c07980d9dc089a693805ad8"}}async function play(flag,id,flags){try{return await playContent(flag,id,flags)}catch(e){await log("play:"+e.message+" line:"+e.lineNumber)}}async function search(wd,quick,pg){pg<=0&&(pg=1);wd=await request(siteUrl+"/search?k="+encodeURIComponent(wd)+"&page="+pg+"&s=0&t=-1");const $=load(wd);var wd=$("van-row > a"),wd=_.map(wd,item=>{var title=$(item).find("template:first").text().trim();return{vod_id:item.attribs.href,vod_name:title,vod_pic:"https://inews.gtimg.com/newsapp_bt/0/13263837859/1000"}}),pageCount=$("van-pagination").attr("page-count")||pg,pageCount=parseInt(pageCount);return JSON.stringify({page:parseInt(pg),pagecount:pageCount,limit:10,total:10*pageCount,list:wd})}function __jsEvalReturn(){return{init:init,home:home,homeVod:homeVod,category:category,detail:detail,play:play,search:search}}export{__jsEvalReturn};