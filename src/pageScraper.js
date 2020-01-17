const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const url = "https://www.epicgames.com/store/free-games";

async function scrapePage() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 0
  });
  const html = await page.content();
  const urlPrefix = await page.evaluate(() => {
    return `${window.location.protocol}//${window.location.hostname}`;
  });
  browser.close();
  return {
    html: html,
    urlPrefix: urlPrefix
  };
}

function getGameCards($) {
  return $(".FreeGamesCollectionFeature-section_daece987").find(
    ".Card-root_06ca652d"
  );
}

// TODO: Don't pass gameCard and $ into everything
function getTitle(gameCard, $) {
  return $(gameCard)
    .find(".Card-title_17f29aee")
    .text();
}

function getDate(gameCard, $) {
  const dateDiv = $(gameCard).find(".Card-subtitle_dd288569");
  const timeDivs = $(dateDiv)
    .find("span")
    .find("time")
    .toArray();

  let dateRange = [];
  for (const timeDiv of timeDivs) {
    const time = $(timeDiv).attr("datetime");
    dateRange.push(time);
  }

  return {
    startDate: dateRange[0],
    endDate: dateRange[1]
  };
}

function getLink(gameCard, $, urlPrefix) {
  return urlPrefix + $(gameCard).attr("href");
}

function getImageInfo(gameCard, $) {
  return {
    titleImage: $(gameCard)
      .find(".Picture-image_59c772c1")
      .attr("src"),
    logoImage: $(gameCard)
      .find(".DynamicLogo-logo_f5443fce")
      .attr("src")
  };
}

function getGameInfo() {
  return scrapePage().then(pageInfo => {
    const $ = cheerio.load(pageInfo.html);
    const gameCards = getGameCards($).toArray();

    let cardInfos = [];
    for (const gameCard of gameCards) {
      const cardInfo = {
        title: getTitle(gameCard, $),
        date: getDate(gameCard, $),
        link: getLink(gameCard, $, pageInfo.urlPrefix),
        imageInfo: getImageInfo(gameCard, $)
      };

      cardInfos.push(cardInfo);
    }

    return cardInfos;
  });
}

module.exports = {
  getGameInfo: getGameInfo
};
