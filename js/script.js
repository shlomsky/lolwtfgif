/* Author:
	brian andrich
*/

var urlParams = {};
(function() {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function(s) { return decodeURIComponent(s.replace(a, ' ')); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
       urlParams[d(e[1])] = d(e[2]);
})();

function showError() {
	$('#error').show();
	//load tumblr url when enter key is pressed
	$(document).keydown(function(e) {
	    if (e.keyCode == 13) {
	       	var str = $('input:visible').val();
			if (str.substr(-1) === '/') {
			  var str = str.substr(0, str.length - 1);
			}
			if (str.substr(0, 7) === 'http://') {
				  var str = str.substring(7);
			}
			if (str === "") {
				return false;
			}
			window.location.href = 'http://lolwtfgif.com/?url=' + str + '';
	    }
	});
	var random = getRandomGallery();
	var nextUrl = "/?url="+random+"";
	defaultGif("error");
	$("#error .big-random a").attr("href", nextUrl);
	$('#landing').hide();
	$('#goodstuff').hide();
	$('#goodthing').hide();
	$('#loading').hide();
}

function delete_image(e)
{
    e.parentNode.parentNode.removeChild(e.parentNode);
	total = $('#goodstuff li').size();
}

function viewport()
{
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
}
viewport();

function imgClean() {
	$('.dirty').each(function() {
		$(this).removeClass('dirty');
		$(this).addClass('clean');
		$(this).attr('width', windowWidth).attr('height', windowHeight);
	});
}
imgClean();

num = 0;
myJsonpCallback = function(data)
{
	$.each(data.response.posts, function(i,x) {
		$.each(this.photos, function(i,x) {
			var q = this.original_size.url;
			if (q.indexOf('.gif') >= 0)
			{
				$('#goodstuff ul').append("<li><img class='dirty' src='" + q + "' onerror='delete_image(this)'></li>");
				imgClean();
			}
		});
	});
	num = num + 1;
	var pop = $('li').size();
	if (pop < 8) {
		load();
	}
	loadAgain(num);
};

$(document).ready(function() {
	total = $('#goodstuff li').size();
	url = urlParams['url'];
	img = urlParams['img'];
	if (img) {
		$('#goodthing').show();
		$('#goodthing ul').append("<li><img class='dirty' src='" + img + "' onerror='showError()'></li>");
		imgClean();
	}
	else if (url) {
		defaultGif("loading");
		$('#loading').show();
		if (url.substr(-1) === '/') {
		 url = url.substr(0, url.length - 1);
		}
		if (url.substr(0, 7) === 'http://') {
			  url = url.substring(7);
		}
		//decide what to show
		load();
		setTimeout(function() {
			var tc = $('#goodstuff li').size();
			if (tc < 1) {
				showError();
			} else {
				$('#loading').hide();
				$('#goodstuff').show();
				var random = getRandomGallery();
				var nextUrl = "/?url="+random+"";
				$("#goodstuff .new-gallery a").attr("href", nextUrl);
			}
		}, 6000);
	} else {
		var random = getRandomGallery();
		var nextUrl = "/?url="+random+"";
		defaultGif("landing");
		$("#landing .big-random a").attr("href", nextUrl);
		$('#loading').hide();
		$('#landing').show();
		imgClean();
		//load tumblr url when enter key is pressed
		$(document).keydown(function(e) {
		    if (e.keyCode == 13) {
		       	var str = $('input:visible').val();
				if (str.substr(-1) === '/') {
				  var str = str.substr(0, str.length - 1);
				}
				if (str.substr(0, 7) === 'http://') {
					  var str = str.substring(7);
				}
				if (str === "") {
					return false;
				}
				window.location.href = 'http://lolwtfgif.com/?url=' + str + '';
		    }
		});
	}

	$('input').click(function() {
		$(this).addClass("pulse");
		var x = $(this).val();
		if (x === "enter url (i.e. iwdrm.tumblr.com)") {
			$(this).val('');
		} 
		$(this).removeClass("blur");
	});

	$('input').blur(function() {
		var x = $(this).val();
		if (x === "") {
			$(this).val("enter url (i.e. iwdrm.tumblr.com)");
			$(this).addClass("blur");
		} 
		$(this).removeClass("pulse");
	});


	$(window).resize(function() {
		viewport();
		$('.clean').attr('width', windowWidth).attr('height', windowHeight);
	});

	//click go right
	$("#goodthing, #goodstuff").click(function() {
		anyScroll();
			//show next img
		    _gaq.push(['_trackEvent', 'Scroll', 'Mouse Click', '']);
			cycle('right');
	});

	//arrows
	$(document).keydown(function(e) {
		anyScroll();
	    if (e.keyCode == 39) {
		   _gaq.push(['_trackEvent', 'Scroll', 'Right Arrow Key Press', '']);
	       cycle('right');
	    }
	    else if (e.keyCode == 37) {
		   _gaq.push(['_trackEvent', 'Scroll', 'Left Arrow Key Press', '']);
	       cycle('left');
	    }
	});
	
	//autoplay
	$(".autoplay span").click(function(){
		$(".autoplay input").trigger("click");
	});
	
	$(".autoplay input").click(function(){
		setInterval(autoPlay, 2500);
	});


});
var offset = 0;
function load() {
	$.ajax({
	    type: 'GET',
	    url: 'http://api.tumblr.com/v2/blog/' + url + '/posts?type=photo&limit=10&offset=' + offset + '',
	    dataType: 'jsonp',
	    data: {
	        api_key: 'fmCi0cMluKIabZEGPyUmaX3pDMA6VApivcTN6artFbU405Sv3K',
	        jsonp: 'myJsonpCallback'
	    }
	});
	offset += 10;
}

function loadAgain(num) {
	if (num < 7) {
		$.ajax({
		    type: 'GET',
		    url: 'http://api.tumblr.com/v2/blog/' + url + '/posts?type=photo&limit=10&offset=' + offset + '',
		    dataType: 'jsonp',
		    data: {
		        api_key: 'fmCi0cMluKIabZEGPyUmaX3pDMA6VApivcTN6artFbU405Sv3K',
		        jsonp: 'myJsonpCallback'
		    }
		});
		offset += 10;
	} else {

	}
}

function initiate() {
	current = $('#goodstuff li img:visible');

		prev = current.parent('li').prev('li').find('img');
		if (!(prev.size())) {
			prev = $('#goodstuff ul li:last-child img');
		}

		next = current.parent('li').next('li').find('img');
		if (!(next.size())) {
			next = $('#goodstuff ul li:first-child img');
		}

}

function cycle(direction) {
	total = $('#goodstuff li').size();
	initiate();
	if (total < 2) {
		return false;
	}
	if (direction === 'right') {
			next.show();
			current.hide();
	} else if (direction === 'left') {
			prev.show();
			current.hide();
	}

	//figure out how many img are left
	var currentIndex = $('#goodstuff li img:visible').parents('li').index();
	var diff = total - currentIndex;
	if (diff < 20)
	{
		load();
	}
	var thisURL = '/?url=' + url + '';
	_gaq.push(['_trackPageview', thisURL]);
}

function anyScroll() {
	total = $('#goodstuff li').size();
	$('#goodstuff #click').hide();
}

var randomGallery = ["theofficegifs.tumblr.com", "mr-gif.com", "lulinternet.com", "gifmovie.tumblr.com", "realitytvgifs.tumblr.com", "ozneo.tumblr.com", "littleplasticthings.tumblr.com", "animalygifs.tumblr.com", "zbags.tumblr.com", "iwdrm.tumblr.com", "cosbygifs.tumblr.com", "prettygameofthronesgifs.tumblr.com"];
function getRandomGallery() {
   return randomGallery[Math.floor(Math.random() * randomGallery.length)];
}

function defaultGif(section){
	var z = $("#"+section+" img.default");
	var x = z.attr('id');
	z.attr('src', x);
}

function autoPlay(){
	//autoplay
	if ($(".autoplay input").is(':checked')){
		cycle('right');
	} 
}






















