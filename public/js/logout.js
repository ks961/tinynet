
async function clearCookie() {
    const cookies = await cookieStore.getAll();
    cookies.forEach(cookie => cookieStore.delete(cookie.name));
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