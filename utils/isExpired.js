const EXPIRATION_TIME = 86400000;

const isExpired = (lastUpdated) => (new Date() - new Date(lastUpdated)) < EXPIRATION_TIME;

module.exports = isExpired