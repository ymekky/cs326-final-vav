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

        if (!response.ok) {
            console.error(response.error);
            alert("Incorrect email or password.");
        }
        else {
                const user = await response.json();
                const user_id = user._id;
                user.password = password;

                console.log('user successfully logged in', user);

                window.localStorage.setItem("logged-in", true);
                window.localStorage.setItem("me",JSON.stringify(user));
 
                const removal = await fetch('./user/rides/completed?user_id=' + user_id); //removes rides past date
                
                if(!removal.ok){
                    console.error('Couldn\'t remove finished rides');
                }
                window.location.replace('./index.html');
        }
    });
});
