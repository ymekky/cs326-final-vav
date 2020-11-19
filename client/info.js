window.addEventListener("load", async function() {
	document.getElementById('sel1').onchange = () => {
		if(document.getElementById('sel1').value === 'looking for a rider') {
			document.getElementById('sel2-label').innerHTML = '';
			document.getElementById('sel2-label').innerHTML = 'Where will you leave from?';
			document.getElementById('test').className = "form-group show";
		}
		else {
			document.getElementById('sel2-label').innerHTML = '';
			document.getElementById('sel2-label').innerHTML = 'Where do you want to leave from?';
			document.getElementById('test').className = "form-group hide";
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
			if(document.getElementById('time').value === ''){
				return;
			}
			const user = JSON.parse(window.localStorage.getItem('me'));
			const ride_id = Math.floor(Math.random() * 10000); //ride id, change to randomize*/
			const response = await fetch('/ride/new', {
			      method: 'POST',
			      headers: {
			        'Content-Type': 'application/json;charset=utf-8'
			      },	      
			      body: JSON.stringify({"date": document.getElementById('date').value,
			      						"time": document.getElementById('time').value,
			      						"from": document.getElementById('from').value,
			      						"to": document.getElementById('to').value, 
			      						"driver": {'_id': user._id,'name': user.name, "email":user.email},
			      						}) 
			    });

			    if(!response.ok) {
			        alert(response.error);
			        return;
			    }
			    else {
			    	alert("Done! Just wait for a notification.");
			    }
			window.location.replace('index.html');
		}
	});
});
