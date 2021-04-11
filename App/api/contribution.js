const axios = require('axios')
const api_url = require('./api_url')
const FULL_URL = api_url.BASE_URL + api_url.CONTRIBUTION_URL

// -----------------------CONTRIBUTION-------------------------
module.exports = {
    // ------- CREATE --------
    create : (userId, title, topicId) => axios ({
        method: "post",
        url: FULL_URL,
        params: {
            userId: userId,
            title: title,
            topicId: topicId
        }

    }),

    // ------- READ --------
    // Only read selected contributions of the topic 
    read_selected : (topicId) => axios ({
        method: "get",
        url: FULL_URL,
        param: {
            topicId: topicId,
            type: "active"
        }
    }),

    // Read all contributions of the topic 
    read_all : (topicId) => axios ({
        method: "get",
        url: FULL_URL,
        param: {
            topicId: topicId,
            type: ""
        }
    }),
    // ------- UPDATE --------
    // Update the mark of contribution
    update_mark : (contributionId, mark) => axios ({
        method: "put",
        url: FULL_URL,
        params: {
            contributionId: contributionId,
            mark: mark
        }
    
    })

   
}

