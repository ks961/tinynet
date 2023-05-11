const homePageForm = document.getElementById("homePageForm");
const customlinkCodeInput = document.getElementById("customlinkCodeInput");
const tinyItBtn = document.getElementById("tinyItBtn");
const tinyAnotherURLBtn = document.getElementById("tinyAnotherURLBtn");
const copyShortLinkBtnFromHistory = document.getElementsByClassName("copy-short-link-btn-from-history");
const genQrCodeBtn = document.getElementById("genQrCodeBtn");
const floatingQRCodeWindow = document.getElementById("floatingQRCodeWindow");
const qrcodeCanvasWrapper = document.getElementById("qrcodeCanvasWrapper");
const qrCodeCanvas = document.getElementById("qrCodeCanvas");
const qrCodeDownloader = document.getElementById("qrCodeDownloader");
const qrCodeDownloaderBtn = document.getElementById("qrCodeDownloaderBtn");
const analyticsChartCanvasWrapper = document.getElementById('analyticsChartCanvasWrapper');
const analyticsChartCanvas = document.getElementById('analyticsChartCanvas');
const analyticsChartCanvasCtx = analyticsChartCanvas.getContext('2d');
const analyticsBtns = document.getElementsByClassName("main-wrapper__links-container__link__analytics__btn");
let globalChartInstance = null;

async function handleFormSubmit(formEvent) {
    formEvent.preventDefault();

    if(shortUrlWrapper.classList.contains('active')) return;

    let longUrl = (longUrlInput.value).trim();
    let customCode = (customlinkCodeInput.value).trim();

    if(longUrl.length <= 0) return;

    longUrl = verifyHasProtocol(longUrl) ?  longUrl : `http://${longUrl}/`;
    const requestUrl = new URL(`http://${DOMAIN}/p/short?longUrl=${longUrl}&customCode=${customCode}`);

    if (await requestForShortUrl(requestUrl)){
        customlinkCodeInput.style.display = 'none';
        
        tinyItBtn.classList.add('hidden');
        genQrCodeBtn.classList.add('hidden');
        tinyAnotherURLBtn.classList.add('active');
    }
};

function handleQRcodeGen() {
    const text = (longUrlInput.value).trim();
    if(!text || text === undefined) return;
    
    QRCode.toCanvas(qrCodeCanvas, text, function (error) {
      if (error) throw error;
      floatingQRCodeWindow.classList.add("active");
      qrcodeCanvasWrapper.classList.add("active");
    });   
}


function downloadQRCode() {
    if(!qrcodeCanvasWrapper.classList.contains("active") || !qrCodeCanvas) return;

    const image = qrCodeCanvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    qrCodeDownloader.setAttribute("href", image);
}

function copyShortUrlFromHistory(event) {
    const shortUrlId = event.currentTarget.dataset.url;
    const url = `http://${DOMAIN}/${shortUrlId}`;
    handleTextCopy(url);
}

function unsecureCopyTextToClipboard(text) {
    const input = document.createElement("input");
    input.value = text;
    input.style.display = "none";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
}

async function handleTextCopy(text) {
    if(!text || text.length <= 0) return;

    (window.isSecureContext && navigator.clipboard) ?
        await navigator.clipboard.writeText(text) : unsecureCopyTextToClipboard(text);

    copySuccessFeedback();
}

function resetAllThingsQR() {
    qrCodeDownloader.removeAttribute('href');
    qrCodeCanvas.getContext('2d').reset();
    analyticsChartCanvasCtx.reset();
    floatingQRCodeWindow.classList.remove('active');
    qrcodeCanvasWrapper.classList.remove('active');
    analyticsChartCanvasWrapper.classList.remove('active');
    longUrlInput.value = '';
    shortUrlInput.value = '';

    if(globalChartInstance) globalChartInstance.destroy();
}


/* About chart */
// Convert dates to days passed from the given date
function totalDaysPassed(fromDate, chartData) {
    const today = todaysDate();
    const idx = chartData.findIndex(data => data.visited_date === today);

    (idx === -1) ? chartData.push({
        visited_date: today,
        clicks: 0,
    }) : null;
    const fromDateArr = fromDate.split('/').map(v => parseInt(v));
    const daysPassed = chartData.map(data => {
        const currentDate = data.visited_date;
        const currentDateArr = currentDate.split('/').map(v => parseInt(v));
        
        /* It can be reduce to small code but for now let it be explicit. [ It works ;) ] */
        const calcDates = [];
        for(let idx=0; idx < currentDateArr.length; idx++) {
            switch(idx) {
                case 0:
                    calcDates.push(currentDateArr[idx] - fromDateArr[idx]);
                    break;
                case 1:
                    /* It doesn't account for months which has 28, 29 or 31 days and treats every month to be 30 days  */
                    calcDates.push((currentDateArr[idx] - fromDateArr[idx])*30);
                    break;
                case 2:
                    /* It doesn't account for leap years [FIX IT] */
                    calcDates.push((currentDateArr[idx] - fromDateArr[idx])*365);
                    break;
            }
        }
        const days = calcDates.reduce((acc, curr) => acc+curr);
        return days;
    });

    return daysPassed;
}

function todaysDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    const date = `${day}/${month}/${year}`;
    
    return date;
}

function generateChart(chartData) {
    
    const clicks = chartData.visitsInfo.length > 0 ? chartData.visitsInfo.map(cd => cd.clicks) : [0];
    const creationDate = chartData.creationDate;
    const daysPassed = chartData.visitsInfo.length > 0 ? totalDaysPassed(creationDate, chartData.visitsInfo) : [0];
    
    floatingQRCodeWindow.classList.add('active');
    analyticsChartCanvasWrapper.classList.add('active');
    
    // Create chart
    globalChartInstance = new Chart(analyticsChartCanvasCtx, {
      type: 'line',
      data: {
        labels: daysPassed,
        datasets: [{
          label: 'Clicks',
          data: clicks,
          borderColor: 'blue',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            color: 'white',
            display: true,
            text: `Clicks vs Days Passed from ${creationDate}`,
            font: {
                weight: 'bold',
            }
          },
          legend: {
            position: 'bottom',
            label: {
                fontColor: 'white',
            }
          }
        },
        scales: {
          x: {
            ticks: {
                color: 'white',
                font: {
                    weight: 'bold',
                }
            },
            title: {
                color: 'white',
                display: true,
                text: 'Days Passed',
            },
        },
        y: {
            ticks: {
                font: {
                  weight: 'bold',
                },
                color: 'white',
            },
            title: {
                color: 'white',
                display: true,
                text: 'Clicks',
            },
            suggestedMax: 50,
          }
        }
      }
    });
}

/* END */


async function handleAnalyticsDraw(event) {
    const node = event.currentTarget;
    const index = node.dataset['index'];
    
    const shortUrlElement = document.getElementById(`shortUrl${index}`);
    const shortUrlCode = shortUrlElement.dataset['url'];

    const name = (window.location.pathname.split('/').pop()).trim();
    const url = new URL(`http://${DOMAIN}/home/${name}/${shortUrlCode}`);

    try {
        const result = await fetch(url, {
            method: 'POST',
            credentials: 'include',
        });

        if(!result.ok) return;
        
        const response = await result.json();

        if(response.info !== 'success') {
            requestFailedError();
            return;
        }

    generateChart(response.data);
    } catch(err) {
        console.log("Error:", err);
    }

}


/* Event Listeners */
homePageForm.addEventListener('submit', handleFormSubmit);
genQrCodeBtn.addEventListener('click', handleQRcodeGen);

qrCodeDownloaderBtn.addEventListener('click', downloadQRCode);

floatingQRCodeWindow.addEventListener('click', ()=> {
    if(floatingQRCodeWindow.classList.contains('active')) {
        resetAllThingsQR();
    }
});

Array.prototype.forEach.call(analyticsBtns, (btn) => btn.addEventListener('click', handleAnalyticsDraw));

Array.prototype.forEach.call(copyShortLinkBtnFromHistory, (btn) => btn.addEventListener('click', copyShortUrlFromHistory));
/* End */