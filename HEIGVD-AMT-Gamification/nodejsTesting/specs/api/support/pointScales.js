// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var apiURL = process.env.API_URL || require('../../../env.json').default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// GET all created pointScales
function getPointScales() {
    return api
        .get("/pointScales")
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// POST a new pointScale
function createPointScale(pointScale) {
    return api
        .post("/pointScales")
        .set("Content-type", "application/json")
        .send(pointScale)
        .then(function (response) {
            return response
        });
}

// PUT an existing pointScale
function updateCompletelyPointScale(id, pointScale) {
    return api
        .put("/pointScales/" + id)
        .set("Content-type", "application/json")
        .send(pointScale)
        .then(function (response) {
            return response
        });
}

// DELETE an existing pointScale
function deletePointScale(id) {
    return api
        .delete("/pointScales/" + id)
        .send()
        .then(function (response) {
            return response
        });
}

// Generation of a new pointScale with random values
function generatePointScale() {
    return {
        name: chance.word(),
        description: chance.sentence(),
        coefficient: chance.integer({min: 1, max: 1000})
    }
}

module.exports = {
    getPointScales: getPointScales,
    createPointScale: createPointScale,
    updateCompletelyPointScale: updateCompletelyPointScale,
    deletePointScale: deletePointScale,
    generatePointScale: generatePointScale
};