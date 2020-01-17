const fs = require("fs");

const reminderProcessor = require("./src/reminderProcessor");
const pageScraper = require("./src/pageScraper");
const sendpulseLiaison = require("./src/sendpulseLiaison");
const storageLiaison = require("./src/storageLiaison");

async function main() {
  const scrapedInfo = await pageScraper.getGameInfo();

  console.log("scrapedInfo", scrapedInfo);

  if (scrapedInfo.length <= 0) {
    throw new Error("The info scraped had no results");
  }

  const latestInfo = await storageLiaison.readData();

  console.log("latestInfo", latestInfo);

  const isThereANewFreeGame = reminderProcessor.isThereANewFreeGame(
    latestInfo,
    scrapedInfo
  );
  if (isThereANewFreeGame) {
    console.log("NEW");
    await reminderProcessor.handleNewFreeGame(scrapedInfo);
  }

  // const html = sendpulseLiaison.buildEmailHtml(scrapedInfo);
  // fs.writeFileSync("gen.html", html);
}

main();

function index(req, res) {
  pageScraper
    .getGameInfo()
    .then(gameInfo => {
      res.status(200).send(gameInfo);
    })
    .catch(error => {
      console.log("Error:", error);
      res.status(500).send("An error ocurred");
    });
}

module.exports = {
  index: index
};