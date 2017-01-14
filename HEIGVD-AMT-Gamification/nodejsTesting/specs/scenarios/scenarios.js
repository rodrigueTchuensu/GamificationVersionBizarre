var applications = require("../api/support/applications.js");
var authentications = require("../api/support/authentications.js");
var env = require('../../env.json');
var chai = require("chai");
var jwt = require('jsonwebtoken');

// Server signature key for authentication token
const KEY = process.env.SIGNATURE_KEY_FOR_JWT || env.default.SIGNATURE_KEY_FOR_JWT;
// Bearer pattern
const BEARER = "Bearer ";

chai.should();

// API tests with workflow
describe("Workflows :", function () {

    // CRUD operations on badges endpoint
    describe("CRUD operation on badges endpoint :", function () {
        it("A new badge created should be present in the list returned by GET request and should contain all provided fields");
        it("An existing badge that is completely updated should be present in the list returned by GET request and should contain all updated fields");
        it("An existing badge that is deleted should not be present in the list returned by GET request");

    });

    // Authentications & applications endpoints
    describe("Authentications & applications operation :", function () {
        it("should allow an unauthenticated user to create a new application, to authenticate itself and to get an authentication token", itShouldAllowUnauthenticatedUserToCreateApplicationToAuthenticateItselfAndToGetAuthenticationToken);
    });

});

function aNewBadgeCreatedShouldBePresentInTheListReturnedByTheGetRequestAndShouldContainAllPostedFields() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Creation of the new badge
    return badges.createBadge(badge)
        .then(function (response) {

            // Get all created badges
            return badges.getBadges()
                .then(function (response) {
                    var nbBadges = response.body.length;
                    var badge = response.body[nbBadges - 1];

                    // HTTP response body should contain the new badge created with all posted fields
                    badge.should.have.property("badgeId");
                    badge.should.have.property("name", badge.name);
                    badge.should.have.property("description", badge.description);
                    badge.should.have.property("imageURL", badge.imageURL);

                });

        });
}

function itShouldAllowUnauthenticatedUserToCreateApplicationToAuthenticateItselfAndToGetAuthenticationToken() {
    // Generation of a new application
    var application = applications.generateApplication();

    // Creation of the application
    return applications.createApplication(application)
        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Creation of the authentication
            var authentication = {
                name: application.name,
                password: application.password
            }

            // Authentication
            return authentications.createAuthentication(authentication);

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // Authentication token should be present in the response body and be a string
            authenticationToken = response.text;
            authenticationToken.should.not.be.empty;
            authenticationToken.should.be.a("string");

            // Authentication token should be signed by the API server and not expired
            // Otherwise, it generate a JsonWebToken error
            jwt.verify(authenticationToken, KEY).should.be.an("object");

        })

}