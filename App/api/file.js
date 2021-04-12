const axios = require('axios')
const api_url = require('./api_url')
const FULL_URL = api_url.BASE_URL + api_url.FILE_URL

// -----------------------USER-------------------------
module.exports = {
    // ------- CREATE --------
    create : (contributionId, fileName, path) => axios ({
        method: "post",
        url: FULL_URL,
        params: {
            contributionId: contributionId,
            fileName: fileName,
            path: path
        }
    }),

    // ------- READ --------
    // LOG IN
    read : (contributionId) => axios ({
        method: "get",
        url: FULL_URL,
        params: {
            type: "",
            contributionId: contributionId
        }
    })

    

    

    
}