const axios = require('axios')
const api_url = require('./api_url')
const FULL_URL = api_url.BASE_URL + api_url.FACULTY_URL

// -----------------------FACULTY-------------------------
module.exports = {
    // ------- CREATE --------
    create : (facultyName, description) => axios ({
        method: "post",
        url: FULL_URL,
        params: {
            facultyName: facultyName,
            description: description
        }
    }),

    // ------- READ --------
    read : (facultyName, description) => axios ({
        method: "get",
        url: FULL_URL,
    })
    // ------- UPDATE --------
    // ------- DELETE --------
}