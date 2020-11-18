window.addEventListener("load", async function() {
	document.getElementById('sel1').onchange = () => {
		if(document.getElementById('sel1').value === 'looking for a rider') {
			document.getElementById('sel2-label').innerHTML = '';
			document.getElementById('sel2-label').innerHTML = 'Where will you leave from?';
		}
		else {
			document.getElementById('sel2-label').innerHTML = '';
			document.getElementById('sel2-label').innerHTML = 'Where do you want to leave from?';	
		}
	}; 

	document.getElementById('search-click').addEventListener('click', async function() {
		if(document.getElementById('sel1').value === 'looking for a driver') {
			const date = document.getElementById('date').value;
			const time = document.getElementById('time').value;
			const from = document.getElementById('from').value;
			const to = document.getElementById('to').value;
			window.localStorage.setItem('search',JSON.stringify({from, to, date, time}));
			window.location.replace('bestMatches.html');
		}
		else{
			if(window.localStorage.getItem('searching') !== "true"){
				const user = JSON.parse(window.localStorage.getItem('me'));
				const response = await fetch('/ride/new', {
				      method: 'POST',
				      headers: {
				        'Content-Type': 'application/json;charset=utf-8'
				      },
				      body: JSON.stringify({"date": document.getElementById('date').value,
				      						"time": document.getElementById('time').value + document.getElementById('PM').value,
				      						"starting": document.getElementById('from').value,
				      						"destination": document.getElementById('to').value, 
				      						"driver": {'id': user._id,'name': user.name, "email":user.email},
				      						"id": Math.random(1000)})//ride id, change to randomize
				    });

				    if(!response.ok) {
				        alert(response.error);
				        return;
				    }
				    else {
				    	window.localStorage.setItem('searching',"true");
				    	alert("Done! Just wait for a notification.");
				    }
				window.location.replace('index.html');
			}
			else {
				alert("You\'re already searching for passengers!");
			}
		}
	});


});
