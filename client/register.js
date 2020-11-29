window.addEventListener("load", async function() {

  if(window.localStorage.getItem("logged-in") === true){
    window.location.replace('./account.html');
    return;
  }

	document.getElementById("register-click").addEventListener('click', async function () {

		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const name = document.getElementById("name").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(email === '' || password === '' || name === ''|| confirmPassword === ''){
      return;

    }else if(!email.match('[A-Za-z0-9_|$|#|+|]+@[a-zA-Z]*[.]*[a-zA-Z]+.(edu|com|net)')) {
      return;
    }

    if(password === confirmPassword){
      
      const response = await fetch(`./user/new`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({email, password, name})
      }); 

      if(response.ok){
        window.location.replace('./login.html');
      }
      else if(response.status === 403) {
        alert("This email already exists.");
      }
      else {
        console.error("Could not register.");
      }

    } 
    else {
      document.getElementById('error').addClass('show');
      console.log("Passwords don't match! try again");  
    }
	});

});
