window.addEventListener('load', async function () {
	document.getElementById("account-link").onclick = () => {
		if (window.localStorage.getItem("logged-in") === null || window.localStorage.getItem("logged-in") === "false") {
			document.getElementById("account-link").href = "/login.html"; 
		}
		else {
			document.getElementById("account-link").href = "/account.html";
		}
	}

	document.getElementById("find-ride").addEventListener('click', () => {
		window.location.replace('/info.html');
		if (window.localStorage.getItem("logged-in") !== null || window.localStorage.getItem("logged-in") !== "false") {
			window.location.replace('/info.html');
		}
		else {
			alert("You must be logged in.");
		}
	});

});