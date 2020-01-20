const sendpulseLiaison = require("./sendpulseLiaison");
const storageLiaison = require("./storageLiaison");

// TODO: Should have more heuristics to make sure bad emails don't go out
function isThereANewFreeGame(oldInfo, newInfo) {
  const objectsAreSame = JSON.stringify(oldInfo) !== JSON.stringify(newInfo);
  const oldInfoExists = oldInfo != undefined && oldInfo.length > 0;

  return objectsAreSame && oldInfoExists;
}

async function handleNewFreeGame(newInfo) {
  console.log("Writing data to GCS")
  await storageLiaison.writeData(newInfo);
  console.log("Going to start a Sendpulse campaign");
  sendpulseLiaison.createCampaign(newInfo);
}

module.exports = {
  handleNewFreeGame: handleNewFreeGame,
  isThereANewFreeGame: isThereANewFreeGame
};