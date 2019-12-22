function isThereANewFreeGame(oldInfo, newInfo) {
  return JSON.stringify(oldInfo) !== JSON.stringify(newInfo);
}

module.exports = {
  isThereANewFreeGame: isThereANewFreeGame
};
