var game;
document.addEventListener('DOMContentLoaded', init) 

function init() {
	document.getElementById("try").addEventListener('keydown', try_keydown);
	document.getElementById("try").addEventListener('click', try_click);
	document.getElementById("name").addEventListener('keydown', name_keydown);
	document.getElementById("choice").addEventListener('click', choice_click);
	document.getElementById("set_max_number").addEventListener('keydown', max_number_keydown);
	document.getElementById("set_max_leaders").addEventListener('keydown', max_leaders_keydown);
	document.getElementById("ok").addEventListener('click', ok_click);
	document.getElementById("cancel").addEventListener('click', cancel_click);
	game = new Game();
	start();
}

function start() {
	n = Number(document.getElementById("set_max_number").value);
	l = Number(document.getElementById("set_max_leaders").value);
	if(game.init(n, l)) {
		sendPost();
		return true;
	}
	return false;
}
function sendPost(){
	document.getElementById("try").value = "Ждите";
	nm = document.getElementById("name").value.trim();
	if(nm == "")
		nm = "Игрок";	
	data = game.getPostBody(nm)
	csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
	fetch(	'/guess_number/', {
			method: 'POST',
			body: JSON.stringify(data), 				
			headers: {
				'X-CSRFToken': csrftoken,
				'Accept': 'application/json',					
				'Content-Type': 'application/json'				
			}})
		.then(response => response.json())							
		.then(temp => getPost(temp)) 	
		.catch(error => console.log(error));
}
function getPost(data) {
	document.getElementById("try").value = "Старт";
	table = newTable(
		document.getElementById("records"), 
		"Лучшие результаты '" + game.max_number + "' ("  + game.max_leaders + "-ка)", 
		["место", "игрок", "ходы", "скорость", "дата-время"]);
	let i=1
	for(el of data["records"])	{
		el.splice(0, 0, i);
		table.appendChild(addRow(el));
		++i;
	}
	if(data["result"].length) {
		el = document.getElementById("steps");
		table = newTable(
		el, 
		"Ваш результат", 
		["место", "ходы", "скорость"]);
		table.appendChild(addRow(data["result"]));
		el.appendChild(document.createElement("br"));
		el.appendChild(document.createTextNode("Для новой игры нажмите мышкой 'Старт'"));
	}	
	else
		newGame()
}
function newGame() {
	document.getElementById("try").value = "";
	document.getElementById("guess").innerHTML = "";
	document.getElementById("max_number").innerHTML = game.max_number;
	game.newGame();
	newTable(
		document.getElementById("steps"), 
		"Ход игры", 
		["ход", "число", "подсказка"])
}
function newTable(div, cap, head) {
	div.innerHTML = ""
	table = document.createElement("table");	
	caption = document.createElement("caption");
	caption.innerHTML = cap;
	table.appendChild(caption);
	table.appendChild(addRow(head, "th"));	
	div.appendChild(table);
	return table;
}
function addRow(arr, h="td") {
	row = document.createElement("tr");
	for(i=0; i<arr.length; ++i) {
		d = document.createElement(h);
		d.innerHTML = arr[i];
		row.appendChild(d);
	}
	return row;
}
function paintStep() {
	arr = game.arrayStep()
	rows = document.getElementById("steps").querySelectorAll('tr');
	if(rows.length == 1)
		rows[0].parentElement.appendChild(addRow(arr));
	else 
		rows[0].parentElement.insertBefore(addRow(arr), rows[1]);
	
}
function isRun() {
	return !isNaN(Number(document.getElementById("try").value));
}
function isNavigationKey(k) {
	return (k == 8 || k == 46 || k == 37 || k == 39) 
}
function isNumberKey(ch) {
	return ch.match(new RegExp("^[0-9]$"));
}
function isLenValue(str, n) {
	return (str.length < n)
}
function name_keydown(event) {
	if(isNavigationKey(event.keyCode)) 
		return;
	event.returnValue = isLenValue(event.target.value, 10);
}
function max_number_keydown(event){
	if(isNavigationKey(event.keyCode)) 
		return;	
	if(isNumberKey(event.key)) {
		if(isLenValue(event.target.value, 6))
			return;
	}
	event.returnValue = false;
}
function max_leaders_keydown(event){
	if(isNavigationKey(event.keyCode)) 
		return;
	if(isNumberKey(event.key)) {
		if(isLenValue(event.target.value, 3))
			return;
	}
	event.returnValue = false;
}
function try_keydown(event) {
	if(isRun()) {
		if(isNavigationKey(event.keyCode)) 
			return;
		num = event.target.value;
		if(event.keyCode == 13) {
			if(game.check(Number(num))) {
				document.getElementById("guess").innerHTML = num
				sendPost();	
			}
			else {
				paintStep();
				event.target.value = ""
			}			 
			return;
		}
		if(isLenValue(num, String(game.max_number).length)) {
			if(isNumberKey(event.key)) 
				return;
		}
	}
	event.returnValue = false; 
}
function try_click() {	
	if(document.getElementById("steps").childNodes.length != 1)
		newGame();
}
function choice_click() {	
	document.getElementById("param").style.display = "flex";
}
function ok_click() {
	if(start()) 
		cancel_click();
}
function cancel_click() {
	document.getElementById("param").style.display = "none";
	document.getElementById("set_max_number").value = game.max_number;
	document.getElementById("set_max_leaders").value = game.max_leaders;
}
class Game {
	#max_number
	#max_leaders
	#step
	#count
	#number
	#time
	init(n, l) {
		if(n < 100 || l < 10) 
			return false;
		this.#max_number = n;
		this.#max_leaders = l;
		this.newGame();
		return true;
	}
	newGame() {
		this.#number = Math.floor(Math.random() * (this.#max_number+1));
		this.#count = 0;
		this.#time = new Date();
	}
	check(st) {
		this.#step = st;
		this.#count++;		
		return (st == this.#number);
	}	
	arrayStep() {
		return [this.#count, this.#step, (this.#step < this.#number ? "больше" : "меньше")]
	}
	get max_number() {
		return this.#max_number
	}
	get max_leaders() {
		return this.#max_leaders
	}
	hint() {
		return this.#number;
	}
	getPostBody(nm) {	
		var ms = new Date(); 
		return {
			"max_leaders": this.#max_leaders,			
			"data": {
				"max_number": this.#max_number,				
				"count": this.#count,
				"milliseconds": ms - this.#time,
				"name": nm}				
		};
	}
}


	
	
	