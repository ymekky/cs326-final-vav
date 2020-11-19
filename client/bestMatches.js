window.addEventListener("load", async function() {

	const response = await fetch('./rides/view');
	console.log('response', response);
	if (!response.ok) {
		console.error("Could not view rides.");
	}
	else {
		let search = JSON.parse(localStorage.getItem('search'));
		console.log(search)
		let rides = await response.json();
		const tbody = document.getElementById('found');
		rides = rides.available;
		if(rides.length === 0){
			tbody.innerHTML = '<h3>No matches found.</h3>';
		}
		// rides = rides.available.filter(ride => ride.date === JSON.parse(window.localStorage.getItem('search')).date);
		// rides = sortRides(rides);
		for(let ride of rides) {
			const tr = document.createElement('tr');
			tr.innerHTML = '<th scope="row"> <img src="files/profile.png" class="mr-3 profile-img" alt="..."></th>';
			const br = document.createElement('br');
			let date;
			let td = document.createElement('td');
			td.innerHTML = ride.driver.name;
			tr.appendChild(td);

			td = document.createElement('td');
			date = ride.date.slice(5,7) + '-' + ride.date.slice(8,10) + '-' + ride.date.slice(0,4); //mm/dd/yyyy
			td.innerHTML = "Date: " + date;
			td.appendChild(br);
			td.innerHTML += "Time: " + ride.time;
			tr.appendChild(td);

			td = document.createElement('td');
			td.innerHTML = "From: " + ride.from;
			td.appendChild(br);
			td.innerHTML += "To: " + ride.to;
			tr.appendChild(td);

			td = document.createElement('td');	
			let button = document.createElement('button');
			button.className = "btn btn-outline-primary";
			button.setAttribute('_id', ride.driver._id);
			button.setAttribute('ride_id', ride._id);
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
	const to = this.getAttribute('_id');
	const ride_id = this.getAttribute('ride_id');
	let from = JSON.stringify(JSON.parse(window.localStorage.getItem('me'))._id);
	if(from === to) {
	 	alert('You can\'t request yourself');
	return;
	}
	let string = '/notify?from=' + from + '&to=' + to +'&ride_id=' + ride_id + '';
	const response = await fetch(string);
	const rideRequest = await fetch('/user/rides/pending?user_id=' + from + '&ride_id=' + ride_id + '');

    if(!response.ok) {
        alert(response.error);
        return;
    }
    else {
     	alert("Done! You will get a notification when they confirm.");
    }
    return;
}