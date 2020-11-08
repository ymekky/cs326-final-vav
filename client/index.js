window.addEventListener('load', async function () {
	document.getElementById("account-link").onclick = () => {
		if (window.localStorage.getItem("logged-in") === null) {
			document.getElementById("account-link").href = "/login.html"; 
		}
		else {
			document.getElementById("account-link").href = "/account.html";
		}
	}

});