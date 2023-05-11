/* TODO: make it for verbose */
function requestFailedError() {
    alert("Something went wrong!");
}

function verifyHasProtocol(url) {
    return (url.startsWith('http') || url.startsWith('https'));    
}

/* TODO: Seperate this function to different file. */
function verifyNotEmpty(value) {
    return (value || value.length > 0 
                  || typeof value !== 'undefined' 
                  || value !== null 
                  || Object.keys(obj).length > 0
            );
}
