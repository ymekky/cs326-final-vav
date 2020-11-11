window.addEventListener("load", async function() {
	document.getElementById("name").placeholder = JSON.parse(window.localStorage.getItem("me")).name;
	document.getElementById("email").placeholder = JSON.parse(window.localStorage.getItem("me")).email;
	document.getElementById("password").placeholder = JSON.parse(window.localStorage.getItem("me")).password;
	const user_id = JSON.parse(window.localStorage.getItem("me")).id;

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
			const rides = await response.json();

			//BUILIDING PENDING (REQUESTED) RIDES
			//-----------------------------------------------
			let table = document.getElementById('requested');
			//let header = document.createElement('h6');
			//header.innerText = "Requested:"
			//table.appendChild(header);

			let tb = document.createElement('table');
			tb.className += " " + "table-bordered" + " " + "table-rides";

			initialize(table, tb);

			for(let ride of rides.pending) {
				build(table,tb,ride);
			}
			table.appendChild(tb);
			//-----------------------------------------------

			//BUILDING ACTIVE (CONFIRMED) RIDES
			//-----------------------------------------------

			table = document.getElementById('active-rides');
			//header = document.createElement('h6');
			//header.innerText = "Current Rides:"
			//table.appendChild(header);

			tb = document.createElement('table');
			tb.className += " " + "table-bordered" + " " + "table-rides";

			initialize(table, tb);

			let ride = rides.active; 
			build(table,tb,ride);
			table.appendChild(tb);

			let outerDiv = document.createElement('div');
			outerDiv.className += " " + "form-row";
			let innerDiv = document.createElement("div");
			innerDiv.className += "col text-center";
			let button = document.createElement('button');
			button.className += "btn btn-danger";
			button.innerHTML = "CANCEL";

			innerDiv.appendChild(button);
			outerDiv.appendChild(innerDiv);
			table.appendChild(outerDiv);

			//-----------------------------------------------

			//BUILDING COMPLETED RIDES
			//-----------------------------------------------
			table = document.getElementById('completed');
			//header = document.createElement('h6');
			//header.innerText = "Completed Rides:"
			//table.appendChild(header);

			tb = document.createElement('table');
			tb.className += " " + "table-bordered" + " " + "table-rides";

			initialize(table, tb);

			for(let ride of rides.completed) {
				build(table,tb,ride);
			}
			table.appendChild(tb);
    }

    const notifs = await fetch('./notifs?id=' + JSON.stringify(JSON.parse(window.localStorage.getItem('me')).id));
 
    if (!notifs.ok) {
        console.error("Could not get notificaitons.");
    }else {
    	const res = await notifs.json();
    	const br = document.createElement('br');
    	const requests = document.getElementById('notifications');

		for(let notif of res.notifications) {
			let btn = document.createElement('button');
			btn.className += "btn btn-outline-primary";
			btn.innerHTML = notif.name;
			btn.appendChild(br);
			btn.innerHTML += notif.email;
			requests.appendChild(btn);

		}
    	
    }
});

function initialize(table, tb) {
	const titles = ["Route", "Date", "Time", "Driver", "Email"];
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
	const tbody = document.createElement('tbody');
	let tr = document.createElement('tr');

	let td = document.createElement('td');
	td.innerHTML = ride.starting + " to " + ride.destination;
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

	tbody.appendChild(tr);
	tb.appendChild(tbody);
}
