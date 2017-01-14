// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var apiURL = process.env.API_URL || require('../../../env.json').default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// GET all created badges for the application with the correct Authorization header
function getBadges(authenticationToken) {
    return api
        .get("/badges")
        .set("Accept", "application/json")
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// Try to GET all created badges for the application without Authorization header
function getBadgesWithoutAuthorizationHeader() {
    return api
        .get("/badges")
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// GET desired badge for the application with the correct Authorization header
function getBadge(id, authenticationToken) {
    return api
        .get("/badges/" + id)
        .set("Accept", "application/json")
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// GET desired badge for the application without Authorization header
function getBadgeWithoutAuthorizationHeader(id) {
    return api
        .get("/badges/" + id)
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// POST a new badge for the application with the correct Authorization header
function createBadge(badge, authenticationToken) {
    return api
        .post("/badges")
        .set("Content-type", "application/json")
        .set("Authorization", authenticationToken)
        .send(badge)
        .then(function (response) {
            return response
        });
}

// Try to POST a new badge for the application without Authorization header
function createBadgeWithoutAuthorizationHeader(badge) {
    return api
        .post("/badges")
        .set("Content-type", "application/json")
        .send(badge)
        .then(function (response) {
            return response
        });
}

// PUT an existing badge for the application with the correct Authorization header
function updateCompletelyBadge(id, badge, authenticationToken) {
    return api
        .put("/badges/" + id)
        .set("Content-type", "application/json")
        .set("Authorization", authenticationToken)
        .send(badge)
        .then(function (response) {
            return response
        });
}

// Try to PUT an existing badge for the application without Authorization header
function updateCompletelyBadgeWithoutAuthorizationHeader(id, badge) {
    return api
        .put("/badges/" + id)
        .set("Content-type", "application/json")
        .send(badge)
        .then(function (response) {
            return response
        });
}

// DELETE an existing badge for the application with the correct Authorization header
function deleteBadge(id, authenticationToken) {
    return api
        .delete("/badges/" + id)
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// Try to DELETE an existing badge for the application without Authorization header
function deleteBadgeWithoutAuthorizationHeader(id) {
    return api
        .delete("/badges/" + id)
        .send()
        .then(function (response) {
            return response
        });
}

// Generation of a new badge with random values
function generateBadge() {
    return {
        name: chance.word(),
        description: chance.sentence(),
        imageURL: chance.sentence()
    }
}

module.exports = {
    getBadges: getBadges,
    getBadgesWithoutAuthorizationHeader: getBadgesWithoutAuthorizationHeader,
    getBadge: getBadge,
    getBadgeWithoutAuthorizationHeader: getBadgeWithoutAuthorizationHeader,
    createBadge: createBadge,
    createBadgeWithoutAuthorizationHeader: createBadgeWithoutAuthorizationHeader,
    updateCompletelyBadge: updateCompletelyBadge,
    updateCompletelyBadgeWithoutAuthorizationHeader: updateCompletelyBadgeWithoutAuthorizationHeader,
    deleteBadge: deleteBadge,
    deleteBadgeWithoutAuthorizationHeader: deleteBadgeWithoutAuthorizationHeader,
    generateBadge: generateBadge
};