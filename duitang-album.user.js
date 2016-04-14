// ==UserScript==
// @name         Dowload Duitang Album
// @name:zh-CN   堆糖相册图片抓取
// @namespace    http://rotar.tk/
// @version      0.2.1
// @description  Fetch URL of all images in album.
// @description:zh-CN  抓取当前堆糖相册所有图片的下载地址。
// @author       Rotar
// @match        http://www.duitang.com/album/*
// @grant        none
// @downloadURL  https://github.com/kaneorotar/duitang-userscript/raw/master/duitang-album.user.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
var albumid = /album\/\?id=([0-9]*)/.exec(window.location.href)[1];
var start = 0;
var lurl = "http://www.duitang.com/napi/blog/list/by_album/?album_id="+albumid+"&limit=100&start="+start;
var urls = "";
var urlsary = new Array();

var notify = document.createElement("div");
notify.id = "notify_box";
notify.style.height = "200px";
notify.style.width = "500px";
notify.style.background = "#EEEEEE";
notify.style.border = "#0000AA 3px solid";
notify.style.position = "fixed";
notify.style.top = "50%";
notify.style.left = "50%";
notify.style.marginTop = "-100px";
notify.style.marginLeft = "-250px";
notify.style.borderRadius = "9px"
notify.style.textAlign = "center";
notify.style.fontFamily = "Microsoft Yahei, SimHei";
notify.style.fontSize = "18px";
notify.style.zIndex = 10000;
notify.style.display = "None"; 
document.body.appendChild(notify);

var notifytitle = document.createElement("span");
notifytitle.innerHTML = "Loading Image URL list ...";
notifytitle.style.fontSize = "18px";
notify.appendChild(notifytitle);

var urltxtcopied = false;
var urltxt = document.createElement("textarea");
urltxt.style.width = "495px";
urltxt.style.height = "165px";
urltxt.style.overflow = "scroll";
urltxt.style.display = "none";
urltxt.title = "Ctrl+C";
urltxt.autocorrect = "off";
urltxt.spellcheck = false;
notify.appendChild(urltxt);
urltxt.onmouseover=function(){
    urltxt.select();
    urltxtcopied = true;
};
notify.onmouseout=function(){
	if (urltxtcopied) {
		setTimeout(function(){notify.style.display = "none";},2000);
	};
}

var responseb;
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
	if (xhr.readyState == XMLHttpRequest.DONE) {
		responseb = JSON.parse(xhr.responseText);
		console.log("Finished Fetching from: "+start);
		for (var j of responseb.data["object_list"]) {
			urls = urls + j["photo"]["path"].replace("_jpeg","") + "\n";
			urlsary[urlsary.length] = j["photo"]["path"].replace("_jpeg","");
		}
		if(responseb.data["more"]==1){
			start = responseb.data["next_start"];
			notifytitle.innerHTML = "Loading Image URL list ... " + parseInt(start/responseb.data["total"]*100) + "%";
			lurl = "http://www.duitang.com/napi/blog/list/by_album/?album_id="+albumid+"&limit=100&start="+start;
			xhr.open('GET', lurl, true);
			xhr.send(null);
			console.log("Start Fetching from: "+start);
		}else{
			console.log("Fetching All Done!");
			console.log(urls);
			notifytitle.innerHTML = "[Total: "+urlsary.length+"] Hover to Select URLs and Then Copy"
			urltxt.innerHTML = urls;
			notify.style.display = "block";
			notifytitle.style.display = "block";
			urltxt.style.display = "block";
		}
	}
}

function startfetch(){
	xhr.open('GET', lurl, true);
	xhr.send(null);
	console.log("Start Fetching from: "+start);
}

var downbtn = document.createElement("div");
downbtn.id = "download_btn";
downbtn.style.height = "57px";
downbtn.style.width = "150px";
//duitang
downbtn.style.backgroundImage = "url('http://img5.duitang.com/uploads/files/201407/26/20140726151838_MStAK.png')";
downbtn.style.backgroundPosition = "-639px -90px";
downbtn.style.position = "fixed";
downbtn.style.top = "5px";
downbtn.style.right = "5px";
downbtn.style.borderRadius = "5px"
downbtn.style.textAlign = "center";
downbtn.style.fontFamily = "Microsoft Yahei, SimHei";
downbtn.style.fontSize = "18px";
downbtn.style.zIndex = 10000;
downbtn.style.cursor = "pointer";
downbtn.style.transform = "scale(0.7)";
document.body.appendChild(downbtn);
downbtn.onclick = function(){
	downbtn.style.display = "none";
	startfetch();
	notify.style.display = "block";
};
console.log("Duitang Download Button Created!")