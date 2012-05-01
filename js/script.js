/* Author:
	brian andrich
*/

var urlParams = {};
(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
       urlParams[d(e[1])] = d(e[2]);
})();

function showError(){
	$("#error").show();
	$("#landing").hide();
	$("#goodstuff").hide();
	$("#loading").hide();
}

function delete_image(e)
{
    e.parentNode.parentNode.removeChild(e.parentNode);
	total = $("#goodstuff li").size();
}

function viewport()
{
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
};
viewport();

function imgClean(){
	$(".dirty").each(function(){
		$(this).removeClass("dirty");
		$(this).addClass("clean");
		$(this).attr('width', windowWidth).attr('height', windowHeight);
	});	
}
imgClean();

num = 0;
myJsonpCallback = function(data)
{	
	$.each(data.response.posts, function(i,x){
		$.each(this.photos, function(i,x){
			var q = this.original_size.url;
			if (q.indexOf(".gif") >= 0)
			{
				$("#goodstuff ul").append("<li><img class='dirty' src='"+q+"' onerror='delete_image(this)'></li>");
				imgClean();
			}
		});
	});
	num = num + 1;
	var pop = $("li").size();
	if (pop < 8) {
		load();
	}
	loadAgain(num);
}

$(document).ready(function(){
	total = $("#goodstuff li").size();
	url = urlParams["url"];
	if (url) {
		$("#loading").show();
		
		if(url.substr(-1) === '/') {
		 url = url.substr(0, url.length - 1);
		}
		if(url.substr(0,7) === 'http://') {
			  url = url.substring(7);
		}

		//decide what to show
		load();
		setTimeout(function(){ 
			var tc = $("#goodstuff li").size();
			if (tc < 1) {
				showError();
			} else {
				$("#loading").hide();
				$("#goodstuff").show();
			}
		}, 5000);
	} else {
		$("#loading").hide();
		$("#landing").show();
		$("#url").focus();
		imgClean();
		$(document).keydown(function(e){
		    if (e.keyCode == 13) { 
		       	var str = $("#url").val();
				if(str.substr(-1) === '/') {
				  var str = str.substr(0, str.length - 1);
				}
				if(str.substr(0,7) === 'http://') {
					  var str = str.substring(7);
				}
				window.location.href="http://lolwtfgif.com/?url="+str+"";
		    }
		});
	}
	
	$("#url").click(function(){
		$(this).val('');
	});
	
	$("#url").blur(function(){
		var x = $(this).val();
		if (!(x)) {
			$(this).val('why did you do that?');
		}
	});
	
	
	$(window).resize(function(){
		viewport();
		$(".clean").attr('width', windowWidth).attr('height', windowHeight);
	});
	
	//click go right
	$(window).click(function(){
		anyScroll();
			//show next img
		    _gaq.push(['_trackEvent', 'Scroll', 'Mouse Click', '']);
			cycle("right");
	});
	
	//arrows
	$(document).keydown(function(e){
		anyScroll();
	    if (e.keyCode == 39) { 
		   _gaq.push(['_trackEvent', 'Scroll', 'Right Arrow Key Press', '']);
	       cycle("right");
	    }
	    else if (e.keyCode == 37) { 
		   _gaq.push(['_trackEvent', 'Scroll', 'Left Arrow Key Press', '']);
	       cycle("left");
	    }
	});
	
	
});
var offset = 0;
function load(){
	$.ajax({
	    type: "GET",
	    url : "http://api.tumblr.com/v2/blog/"+url+"/posts?type=photo&limit=10&offset="+offset+"",
	    dataType: "jsonp",
	    data: {
	        api_key : "fmCi0cMluKIabZEGPyUmaX3pDMA6VApivcTN6artFbU405Sv3K",
	        jsonp : "myJsonpCallback",
	    }
	});
	offset+=10;
}

function loadAgain(num){
	if (num < 7) {
		$.ajax({
		    type: "GET",
		    url : "http://api.tumblr.com/v2/blog/"+url+"/posts?type=photo&limit=10&offset="+offset+"",
		    dataType: "jsonp",
		    data: {
		        api_key : "fmCi0cMluKIabZEGPyUmaX3pDMA6VApivcTN6artFbU405Sv3K",
		        jsonp : "myJsonpCallback",
		    }
		});
		offset+=10;
	} else {
		
	}
}

function initiate(){
	current = $("#goodstuff li img:visible");

		prev = current.parent("li").prev("li").find("img");
		if (!(prev.size())) {
			prev = $("#goodstuff ul li:last-child img");
		}
		
		next = current.parent("li").next("li").find("img");
		if (!(next.size())) {
			next = $("#goodstuff ul li:first-child img");
		}

}

function cycle(direction){
	total = $("#goodstuff li").size();
	initiate();
	if (direction === "right") {
			next.show();
			current.hide();
	} else if (direction === "left") {
			prev.show();
			current.hide();
	}
	
	//figure out how many img are left
	var currentIndex = $("#goodstuff li img:visible").parents("li").index();
	var diff = total-currentIndex;
	if (diff<20) 
	{
		load();
	}
	var thisURL = "/?url="+url+"";
	_gaq.push(['_trackPageview', thisURL]);
}

function anyScroll(){
	total = $("#goodstuff li").size();
	$("#goodstuff #click").hide();	
}



















