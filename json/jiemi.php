<?php include ('./inc/aik.config.php');
include ('./inc/init.php');
include ('./inc/cache.php');
$id=$_GET['cid'];
$info2=file_get_contents($aik['zhanwai']);
$curl = $info2."?ac=detail&id=1&pg=1".$id;
if (empty($_GET['cid'])) {
    $cxurl = $curl;
    $x=$_GET['page'];
    $url = $cxurl."?ac=detail&t=".$x;
} else {
    $cxurl = $curl."?ac=detail&t=".$_GET["cid"];
    $x=$_GET['page'];
    $y=$_GET['cid'];
    $url = $curl."?ac=detail&t=".$y."?pg=".$x;
}
if(empty($_GET['page'])){
    $_GET['page']='1';
}
$list=json_decode(file_get_contents($cxurl),true);
$data=json_decode(file_get_contents($url),true);
$recordcount = $data['page']['recordcount'];
$pagesize = $data['page']['pagesize'];
?>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta http-equiv="cache-control" content="no-siteapp">
<title>影片列表-全网最新影片-<?php echo $aik['title'];?></title>
<meta name='referrer' content="never">
<meta name="keywords" content="影片列表-在线观看的最新电影，影片库，视频列表">
<meta name="description" content="<?php echo $aik['title'];?>-影片资源列表">
<link rel="shortcut icon" href="favicon.ico" />
<link rel='stylesheet' id='main-css'  href='css/style.css' type='text/css' media='all' />
<link rel='stylesheet' id='main-css'  href='css/movie.css' type='text/css' media='all' />
<script type='text/javascript' src='//apps.bdimg.com//libs/jquery/2.0.0/jquery.min.js?ver=0.5'></script>
<!--[if lt IE 9]><script src="js/html5.js"></script><![endif]-->
</head>
<body>
<?php  include 'header.php';?>
<section class="container"><div class="fenlei">
<div class="b-listfilter" style="padding: 0px;">
<dl class="b-listfilter-item js-listfilter" style="padding-left: 0px;height:auto;padding-right:0px;">
<dd class="item g-clear js-listfilter-content" style="margin: 0;">
<strong><a href="movie.php?page=1">资源频道一</a>
<a href="moviea.php?page=1">资源频道二</a>
<a href="movieb.php?page=1">资源频道三</a>
<a href="dh.php">其他资源</a>
<a href="javascript:history.back(-1)">返回上页</a>
</strong>
</dd>
</dl>
</div>
</div>

<dl class="b-listfilter-item js-listfilter" style="padding-left: 0px;height:auto;padding-right:0px;">
<dd class="item g-clear js-listfilter-content" style="margin: 0;">
<strong>
<a href="movie.php?page=1">综合</a>
<?php echo $aik['zhan1'];?>
</strong>    
</dd>
</dl>
</div>
</div>
<div class="m-g">
<div class="b-listtab-main">
<div>
<div>
<div class="s-tab-main">
                    <ul class="list g-clear">
                    
<?php
//初始化
    $curl = curl_init();
    //设置抓取的url
    curl_setopt($curl, CURLOPT_URL, $html);
    //设置头文件的信息作为数据流输出
    curl_setopt($curl, CURLOPT_HEADER, 1);
    //设置获取的信息以文件流的形式返回，而不是直接输出。
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    //执行命令
    $response = curl_exec($curl);
    //关闭URL请求
    curl_close($curl);
    //显示获得的数据
if(empty($_GET['page'])){$html=''.$aik["zhanwai"].'?ac=detail&type=1&pg=1';
}else{ 
$html=''.$aik["zhanwai"].'?ac=detail&t='.$_GET['cid']. '&pg='.$_GET['page'];
}
?>
<?php
$rurl=file_get_contents($html);
$vname='#"vod_id":(.*?),#';//取出播放
$vname1='#"vod_name":"(.*?)"#';//取出名称
$vname2='#"vod_pic":"(.*?)"#';//取出图片
$vname3='#"vod_time":"(.*?)"#';//取出时间
preg_match_all($vname, $rurl,$xarr);
preg_match_all($vname1, $rurl,$xarr1);
preg_match_all($vname2, $rurl,$xarr2);
preg_match_all($vname3, $rurl,$xarr3);
$xbflist=$xarr[1];//播放
$xname=$xarr1[1];//名字
$ximg=$xarr2[1];//封面图
$shijian=$xarr3[1];//时间
$ximga = str_replace('\/','/',$ximg);
$rurl = str_replace('\/','/',$rurl);
foreach ($ximga as $key=>$imga);
foreach ($xname as $key=>$xvau){
    $do=$xbflist[$key];
    $do1=base64_encode($do);
    $cc="./mplay.php?id=";
    $ccb=$cc.$do1;
    echo "
<li class='item'>
<a class='js-tongjic' href='mplay.php?id=$xbflist[$key]' title='$xname[$key]' target='_blank'>
<div class='cover g-playicon'>
<img  src='$ximga[$key]' alt='$xname[$key]'/>
</div>
<div class='detail'>
<p class='title g-clear'>
<span class='s1'>$xname[$key]</span>
<p class='star'>$shijian[$key]</p>
 </div>
</a>
</li>
";
}
//print_r($rurl);
?>
</ul>
</div>
</div>
</div> 
 </br>
<div style="clear: both;"></div>
<div class="paging">
<?php
if(!empty($_GET['cid'])){
    $page=$_GET['page'];
    $cid=$_GET['cid'];
    $c="&cid=".$cid;}
    else{$c="";}
if($_GET['page'] != 1){
     echo '<a href="movie.php?page=1'.$c.'">首页</a>';
     echo '<a href="movie.php?page=' . ($_GET['page']-1) .$c.'">上一页</a>';
     } else {
echo '<a href="movie.php?page=1'.$c.'">首页</a>';
}
if($_GET['page'] == 1){
    echo '';
}else
echo '<a href="movie.php?page='.($_GET['page']-1).$c.'">'.($_GET['page']-1).'</a>';
echo '<a href="movie.php?page='.$_GET['page'].$c.'" class="active">'.$_GET['page'].'</a>';
if($_GET['page'] == 200){
    echo '';
}else
echo '<a href="movie.php?page='.($_GET['page']+1).$c.'">'.($_GET['page']+1).'</a>';

if($_GET['page'] < 200){
     echo '<a href="movie.php?page=' . ($_GET['page']+1) .$c.'">下一页</a>';
     echo '';
     } else {
echo '';
}    
?>
<a href="javascript:void(0);">当前第<?php echo $_GET['page'];?>页</a>
</div>
</div></div>
<div class="asst asst-list-footer"><?php echo $aik['movie_ad'];?></div></section>
<?php  include 'footer.php';?>
</body></html>