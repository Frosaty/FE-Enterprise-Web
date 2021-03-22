const axios = require('axios')
const api_url = require('./api_url')
const FULL_URL = api_url.BASE_URL + api_url.FACULTY_URL

// -----------------------CONTRIBUTION-------------------------
module.exports = {
    // ------- CREATE --------
    create : (userId, startDate, endDate) => axios ({
        method: "post",
        url: FULL_URL,
        params: {
            topicName: topicName,
            startDate: startDate,
            endDate: endDate
        }

    }),

    // ------- READ --------
    read : (topicName, startDate, endDate) => axios ({
        method: "get",
        url: FULL_URL,

    }),

    // ------- UPDATE --------
    update : (topicId, topicName, startDate, endDate) => axios ({
        method: "put",
        url: FULL_URL,
        params: {
            topicId: topicId,
            topicName: topicName,
            startDate: startDate,
            endDate: endDate
        }
    
    }),

    // ------- DELETE --------
    delete : (contributionId) => axios ({
        method: "delete",
        url: FULL_URL,
        params: {
            contributionId: contributionId
        }
    
    }),
}

