const sendpulseLiaison = require("./sendpulseLiaison");
const storageLiaison = require("./storageLiaison");

// TODO: Should have more heuristics to make sure bad emails don't go out
function isThereANewFreeGame(oldInfo, newInfo) {
  const titlesAreTheSame = areTitlesTheSame(oldInfo, newInfo);
  const oldInfoExists = oldInfo != undefined && oldInfo.length > 0;

  return !titlesAreTheSame && oldInfoExists;
}

function areTitlesTheSame(oldInfo, newInfo) {
  const oldGameTitles = getGameTitles(oldInfo);
  const newGameTitles = getGameTitles(newInfo);

  return (
    oldGameTitles.length === newGameTitles.length &&
    oldGameTitles.every(
      (oldGameTitle) => newGameTitles.indexOf(oldGameTitle) >= 0
    )
  );
}

function getGameTitles(gamesInfo) {
  const gameTitles = [];

  for (const gameInfo of gamesInfo) {
    if (!gameIsMystery(gameInfo)) {
      gameTitles.push(gameInfo.title);
    }
  }

  return gameTitles;
}

function gameIsMystery(gameInfo) {
  const mysteryRegex = /Unlocking in \d{2}:\d{2}:\d{2}:\d{2}/g;
  return gameInfo.title.match(mysteryRegex);
}

async function handleNewFreeGame(newInfo) {
  console.log("Going to start a Sendpulse campaign");
  await sendpulseLiaison.createCampaign(newInfo);
  console.log("Writing data to GCS");
  await storageLiaison.writeData(newInfo);
}

module.exports = {
  handleNewFreeGame: handleNewFreeGame,
  isThereANewFreeGame: isThereANewFreeGame,
};
