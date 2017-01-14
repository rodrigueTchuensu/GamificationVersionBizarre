var env = require('../../env.json');
var apiURL = process.env.API_URL || env.default.API_URL;
var badges = require("./support/badges.js");
var applications = require("./support/applications.js");
var jwt = require('jsonwebtoken');
var chai = require("chai");
var Chance = require("chance");
var chance = new Chance();

chai.should();

// Server signature key for authentication token
const KEY = process.env.SIGNATURE_KEY_FOR_JWT || env.default.SIGNATURE_KEY_FOR_JWT;
// Bearer pattern
const BEARER = "Bearer ";

// API tests

// badges endpoint
describe("The /badges endpoint :", function () {

    // Success
    // GET
    it("should allow an authenticated user to get the list of badges of the application", itShouldAllowAuthenticatedUserToGetTheListOfBadgesOfTheApplication);

    // GET /id
    it("should allow an authenticated user to get the desired badge of the application", itShouldAllowAuthenticatedUserToGetTheDesiredBadgeOfTheApplication);

    // POST
    it("should allow an authenticated user to create a new badge on this application", itShouldAllowAuthenticatedUserToCreateBadgeOnThisApplication);

    // PUT
    it("should allow an authenticated user to completely update an existing badge on this application", itShouldAllowAuthenticatedUserToCompletelyUpdateExistingBadgeOnThisApplication);

    // Delete
    it("should allow an authenticated user to delete an existing badge on this application", itShouldAllowAuthenticatedUserToDeleteExistingBadgeOnThisApplication);

    // Failures
    // GET
    it("should refuse an unauthenticated user to get all badges of this application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthorizationHeaderIsNotProvided);
    it("should refuse an unauthenticated user to get all badges of this application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthenticationTokenIsEmpty);
    it("should refuse an unauthenticated user to get all badges of this application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
    it("should refuse an unauthenticated user to get all badges of this application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
    it("should refuse an unauthenticated user to get all badges of this application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthenticationTokenIsExpired);
    it("should refuse an unauthenticated user to get all badges of an application that does not exist", itShouldRefuseUnauthenticatedUserToGetAllBadgesOfAnApplicationThatDoesNotExist);

    // GET /id
    it("should refuse an unauthenticated user to get the desired badge of this application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthorizationHeaderIsNotProvided);
    it("should refuse an unauthenticated user to get the desired badge of this application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsEmpty);
    it("should refuse an unauthenticated user to get the desired badge of this application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
    it("should refuse an unauthenticated user to get the desired badge of this application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
    it("should refuse an unauthenticated user to get the desired badge of this application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsExpired);
    it("should refuse an unauthenticated user to get the desired badge of an application that does not exist", itSouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfAnApplicationThatDoesNotExist);
    it("should refuse an authenticated user to get the desired badge of this application if badge id provided does not exist", itShouldRefuseAuthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfBadgeIdProvidedDoesNotExist);

    // POST
    it("should refuse an unauthenticated user to create new badge on this application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToCreateBadgeOnThisApplicationIfTheAuthorizationHeaderIsNotProvided);
    it("should refuse an unauthenticated user to create new badge on this application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToCreateNewBadgeOnThisApplicationIfTheAuthenticationTokenIsEmpty);
    it("should refuse an unauthenticated user to create new badge on this application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToCreateBadgeOnThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
    it("should refuse an unauthenticated user to create new badge on this application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToCreateBadgeOnThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
    it("should refuse an unauthenticated user to create new badge on this application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToCreateBadgeOnThisApplicationIfTheAuthenticationTokenIsExpired);
    it("should refuse an unauthenticated user to create new badge if mandatory fields are not provided", itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to create new badge if mandatory fields are empty or contain only spaces", itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an unauthenticated user to create new badge if name contains more than 80 characters", itShouldRefuseUnauthenticatedUserToCreateBadgeIfNameContainsMoreThan80Characters);
    it("should refuse an unauthenticated user to create new badge if description or image URL contain more than 255 characters", itShouldRefuseUnauthenticatedUserToCreateBadgeIfDescriptionOrImageURLContainMoreThan255Characters);
    it("should refuse an unauthenticated user to create new badge if the badge name provided already exists in this application", itShouldRefuseUnauthenticatedUserToCreateBadgeIfTheBadgeNameProvidedAlreadyExistsInThisApplication);

    // PUT
    it("should refuse an unauthenticated user to update completely the desired badge of this application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthorizationHeaderIsNotProvided);
    it("should refuse an unauthenticated user to update completely the desired badge of this application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsEmpty);
    it("should refuse an unauthenticated user to update completely the desired badge of this application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
    it("should refuse an unauthenticated user to update completely the desired badge of this application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
    it("should refuse an unauthenticated user to update completely the desired badge of this application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsExpired);
    it("should refuse an unauthenticated user to completely update an existing badge if mandatory fields are not provided");
    it("should refuse an unauthenticated user to completely update an existing badge if mandatory fields are empty or contain only spaces");
    it("should refuse an unauthenticated user to completely update an existing badge if name contains more than 80 characters");
    it("should refuse an unauthenticated user to completely update an existing badge if description or image URL contain more than 255 characters");
    it("should refuse an unauthenticated user to completely update an existing badge if the badge name provided already exists");
    it("should refuse an unauthenticated user to completely update an existing badge if badge id provided does not exist");

    // Delete
    it("should refuse an unauthenticated user to get the desired badge of this application if the authorization header is not provided");
    it("should refuse an unauthenticated user to get the desired badge of this application if the authentication token is empty");
    it("should refuse an unauthenticated user to get the desired badge of this application if the authentication token is not preceded by the Bearer pattern");
    it("should refuse an unauthenticated user to get the desired badge of this application if the authentication token is not signed by the gamification API server");
    it("should refuse an unauthenticated user to get the desired badge of this application if the authentication token is expired");
    it("should refuse an unauthenticated user to delete an existing badge if badge id provided does not exist");

});

// Success
// GET
function itShouldAllowAuthenticatedUserToGetTheListOfBadgesOfTheApplication() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Get the badge of this application
            return badges.getBadges(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // HTTP response body should be an empty array
            var array = response.body;
            array.should.be.an("array");
            array.should.be.empty;

        })

}

// Success
// GET /id
function itShouldAllowAuthenticatedUserToGetTheDesiredBadgeOfTheApplication() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Badge id to get
    var badgeId;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new badge on this application
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // Get the badge id from Location hader
            var location = response.header["location"];
            badgeId = location.substring(location.lastIndexOf("/") + 1);

            // Get the desired badge
            return badges.getBadge(badgeId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // The badge should contain these values
            var badge = response.body;
            badge.should.have.deep.property("badgeId", Number(badgeId));
            badge.should.have.deep.property("name", BADGE.name);
            badge.should.have.deep.property("description", BADGE.description);
            badge.should.have.deep.property("imageURL", BADGE.imageURL);

        });

}

// Success
// POST
function itShouldAllowAuthenticatedUserToCreateBadgeOnThisApplication() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    // Location http header
    var location = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new badge on this application
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Saving of the Location HTTP header
            location = response.header['location'];

            // Get the badges
            return badges.getBadges(authenticationToken);

        })

        .then(function (response) {

            var badge = response.body[0];

            // HTTP Location header response from previous POST request should contain the URL to access the new badge created
            location.should.equal(apiURL + '/badges/' + badge.badgeId);

            // Badge should contain these keys
            badge.should.include.all.keys("badgeId", "description", "name", "imageURL");

            // badgeId should be a positive number
            badge.badgeId.should.be.a("number");
            badge.badgeId.should.be.above(0);

            // badge should contain these values
            badge.should.have.deep.property("name", BADGE.name);
            badge.should.have.deep.property("description", BADGE.description);
            badge.should.have.deep.property("imageURL", BADGE.imageURL);

        });

}

// Success
// PUT
function itShouldAllowAuthenticatedUserToCompletelyUpdateExistingBadgeOnThisApplication() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Badge updated
    const BADGE_UPDATED = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Badge id to update
    var badgeId;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new badge on this application
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // Get the badge id from Location hader
            var location = response.header["location"];
            badgeId = location.substring(location.lastIndexOf("/") + 1);

            // Update the badge
            return badges.updateCompletelyBadge(badgeId, BADGE_UPDATED, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

            // The badge updated should contain the updated value
            // Get the badge updated
            return badges.getBadges(authenticationToken);

        })

        .then(function (response) {

            // Save the badge updated
            var badge = response.body[0];

            // badge should contain these values
            badge.should.have.deep.property("badgeId", Number(badgeId));
            badge.should.have.deep.property("name", BADGE_UPDATED.name);
            badge.should.have.deep.property("description", BADGE_UPDATED.description);
            badge.should.have.deep.property("imageURL", BADGE_UPDATED.imageURL);

        });

}

// Success
// DELETE
function itShouldAllowAuthenticatedUserToDeleteExistingBadgeOnThisApplication() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Badge id to delete
    var badgeId;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new badge on this application
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // Get the badge id from Location hader
            var location = response.header["location"];
            badgeId = location.substring(location.lastIndexOf("/") + 1);

            // Delete the badge
            return badges.deleteBadge(badgeId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

            // There should be no badge
            return badges.getBadges(authenticationToken);

        })

        .then(function (response) {

            // HTTP response body should be an empty array
            var badges = response.body;
            badges.should.be.an("array");
            badges.should.be.empty;

        });
}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    // Try to get all badges of the application
    return badges.getBadgesWithoutAuthorizationHeader()
        .then(function (response) {

            // HTTP response status should equal 400 BAD REQUEST
            response.status.should.equal(400);

        });

}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Empty authentication token
    var authenticationToken = "";
    // Try to get all badges of the application
    return badges.getBadges(authenticationToken)
        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token without Bearer pattern
    var authenticationToken = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Try to get badges
            return badges.getBadges(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });

}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            id = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but not signed with the server signature key
            const WRONG_KEY = KEY + 1;
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: id
                },
                WRONG_KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Try to get badges
            return badges.getBadges(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application signed with the server signature key
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: id
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Get badges
            return badges.getBadges(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 200 OK
            response.status.should.equal(200);

        })
}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllBadgesOfThisApplicationIfTheAuthenticationTokenIsExpired() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            id = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: id
                },
                KEY,
                {
                    expiresIn: 0
                }
            );

            // Try to get badges
            return badges.getBadges(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token not expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: id
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Update application
            return badges.getBadges(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 200 OK
            response.status.should.equal(200);

        })
}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllBadgesOfAnApplicationThatDoesNotExist() {
    // Application id that doesn't exist
    var applicationId = 0

    // Creation of a valid authentication token for the application id = 0
    authenticationToken = BEARER + jwt.sign(
        {
            iss: applicationId
        },
        KEY,
        {
            expiresIn: '1h'
        }
    );

    // Try to get all badges
    return badges.getBadges(authenticationToken)

        .then(function (response) {

            // HTTP response status should be 410 GONE
            response.status.should.equal(410);

        });
}

// Failure 
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    var badgeId = 0;

    // Try to get desired badge
    return badges.getBadgeWithoutAuthorizationHeader(badgeId)
        .then(function (response) {

            // HTTP response status should be 400 BAD REQUEST
            response.status.should.equal(400);

        });

}

// Failure
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Empty authentication token
    var authenticationToken = "";
    var badgeId = 0;

    // Try to get the desired badge of the application
    return badges.getBadge(badgeId, authenticationToken)
        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Badge id to get
    var badgeId = 0;
    // Authentication token for the application above without Bearer pattern
    var authenticationToken = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken = response;

            // Create a new badge on this application
            return badges.getBadge(badgeId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });

}

// Failure
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Badge to get
    var badgeId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Create the badge
            return badges.createBadge(BADGE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the badge id from Location hader
            var location = response.header["location"];
            badgeId = location.substring(location.lastIndexOf("/") + 1);

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but not signed with the server signature key
            const WRONG_KEY = KEY + 1;
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                WRONG_KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Try to get badge
            return badges.getBadge(badgeId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application signed with the server signature key
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Get badges
            return badges.getBadge(badgeId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 200 OK
            response.status.should.equal(200);

        })
}

// Failure
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsExpired() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Badge to get
    var badgeId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Create the badge
            return badges.createBadge(BADGE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the badge id from Location hader
            var location = response.header["location"];
            badgeId = location.substring(location.lastIndexOf("/") + 1);

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: 0
                }
            );

            // Try to get badge
            return badges.getBadge(badgeId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application but not expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Get badges
            return badges.getBadge(badgeId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 200 OK
            response.status.should.equal(200);

        })
}

// Failure
// GET /id
function itSouldRefuseUnauthenticatedUserToGetTheDesiredBadgeOfAnApplicationThatDoesNotExist() {
    // Application id
    var applicationId = 0;
    // Creation of a valid authentication token but for an application that doesn't exist
    var authenticationToken = BEARER + jwt.sign(
        {
            iss: applicationId
        },
        KEY,
        {
            expiresIn: '1h'
        }
    );

    // Try to get badge
    var badgeId = 0;
    return badges.getBadge(badgeId, authenticationToken)
        .then(function (response) {

            // HTTP response status should be 410 GONE
            response.status.should.equal(410);

        })
}

// Failure
// GET /id
function itShouldRefuseAuthenticatedUserToGetTheDesiredBadgeOfThisApplicationIfBadgeIdProvidedDoesNotExist() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received
            authenticationToken += response;

            // Try to get desired badge
            var badgeId = 0;
            return badges.getBadge(badgeId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 404 NOT FOUND
            response.status.should.equal(404);

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeOnThisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Try to create badge
    return badges.createBadgeWithoutAuthorizationHeader(BADGE)
        .then(function (response) {

            // HTTP response status should be 400 BAD REQUEST
            response.status.should.equal(400);

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateNewBadgeOnThisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Empty authentication token
    var authenticationToken = "";
    // Try to create badge
    return badges.createBadge(BADGE, authenticationToken)
        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeOnThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above without Bearer pattern
    var authenticationToken = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken = response;

            // Try to create badge
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeOnThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but not signed with the server signature key
            const WRONG_KEY = KEY + 1;
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                WRONG_KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Try to create badge
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application signed with the server signature key
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Create badge
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 201 CREATED
            response.status.should.equal(201);

        })
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeOnThisApplicationIfTheAuthenticationTokenIsExpired() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: 0
                }
            );

            // Try to create badge
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application but not expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Create badge
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 201 CREATED
            response.status.should.equal(201);

        })
}

// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Generation of a new badge as payload
            var payload = badges.generateBadge();
            // Creation of a string with the payload
            var original = JSON.stringify(payload);

            // Creation of wrong payloads
            // Each wrong payload have one mandatory field deleted
            var wrongPayloads = [];
            for (var i = 0; i < 3; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            delete wrongPayloads[0].name;
            delete wrongPayloads[1].description;
            delete wrongPayloads[2].imageURL;

            // Creation of an array of promise
            // Try to create new badge with each wrong payload
            var promises = wrongPayloads.map(p => (badges.createBadge(p, authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Generation of a new badge as payload
            var payload = badges.generateBadge();
            // Creation of a string with the payload
            var original = JSON.stringify(payload);

            // Creation of wrong payloads
            // Each wrong payload have one mandatory field that contains only two spaces
            var wrongPayloads = [];
            for (var i = 0; i < 3; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].name = "  ";
            wrongPayloads[1].description = "  ";
            wrongPayloads[2].imageURL = "  ";

            // Creation of an array of promise
            // Try to create new badge with each wrong payload
            var promises = wrongPayloads.map(p => (badges.createBadge(p, authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeIfNameContainsMoreThan80Characters() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Change the length of the badge name to 81 characters
            badge.name = chance.word({ length: 81 });

            return badges.createBadge(badge, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the badge name to 80 characters
            badge.name = chance.word({ length: 80 });

            return badges.createBadge(badge, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeIfDescriptionOrImageURLContainMoreThan255Characters() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Wrong payloads
    var wrongPayloads = [];
    // Stringify the payload
    var original;
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Generation of a new badge as payload
            var payload = badge;
            // Creation of a string with the payload
            original = JSON.stringify(payload);

            // Creation of wrong payloads
            // Each wrong payload have description or imageURL that contain 256 characters
            for (var i = 0; i < 2; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].description = chance.word({ length: 256 });
            wrongPayloads[1].imageURL = chance.word({ length: 256 });

            // Creation of an array of promise
            // Try to create new badge with each wrong payload
            var promises = wrongPayloads.map(p => (badges.createBadge(p, authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

            // Creation of correct payloads
            // Each correct payload have description or imageURL that contain 255 characters
            wrongPayloads = [];
            for (var i = 0; i < 2; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].description = chance.word({ length: 255 });
            wrongPayloads[1].imageURL = chance.word({ length: 255 });

            // Creation of an array of promise
            // Create new badge with each correct payload
            var promises = wrongPayloads.map(p => (badges.createBadge(p, authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 201 CREATED
            responses.forEach(r => (r.status.should.equal(201)));

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeIfTheBadgeNameProvidedAlreadyExistsInThisApplication() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken += response;

            // Creation of the new badge
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // Try to create the same badge a second time
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

        });

}

// Failure
// PUT
function itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    // Badge id to update
    var badgeId = 0;
    // Try to update badge
    return badges.updateCompletelyBadgeWithoutAuthorizationHeader(badgeId)
        .then(function (response) {

            // HTTP response status should be 400 BAD REQUEST
            response.status.should.equal(400);

        });
}

// Failure
// PUT
function itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Badge id to update
    var badgeId = 0;
    // Empty authentication token
    var authenticationToken = "";
    // Try to update badge
    return badges.updateCompletelyBadge(badgeId, BADGE, authenticationToken)
        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// PUT
function itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Badge id to update
    var badgeId = 0;
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above without Bearer pattern
    var authenticationToken = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken = response;

            // Try to update badge
            return badges.updateCompletelyBadge(badgeId, BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure 
// PUT
function itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Badge id to update
    var badgeId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Create a badge
            return badges.createBadge(BADGE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the badge id from Location hader
            var location = response.header["location"];
            badgeId = location.substring(location.lastIndexOf("/") + 1);

            // Creation of a valid authentication token for this application but not signed with the server signature key
            const WRONG_KEY = KEY + 1;
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                WRONG_KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Try to update badge
            return badges.updateCompletelyBadge(badgeId, BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application signed with the server signature key
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Update the badge
            return badges.updateCompletelyBadge(badgeId, BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })
}

// Failure
// PUT
function itShouldRefuseUnauthenticatedUserToUpdateCompletelyTheDesiredBadgeOfThisApplicationIfTheAuthenticationTokenIsExpired() {
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Badge id to update
    var badgeId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Create a badge
            return badges.createBadge(BADGE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the badge id from Location hader
            var location = response.header["location"];
            badgeId = location.substring(location.lastIndexOf("/") + 1);

            // Creation of a valid authentication token for this application but expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: 0
                }
            );

            // Try to update badge
            return badges.updateCompletelyBadge(badgeId, BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application but not expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Update badge
            return badges.updateCompletelyBadge(badgeId, BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })
}

// Failure 
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfMandatoryFieldsAreNotProvided() {
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
                    var id = badge.badgeId;

                    // Update completely an existing badge with wrong payloads
                    // Generation of a new badge as payload
                    var payload = badges.generateBadge();
                    // Creation of a string with the payload
                    var original = JSON.stringify(payload);

                    // Creation of wrong payloads
                    // Each wrong payload have one mandatory field deleted
                    var wrongPayloads = [];
                    for (var i = 0; i < 3; ++i) {
                        wrongPayloads.push(JSON.parse(original));
                    }
                    delete wrongPayloads[0].name;
                    delete wrongPayloads[1].description;
                    delete wrongPayloads[2].imageURL;

                    // Creation of an array of promise
                    // Try to completely update badge with each wrong payload
                    var promises = wrongPayloads.map(p => (badges.updateCompletelyBadge(id, p)));

                    // When all requests have provided a response
                    return Promise.all(promises)
                        .then(function (responses) {

                            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
                            responses.forEach(r => (r.status.should.equal(422)));

                        });

                });

        });

}

// Failure
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
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
                    var id = badge.badgeId;

                    // Update completely an existing badge with wrong payloads
                    // Generation of a new badge as payload
                    var payload = badges.generateBadge();
                    // Creation of a string with the payload
                    var original = JSON.stringify(payload);

                    // Creation of wrong payloads
                    // Each wrong payload have one mandatory field that contains only two spaces
                    var wrongPayloads = [];
                    for (var i = 0; i < 3; ++i) {
                        wrongPayloads.push(JSON.parse(original));
                    }
                    wrongPayloads[0].name = "  ";
                    wrongPayloads[1].description = "  ";
                    wrongPayloads[2].imageURL = "  ";

                    // Creation of an array of promise
                    // Try to completely update badge with each wrong payload
                    var promises = wrongPayloads.map(p => (badges.updateCompletelyBadge(id, p)));

                    // When all requests have provided a response
                    return Promise.all(promises)
                        .then(function (responses) {

                            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
                            responses.forEach(r => (r.status.should.equal(422)));

                        });

                });

        });
}

// Failure
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfNameContainsMoreThan80Characters() {
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
                    var id = badge.badgeId;

                    // Change the length of the badge name to 81 characters
                    badge.name = chance.word({ length: 81 });

                    return badges.updateCompletelyBadge(id, badge)
                        .then(function (response) {

                            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
                            response.status.should.equal(422);

                            // Change the length of the badge name to 80 characters
                            badge.name = chance.word({ length: 80 });
                            return badges.updateCompletelyBadge(id, badge)
                                .then(function (response) {

                                    // HTTP response status should equal 204 NO CONTENT
                                    response.status.should.equal(204);

                                });

                        });

                });

        });

}

// Failure
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfDescriptionOrImageUrlContainMoreThan255Characters() {
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
                    var id = badge.badgeId;

                    // Update completely an existing badge with wrong payloads
                    // Generation of a new badge as payload
                    var payload = badges.generateBadge();
                    // Creation of a string with the payload
                    var original = JSON.stringify(payload);

                    // Creation of wrong payloads
                    // Each wrong payload have description or imageURL that contains 256 characters
                    var wrongPayloads = [];
                    for (var i = 0; i < 2; ++i) {
                        wrongPayloads.push(JSON.parse(original));
                    }
                    wrongPayloads[0].description = chance.word({ length: 256 });
                    wrongPayloads[1].imageURL = chance.word({ length: 256 });

                    // Creation of an array of promise
                    // Try to completely update badge with each wrong payload
                    var promises = wrongPayloads.map(p => (badges.updateCompletelyBadge(id, p)));

                    // When all requests have provided a response
                    return Promise.all(promises)
                        .then(function (responses) {

                            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
                            responses.forEach(r => (r.status.should.equal(422)));

                            // Creation of correct payloads
                            // Each correct payload have description or imageURL that contains 255 characters
                            for (var i = 0; i < 2; ++i) {
                                wrongPayloads.push(JSON.parse(original));
                            }
                            wrongPayloads[0].description = chance.word({ length: 255 });
                            wrongPayloads[1].imageURL = chance.word({ legth: 255 });

                            // Creation of an array of promise
                            // Try to completely update badge with each correct payload
                            var promises = wrongPayloads.map(p => (badges.updateCompletelyBadge(id, p)));

                            // When all requests have provided a response
                            return Promise.all(promises)
                                .then(function (responses) {

                                    // Each HTTP responses status should equal 204 NO CONTENT
                                    responses.forEach(r => (r.status.should.equal(204)));

                                });


                        });

                });

        });
}

// Failure
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfBadgeIdProvidedDoesNotExist() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Update a badge that doesn't exist
    return badges.updateCompletelyBadge(0, badge)
        .then(function (response) {

            // HTTP response status should equal 404 NOT FOUND
            response.status.should.equal(404);

        });

}

// Failure
// Delete
function itShouldRefuseAnUnauthenticatedUserToDeleteAnExistingBadgeIfBadgeIdProvidedDoesNotExist() {
    // Delete a badge that doesn't exist
    return badges.deleteBadge(0)
        .then(function (response) {

            // HTTP response status should equal 404 NOT FOUND
            response.status.should.equal(404);

        });
}