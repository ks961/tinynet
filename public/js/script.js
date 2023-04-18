const longUrlInput          = document.getElementById("longUrlInput");
const shortUrlInput         = document.getElementById("shortUrlInput");
const shortUrlWrapper       = document.getElementById("shortUrlWrapper");
const copiedSuccessAlert    = document.getElementById("copiedSuccessAlert");

async function requestForShortUrl(requestUrl) {

    try {

        const response = await fetch(requestUrl, {
            method: 'POST',
        });

        if(!response.ok) {
            requestFailedError();
            return false;
        }
        const data = await response.json();

        if(data.info !== "success") {
            alert((data.info).trim());
            return false;
        }
        
        /* JUST FOR DEBUG */
        // console.log(data);
        /* REMOVE */

        shortUrlInput.value = data.shortUrl;
        shortUrlWrapper.classList.add('active');

        return true;
    } catch(err) {
        requestFailedError();
        return false;
    }
}

function unsecureCopyToClipboard() {
    shortUrlInput.select();
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

async function handleShortUrlCopy() {
    const url = (shortUrlInput.value).trim();

    if(url.length <= 0) return;

    (window.isSecureContext && navigator.clipboard) ?
        await navigator.clipboard.writeText(url) : unsecureCopyToClipboard();

    copySuccessFeedback();
}

function copySuccessFeedback() {
    copiedSuccessAlert.classList.toggle("copied-success--active");
    setTimeout(()=> copiedSuccessAlert.classList.toggle("copied-success--active"), 600);
}

function gotoLogin() {
    return window.location.href = '/login';
}

/* Event Listener */

/* END */