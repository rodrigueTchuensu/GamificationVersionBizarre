var apiURL = process.env.API_URL || require('../../env.json').default.API_URL;
var chai = require("chai");
var authentications = require("./support/authentications.js");

chai.should();

// API tests
// An unauthenticated user is a user that doesn't send an authentication token in the Authorization header

// authentications endpoint
describe("The /authentications endpoint :", function () {

    // Success
    // POST
    // See scenarios because this test requires the applications endpoint

    // Failures
    // POST
    it("should refuse an unauthenticated user to authenticate itself if mandatory fields are not provided", itShouldRefuseUnauthenticatedUserToAuthenticateItselfIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to authenticate itself if credentials are not correct", itShouldRefuseUnauthenticatedUserToAuthenticateItselfIfCredentialsAreNotCorrect);
});

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToAuthenticateItselfIfMandatoryFieldsAreNotProvided() {
    // Generation of a new authentication as payload
    var payload = authentications.generateAuthentication();
    // Creation of a string with the payload
    var original = JSON.stringify(payload);

    // Creation of wrong payloads
    // Each wrong payload have one mandatory field deleted
    var wrongPayloads = [];
    for (var i = 0; i < 2; ++i) {
        wrongPayloads.push(JSON.parse(original));
    }
    delete wrongPayloads[0].name;
    delete wrongPayloads[1].password;

    // Creation of an array of promise
    // Try to authenticate itself with each wrong payload
    var promises = wrongPayloads.map(p => (authentications.createAuthentication(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToAuthenticateItselfIfCredentialsAreNotCorrect() {
    // Generation of a new authentication
    var authentication = authentications.generateAuthentication();

    // Try to authenticate
    return authentications.createAuthentication(authentication)
        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

        })

}