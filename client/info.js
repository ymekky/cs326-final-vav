window.addEventListener("load", async function() {
	let today = new Date().toISOString().split('T')[0];
	let past_search = JSON.parse(window.localStorage.getItem("search"));
	document.getElementById("date").setAttribute('min', today);
	document.getElementById("date").value = today;

	if(parseInt(window.localStorage.getItem("notifs")) > 0) {
		document.getElementById('alert').className = "mb-0 alert alert-success alert-dismissible fade show";
		window.localStorage.setItem("notifs", 0);
	}
	//reloads past search
	if(past_search !== null || past_search !== undefined){
		let locations = ["UMASS", "Boston Logan Airport", "JFK Airport", "Bradley International Airport"];
		if(past_search.driver){
			document.getElementById('sel1').selectedIndex = 1;
			document.getElementById('sel2-label').innerHTML = '';
			document.getElementById('sel2-label').innerHTML = 'Where will you leave from?';
			document.getElementById('test').className = "form-group show";
		}
		else {
			document.getElementById('sel1').selectedIndex = 0;
		}

		for(let location in locations){
			if(past_search.from === locations[location]){
				document.getElementById('from').selectedIndex = location;
			}
			if(past_search.to === locations[location]){
				document.getElementById('to').selectedIndex = location;
			}
		}

		document.getElementById('date').value = past_search.date;
	}

	document.getElementById("back").onclick = () => {window.location.replace("/index.html")};

	document.getElementById('sel1').onchange = () => {
		if(document.getElementById('sel1').value === 'looking for a passenger') {
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
		const date = document.getElementById('date').value;
		const time = document.getElementById('time').value;
		const from = document.getElementById('from').value;
		const to = document.getElementById('to').value;
		if(document.getElementById('sel1').value === 'looking for a driver') {
			window.localStorage.setItem('search',JSON.stringify({"driver": false, from, to, date, time}));
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
			window.localStorage.setItem('search',JSON.stringify({"driver": true, from, to, date, time}));
			window.location.replace('index.html');
		}
	});

});
