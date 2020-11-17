window.addEventListener("load", async function() {
	document.getElementById("login-click").addEventListener('click', async function () {
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;


	    const response = await fetch(`./login?email=${email}&password=${password}`);
	    const user = await response.json();
	    if (!response.ok) {
	        console.error(user.error);
	        alert(user.error);
	    }
	    else {
				console.log('user successfully logged in', user)
	    		window.localStorage.setItem("logged-in", true);
				window.localStorage.setItem("me",JSON.stringify(user.me));
				window.location.replace('./account.html')
	    }
	});
});
