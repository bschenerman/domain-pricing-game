var $ = function (x) {
	return document.getElementById(x);
};

// var continues = ["AGAIN", "CONTINUE", "KEEP GOING", "TRY AGAIN", "MORE", "WHY AM I STILL DOING THIS"];

// var jsonurl = "https://cdn.glitch.com/b13b1538-556d-4bed-b9db-749060ea3dd1%2Fdomains.json?1548029701851";
var jsonurl = "assets/data.json";
var domains = [];
const loadingEl = document.querySelector('.loading');
const gameController = document.querySelector('.game-controller');
let topDomainBtn = document.querySelector('.domain.top');
let botDomainBtn = document.querySelector('.domain.bottom');
let topDomainEl = document.querySelector('.domain.top label');
let botDomainEl = document.querySelector('.domain.bottom label');
const priceTopEl = document.querySelector('.price-top');
const priceBotEl = document.querySelector('.price-bottom');
const responseTopEl = document.querySelector('.response-top');
const responseBotEl = document.querySelector('.response-bottom');
const nextQuestionEl = document.querySelector('.next-question');
const triesEl = document.querySelector('.high-score .local .score .total-questions');
const scoreEl = document.querySelector('.high-score .local .score .correct');

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
	return '$' + s;
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
		// console.log(topDomain)
		// console.log(botDomain)
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

function startNewRound () {
	gameController.classList.remove('end');
	gameController.classList.add('start');

	nextQuestionEl.classList.remove('end');
	nextQuestionEl.classList.add('start');

	nextQuestionEl.removeEventListener('click', startNewRound);

	responseTopEl.innerHTML = '';
	responseBotEl.innerHTML = '';

	responseTopEl.hide();
	responseBotEl.hide();

	toggleCorrectState(topDomainBtn, 0, 1)
	toggleCorrectState(botDomainBtn, 0, 1)


	priceTopEl.hide();
	priceTopEl.innerText = '';
	toggleCorrectState(priceTopEl, 0, 1)

	priceBotEl.hide();
	priceBotEl.innerText = '';
	toggleCorrectState(priceBotEl, 0, 1)

	showRandomDomains();
}

function toggleCorrectState (element, correct = 0, reset = 0) {
	
	if(reset){
		element.classList.remove('incorrect');
		element.classList.remove('correct');

		return false;
	}

	if(correct){
		element.classList.add('correct');
		element.classList.remove('incorrect');
	}else{
		element.classList.add('incorrect');
		element.classList.remove('correct');
	}
}

function clickTop() {
	
	if (state == 'showing') {
		showResult(topDomain.price > botDomain.price, 0);
	}
}

function clickBot() {
	if (state == 'showing') {
		showResult(topDomain.price < botDomain.price, 1);
	}
}

function clickAgain() {
	if (state == 'result') {
		showRandomDomains();
	}
}

function showResult(correct, button) {
	state = 'result';
	tries += 1;
	correct && score++;

	// console.log(button ? 'bottom' : 'top')

	if(!button){ // which btn clicked? 0 = top
		if(correct){
			responseTopEl.innerHTML = '<img src="assets/correct.svg" alt="" aria-hidden="true"><span>Correct</span>';
			toggleCorrectState(priceTopEl, 1);
			toggleCorrectState(priceBotEl, 0);

			toggleCorrectState(topDomainBtn, 1);

		}else{
			responseTopEl.innerHTML = '<img src="assets/incorrect.svg" alt="" aria-hidden="true"><span>Incorrect</span>';
			toggleCorrectState(priceTopEl, 0);
			toggleCorrectState(priceBotEl, 1);

			toggleCorrectState(topDomainBtn, 0);
		}
	}else{ // 1 = bot
		if(correct){			
			responseBotEl.innerHTML = '<img src="assets/correct.svg" alt="" aria-hidden="true"><span>Correct</span>';
			toggleCorrectState(priceTopEl, 0);
			toggleCorrectState(priceBotEl, 1);

			toggleCorrectState(botDomainBtn, 1);
		}else{
			responseBotEl.innerHTML = '<img src="assets/incorrect.svg" alt="" aria-hidden="true"><span>Incorrect</span>';
			toggleCorrectState(priceTopEl, 1);
			toggleCorrectState(priceBotEl, 0);

			toggleCorrectState(botDomainBtn, 0);
		}
	}

	gameController.classList.remove('start');
	gameController.classList.add('end');

	nextQuestionEl.classList.remove('start');
	nextQuestionEl.classList.add('end');

	nextQuestionEl.addEventListener('click', function(e){
		e.preventDefault();
		startNewRound();
	}, false);

	nextQuestionEl.focus();

	responseTopEl.show();
	responseBotEl.show();

	priceTopEl.show();
	priceTopEl.innerText = renderPrice(topDomain.price);

	priceBotEl.show();
	priceBotEl.innerText = renderPrice(botDomain.price);

	triesEl.innerText = tries;
	scoreEl.innerText = score;

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