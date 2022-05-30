
function my_submit(event) {
	el = document.getElementsByName("edit")[0].value;	
	fr = document.getElementsByTagName("form")[0];
	if(el.length < 5) {
		console.log("Сообщение не отправлено");	
		event.returnValue = false;
		return;
	}
	el = document.getElementById("check_B").checked;
	if(el) {
		console.log("Сообщение будет открыто в новом окне");		
		fr.target = "_blank";
		return;		
	}
	fr.target = "";
	console.log("Сообщение будет получено. Ждите");
}