const reminderProcessor = require("./reminderProcessor");
const pageScraper = require("./pageScraper");
const storageLiaison = require("./storageLiaison");

async function main() {
  const gameInfo = await pageScraper.getGameInfo();

  console.log("gameInfo", gameInfo);

  const latestInfo = await storageLiaison.readData();

  console.log("latestInfo", latestInfo);

  const isThereANewFreeGame = reminderProcessor.isThereANewFreeGame(
    latestInfo,
    gameInfo
  );
  if (isThereANewFreeGame) {
    console.log("NEW");
  }

  await storageLiaison.writeData(gameInfo);
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
