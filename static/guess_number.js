var game;
document.addEventListener('DOMContentLoaded', init) 
function init() {	
	game = new Game(
		Number(document.getElementById("max_number").innerHTML),
		Number(document.getElementById("try").value));
	document.getElementById("try").addEventListener('keydown', try_keydown);
	document.getElementById("try").addEventListener('click', try_click);
	document.getElementById("name").addEventListener('keydown', name_keydown);
	sendPost();	
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
function isRun() {
	return !isNaN(Number(document.getElementById("try").value));
}

function name_keydown(event) {
	k = event.keyCode
	if(k == 8 || k == 46 || k == 37 || k == 39) 
		return;
	event.returnValue = event.target.value.length < 10;
}

function try_keydown(event) {
	if(isRun()) {
		k = event.keyCode
		if(k == 8 || k == 46 || k == 37 || k == 39) 
			return; 
		num = event.target.value;
		if(k == 13) {
			if(game.check(Number(num))) {
				document.getElementById("guess").innerHTML = num
				sendPost();	
			}
			else
			{
				arr = game.arrayStep()
				rows = document.getElementById("steps").querySelectorAll('tr');
				if(rows.length == 1)
					rows[0].parentElement.appendChild(addRow(arr));
				else 
					rows[0].parentElement.insertBefore(addRow(arr), rows[1]);
				event.target.value = ""
			} 
			return;
		}
		if(num.length < String(game.max_number).length) {
			if(event.key.match(new RegExp("^[0-9]$"))) 
				return;
		}
	}
	event.returnValue = false; 
}
function try_click(event) {	
	if(document.getElementById("steps").childNodes.length != 1)
		newGame();
}

class Game {
	#max_number
	#max_leaders
	#step
	#count
	#number
	#time
	constructor(n, l) {
		this.#max_number = n;
		this.#max_leaders = l;
		this.newGame();
	}
	newGame() {
		this.#number = Math.floor(Math.random() * (this.#max_number+1));
		this.#count = 0;
		this.#time = new Date();
		console.log(this.#number);	
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


	
	
	