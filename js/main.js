const charset = "iso-8859-1";
const localBasePath = "/resistenze.org";
const latestNumberFilename = "/sito2/re00dx.htm";
const sidebarWidth = "450px";

// load a "nuove resistenti" number
const loadNumber = (number) => {
  switch (number) {
    case undefined: // if no number is specified, use latest number filename
      numberFilename = latestNumberFilename;
      break;
    case "prev": // if "prev" string is specified, load number preceding currentNumber (global variable)
      number = --currentNumber;
      numberFilename = latestNumberFilename.replace(/(\/re00dx)/g, `$1${String(number).padStart(3, "0")}`);
      break;
    case "next": // if "next" string is specified, load number following currentNumber (global variable)
      number = ++currentNumber;
      numberFilename = latestNumberFilename.replace(/(\/re00dx)/g, `$1${String(number).padStart(3, "0")}`);
      break;
    default: // if a number is specified, add the zero-padded number to the latest number filename
      currentNumber = number;
      numberFilename = latestNumberFilename.replace(/(\/re00dx)/g, `$1${String(number).padStart(3, "0")}`);
  }

  url = (isLocal() ? localBasePath : "") + numberFilename;

  // fetch url of file with requested number
  fetch(url)
  .then(response => {
    if (!response.ok) throw (new Error(`${numberFilename}: ${response.statusText}`));
    return response;
  })
  .then(response => {
    return response.arrayBuffer();
  })
  .then(response => {
    const decoder = new TextDecoder(charset);
    return decoder.decode(response);
  })
  .then(html => {
    const regexpNumber = /<h5>(.*)<\/h5>/gi;
    const regexpDate = /<td.*>\s*(\d{2}-\d{2}-\d{2,4})\s*<\/td>/gi;
    const regexpCategory = /<h5>(.*)<\/h5>/gi;
    const regexpNews = /<a (.*)>(.*)<\/a>/gi;

    // try to match number
    matchNumber = regexpNumber.exec(html);
    if (matchNumber) { // found number
      numberText = matchNumber[1];
      html = html.substring(matchNumber.index + matchNumber[0].length);
      document.getElementById("number").innerHTML = numberText;
      currentNumber = numberText.replace(/[^0-9]*/, "") || currentNumber;
    }
    
    // try to match date
    matchDate = regexpDate.exec(html);
    if (matchDate) { // found number
      dateText = matchDate[1];
      html = html.substring(matchDate.index + matchDate[0].length);
      document.getElementById("date").innerHTML = `<i>${dd_mm_yy2Date(dateText)}</i>`;
    }

    // try to match all news
    let all = [];
    let categoryText = "";
    do { // parse html to extract array of catecories and news
      matchCategory = regexpCategory.exec(html);
      matchNews = regexpNews.exec(html);
      // if (!matchCategory) { }
      if (!matchNews) break; // no more new, break loop
      if (matchCategory && (matchCategory.index < matchNews.index)) { // found category
        categoryText = matchCategory[1];
        html = html.substring(matchCategory.index + matchCategory[0].length);
      } else { // found a news link
        if (!categoryText) { regexpCategory.lastIndex = 0; continue; } // found a link without a category: it's not news, skip it
        newsAttr = matchNews[1];
        newsHref   = /href="(.*)"/.exec(newsAttr);   newsHref   = newsHref   ? newsHref[1]   : "";
        newsTarget = /target="(.*)"/.exec(newsAttr); newsTarget = newsTarget ? newsTarget[1] : "";
        newsText   = matchNews[2];
        html = html.substring(matchNews.index + matchNews[0].length);
        all.push({
          "category": { "text": categoryText }, "news": { "text": newsText, "href": newsHref, "target": newsTarget }
        });
      }
      regexpCategory.lastIndex = regexpNews.lastIndex = 0;
    } while (true);

    // transform all news to html
    let contents = ``;
    let categoryLast = ``;
    for (const element of all) {
      contents += `
        <div class="news">
          <div>${element.category.text === categoryLast ? "" : element.category.text}</div>
          <div><a href="${element.news.href}" target="${element.news.target}">${element.news.text}</a></div>
        </div>
      `;
      categoryLast = element.category.text;
    }
    document.getElementById("contents").innerHTML = contents;
  })
  .catch(error => { // some error happened reading url
    console.error(error);
    document.getElementById("contents").innerHTML = `<div class="error">${error}</div>`;
  });
}

const dd_mm_yy2Date = (ddmmyy) => {
  let months = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
  ];

  let ddmmyyArray = ddmmyy.split("-");
  let dd = parseInt(ddmmyyArray[0]);
  let mm = parseInt(ddmmyyArray[1]);
  let yy = parseInt(ddmmyyArray[2]);
  let monthName = months[mm - 1];
  yy = (yy < 100 ? 2000 + yy : yy);
  return `${dd} ${monthName} ${yy}`;
}

const isLocal = () => {
  return (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "");
}

const toggleSidebar = () => {
  const sidebar = document.getElementsByClassName("sidebar")[0];
  const isOpened = sidebar.style.width != "";
  sidebar.style.width = (isOpened ? "" : sidebarWidth);
}

let currentNumber = null; // initially we don't know current number
document.addEventListener("DOMContentLoaded", () => loadNumber(), false);