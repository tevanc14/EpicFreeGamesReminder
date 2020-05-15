const fs = require("fs");

const emailBuilder = require("./emailBuilder");
const pageScraper = require("./pageScraper");
const reminderProcessor = require("./reminderProcessor");
const storageLiaison = require("./storageLiaison");

async function main() {
  const scrapedInfo = await pageScraper.getGameInfo();

  console.log("scrapedInfo", JSON.stringify(scrapedInfo));

  if (scrapedInfo.length <= 0) {
    throw new Error("The info scraped had no results");
  }

  const latestInfo = await storageLiaison.readData();

  console.log("latestInfo", JSON.stringify(latestInfo));

  const isThereANewFreeGame = reminderProcessor.isThereANewFreeGame(
    latestInfo,
    scrapedInfo
  );
  if (isThereANewFreeGame) {
    console.log("A new game was found, time to handle it");
    if (!isTestRun()) {
      await reminderProcessor.handleNewFreeGame(scrapedInfo);
    }
  } else {
    console.log("There were no new games found.");
  }
}

if (isTestRun()) {
  main();
  const html = emailBuilder.buildEmailHtml(scrapedInfo);
  fs.writeFileSync("gen.html", html);
}

function index(req, res) {
  main()
    .then(() => {
      res.status(200).send("All good");
    })
    .catch(error => {
      console.log("Error:", error);
      res.status(500).send("An error ocurred");
    });
}

function isTestRun() {
  if (process.argv.length < 3) {
    return false;
  } else {
    return process.argv[2] === "dry-run";
  }
}

module.exports = {
  index: index
};