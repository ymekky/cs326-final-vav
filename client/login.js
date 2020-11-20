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
				console.log('user successfully logged in', user);
	    		window.localStorage.setItem("logged-in", true);
				window.localStorage.setItem("me",JSON.stringify(user));
				window.location.replace('./account.html')
	    }
	});
});
