var apiURL = process.env.API_URL || require('../../env.json').default.API_URL;
var chai = require("chai");
var pointScales = require("./support/pointScales.js");
var Chance = require("chance");
var chance = new Chance();

chai.should();

// API tests

// pointScale endpoint
describe("The /pointScale endpoint :", function () {

    // Success
    // GET
    it("should allow an unauthenticated user to get the list of all pointScales", itShouldAllowUnauthenticatedUserToGetTheListOfAllPointScales);

    // POST
    it("should allow an unauthenticated user to create a new pointScale", itShouldAllowUnauthenticatedUserToCreateNewPointScale);

    // PUT
    it("should allow an unauthenticated user to completely update an existing pointScale", shouldAllowUnauthenticatedUserToCompletelyUpdatePointScale);

    // Delete
    it("should allow an unauthenticated user to delete an existing pointScale", shoulAllowUnauthenticatedUserToDeletePointScale);

    // Failures
    // POST
    it("should refuse an unauthenticated user to create a new pointScale if mandatory fields are not provided", itShouldRefuseUnauthenticatedUserToCreatePointScaleIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to create a new pointScale if mandatory fields are empty or contain only spaces", itShouldRefuseUnauthenticatedUserToCreatePointScaleIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an unauthenticated user to create a new pointScale if name contains more than 80 characters", itShouldRefuseAnUnauthenticatedUserToCreatePointScaleIfNameContainsMoreThan80Characters);
    it("should refuse an unauthenticated user to create a new pointScale if description contain more than 255 characters", itShouldRefuseAnUnauthenticatedUserToCreatePointScaleIfDescriptionContainMoreThan255Characters);
    it("should refuse an unauthenticated user to create a new pointScale if coefficient is greater than 1000 or is less than 1", itShouldRefuseAnUnauthenticatedUserToCreatePointScaleIfCoefficientIsGreaterThan1000OrIsLessThan1);
    it("should refuse an unauthenticated user to create a new pointScale if the pointScale name provided already exists in this application");

    // PUT
    it("should refuse an unauthenticated user to completely update an existing pointScale if mandatory fields are not provided", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to completely update an existing pointScale if mandatory fields are empty or contain only spaces", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an unauthenticated user to completely update an existing pointScale if name contains more than 80 characters", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfNameContainsMoreThan80Characters);
    it("should refuse an unauthenticated user to completely update an existing pointScale if description contain more than 255 characters", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfDescriptionContainMoreThan255Characters);
    it("should refuse an unauthenticated user to completely update an existing pointScale if the pointScale name provided already exists");
    it("should refuse an unauthenticated user to completely update an existing pointScale if coefficient is greater than 1000 or is less than 1", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfCoefficientIsGreaterThan1000OrIsLessThan1);
    it("should refuse an unauthenticated user to completely update an existing pointScale if pointScale id provided does not exist", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfPointScaleIdProvidedDoesNotExist);

    // Delete
    it("should refuse an unauthenticated user to delete an existing pointScale if pointScale id provided does not exist", itShouldRefuseAnUnauthenticatedUserToDeleteAnExistingPointScaleIfPointScaleIdProvidedDoesNotExist);

});

// Success
// GET
function itShouldAllowUnauthenticatedUserToGetTheListOfAllPointScales() {
    return pointScales.getPointScales()
        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // HTTP response body should be an array
            response.body.should.be.an("array");

            return response;
        })
}

// Success
// POST
function itShouldAllowUnauthenticatedUserToCreateNewPointScale() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Saving of the HTTP header
            var location = response.header['location'];

            // Get all created pointScales
            return pointScales.getPointScales()
                .then(function (response) {
                    var nbPointScales = response.body.length;
                    var pointScale = response.body[nbPointScales - 1];
                    var id = pointScale.pointScaleId;

                    // HTTP Location header response should contain the URL to access the new badge created
                    location.should.equal(apiURL + '/pointScales/' + id);

                })

        })
}

// Success
// PUT
function shouldAllowUnauthenticatedUserToCompletelyUpdatePointScale() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Creation of the new pointScale
    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // Get all created pointScales
            return pointScales.getPointScales()
                .then(function (response) {
                    var nbPointScales = response.body.length;
                    var pointScale = response.body[nbPointScales - 1];
                    var id = pointScale.pointScaleId;

                    // Update completely an existing pointScale
                    return pointScales.updateCompletelyPointScale(id, pointScale)
                        .then(function (response) {

                            // HTTP response status should equal 204 NO CONTENT
                            response.status.should.equal(204);

                        });

                });

        });

}

// Success
// DELETE
function shoulAllowUnauthenticatedUserToDeletePointScale() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Creation of the new pointScale
    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // Get all created pointScales
            return pointScales.getPointScales()
                .then(function (response) {
                    var nbPointScales = response.body.length;
                    var pointScale = response.body[nbPointScales - 1];
                    var id = pointScale.pointScaleId;

                    // Delete an existing pointScale
                    return pointScales.deletePointScale(id)
                        .then(function (response) {

                            // HTTP response status should equal 204 NO CONTENT
                            response.status.should.equal(204);

                        });

                });

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreatePointScaleIfMandatoryFieldsAreNotProvided() {
    // Generation of a new pointScale as payload
    var payload = pointScales.generatePointScale();
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
    delete wrongPayloads[2].coefficient;

    // Creation of an array of promise
    // Try to create new pointScale with each wrong payload
    var promises = wrongPayloads.map(p => (pointScales.createPointScale(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreatePointScaleIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
    // Generation of a new pointScale as payload
    var payload = pointScales.generatePointScale();
    // Creation of a string with the payload
    var original = JSON.stringify(payload);

    // Creation of wrong payloads
    // Each wrong payload have one mandatory field that contains only two spaces
    var wrongPayloads = [];
    for (var i = 0; i < 2; ++i) {
        wrongPayloads.push(JSON.parse(original));
    }
    wrongPayloads[0].name = "  ";
    wrongPayloads[1].description = "  ";

    // Creation of an array of promise
    // Try to create new pointScale with each wrong payload
    var promises = wrongPayloads.map(p => (pointScales.createPointScale(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });
}

// Failure
// POST
function itShouldRefuseAnUnauthenticatedUserToCreatePointScaleIfNameContainsMoreThan80Characters() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Change the length of the pointScale name to 81 characters
    pointScale.name = chance.word({ length: 81 });

    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the pointScale name to 80 characters
            pointScale.name = chance.word({ length: 80 });

            return pointScales.createPointScale(pointScale)
                .then(function (response) {

                    // HTTP response status should equal 201 CREATED
                    response.status.should.equal(201);

                });

        });

}

// Failure
// POST
function itShouldRefuseAnUnauthenticatedUserToCreatePointScaleIfDescriptionContainMoreThan255Characters() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Change the length of the pointScale description to 256 characters
    pointScale.description = chance.word({ length: 256 });

    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the pointScale name to 255 characters
            pointScale.description = chance.word({ length: 255 });

            return pointScales.createPointScale(pointScale)
                .then(function (response) {

                    // HTTP response status should equal 201 CREATED
                    response.status.should.equal(201);

                });

        });

}

// Falure
// POST
function itShouldRefuseAnUnauthenticatedUserToCreatePointScaleIfCoefficientIsGreaterThan1000OrIsLessThan1() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Change the value of the coefficient to 1001
    pointScale.coefficient = 1001;

    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the value of the coefficient to 1000
            pointScale.coefficient = 1000;

            return pointScales.createPointScale(pointScale)
                .then(function (response) {

                    // HTTP response status should equal 201 CREATED
                    response.status.should.equal(201);

                    // Change the value of the coefficient to 0
                    pointScale.coefficient = 0;

                    return pointScales.createPointScale(pointScale)
                        .then(function (response) {

                            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
                            response.status.should.equal(422);

                        });

                });

        });
}

/*
// Failure
// POST
function itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfTheBadgeNameProvidedAlreadyExistsInThisApplication() {
    // Generation of a new badge
    var badge = badges.generateBadge();

    // Creation of the badge
    return badges.createBadge(badge)
        .then(function (response) {

            // Creation of the same badge
            return badges.createBadge(badge)
                .then(function (response) {

                    // HTTP response status should equal 422 UNPROCESSABLE ENTITY
                    response.status.should.equal(422);
                });

        });

}
*/

// Failure 
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfMandatoryFieldsAreNotProvided() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Creation of the new pointScale
    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // Get all created pointScale
            return pointScales.getPointScales()
                .then(function (response) {
                    var nbPointScales = response.body.length;
                    var pointScale = response.body[nbPointScales - 1];
                    var id = pointScale.pointScaleId;

                    // Update completely an existing pointScale with wrong payloads
                    // Generation of a new pointScale as payload
                    var payload = pointScales.generatePointScale();
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
                    delete wrongPayloads[2].coefficient;

                    // Creation of an array of promise
                    // Try to completely update pointScale with each wrong payload
                    var promises = wrongPayloads.map(p => (pointScales.updateCompletelyPointScale(id, p)));

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
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Creation of the new pointScale
    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // Get all created pointScales
            return pointScales.getPointScales()
                .then(function (response) {
                    var nbPointScales = response.body.length;
                    var pointScale = response.body[nbPointScales - 1];
                    var id = pointScale.pointScaleId;

                    // Update completely an existing pointScale with wrong payloads
                    // Generation of a new pointScale as payload
                    var payload = pointScales.generatePointScale();
                    // Creation of a string with the payload
                    var original = JSON.stringify(payload);

                    // Creation of wrong payloads
                    // Each wrong payload have one mandatory field that contains only two spaces
                    var wrongPayloads = [];
                    for (var i = 0; i < 2; ++i) {
                        wrongPayloads.push(JSON.parse(original));
                    }
                    wrongPayloads[0].name = "  ";
                    wrongPayloads[1].description = "  ";

                    // Creation of an array of promise
                    // Try to completely update pointScale with each wrong payload
                    var promises = wrongPayloads.map(p => (pointScales.updateCompletelyPointScale(id, p)));

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
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfNameContainsMoreThan80Characters() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Creation of the new pointScale
    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // Get all created pointScales
            return pointScales.getPointScales()
                .then(function (response) {
                    var nbPointScales = response.body.length;
                    var pointScale = response.body[nbPointScales - 1];
                    var id = pointScale.pointScaleId;

                    // Change the length of the pointScale name to 81 characters
                    pointScale.name = chance.word({ length: 81 });

                    return pointScales.updateCompletelyPointScale(id, pointScale)
                        .then(function (response) {

                            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
                            response.status.should.equal(422);

                            // Change the length of the pointScale name to 80 characters
                            pointScale.name = chance.word({ length: 80 });
                            return pointScales.updateCompletelyPointScale(id, pointScale)
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
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfDescriptionContainMoreThan255Characters() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Creation of the new pointScale
    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // Get all created pointScales
            return pointScales.getPointScales()
                .then(function (response) {
                    var nbPointScales = response.body.length;
                    var pointScale = response.body[nbPointScales - 1];
                    var id = pointScale.pointScaleId;

                    // Change the length of the description to 256 characters
                    pointScale.description = chance.word({ length: 256 });

                    // Try to update pointScale with wrong payload
                    return pointScales.updateCompletelyPointScale(id, pointScale)
                        .then(function (response) {

                            // HTTP responses status should equal 422 UNPROCESSABLE ENTITY
                            response.status.should.equal(422);

                            // Change the length of the description to 255 characters
                            pointScale.description = chance.word({ length: 255 });

                            // Update pointScale with correct payload
                            return pointScales.updateCompletelyPointScale(id, pointScale)
                                .then(function (response) {

                                    // Each HTTP responses status should equal 204 NO CONTENT
                                    response.status.should.equal(204);

                                });

                        });

                });

        });
}

// Failure 
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfCoefficientIsGreaterThan1000OrIsLessThan1() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Creation of the new pointScale
    return pointScales.createPointScale(pointScale)
        .then(function (response) {

            // Get all created pointScales
            return pointScales.getPointScales()
                .then(function (response) {
                    var nbPointScales = response.body.length;
                    var pointScale = response.body[nbPointScales - 1];
                    var id = pointScale.pointScaleId;

                    // Change the value of the coefficient to 1001
                    pointScale.coefficient = 1001;

                    return pointScales.updateCompletelyPointScale(id, pointScale)
                        .then(function (response) {

                            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
                            response.status.should.equal(422);

                            // Change the value of the coefficient to 1000
                            pointScale.coefficient = 1000;

                            return pointScales.updateCompletelyPointScale(id, pointScale)
                                .then(function (response) {

                                    // HTTP response status should equal 204 NO CONTENT
                                    response.status.should.equal(204);

                                    // Change the value of the coefficient to 0
                                    pointScale.coefficient = 0;

                                    return pointScales.updateCompletelyPointScale(id, pointScale)
                                        .then(function (response) {

                                            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
                                            response.status.should.equal(422);

                                        });

                                });

                        });

                });

        });

}

// Failure
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingPointScaleIfPointScaleIdProvidedDoesNotExist() {
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Update a pointScale that doesn't exist
    return pointScales.updateCompletelyPointScale(0, pointScale)
        .then(function (response) {

            // HTTP response status should equal 404 NOT FOUND
            response.status.should.equal(404);

        });

}

// Failure
// Delete
function itShouldRefuseAnUnauthenticatedUserToDeleteAnExistingPointScaleIfPointScaleIdProvidedDoesNotExist() {
    // Delete a pointScale that doesn't exist
    return pointScales.deletePointScale(0)
        .then(function (response) {

            // HTTP response status should equal 404 NOT FOUND
            response.status.should.equal(404);

        });
}