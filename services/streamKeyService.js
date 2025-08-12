const crypto = require("crypto");

const streamKeysDB = new Map();

function createStreamKey(email) {
  const streamKey = crypto.randomBytes(8).toString("hex");
  streamKeysDB.set(streamKey, { email});
  return { streamKey, email };
}

function validateStreamKey(key) {
  return streamKeysDB.has(key);
}

function getStreamKeyInfo(key) {
  return streamKeysDB.get(key);
}

module.exports = {
  createStreamKey,
  validateStreamKey,
  getStreamKeyInfo,
};
