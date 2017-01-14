var env = require('../../env.json');
var applications = require("./support/applications.js");
var authentications = require("./support/authentications.js");
var emptyTables = require("../database/emptyTables.js");
var chai = require("chai");
var Chance = require("chance");
var jwt = require('jsonwebtoken');
var chance = new Chance();
chai.should();

// Server signature key for authentication token
const KEY = process.env.SIGNATURE_KEY_FOR_JWT || env.default.SIGNATURE_KEY_FOR_JWT;
// Bearer pattern
const BEARER = "Bearer ";

// Empty the database tables
emptyTables.emptyTables();

// API tests
// An unauthenticated user is a user that doesn't send an authentication token in the Authorization header
// An authenticated user is a user that send an authentication token in the Authorization header

// applications endpoint
describe("The /applications endpoint :", function () {

    // Success
    // GET
    it("should allow an authenticated user to get the current application", itShouldAllowAuthenticatedUserToGetTheCurrentApplication);

    // POST
    it("should allow an unauthenticated user to create a new application", itShouldAllowUnauthenticatedUserToCreateApplication);

    // PUT
    it("should allow an authenticated user to completely update his application", itShouldAllowAuthenticatedUserToCompletelyUpdateHisApplication);

    // Delete 
    it("should allow an authenticated user to delete his application", itShouldAllowAuthenticatedUserToDeleteHisApplication);

    // Failures
    // POST
    it("should refuse an unauthenticated user to create a new application if mandatory fields are not provided", itShouldRefuseUnauthenticatedUserToCreateApplicationIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to create a new application if mandatory fields are empty or contain only spaces", itShouldRefuseUnauthenticatedUserToCreateApplicationIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an unauthenticated user to create a new application if name or password contain more than 80 characters", itShouldRefuseUnauthenticatedUserToCreateApplicationIfNameOrPasswordContainMoreThan80Characters);
    it("should refuse an unauthenticated user to create a new application if description contains more than 255 characters", itShouldRefuseUnauthenticatedUserToCreateApplicationIfDescriptionContainsMoreThan255Characters);
    it("should refuse an unauthenticated user to create a new application if password contains less than 7 characters", itShouldRefuseUnauthenticatedUserToCreateApplicationIfPasswordContainsLessThan7Characters);
    it("should refuse an unauthenticated user to create a new application if name provided already exists", itShouldRefuseUnauthenticatedUserToCreateApplicationIfNameProvidedAlreadyExists);

    // PUT
    it("should refuse an unauthenticated user to completely update his application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthorizationHeaderIsNotProvided);
    it("should refuse an unauthenticated user to completely update his application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthenticationTokenIsEmpty);
    it("should refuse an unauthenticated user to completely update his application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
    it("should refuse an unauthenticated user to completely update his application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
    it("should refuse an unauthenticated user to completely update his application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthenticationTokenIsExpired);
    it("should refuse an authenticated user to completely update his application if mandatory fields are not provided", itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfMandatoryFieldsAreNotProvided);
    it("should refuse an authenticated user to completely update his application if mandatory fields are empty or contain only spaces", itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an authenticated user to completely update his application if name or password contain more than 80 characters", itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfNameOrPasswordContainMoreThan80Characters);
    it("should refuse an authenticated user to completely update his application if description contains more than 255 characters", itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfDescriptionContainsMoreThan255Characters);
    it("should refuse an authenticated user to completely update his application if password contains less than 7 characters", itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfPasswordContainsLessThan7Characters);
    it("should refuse an authenticated user to completely update his application if the name provided already exists", itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfTheNameProvidedAlreadyExists);

    // Delete
    it("should refuse an unauthenticated user to delete his application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthorizationHeaderIsNotProvided);
    it("should refuse an unauthenticated user to delete his application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthenticationTokenIsEmpty);
    it("should refuse an unauthenticated user to delete his application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
    it("should refuse an unauthenticated user to delete his application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
    it("should refuse an unauthenticated user to delete his application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthenticationTokenIsExpired);
    it("should refuse an authenticated user to delete an application that doesn't exist", itShouldRefuseAuthenticatedUserToDeleteApplicationThatDoesNotExist);

});

// Success
// GET
function itShouldAllowAuthenticatedUserToGetTheCurrentApplication() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Get the current application
            return applications.getApplication(authenticationToken);
        })
        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // HTTP response body should be an object
            response.body.should.be.an("object");

            // Object response should contain these keys
            response.body.should.include.all.keys("applicationId", "name", "description");

            // applicationId should be a positive number
            response.body.applicationId.should.be.a("number");
            response.body.applicationId.should.be.above(0);

            // Object response should contain these values
            response.body.should.have.deep.property("name", APPLICATION.name);
            response.body.should.have.deep.property("description", APPLICATION.description);

        });
}

// Success
// POST
function itShouldAllowUnauthenticatedUserToCreateApplication() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Creation of the application
    return applications.createApplication(APPLICATION)
        .then(function (response) {
            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);
        })
}

// Success
// PUT
function itShouldAllowAuthenticatedUserToCompletelyUpdateHisApplication() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // New application values (after update)
    const APPLICATION_UPDATED = applications.generateApplication();

    // Authentication token for the new application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Update the application
            return applications.updateCompletelyApplication(authenticationToken, APPLICATION_UPDATED);

        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

            // The current application should have the updated values
            return applications.getApplication(authenticationToken);

        })

        .then(function (response) {

            // Name & description should be equal to the updated values
            response.body.name.should.be.equal(APPLICATION_UPDATED.name);
            response.body.description.should.be.equal(APPLICATION_UPDATED.description);

            // Authentication shouldn't work with the old credentials
            return authentications.createAuthentication(
                {
                    name: APPLICATION.name,
                    password: APPLICATION.password
                }
            );

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Authentication should work with the updated credentials
            return authentications.createAuthentication(
                {
                    name: APPLICATION_UPDATED.name,
                    password: APPLICATION_UPDATED.password
                }
            );

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

        });

}

// Success
// DELETE
function itShouldAllowAuthenticatedUserToDeleteHisApplication() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();

    // Authentication token for the new application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Delete the application
            return applications.deleteApplication(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

            // It shouldn't be possible to authenticate the deleted application
            return authentications.createAuthentication(
                {
                    name: APPLICATION.name,
                    password: APPLICATION.password
                }
            );

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // The application should be deleted
            // But authentication token is still valid
            return applications.getApplication(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 410 GONE
            response.status.should.equal(410);

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateApplicationIfMandatoryFieldsAreNotProvided() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Creation of a string with the application
    var original = JSON.stringify(APPLICATION);

    // Creation of wrong payloads
    // Each wrong payload have one mandatory field deleted
    var wrongPayloads = [];
    for (var i = 0; i < 3; ++i) {
        wrongPayloads.push(JSON.parse(original));
    }
    delete wrongPayloads[0].name;
    delete wrongPayloads[1].description;
    delete wrongPayloads[2].password;

    // Creation of an array of promise
    // Try to create new application with each wrong payload
    var promises = wrongPayloads.map(p => (applications.createApplication(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateApplicationIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Creation of a string with the payload
    var original = JSON.stringify(APPLICATION);

    // Creation of wrong payloads
    // Each wrong payload have one mandatory field that contains only two spaces
    var wrongPayloads = [];
    for (var i = 0; i < 3; ++i) {
        wrongPayloads.push(JSON.parse(original));
    }
    wrongPayloads[0].name = "  ";
    wrongPayloads[1].description = "  ";
    wrongPayloads[2].password = "  ";

    // Creation of an array of promise
    // Try to create new badge with each wrong payload
    var promises = wrongPayloads.map(p => (applications.createApplication(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateApplicationIfNameOrPasswordContainMoreThan80Characters() {
    // Generation of a new application
    var application = applications.generateApplication();

    // Change the length of the registration name to 81 characters
    application.name = chance.word({ length: 81 });

    // Try to create the application
    return applications.createApplication(application)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the application name to 80 characters
            application.name = chance.word({ length: 80 });

            // Create the application
            return applications.createApplication(application);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Change the length of the application password to 81 characters
            application.password = chance.word({ length: 81 });

            // We need to change the name too because it already exists now
            application.name = chance.word();

            // Try to create the application
            return applications.createApplication(application);

        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the application password to 80 characters
            application.password = chance.word({ length: 80 });

            // Create the application
            return applications.createApplication(application);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateApplicationIfDescriptionContainsMoreThan255Characters() {
    // Generation of a new application
    var application = applications.generateApplication();

    // Change the length of the application description to 256 characters
    application.description = chance.word({ length: 256 });

    return applications.createApplication(application)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the application description to 255 characters
            application.description = chance.word({ length: 255 });

            // Create the application
            return applications.createApplication(application);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

        });

}

// Failure 
// POST
function itShouldRefuseUnauthenticatedUserToCreateApplicationIfPasswordContainsLessThan7Characters() {
    // Generation of a new application
    var application = applications.generateApplication();

    // Change the length of the application password to 6 characters
    application.password = chance.word({ length: 6 });

    // Try to create the application
    return applications.createApplication(application)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the application password to 7 characters
            application.password = chance.word({ length: 7 });

            // Create the application
            return applications.createApplication(application);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateApplicationIfNameProvidedAlreadyExists() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();

    // Creation of the new application
    return applications.createApplication(APPLICATION)
        .then(function (response) {

            // Recreation of the same application 
            return applications.createApplication(APPLICATION);
        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

        });

}

// Failure
// PUT
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();

    // Creation of the new application
    return applications.createApplication(APPLICATION)
        .then(function (response) {

            // Try to update application without to provide Authorization header 
            return applications.updateCompletelyApplicationWithoutAuthorizationHeader(APPLICATION);

        })

        .then(function (response) {

            // HTTP response status should be 400 BAD REQUEST
            response.status.should.equal(400);

        });
}

// Failure
// PUT
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();

    // Creation of the new application
    return applications.createApplication(APPLICATION)
        .then(function (response) {

            // Creation of a malformed authentication token
            authenticationToken = "";

            // Try to update application
            return applications.updateCompletelyApplication(authenticationToken, APPLICATION);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

        })

}

// Failure
// PUT
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken += response;

            // Try to update application
            return applications.updateCompletelyApplication(authenticationToken, APPLICATION);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

        })

}

// Failure
// PUT
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
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

            // Try to update application
            return applications.updateCompletelyApplication(authenticationToken, APPLICATION);

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

            // Update application
            return applications.updateCompletelyApplication(authenticationToken, APPLICATION);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })

}

// Failure
// PUT
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateHisApplicationIfTheAuthenticationTokenIsExpired() {
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

            // Try to update application
            return applications.updateCompletelyApplication(authenticationToken, APPLICATION);

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
            return applications.updateCompletelyApplication(authenticationToken, APPLICATION);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })
}

// Failure
// PUT
function itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfMandatoryFieldsAreNotProvided() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();

    // Authentication token for the new application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Generation of a new application as payload
            var payload = applications.generateApplication();
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
            delete wrongPayloads[2].password;

            // Creation of an array of promise
            // Try to update the application with each wrong payload
            var promises = wrongPayloads.map(p => (applications.updateCompletelyApplication(authenticationToken, p)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });
}

// Failure
// PUT
function itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();

    // Authentication token for the new application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Generation of a new application as payload
            var payload = applications.generateApplication();
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
            wrongPayloads[2].password = "  ";

            // Creation of an array of promise
            // Try to update the application with each wrong payload
            var promises = wrongPayloads.map(p => (applications.updateCompletelyApplication(authenticationToken, p)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });
}

// Failure
// PUT
function itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfNameOrPasswordContainMoreThan80Characters() {
    // Generation of a new application
    var application = applications.generateApplication();

    // Authentication token for the new application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(application)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Change the length of the application name to 81 characters
            application.name = chance.word({ length: 81 });

            // Try to update the application
            return applications.updateCompletelyApplication(authenticationToken, application);

        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the application name to 80 characters
            application.name = chance.word({ length: 80 });

            // Update the application
            return applications.updateCompletelyApplication(authenticationToken, application);

        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

            // Change the length of the application password to 81 characters
            application.password = chance.word({ length: 81 });

            // Try to update the application
            return applications.updateCompletelyApplication(authenticationToken, application);

        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE
            response.status.should.equal(422);

            // Change the length of the application password to 80 characters
            application.password = chance.word({ length: 80 });

            // Update the application
            return applications.updateCompletelyApplication(authenticationToken, application);

        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

        });

}

// Failure
// PUT
function itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfDescriptionContainsMoreThan255Characters() {
    // Generation of a new application
    var application = applications.generateApplication();

    // Authentication token for the new application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(application)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Change the length of the application description to 256 characters
            application.description = chance.word({ length: 256 });

            // Try to update the application
            return applications.updateCompletelyApplication(authenticationToken, application);

        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the application description to 255 characters
            application.description = chance.word({ length: 255 });

            // Update the application
            return applications.updateCompletelyApplication(authenticationToken, application);
        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

        });

}

// Failure
// PUT
function itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfPasswordContainsLessThan7Characters() {
    // Generation of a new application
    var application = applications.generateApplication();

    // Authentication token for the new application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(application)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Change the length of the application password to 6 characters
            application.password = chance.word({ length: 6 });

            // Try to update the application
            return applications.updateCompletelyApplication(authenticationToken, application);
        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE
            response.status.should.equal(422);

            // Change the length of the application password to 7 characters
            application.password = chance.word({ length: 7 });

            // Update the application
            return applications.updateCompletelyApplication(authenticationToken, application);
        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

        });

}

// Failure
// PUT
function itShouldRefuseAuthenticatedUserToCompletelyUpdateHisApplicationIfTheNameProvidedAlreadyExists() {
    // Generation of two new applications
    const APPLICATION_1 = applications.generateApplication();
    const APPLICATION_2 = applications.generateApplication();

    // Creation of the APPLICATION_1 and save the Authentication token for the APPLICATION_1
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION_1)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create the second application normally
            return applications.createApplication(APPLICATION_2);

        })

        .then(function (response) {

            // Try to update the APPLICATION_1 with the name of APPLICATION_2
            return applications.updateCompletelyApplication(authenticationToken, APPLICATION_2);
        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE
            response.status.should.equal(422);

        });
}

// Failure
// DELETE
function itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthorizationHeaderIsNotProvided() {

    // Try to delete an application without Authorization header
    return applications.deleteApplicationWithoutAuthorizationHeader()

        .then(function (response) {

            // HTTP response status should be 400 BAD REQUEST
            response.status.should.equal(400);

        });
}

// Failure
// DELETE
function itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthenticationTokenIsEmpty() {

    // Try to delete an application with an empty authentication token
    return applications.deleteApplication("")

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

        });

}

// Failure
// DELETE
function itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();

    // Authentication token for the new application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received without the Bearer pattern
            authenticationToken += response;

            // Try to delete the application
            return applications.deleteApplication(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure 
// DELETE
function itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
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

            // Try to delete application
            return applications.deleteApplication(authenticationToken);

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

            // Delete the application
            return applications.deleteApplication(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })
}

// Failure 
// DELETE
function itShouldRefuseUnauthenticatedUserToDeleteHisApplicationIfTheAuthenticationTokenIsExpired() {
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

            // Try to delete the application
            return applications.deleteApplication(authenticationToken);

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
            return applications.deleteApplication(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })
}

// Failure
// DELETE
function itShouldRefuseAuthenticatedUserToDeleteApplicationThatDoesNotExist() {
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

    // Try to delete an application that doesn't exist
    return applications.deleteApplication(authenticationToken)

        .then(function (response) {

            // HTTP response status should be 410 GONE
            response.status.should.equal(410);

        });
}

