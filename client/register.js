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
        alert("We sent an activation link to your email.");
        window.location.replace('./login.html');
        //const user = await response.json();
        //window.localStorage.setItem("logged-in", true);
        //window.localStorage.setItem("me",JSON.stringify(user.me));
        //window.location.replace('./account.html');
        //console.log('User Successfully Created', user); 
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
/*
      if (!response.ok) {
          if(response.status === 403){
            alert("This email already exists.");
          }
          console.error("Could not register.");
      }
      else {
        console.log("here");
        //const user = await response.json();
        if (user.success === true) {
          window.localStorage.setItem("logged-in", true);
          window.localStorage.setItem("me",JSON.stringify(user.me));
          window.location.replace('./account.html')
        }
        console.log('User Successfully Created', user)
      }
    }
    else {
      document.getElementById('error').addClass('show');
      console.log("Passwords don't match! try again");
    } 
*/ 
	});

});
