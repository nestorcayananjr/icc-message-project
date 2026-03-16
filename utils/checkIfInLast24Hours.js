const EXPIRATION_TIME = 86400000;

const isExpired = (lastUpdated) => (new Date() - new Date(lastUpdated)) < EXPIRATION_TIME;

const checkIfInLast24Hours = (lastUpdated) => {
    return isExpired(lastUpdated)  
}

module.exports = checkIfInLast24Hours