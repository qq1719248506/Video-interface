import{Crypto,load,_}from"assets://js/lib/cat.js";const key="ggys",HOST="https://ggys.me",TYPE_MOVIE="movie",TYPE_TVSHOW="tv-show";let siteKey="",siteType=0;const UA="Mozilla/5.0 (Linux; Android 11; M2007J3SC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045714 Mobile Safari/537.36";async function request(reqUrl,method,data){return(await req(reqUrl,{method:method||"get",headers:{"User-Agent":UA,Referer:HOST},data:data,postType:"post"===method?"form":""})).content}async function init(cfg){siteKey=cfg.skey,siteType=cfg.stype,cfg.hasOwnProperty("ext")&&cfg.ext.hasOwnProperty("host")&&(HOST=cfg.ext.host)}async function home(filter){return JSON.stringify({class:[{type_id:"movies",type_name:"电影"},{type_id:"tv-shows",type_name:"剧集"}],filters:{movies:[{key:"class",name:"类型",init:"",value:[{n:"全部",v:""},{n:"欧美电影",v:"tag/欧美电影"},{n:"华语电影",v:"tag/华语电影"},{n:"日韩电影",v:"tag/日韩电影"},{n:"其他地区",v:"tag/其他地区"},{n:"冒险",v:"genre/冒险"},{n:"剧情",v:"genre/剧情"},{n:"动作",v:"genre/动作"},{n:"动画",v:"genre/动画"},{n:"历史",v:"genre/历史"},{n:"喜剧",v:"genre/喜剧"},{n:"奇幻",v:"genre/奇幻"},{n:"家庭",v:"genre/家庭"},{n:"恐怖",v:"genre/恐怖"},{n:"悬疑",v:"genre/悬疑"},{n:"惊悚",v:"genre/惊悚"},{n:"战争",v:"genre/战争"},{n:"爱情",v:"genre/爱情"},{n:"犯罪",v:"genre/犯罪"},{n:"科幻",v:"genre/科幻"},{n:"纪录",v:"genre/纪录"},{n:"音乐",v:"genre/音乐"}]}],"tv-shows":[{key:"class",name:"类型",init:"",value:[{n:"全部",v:""},{n:"欧美剧",v:"tag/欧美剧"},{n:"日韩剧",v:"tag/日韩剧"},{n:"国产剧",v:"tag/国产剧"},{n:"其他地区",v:"tag/其他地区"},{n:"剧情",v:"genre/剧情"},{n:"动作",v:"genre/动作"},{n:"动画",v:"genre/动画"},{n:"喜剧",v:"genre/喜剧"},{n:"家庭",v:"genre/家庭"},{n:"悬疑",v:"genre/悬疑"},{n:"犯罪",v:"genre/犯罪"},{n:"科幻",v:"genre/科幻"},{n:"西部",v:"genre/西部"}]}]}})}async function homeVod(){}async function category(tid,pg,filter,extend){pg<=0&&(pg=1);let path="";var prefix={movies:TYPE_MOVIE,"tv-shows":TYPE_TVSHOW}[tid];path=extend.class?"/"+prefix+"-"+extend.class:"/"+tid;let page="";1<pg&&(page="page/"+pg+"/");extend=await request(HOST+path+"/"+page),tid=load(extend),extend=[],parseVideoList(tid,prefix,!1,extend),prefix=0<tid(".page-numbers a.next").length?parseInt(pg)+1:parseInt(pg);return JSON.stringify({page:parseInt(pg),pagecount:prefix,limit:20,total:20*prefix,list:extend})}function parseVideoList($,prefix,imgSrc,videos){var items=$("."+prefix);_.each(items,item=>{var item=$(item),title=item.find("."+prefix+"__title:first").text(),url=item.find("."+prefix+"__actions a:first").attr("href"),imgAttr=imgSrc?"src":"data-lazy-src",imgAttr=item.find("."+prefix+"__poster img:first").attr(imgAttr),item=item.find("."+prefix+"__meta span:last").text();url&&(url={vod_id:decodeURIComponent(url.replace(/.*\/\/.*\/(.*\/.*)\//g,"$1")),vod_name:title,vod_pic:imgAttr,vod_remarks:item},videos.push(url))})}async function detail(id){var isMovieType=id.startsWith(TYPE_MOVIE),html=await request(HOST+"/"+id+"/");const $=load(html);html=isMovieType?TYPE_MOVIE:TYPE_TVSHOW,id={vod_id:id,vod_name:$("."+html+"_title").text(),vod_actor:$("."+html+"-casts").text().trim().substring(3).replace(/\s+\/\s+/g,"/"),vod_pic:$("."+html+"__poster img:first").attr("data-lazy-src"),vod_remarks:$("."+html+"__meta span:last").text()};isMovieType?(id.vod_type=$("."+html+"__meta span:last").text(),id.vod_year=$("."+html+"__meta span:first").text(),id.vod_content=$(".movie__description").text()):(id.vod_type=$("."+html+"__meta span:first").text(),id.vod_content=$(".tv-show__info--body").text());const playMap={};if(isMovieType){html=$(".ggys-video-player").attr("data-source-id")+"@"+TYPE_MOVIE;playMap.ggys=["全$"+html]}else{isMovieType=$(".tv_show__season-tabs-wrap .nav-item");const episodes=$(".episodes");_.each(isMovieType,(tab,i)=>{const titlePrefix=$(tab).text().trim();tab=$(episodes[i]).find(".episode__body");_.each(tab,episode=>{var episode=$(episode),title=titlePrefix+" "+episode.text().trim(),episode=episode.find("a").attr("href")+"@"+TYPE_TVSHOW;playMap.hasOwnProperty("ggys")||(playMap.ggys=[]),playMap.ggys.push(title+"$"+episode)})})}id.vod_play_from=_.keys(playMap).join("$$$");html=_.values(playMap),isMovieType=_.map(html,urlist=>urlist.join("#"));return id.vod_play_url=isMovieType.join("$$$"),JSON.stringify({list:[id]})}async function play(flag,id,flags){var id=id.split("@"),playType=id[1];let playId=id[0];playType==TYPE_TVSHOW&&(id=await request(playId),playType=load(id),playId=playType(".ggys-video-player").attr("data-source-id"));id={video_id:playId},playType=await request(HOST+"/wp-json/get_addr/v1/get_video_url","post",id),id=JSON.parse(playType).video_url,playType={"User-Agent":UA,Referer:HOST};return JSON.stringify({parse:0,url:id,header:playType})}async function search(wd,quick,pg){let page="";1<pg&&(page="/page/"+pg);var wd=HOST+"/search/"+wd+page+"/?post_type=",videos=[],html=await request(wd+"movie");let $=load(html);parseVideoList($,TYPE_MOVIE,!0,videos);var hasMoreMovie=0<$(".page-numbers a.next").length,html=await request(wd+"tv_show"),wd=(parseVideoList($=load(html),TYPE_TVSHOW,!0,videos),0<$(".page-numbers a.next").length),html=hasMoreMovie||wd?parseInt(pg)+1:parseInt(pg);return JSON.stringify({page:parseInt(pg),pagecount:html,limit:40,total:40*html,list:videos})}function __jsEvalReturn(){return{init:init,home:home,homeVod:homeVod,category:category,detail:detail,play:play,search:search}}export{__jsEvalReturn};