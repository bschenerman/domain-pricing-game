var $ = function (x) {
	return document.getElementById(x);
};

var continues = ["AGAIN", "CONTINUE", "KEEP GOING", "TRY AGAIN", "MORE", "WHY AM I STILL DOING THIS"];

// var jsonurl = "https://cdn.glitch.com/b13b1538-556d-4bed-b9db-749060ea3dd1%2Fdomains.json?1548029701851";
var jsonurl = "assets/data.json";
var domains = [];
const loadingEl = document.querySelector('.loading');
const gameController = document.querySelector('.game-controller');
let topDomainEl = document.querySelector('.domain.top label');
let botDomainEl = document.querySelector('.domain.bottom label');
const priceTopEl = document.querySelector('.price-top');
const priceBotEl = document.querySelector('.price-bottom');
// const resultEl = document.querySelector
var state;
var score = 0;
var tries = 0;
let topDomain;
let botDomain;

Element.prototype.hide = function () {
	this.style.display = 'none';
}
Element.prototype.show = function () {
	this.style.display = '';
}

function randomDomain() {
	return domains[Math.floor(Math.random() * domains.length)];
}

function renderPrice(n) {
	var s = "";
	var d = 0;
	while (n > 0) {
		if (d % 3 == 0) {
			s = (n % 10) + "," + s
		} else {
			s = (n % 10) + s;
		}
		d += 1;
		n = Math.floor(n / 10);
	}
	s = s.substring(0, s.length - 1);
	return '($' + s + ')';
}

function showRandomDomains() {
	state = 'flicking';
	loadingEl.hide();
	gameController.show();
	// priceTopEl.hide();
	// priceBotEl.hide();
	$('result').hide();
	var flicks = 0

	function flick() {
		while (true) {
			topDomain = randomDomain();
			botDomain = randomDomain();
			if (topDomain.price != botDomain.price) break;
		}
		console.log(topDomain)
		console.log(botDomain)
		topDomainEl.innerText = topDomain.name;
		botDomainEl.innerText = botDomain.name;
		flicks += 1;
		if (flicks > 10) {
			state = 'showing';
		} else {
			window.setTimeout(flick, flicks * 25);
		}
	}
	window.setTimeout(flick, 25);
}

function clickTop() {
	if (state == 'showing') {
		showResult(topDomain.price > botDomain.price);
	}
}

function clickBot() {
	if (state == 'showing') {
		showResult(topDomain.price < botDomain.price);
	}
}

function clickAgain() {
	if (state == 'result') {
		showRandomDomains();
	}
}

function showResult(correct) {
	state = 'result';
	tries += 1;

	var tp = priceTopEl;
	tp.show();
	tp.innerText = renderPrice(topDomain.price);

	var bp = priceBotEl;
	bp.show();
	bp.innerText = renderPrice(botDomain.price);

	$('result').show();
	var restext = $('resultText');

	if (correct) {
		restext.innerText = 'CORRECT!';
		score += 1;
	} else {
		restext.innerText = 'WRONG!';
	}
	// $('score').innerText = 'SCORE: ' + score + '/' + tries;
	// $('continue').innerText = continues[tries % continues.length];

}
showLoading();

function showLoading() {
	state = 'loading';
	loadingEl.show();
	// gameController.hide();
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			domains = JSON.parse(this.responseText);
			showRandomDomains();
		}
	};
	xmlhttp.open("GET", jsonurl, true);
	xmlhttp.send();
}