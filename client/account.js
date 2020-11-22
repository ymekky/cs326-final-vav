window.addEventListener("load", async function() {
	document.getElementById("name").placeholder = JSON.parse(window.localStorage.getItem("me")).name;
	document.getElementById("email").placeholder = JSON.parse(window.localStorage.getItem("me")).email;
	document.getElementById("password").value = JSON.parse(window.localStorage.getItem("me")).password;
	const user_id = JSON.parse(window.localStorage.getItem("me"))._id;

	document.getElementById("logout").addEventListener('click', async function () {
		const res = await fetch('/logout',{credentials: 'include'});
		if (res.ok) {
			window.localStorage.setItem("logged-in", false);
			window.localStorage.setItem("me", null);
			window.location.replace('./index.html');
		}
	});

	document.getElementById("nav-logout").addEventListener('click', async function () {
		const res = await fetch('/logout',{credentials: 'include'});
		if (res.ok) {
			window.localStorage.setItem("logged-in", false);
			window.localStorage.setItem("me", null);
			window.location.replace('./index.html');
		}
	});

	document.getElementById("change-pwd").addEventListener('click', async function () {
		if(document.getElementById('password').readOnly === true){
			document.getElementById('password').readOnly = false;
			document.getElementById("change-pwd").addEventListener('click', async function () {
				const newPwd = document.getElementById("password").value;
				try {
					let changedPwd = await fetch(`/user/password?user_id=${user_id}&new=${newPwd}`);
					let user = JSON.parse(window.localStorage.getItem("me"));
					user.password = newPwd;
					window.localStorage.setItem("me",JSON.stringify(user));
					document.getElementById('password').readOnly = true;
					document.getElementById("password").value = JSON.parse(window.localStorage.getItem("me")).password;
					location.reload();
				}
				catch(e) {
					console.error(e);
				}
			});
		}
		else {}
	});

	document.getElementById("nav-request-tab").addEventListener('click', function () {
		document.getElementById("nav-request-tab").className = "nav-item nav-link active";
		document.getElementById("nav-current-tab").className = "nav-item nav-link";
		//document.getElementById("nav-past-tab").className = "nav-item nav-link";

		document.getElementById("requested").className = "tab-pane fade show active";
		document.getElementById("active-rides").className = "tab-pane fade";
		//document.getElementById("completed").className = "tab-pane fade";
	});

	document.getElementById("nav-current-tab").addEventListener('click', function () {
		document.getElementById("nav-current-tab").className = "nav-item nav-link active";
		document.getElementById("nav-request-tab").className = "nav-item nav-link";
		//document.getElementById("nav-past-tab").className = "nav-item nav-link";

		document.getElementById("active-rides").className = "tab-pane fade show active";
		document.getElementById("requested").className = "tab-pane fade";
		//document.getElementById("completed").className = "tab-pane fade";
	});

	/*document.getElementById("nav-past-tab").addEventListener('click', function () {
		document.getElementById("nav-past-tab").className = "nav-item nav-link active";
		document.getElementById("nav-current-tab").className = "nav-item nav-link";
		document.getElementById("nav-request-tab").className = "nav-item nav-link";

		document.getElementById("completed").className = "tab-pane fade show active";
		document.getElementById("active-rides").className = "tab-pane fade";
		document.getElementById("requested").className = "tab-pane fade";
	});*/

    const response = await fetch(`./user/rides/view?user_id=${user_id}`,{credentials: 'include'}); //change
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
			tb.className += " table-bordered table-rides";

			if(rides.pending !== undefined && rides.pending.length > 0) {
				initializeRides(table, tb, true);
				rides.pending = sortRides(rides.pending);
				for(let ride of rides.pending) {
					buildRides(table,tb,ride, true);
				}
			}else {
				tb.innerText = "None.";
			}
			table.appendChild(tb);
			//-----------------------------------------------

			//BUILDING ACTIVE (CONFIRMED) RIDES
			//-----------------------------------------------

			table = document.getElementById('active-rides');
			tb = document.createElement('table');
			tb.className += " table-bordered table-rides";

			if(rides.active !== undefined && rides.active.length > 0) {
				initializeRides(table, tb, false);
				rides.active = sortRides(rides.active);
				for(let ride of rides.active) {
					buildRides(table,tb,ride, false);
				}
			}else {
				tb.innerText = "None.";
			}
			table.appendChild(tb);

			//-----------------------------------------------
			/*
			//BUILDING COMPLETED RIDES
			//-----------------------------------------------
			table = document.getElementById('completed');
			tb = document.createElement('table');
			tb.className += " table-bordered table-rides";

			if(rides.completed !== undefined && rides.completed.length > 0) {
				initializeRides(table, tb);
				for(let ride of rides.completed) {
					buildRides(table,tb,ride);
				}
			}else {
				tb.innerText = "None.";
			}
			table.appendChild(tb);*/
    }

    const notifs = await fetch('./notifs?id=' + user_id,{credentials: 'include'});
 
    if (!notifs.ok) {
        console.error("Could not get notificaitons.");
    }else {
    	const notifications = await notifs.json();
		let table = document.getElementById('notifications');
		let tb = document.createElement('table');
		tb.className += " " + "table-bordered" + " " + "table-rides";

		if(notifications.length > 0) {
			initializeReqs(table, tb);
			for(let notif of notifications) {
				buildReqs(table,tb,notif);
			}
		}
		else {
			tb.innerText = "None.";
		}
		table.appendChild(tb);
    	
    }
});

function initializeRides(table, tb, pending) {
	let titles;
	if(pending){
		titles = ["Route", "ID", "Date", "Time", "Driver", ""];
	}
	else{
		titles = ["Route", "ID", "Date", "Time", "Driver", "Contact", ""];
	}

	const thead = document.createElement('thead');
	const tr = document.createElement('tr');
	tr.className = "table-primary";

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
	const titles = ["Name", "Contact", "Route ID","Confirm"];
	const thead = document.createElement('thead');
	const tr = document.createElement('tr');
	tr.className = "table-success";

	for(const title of titles){ 
		const th = document.createElement('th');
		if(title === "Confirm"){
			th.className = "text-center";
			th.setAttribute("colspan","2");
			th.setAttribute("scope","colgroup");
		}
		th.innerHTML = title;
		tr.appendChild(th);
		thead.appendChild(tr);
		tb.appendChild(thead);
	}

	table.appendChild(tb);
}

function buildRides(table,tb,ride, pending) {
	const tbody = document.createElement('tbody');
	let tr = document.createElement('tr');
	let date;

	let td = document.createElement('td');
	td.innerHTML = ride.from + " - " + ride.to;
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = ride._id;
	tr.appendChild(td);

	td = document.createElement('td');
	date = ride.date.slice(5,7) + '-' + ride.date.slice(8,10) + '-' + ride.date.slice(0,4); //mm/dd/yyyy
	td.innerHTML = date;
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = ride.time;
	tr.appendChild(td);

	td = document.createElement('td');
	if(ride.driver._id === JSON.parse(window.localStorage.getItem("me"))._id){
		td.innerHTML = "You";
	}
	else {
		td.innerHTML = ride.driver.name;
	}
	tr.appendChild(td);

	if(!pending){
		td = document.createElement('td');
		let message = "Hey! Where should we meet?"
		td.innerHTML = '<a href=\"mailto:' + ride.driver.email + '?subject=UMassRideshare ' + ride.from + " - " + ride.to + '&body=' + message + '\">' + ride.driver.email +'</a';
		tr.appendChild(td);
	}

	let button = document.createElement('button');
	button.className += "btn btn-danger h-center w-100";
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
	td.innerHTML = '<a href=\"mailto:"' + notif.email + '\">' + notif.email +'</a';
	tr.appendChild(td);

	td = document.createElement('td');
	td.innerHTML = notif.ride_id;
	tr.appendChild(td);

	let btn = document.createElement('button');
	btn.className += "btn btn-outline-success w-100 d-flex justify-content-center";
	btn.innerHTML = "Accept";
	btn.setAttribute('user_id', notif._id);
	btn.setAttribute('ride_id', notif.ride_id);
	btn.addEventListener('click', accept);

	td = document.createElement('td');
	td.appendChild(btn);
	tr.appendChild(td);

	btn = document.createElement('button');
	btn.className += "btn btn-outline-danger w-100 d-flex justify-content-center";
	btn.innerHTML = "Reject";
	btn.setAttribute('user_id', notif._id);
	btn.setAttribute('ride_id', notif.ride_id);
	btn.addEventListener('click', reject);

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

	const rideRequest = await fetch('/user/rides/active?user_id=' + from + '&ride_id=' + ride_id + '',{credentials: 'include'});
	await fetch('/denotify?from=' + from + '&to=' + to + '&ride_id=' + ride_id);

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

	const rideRequest = await fetch('/user/rides/delete?user_id=' + from + '&ride_id=' + ride_id + '',{credentials: 'include'});
	await fetch('/denotify?from=' + from + '&to=' + to + '&ride_id=' + ride_id);

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

	let response = await fetch('/user/rides/delete?user_id=' + user_id + '&ride_id=' + ride_id, {credentials: 'include'});
	if(!response.ok) {
		console.error(response);
		return;
	}
	location.reload();
}

function sortRides(rides) {
	return rides.sort(function(a,b) {return sortHelper(a,b)});
}

function sortHelper(a,b) {
    if (a.date > b.date) {
        return 1;
    } else if (a.date < b.date) { 
        return -1;
    }

    if (a.time < b.time) { 
        return -1;
    } else if (a.time > b.time) {
        return 1
    } else { 
        return 0;
    }
}