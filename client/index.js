window.addEventListener('load', async function () {

	const logged = (window.localStorage.getItem("logged-in") !== null && window.localStorage.getItem("logged-in") !== "false");

	if (!logged) {
		
		document.getElementById("account-link").innerText= "Login";
		document.getElementById("register").href = "/register.html"; 
		document.getElementById("account-link").href = "/login.html"; 
	}
	else {

		document.getElementById("account-link").innerText= "My account";
		document.getElementById("account-link").href = "/account.html"; 
		document.getElementById("register").href = "#";

		const user_id = JSON.parse(window.localStorage.getItem("me"))._id;
		const notifs = await fetch('./notifs?id=' + user_id,{credentials: 'include'});
        if(notifs.ok){
            const notifications = await notifs.json();
            window.localStorage.setItem("notifs", notifications.length);
        }

		if(parseInt(window.localStorage.getItem("notifs")) > 0) {
			document.getElementById('alert').className = "mb-0 alert alert-success alert-dismissible fade show";
			window.localStorage.setItem("notifs", 0);
		}

	}

	document.getElementById("account-link").onclick = () => {
		if (!logged) {
			window.location.replace("/login.html"); 
		}
		else {
			window.location.replace("/account.html"); 
		}
	};

	document.getElementById("find-ride").addEventListener('click', () => {
		if (logged) {
			window.location.replace('/info.html');
		}
		else {
			alert("You must be logged in.");
		}
	});

	document.getElementById("register").addEventListener('click', () => {
		if(logged) {
			alert("You already have an account!");
		}
	});

});