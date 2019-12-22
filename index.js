const reminderProcessor = require("./reminderProcessor");
const pageScraper = require("./pageScraper");
const storageLiaison = require("./storageLiaison");

async function main() {
  const scrapedInfo = await pageScraper.getGameInfo();

  console.log("scrapedInfo", scrapedInfo);

  const latestInfo = await storageLiaison.readData();

  console.log("latestInfo", latestInfo);

  const isThereANewFreeGame = reminderProcessor.isThereANewFreeGame(
    latestInfo,
    scrapedInfo
  );
  if (isThereANewFreeGame) {
    // TODO: Need a lot of heuristics to make sure bad emails don't go out
    console.log("NEW");
  }

  await storageLiaison.writeData(scrapedInfo);
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
      res.status(500).send("Unknown error ocurred");
    });
}

module.exports = {
  index: index
};