window.addEventListener("load", async function() {
	document.getElementById("login-click").addEventListener('click', async function () {
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;

	    const response = await fetch(`./login`, {
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({email, password})
			});
	    const user = await response.json();
	    if (!response.ok) {
	        console.error(user.error);
	        alert(user.error);
	    }
	    else {
	    		const user_id = user._id;
				console.log('user successfully logged in', user);
	    		window.localStorage.setItem("logged-in", true);
				window.localStorage.setItem("me",JSON.stringify(user));

				const notifs = await fetch('./notifs?id=' + user_id,{credentials: 'include'});
				if(notifs.ok){
					const notifications = await notifs.json();
					window.localStorage.setItem("notifs", notifications.length);
				}
 
				const removal = await fetch('./user/rides/completed?user_id=' + user_id); //removes rides past date
				if(!removal.ok){
					console.error('Couldn\'t remove finished rides');
				}

				window.location.replace('./index.html');
	    }
	});
});
