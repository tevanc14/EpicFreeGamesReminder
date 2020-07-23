const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const reminderProcessor = require("./reminderProcessor");

const url = "https://www.epicgames.com/store/free-games";
const titleSelector = ".OfferTitleInfo-title_ed062ba4";
const subtitleSelector = ".OfferTitleInfo-subtitle_30c79f0d";

async function scrapePage() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 0,
  });
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
  const gameCards = $(".CardGrid-group_c5363b6a")
    .find(".CardGrid-card_57b1694f")
    .toArray();
  const freeGameCards = [];

  for (const gameCard of gameCards) {
    freeGameCards.push(gameCard);
  }

  return freeGameCards;
}

// TODO: Don't pass gameCard and $ into everything
function getTitle(gameCard, $) {
  return $(gameCard).find(titleSelector).text();
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
    titleImage: $(gameCard)
      .find(".Picture-picture_6dd45462")
      .find("img")
      .attr("src"),
    logoImage: $(gameCard).find(".DynamicLogo-logo_3af88135").attr("src"),
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
