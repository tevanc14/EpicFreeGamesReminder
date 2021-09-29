const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const reminderProcessor = require("./reminderProcessor");

const url = "https://www.epicgames.com/store/free-games";
const cardCollectionSelector = ".css-1i5exm2";
const cardSelector = ".css-nq799m";
const titleSelector = ".css-2ucwu";
const subtitleSelector = ".css-os6fbq";
// Needs to be the selector on the img tag itself
const imageSelector = ".css-18gnhv2";
const freeBannerSelector = ".css-1kggtxl";

async function scrapePage() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const pageResponse = await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 0,
  });
  console.log("Page response:", pageResponse.status());
  const html = await page.content();
  const urlPrefix = await page.evaluate(() => {
    return `${window.location.protocol}//${window.location.hostname}`;
  });
  browser.close();
  return {
    html: html,
    urlPrefix: urlPrefix,
  };
}

function getGameCards($) {
  const gameCards = $(cardCollectionSelector)
    .find(cardSelector)
    .toArray();
  const freeGameCards = [];

  for (const gameCard of gameCards) {
    // Check for the "FREE NOW" or "COMING SOON" banner underneath the good free games
    // Don't need to include Sludge Life and Thimbleweed Park for the thousandth time
    if ($(gameCard).find(freeBannerSelector).toArray().length > 0) {
      freeGameCards.push(gameCard);
    }
  }

  return freeGameCards;
}

// TODO: Don't pass gameCard and $ into everything
function getTitle(gameCard, $) {
  return $(gameCard).find(titleSelector).find('.css-0').text();
}

function getDate(gameCard, $, title) {
  // If the game is mystery, it displays a countdown including days, hours, minutes, and seconds
  // So we calculate that out to get a start date, end date is not defined
  if (reminderProcessor.gameIsMystery(title)) {
    return getCountdownDate(gameCard, $);
  } else {
    return getRegularDate(gameCard, $);
  }
}

function getCountdownDate(gameCard, $) {
  const countdownDivs = $(gameCard)
    .find(titleSelector)
    .find(".css-1ovumeb")
    .toArray();

  const days = parseInt($(countdownDivs[0]).text());
  const hours = parseInt($(countdownDivs[1]).text());
  const minutes = parseInt($(countdownDivs[2]).text());
  const seconds = parseInt($(countdownDivs[3]).text());

  const releaseDate = new Date();
  releaseDate.setSeconds(releaseDate.getSeconds() + seconds);
  releaseDate.setMinutes(releaseDate.getMinutes() + minutes);
  releaseDate.setHours(releaseDate.getHours() + hours);
  releaseDate.setDate(releaseDate.getDate() + days);

  return {
    startDate: releaseDate,
    endDate: "?",
  };
}

function getRegularDate(gameCard, $) {
  const dateDiv = $(gameCard).find(subtitleSelector);
  const timeDivs = $(dateDiv).find("span").find("time").toArray();

  let dateRange = [];
  for (const timeDiv of timeDivs) {
    const time = $(timeDiv).attr("datetime");
    dateRange.push(time);
  }

  return {
    startDate: dateRange[0],
    endDate: dateRange[1],
  };
}

function getLink(gameCard, $, urlPrefix) {
  return urlPrefix + $(gameCard).find("a").attr("href");
}

function getImageInfo(gameCard, $) {
  return {
    image: $(gameCard)
      .find(imageSelector)
      .attr("src"),
  };
}

function getGameInfo() {
  return scrapePage().then((pageInfo) => {
    const $ = cheerio.load(pageInfo.html);
    const gameCards = getGameCards($);

    let cardInfos = [];
    for (const gameCard of gameCards) {
      const title = getTitle(gameCard, $);
      const date = getDate(gameCard, $, title);
      const link = getLink(gameCard, $, pageInfo.urlPrefix);
      const imageInfo = getImageInfo(gameCard, $);

      const cardInfo = {
        title: title,
        date: date,
        link: link,
        imageInfo: imageInfo,
      };

      cardInfos.push(cardInfo);
    }

    return cardInfos;
  });
}

module.exports = {
  getGameInfo: getGameInfo,
};
