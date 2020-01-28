const fs = require("fs");

const reminderProcessor = require("./reminderProcessor");
const pageScraper = require("./pageScraper");
const sendpulseLiaison = require("./sendpulseLiaison");
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
    await reminderProcessor.handleNewFreeGame(scrapedInfo);
  } else {
    console.log("There were no new games found.");
  }

  // const html = sendpulseLiaison.buildEmailHtml(latestInfo);
  // fs.writeFileSync("gen.html", html);
}

// main();

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

module.exports = {
  index: index
};
