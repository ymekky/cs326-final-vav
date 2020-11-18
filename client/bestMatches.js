window.addEventListener("load", async function() {

	const response = await fetch(`./drivers`);
	console.log('response', response);
	if (!response.ok) {
		console.error("Could not view rides.");
	}
	else {
		let search = JSON.parse(localStorage.getItem('search'));
		console.log(search)
		let drivers = await response.json();
		const tbody = document.getElementById('found');
		// rides = rides.available.filter(ride => ride.date === JSON.parse(window.localStorage.getItem('search')).date);
		// rides = sortRides(rides);
		for(let driver of drivers) {
			const tr = document.createElement('tr');
			tr.innerHTML = '<th scope="row"> <img src="files/profile.png" class="mr-3 profile-img" alt="..."></th>';
			const br = document.createElement('br');
			let td = document.createElement('td');
			td.innerHTML = driver.name;
			tr.appendChild(td);

			td = document.createElement('td');
			td.innerHTML = "Date: " + search.date;
			td.appendChild(br);
			td.innerHTML += "Time: " + search.time;
			tr.appendChild(td);

			td = document.createElement('td');
			td.innerHTML = "From: " + search.from;
			td.appendChild(br);
			td.innerHTML += "To: " + search.to;
			tr.appendChild(td);

			td = document.createElement('td');	
			let button = document.createElement('button');
			button.className = "btn btn-outline-primary";
			button.setAttribute('id', driver._id);
			button.innerHTML = "Request";
			button.addEventListener('click', () => notify({
				user_id :JSON.parse(window.localStorage.getItem('me'))._id,
				date : search.date,
				time : search.time,
				from : search.from,
				to : search.to,
				driver_id: driver._id,
			}));
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
async function notify(ride) {
	// const driver = this.getAttribute('id');
	// let rider = JSON.stringify(JSON.parse(window.localStorage.getItem('me'))._id);
	// if(from === to) {
	// 	alert('You cant request yourself');
	// 	return;
	// }
	const {user_id, driver_id} = ride;
	let string = '/notify?from=' + user_id + '&to=' + driver_id +'';
	console.log(string);
	const response = await fetch(string);

	const res = await fetch('/ride/new', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(ride)
	});

	window.location.replace('./account.html');




    // if(!response.ok) {
    //     alert(response.error);
    //     return;
    // }
    // else {
    // 	alert("Done! You will get a notification when they confirm.");
    // }
    return;
}