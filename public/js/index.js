const indexPageForm = document.getElementById("indexPageForm");


async function handleFormSubmit(formEvent) {
    formEvent.preventDefault();

    if(shortUrlWrapper.classList.contains('active')) return;

    let longUrl = (longUrlInput.value).trim();

    if(longUrl.length <= 0) return;

    longUrl = verifyHasProtocol(longUrl) ? `http://${longUrl}/` : longUrl;
    const requestUrl = new URL(`http://${DOMAIN}/short?longUrl=${longUrl}`);

    requestForShortUrl(requestUrl);
}


/* Event Listener */

indexPageForm.addEventListener('submit', handleFormSubmit);

/* END */