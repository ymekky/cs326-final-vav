window.addEventListener("load", async function() {
	document.getElementById("name").placeholder = JSON.parse(window.localStorage.getItem("me")).name; 
	document.getElementById("email").placeholder = JSON.parse(window.localStorage.getItem("me")).email;
	document.getElementById("password").placeholder = JSON.parse(window.localStorage.getItem("me")).password;

	document.getElementById("login-click").addEventListener('click', async function () {
	});
});
