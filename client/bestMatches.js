window.addEventListener("load", async function() {
    const notifs = await fetch('./notifs?id=' + user_id,{credentials: 'include'});

    if(notifs.ok){
        const notifications = await notifs.json();
        window.localStorage.setItem("notifs", notifications.length);
    }

    if(parseInt(window.localStorage.getItem("notifs")) > 0) {
            document.getElementById('alert').className = "mb-0 alert alert-success alert-dismissible fade show";
            window.localStorage.setItem("notifs", 0);

    }

    document.getElementById("nav-logout").addEventListener('click', function () {
        window.localStorage.setItem("logged-in", false);
        window.localStorage.removeItem("me");
        window.location.replace('./index.html');
    });

    const response = await fetch('./rides/view');
    if (!response.ok) {
        console.error("Could not view rides.");
    }
    else {

        let rides = await response.json();
        const tbody = document.getElementById('found');

        rides = rides.available;
        rides = filterRides(rides);

        if(rides.length === 0){
            tbody.innerHTML = '<h3>No matches found.</h3>';
        }

        rides = sortRides(rides);

        for(const ride of rides) {

            const tr = document.createElement('tr');
            tr.innerHTML = '<th scope="row"> <img src="files/profile.png" class="mr-3 profile-img" alt="..."></th>';
            const br = document.createElement('br');

            let date;
            let td = document.createElement('td');
            td.className = "align-middle";
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
            td.className = "text-center";   

            const button = document.createElement('button');
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

    document.getElementById("back").onclick = () => {window.location.replace("/info.html");};
});
function filterRides(rides){

    const date = JSON.parse(window.localStorage.getItem('search')).date;
    let rides_copy = rides.filter(ride => ride.date === date);

    rides_copy = rides_copy.filter(ride => ride.from === JSON.parse(window.localStorage.getItem('search')).from);
    rides_copy = rides_copy.filter(ride => ride.to === JSON.parse(window.localStorage.getItem('search')).to);

    if(rides_copy.length === 0){
        let day = parseInt(date.slice(-2));
        let year = parseInt(date.slice(0,4));
        let month = parseInt(date.slice(5,7));
        const days_in_month = new Date(year, month, 0).getDate();

        const week = [date];
        for(let i = 0; i < 6; i++){
            day = (day + 1) % (days_in_month + 1);
            if(day === 0){ //new month
                if(month < 12){
                    month = month + 1;
                } else { //new year
                    month = 1;
                    year = year + 1; 
                }
                day = 1;
            }
            week.push(JSON.stringify(year) + '-' + JSON.stringify(month) + '-' + JSON.stringify(day)); 
        }

        for(const ride in rides){
            if(week.indexOf(rides[ride].date) > -1){
                rides_copy.push(rides[ride]);
            }
        }

        rides_copy = rides_copy.filter(ride => ride.from === JSON.parse(window.localStorage.getItem('search')).from);
        rides_copy = rides_copy.filter(ride => ride.to === JSON.parse(window.localStorage.getItem('search')).to);
    }
    return rides_copy;
}

function sortRides(rides) {
    return rides.sort(function(a,b) {return sortHelper(a,b);});
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
        return 1;
    } else { 
        return 0;
    }
}

//adds requests to users requests, send notification to driver
async function notify() {
    const to = this.getAttribute('_id');
    const ride_id = this.getAttribute('ride_id');
    const from = JSON.stringify(JSON.parse(window.localStorage.getItem('me'))._id);

    if(from === to) {
        alert('You can\'t request yourself!');
    return;
    }
    
    const string = '/notify?from=' + from + '&to=' + to +'&ride_id=' + ride_id + '';
    const rideRequest = await fetch('/user/rides/pending?user_id=' + from + '&ride_id=' + ride_id + '');

    if(!rideRequest.ok){
        if(rideRequest.status === 403){
            alert("You already have another ride at that time.");
        }else {
            console.error(rideRequest.error);
        }
    }
    else {
        const response = await fetch(string);
        if(!response.ok) {
            console.error(response.error);
        } else {
            alert("Done! You will get a notification when they confirm.");
        }
    }
}