// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var apiURL = process.env.API_URL || require('../../../env.json').default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var authentications = require("./authentications.js");
var chance = new Chance();

// GET the authenticated application with the correct Authorization header
function getApplication(authenticationToken) {
    return api
        .get("/applications")
        .set("Accept", "application/json")
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// Try to GET the authenticated application without Authorization header
function getApplicationWithoutAuthorizationHeader() {
    return api
        .get("/applications")
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// POST a new application
function createApplication(application) {
    return api
        .post("/applications")
        .set("Content-type", "application/json")
        .send(application)
        .then(function (response) {
            return response
        });
}

// Try to PUT an existing application without Authorization header
function updateCompletelyApplicationWithoutAuthorizationHeader(application) {
    return api
        .put("/applications")
        .set("Content-type", "application/json")
        .send(application)
        .then(function (response) {
            return response
        });
}

// PUT an existing application with the correct Authorization header
function updateCompletelyApplication(authenticationToken, application) {
    return api
        .put("/applications")
        .set("Content-type", "application/json")
        .set("Authorization", authenticationToken)
        .send(application)
        .then(function (response) {
            return response
        });
}

// Try to DELETE an existing application without Authorization header
function deleteApplicationWithoutAuthorizationHeader() {
    return api
        .delete("/applications")
        .send()
        .then(function (response) {
            return response
        });
}

// DELETE an existing application with the correct Authorization header
function deleteApplication(authenticationToken) {
    return api
        .delete("/applications")
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// Generation of a new application with random values
function generateApplication() {
    return {
        name: chance.word({ length: 15 }),
        description: chance.sentence(),
        password: chance.word({ length: 7 })
    }
}

// Create the application, authenticate it and return the authentication token received
function createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(application) {

    // Creation of the new application
    return createApplication(application)
        .then(function (response) {
            // Application authentication
            return authentications.createAuthentication(
                {
                    name: application.name,
                    password: application.password
                }
            );
        })
        .then(function (response) {
            // Return the valid authentication token received
            return response.text;
        });
}

module.exports = {
    getApplication: getApplication,
    getApplicationWithoutAuthorizationHeader: getApplicationWithoutAuthorizationHeader,
    createApplication: createApplication,
    updateCompletelyApplicationWithoutAuthorizationHeader: updateCompletelyApplicationWithoutAuthorizationHeader,
    updateCompletelyApplication: updateCompletelyApplication,
    deleteApplicationWithoutAuthorizationHeader: deleteApplicationWithoutAuthorizationHeader,
    deleteApplication: deleteApplication,
    generateApplication: generateApplication,
    createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived: createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived
};