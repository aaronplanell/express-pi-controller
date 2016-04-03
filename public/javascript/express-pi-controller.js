// Call the switch url and get the result
var switchButton = function (id) {
	var url = "/led/" + id + "/switch";
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.open("GET", url, true);
	xmlhttp.send();			

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        var data = JSON.parse(xmlhttp.responseText);
	        if (data!==null) {
	        	//Get the result
	        	if (data.success) 
	        		refreshButton(data.bcm);
	        	else
	        		showErrors(data.errors);

	        	//Disable buttons
	        	if (!data.sStatusLed)
	        		disableButtons();
		    };
	    };
	};			
};

var refreshButton = function (bcm) {
	var id = bcm.id;
	var status = bcm.status

	if(status === 0) 
		document.getElementById('button_' + id).className = "btn btn-lg btn-danger";
	else
		document.getElementById('button_' + id).className = "btn btn-lg btn-success";
};

var showErrors = function (errors) {
	if(errors.length>0) {
		var warning = "<strong>Warning!</strong> ";
		for (i = 0; i < errors.length; i++) {
			warning += " " + errors[i].message;
		};

		document.getElementById('alert').innerHtml = warning;
		document.getElementById('alert').style = "display:block";
	};
};

var disableButtons = function () {
	var allDanger = document.getElementsByClassName("btn btn-lg btn-danger");
	while (allDanger.length>0) {
	    allDanger[0].disabled = true;
	    allDanger[0].className = "btn btn-lg";
		allDanger = document.getElementsByClassName("btn btn-lg btn-danger");
	};

	var allSuccess = document.getElementsByClassName("btn btn-lg btn-success");
	while (allSuccess.length>0) {
	    allSuccess[0].disabled = true;
	    allSuccess[0].className = "btn btn-lg";
		allSuccess = document.getElementsByClassName("btn btn-lg btn-success");
	};
};