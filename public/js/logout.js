
async function clearCookie() {
    /*
     const cookies = await cookieStore.getAll();
     cookies.forEach(cookie => cookieStore.delete(cookie.name));
   */

   const cookies = document.cookie.split(";");

   for (let i = 0; i < cookies.length; i++) {
     const cookie = cookies[i];
     const eqPos = cookie.indexOf("=");
     const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
     document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
   }
}

async function logout() {
    const url = new URL(`http://${DOMAIN}/logout`);
    try {
        const response = await fetch(url, {
            method: 'POST',
        });
        if(!response.ok) return requestFailedError();

        const result = await response.json();
        if(result.info === 'success') {
            await clearCookie();
            window.location.href = '/';
        } else {
            return alert(`${result.info}`); /* TODO: More better response message to user. */
        }

    } catch(err) {
        console.log(err);

        return requestFailedError();
    }
}