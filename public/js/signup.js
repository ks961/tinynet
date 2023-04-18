const signupPageForm = document.getElementById("signupPageForm");

const signupFormUsernameInput = document.getElementById("signupFormUsernameInput");
const signupFormPasswordInput = document.getElementById("signupFormPasswordInput");
const signupFormConfirmPasswordInput = document.getElementById("signupFormConfirmPasswordInput");

function resetInputs() {
    signupFormUsernameInput.value = '';
    signupFormPasswordInput.value = '';
    signupFormConfirmPasswordInput.value = '';
}

async function requestForNewAccount(credentials) {
    const url = new URL(`http://${DOMAIN}/signup?credentials=${credentials}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
        });
        
        if(!response.ok) return requestFailedError();

        const result = await response.json();

        if(result.info === 'success') {
            resetInputs();
            alert('Account created!, Let\'s login now.');
            return window.location.href = '/login';
        } else {
            return alert('Account creation failed, Try again!');
        }

    }catch(err) {

        /* TODO: Handle more appropiately [ DEBUG ] */
        console.log(err);
        
        return requestFailedError();
    }
}


function handleSignup(e) {
    e.preventDefault();

    const username        = signupFormUsernameInput.value
    const password        = signupFormPasswordInput.value
    const confirmPassword = signupFormConfirmPasswordInput.value

    if(password !== confirmPassword) return alert("Password doesn't match!");
    /* TODO: Also check if username already exists! */

    const credentials = {
        username: username,
        password: password,
    }

    if(!verifyNotEmpty(credentials)) return alert("Invalid credentials!");

    requestForNewAccount(JSON.stringify(credentials));
}

signupPageForm.addEventListener('submit', handleSignup);