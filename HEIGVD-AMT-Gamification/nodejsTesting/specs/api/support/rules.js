// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var apiURL = process.env.API_URL || require('../../../env.json').default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// GET all created rules
function getRules() {
    return api
        .get("/rules")
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// POST a new rule
function createRule(rule) {
    return api
        .post("/rules")
        .set("Content-type", "application/json")
        .send(rule)
        .then(function (response) {
            return response
        });
}

// PUT an existing rule
function updateCompletelyRule(id, rule) {
    return api
        .put("/rules/" + id)
        .set("Content-type", "application/json")
        .send(rule)
        .then(function (response) {
            return response
        });
}

// DELETE an existing rule
function deleteRule(id) {
    return api
        .delete("/rules/" + id)
        .send()
        .then(function (response) {
            return response
        });
}

// Generation of a new rule with random values
function generateRule() {
    return {
        name: chance.word(),
        description: chance.sentence()
    }
}

module.exports = {
    getRules: getRules,
    createRule: createRule,
    updateCompletelyRule: updateCompletelyRule,
    deleteRule: deleteRule,
    generateRule: generateRule
};