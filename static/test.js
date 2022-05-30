
function my_submit(event) {
	el = document.getElementsByName("edit")[0].value;	
	fr = document.getElementsByTagName("form")[0];
	if(el.length < 5) {
		console.log("Сообщение не отправлено");	
		event.returnValue = false;					//отменяет отправку сообщения на сервер
		return;
	}
	el = document.getElementById("check_B").checked;
	if(el) {
		console.log("Сообщение будет открыто в новом окне");		
		fr.target = "_blank";						//открывает новое окно для получения результата с сервера
		return;							
	}
	fr.target = "";
	console.log("Сообщение будет получено. Ждите");	
	//Окно браузера в ожидании ответа с сервера
}

function my_fetch(event) {
	csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
	fetch(	'/guess_number/test', {
			method: 'POST',
			body: JSON.stringify({"A": "aaa", "B": "bbb"}), 				
			headers: {
				'X-CSRFToken': csrftoken,
				'Accept': 'text/html',					
				'Content-Type': 'application/json'				
			}})
		.then(response => response.text())								
		.then(temp => console.log(temp));		//обработка после получения 	
		console.log("Отправлено");
		//Окно браузера не ждет ответа с сервера
}