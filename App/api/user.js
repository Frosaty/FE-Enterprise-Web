const axios = require('axios')
const api_url = require('./api_url')
const FULL_URL = api_url.BASE_URL + api_url.USER_URL

// -----------------------USER-------------------------
module.exports = {
    // ------- CREATE --------
    create : (firstName, lastName, userTypeId, birthdate, gender, email, password, phone, address, facultyId) => axios ({
        method: "post",
        url: FULL_URL,
        params: {
            firstName: firstName,
            lastName: lastName,
            userTypeId: userTypeId,
            birthdate: birthdate,
            gender: gender,
            email: email,
            password: password,
            phone: phone,
            address: address,
            facultyId: facultyId
        }
    }),

    // ------- READ --------
    // LOG IN
    login : (email, password) => axios ({
        method: "put",
        url: FULL_URL,
        params: {
            type: "login",
            email: email,
            password: password
        }
    }),
    
    // LOG OUT
    logout : (userId) => axios ({
        method: "put",
        url: FULL_URL,
        params: {
            type: "logout",
            userId: userId
        }
    }),

    // ------- UPDATE --------
    update : (firstName, lastName, birthdate, gender, email, phone, address, userId) => axios ({
        method: "put",
        url: FULL_URL,
        params: {
            type: "",
            firstName: firstName,
            lastName: lastName,
            birthdate: birthdate,
            gender: gender,
            email: email,
            phone: phone,
            address: address,
            userId: userId,      
        }
    }),

    // ------- CHANGE PASSWORD --------
    change_pass : (userId, password) => axios({
        method: "put",
        url: FULL_URL,
        prams: {
            type: "password",
            userId: userId,
            password: password
        }
    }),

    // ------- DELETE --------
    delete : (userId) => axios ({
        method: "delete",
        url: FULL_URL,
        params: {
            userId: userId
        }
    })
}