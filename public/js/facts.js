const factSpan = document.getElementById("factSpan");

async function fetchFacts() {
    factSpan.textContent = 'Loading...';
    const url = new URL(`http://${DOMAIN}/facts`);
    try {
        const response = await fetch(url, {
            method: 'POST',
        });
        if(!response.ok) return requestFailedError();

        const factData = await response.json();
        factSpan.textContent = factData.fact;
    } catch(err) {
        /* TODO: HANDLE more properly */
        console.log(err);
        return requestFailedError();
    }
}

/* EVENT LISTENERS */

document.addEventListener('DOMContentLoaded', fetchFacts);

/* END */