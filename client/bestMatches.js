window.addEventListener("load", async function() {

	const response = await fetch(`./rides/view`);
	console.log('response', response);
	if (!response.ok) {
		console.error("Could not view rides.");
	}
	else {
		let rides = await response.json();
		const tbody = document.getElementById('found');
		rides = rides.available.filter(ride => ride.date === JSON.parse(window.localStorage.getItem('search')).date);
		rides = sortRides(rides);
		for(let ride of rides) {
			const tr = document.createElement('tr');
			tr.innerHTML = '<th scope="row"> <img src="files/profile.png" class="mr-3 profile-img" alt="..."></th>';
			const br = document.createElement('br');
			let td = document.createElement('td');
			td.innerHTML = ride.driver.name;
			tr.appendChild(td);

			td = document.createElement('td');
			td.innerHTML = "Date: " + ride.date;
			td.appendChild(br);
			td.innerHTML += "Time: " + ride.time;
			tr.appendChild(td);

			td = document.createElement('td');
			td.innerHTML = "From: " + ride.starting;
			td.appendChild(br);
			td.innerHTML += "To: " + ride.destination;
			tr.appendChild(td);

			td = document.createElement('td');	
			let button = document.createElement('button');
			button.className = "btn btn-outline-primary";
			button.setAttribute('id', JSON.stringify(ride.driver.id));
			button.innerHTML = "Request";
			button.addEventListener('click', notify);
			td.appendChild(button);

			tr.appendChild(td);

			tbody.appendChild(tr);
		}
	}
});

function sortRides(rides) {
	let tosort = [];
	let sorted = [];
	for(let ride of rides) {
		tosort.push([ride.time,ride.id]);
	}
	tosort.sort(function(a,b) {return a[0].localeCompare(b[0]);});

	for(let cur = 0; cur < rides.length; cur++){
		for(let ride in rides){
			if(tosort[cur][1] === rides[ride].id){
				sorted.push(rides[ride]);
			}
		}
	}

	return sorted;
}

//adds requests to users requests, send notification to driver
async function notify() {
	const to = this.getAttribute('id');
	let from = JSON.stringify(JSON.parse(window.localStorage.getItem('me')).id);
	if(from === to) {
		alert('You cant request yourself');
		return;
	}
	let string = '/notify?from=' + from + '&to=' + to +'';
	console.log(string);
	const response = await fetch(string);

    if(!response.ok) {
        alert(response.error);
        return;
    }
    else {
    	alert("Done! You will get a notification when they confirm.");
    }
    return;
}