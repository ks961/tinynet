
const loginPageForm          = document.getElementById("loginPageForm");
const loginFormUsernameInput = document.getElementById("loginFormUsernameInput")
const loginFormPasswordInput = document.getElementById("loginFormPasswordInput")

function resetInputs() {
    loginFormUsernameInput.value = '';
    loginFormPasswordInput.value = '';
}

async function requestForLogin(credentials) {
    const url = new URL(`http://${DOMAIN}/login`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: credentials,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if(!response.ok) return requestFailedError();

        const result = await response.json();

        if(result.info === 'success') {
            /* Here it says credentials.username is undefined */
            resetInputs();
            const parsedCreds = JSON.parse(credentials);
            window.location.href = `/home/${parsedCreds.username}`;
        } else {
            return alert('Account Login failed, Try again!');
        }

    }catch(err) {

        /* TODO: Handle more appropiately [ DEBUG ] */
        console.log(err);
        
        return requestFailedError();
    }
}

function handleLogin(e) {
    e.preventDefault();

    const credentials = {
        username: loginFormUsernameInput.value,
        password: loginFormPasswordInput.value,
    }

    if(!verifyNotEmpty(credentials)) return alert("Invalid credentials!");

    requestForLogin(JSON.stringify(credentials));
}

/* EVENT LISTENERS */

loginPageForm.addEventListener('submit', handleLogin);

/* END */