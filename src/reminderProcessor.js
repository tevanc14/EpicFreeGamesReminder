const sendpulseLiaison = require("./sendpulseLiaison");
const storageLiaison = require("./storageLiaison");

// TODO: Need a lot of heuristics to make sure bad emails don't go out
function isThereANewFreeGame(oldInfo, newInfo) {
  const objectsAreSame = JSON.stringify(oldInfo) !== JSON.stringify(newInfo);
  const oldInfoExists = oldInfo != undefined && oldInfo.length > 0;

  return objectsAreSame && oldInfoExists;
}

async function handleNewFreeGame(newInfo) {
  // await storageLiaison.writeData(newInfo);
  sendpulseLiaison.createCampaign(newInfo);
}

module.exports = {
  handleNewFreeGame: handleNewFreeGame,
  isThereANewFreeGame: isThereANewFreeGame
};