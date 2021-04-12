const axios = require('axios')
const api_url = require('./api_url')
const FULL_URL = api_url.BASE_URL + api_url.COMMENT_URL

// -----------------------USER-------------------------
module.exports = {
    // ------- CREATE --------
    create : (contributionId, userId, content) => axios ({
        method: "post",
        url: FULL_URL,
        params: {
            contributionId: contributionId,
            userId: userId,
            content: content
        }

    }),

    // ------- READ --------
    // Read commments of the contribution
    read : (contributionId, userId) => axios ({
        method: "get",
        url: FULL_URL,
        param: {
            contributionId: contributionId,
            userId: userId
        }
    }),

    // ------- UPDATE --------
    update : (commentIid, content) => axios ({
        method: "put",
        url: FULL_URL,
        params: {
            commentIid: commentIid,
            content: content
        }
    
    })

}