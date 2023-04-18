const homePageForm = document.getElementById("homePageForm");
const customlinkCodeInput = document.getElementById("customlinkCodeInput");

async function handleFormSubmit(formEvent) {
    formEvent.preventDefault();

    if(shortUrlWrapper.classList.contains('active')) return;

    let longUrl = (longUrlInput.value).trim();
    let customCode = (customlinkCodeInput.value).trim();

    if(longUrl.length <= 0) return;

    longUrl = verifyHasProtocol(longUrl) ? `http://${longUrl}/` : longUrl;
    const requestUrl = new URL(`http://${DOMAIN}/p/short?longUrl=${longUrl}&customCode=${customCode}`);

    if (await requestForShortUrl(requestUrl))
        customlinkCodeInput.style.display = 'none';
}

/* Event Listeners */
homePageForm.addEventListener('submit', handleFormSubmit);
/* End */