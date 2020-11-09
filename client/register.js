window.addEventListener("load", async function() {
	document.getElementById("register-click").addEventListener('click', async function () {
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const name = document.getElementById("name").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const id = Math.floor(Math.random() * 1000)
        if(password == confirmPassword){
          const response = await fetch(`./user/new`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({email, password, name, id})
          }); console.log('response', response)
          if (!response.ok) {
              console.error("Could not register.");
          }
          else {
            const res = await response.json();
            if (res.success === true) {
              window.localStorage.setItem("logged-in", true);
              window.localStorage.setItem("me",JSON.stringify({id, name, email, password, Rides: {}, Chatters: []}));
              window.location.replace('./account')
            }
            console.log('User Successfully Created', user)
          }
        }
        else{
          document.getElementById('error').addClass('show');
          console.log("Passwords don't match! try again");
        }
    
    
	});
});
