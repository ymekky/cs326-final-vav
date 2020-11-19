window.addEventListener("load", async function() {
	document.getElementById("name").placeholder = JSON.parse(window.localStorage.getItem("me")).name;
	document.getElementById("email").placeholder = JSON.parse(window.localStorage.getItem("me")).email;
	document.getElementById("password").value = JSON.parse(window.localStorage.getItem("me")).password;
	const user_id = JSON.parse(window.localStorage.getItem("me"))._id;

	document.getElementById("logout").addEventListener('click', function () {
		window.localStorage.setItem("logged-in", false);
		window.location.replace('./index.html')
	});

	document.getElementById("nav-request-tab").addEventListener('click', function () {
		document.getElementById("nav-request-tab").className = "nav-item nav-link active";
		document.getElementById("nav-current-tab").className = "nav-item nav-link";
		document.getElementById("nav-past-tab").className = "nav-item nav-link";

		document.getElementById("requested").className = "tab-pane fade show active";
		document.getElementById("active-rides").className = "tab-pane fade";
		document.getElementById("completed").className = "tab-pane fade";
	});

	document.getElementById("nav-current-tab").addEventListener('click', function () {
		document.getElementById("nav-current-tab").className = "nav-item nav-link active";
		document.getElementById("nav-request-tab").className = "nav-item nav-link";
		document.getElementById("nav-past-tab").className = "nav-item nav-link";

		document.getElementById("active-rides").className = "tab-pane fade show active";
		document.getElementById("requested").className = "tab-pane fade";
		document.getElementById("completed").className = "tab-pane fade";
	});

	document.getElementById("nav-past-tab").addEventListener('click', function () {
		document.getElementById("nav-past-tab").className = "nav-item nav-link active";
		document.getElementById("nav-current-tab").className = "nav-item nav-link";
		document.getElementById("nav-request-tab").className = "nav-item nav-link";

		document.getElementById("completed").className = "tab-pane fade show active";
		document.getElementById("active-rides").className = "tab-pane fade";
		document.getElementById("requested").className = "tab-pane fade";
	});

    const response = await fetch(`./user/rides/view?user_id=${user_id}`); //change
    if (!response.ok) {
        console.error("Could not view rides.");
    }
    else {
			let rides = await response.json();

			const _br = document.createElement('br');

			//BUILIDING PENDING (REQUESTED) RIDES
			//-----------------------------------------------
			let table = document.getElementById('requested');
			let tb = document.createElement('table');
			tb.className += " " + "table-bordered" + " " + "table-rides";

			initialize(table, tb);

			if(rides.pending !== undefined) {
				for(let ride of rides.pending) {
					build(table,tb,ride);
				}
			}
			table.appendChild(tb);
			//-----------------------------------------------

			//BUILDING ACTIVE (CONFIRMED) RIDES
			//-----------------------------------------------

			table = document.getElementById('active-rides');
			tb = document.createElement('table');
			tb.className += " " + "table-bordered" + " " + "table-rides";

			initialize(table, tb);

			if(rides.active !== undefined) {
				for(let ride of rides.active) {
					build(table,tb,ride);
				}
			}
			table.appendChild(tb);

			//-----------------------------------------------

			//BUILDING COMPLETED RIDES
			//-----------------------------------------------
			table = document.getElementById('completed');
			tb = document.createElement('table');
			tb.className += " " + "table-bordered" + " " + "table-rides";

			initialize(table, tb);

			if(rides.completed !== undefined) {
				for(let ride of rides.completed) {
					build(table,tb,ride);
				}
			}
			table.appendChild(tb);
    }

    const notifs = await fetch('./notifs?id=' + user_id);
 
    if (!notifs.ok) {
        console.error("Could not get notificaitons.");
    }else {
    	const notifications = await notifs.json();


			let table = document.getElementById('notifications');
			let tb = document.createElement('table');
			tb.className += " " + "table-bordered" + " " + "table-rides";

			initializeReqs(table, tb);

			if(notifications !== undefined) {
				for(let notif of notifications) {
					buildReqs(table,tb,notif);
				}
			}
			table.appendChild(tb);
    	
    }
});

function initialize(table, tb) {
	const titles = ["Route", "ID", "Date", "Time", "Driver", "Email", ""];
	const thead = document.createElement('thead');
	const tr = document.createElement('tr');

	for(const title of titles){ 
		const th = document.createElement('th');
		th.innerHTML = title;
		tr.appendChild(th);
		thead.appendChild(tr);
		tb.appendChild(thead);
	}

	table.appendChild(tb);
}

function initializeReqs(table, tb) {
	const titles = ["Name", "Email", "Ride ID", "",""];
	const thead = document.createElement('thead');
	const tr = document.createElement('tr');

	for(const title of titles){ 
		const th = document.createElement('th');
		th.innerHTML = title;
		tr.appendChild(th);
		thead.appendChild(tr);
		tb.appendChild(thead);
	}

	table.appendChild(tb);
}

function build(table,tb,ride) {
	console.log(ride);
	const tbody = document.createElement('tbody');
	let tr = document.createElement('tr');

	let td = document.createElement('td');
	td.innerHTML = ride.from + " to " + ride.to;
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = ride._id;
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = ride.date;
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = ride.time;
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = ride.driver.name;
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = ride.driver.email;
	tr.appendChild(td);

	let button = document.createElement('button');
	button.className += "btn btn-danger";
	button.setAttribute('ride_id',ride._id);
	button.setAttribute('driver_id',ride.driver._id);
	button.innerHTML = "CANCEL";
	button.addEventListener('click',cancel);

	td = document.createElement('td');
	td.appendChild(button)
	tr.appendChild(td);

	tbody.appendChild(tr);
	tb.appendChild(tbody);
}

function buildReqs(table,tb,notif) {
	console.log(notif);
	const tbody = document.createElement('tbody');
	let tr = document.createElement('tr');

	let td = document.createElement('td');
	td.innerHTML = notif.name;
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = notif.email;
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = notif.ride_id;
	tr.appendChild(td);

	let btn = document.createElement('button');
	btn.className += "btn btn-outline-success";
	btn.innerHTML = "Accept";
	btn.setAttribute('user_id', notif._id);
	btn.setAttribute('ride_id', notif.ride_id);
	btn.addEventListener('click', accept);

	td = document.createElement('td');
	td.appendChild(btn);
	tr.appendChild(td);

	btn = document.createElement('button');
	btn.className += "btn btn-outline-danger";
	btn.innerHTML = "Reject";
	btn.setAttribute('user_id', notif._id);
	btn.setAttribute('ride_id', notif.ride_id);
	btn.addEventListener('click', accept);

	td = document.createElement('td');
	td.appendChild(btn);
	tr.appendChild(td);

	tbody.appendChild(tr);
	tb.appendChild(tbody);	
}

//accepts requests. adds ride to requestor's active rides
async function accept() {
	const from = this.getAttribute('user_id');
	const ride_id = this.getAttribute('ride_id');
	let to = JSON.stringify(JSON.parse(window.localStorage.getItem('me'))._id);

	const rideRequest = await fetch('/user/rides/active?user_id=' + from + '&ride_id=' + ride_id + '');

	await fetch('/denotify?from=' + from + '&to=' + to + '');

    if(!rideRequest.ok) {
        alert(response.error);
    }
    location.reload();
    return;
}

//rejects requests
async function reject() {
	const from = this.getAttribute('user_id');
	const ride_id = this.getAttribute('ride_id');
	let to = JSON.stringify(JSON.parse(window.localStorage.getItem('me'))._id);

	const rideRequest = await fetch('/user/rides/delete?user_id=' + from + '&ride_id=' + ride_id + '');
	await fetch('/denotify?from=' + from + '&to=' + to + '');

    if(!rideRequest.ok) {
        alert(response.error);
    }
    location.reload();
    return;
}


async function cancel(){
	const ride_id = parseInt(this.getAttribute('ride_id'));
	const driver_id = parseInt(this.getAttribute('driver_id'));
	const user_id = JSON.parse(window.localStorage.getItem("me"))._id;

	let response = await fetch('/user/rides/delete?user_id=' + user_id + '&ride_id=' + ride_id);
	if(!response.ok) {
		console.error(response);
		return;
	}

	alert(ride_id);
/*
	if(driver_id === parseInt(user_id)){
		response = await fetch('/ride/delete?ride_id=' + ride_id);
	}*/
}
