/// <reference types="cypress" />

describe("Smoke Tests - Study Plan Generation", () => {
    const apiUrl = Cypress.env("apiUrl");
    const endpoint = `${apiUrl}/api/v1/assistant/study-plan`;

    describe("Invalid Requests", () => {
        it("should return 400 for missing topics", () => {
            cy.request({
                method: "POST",
                url: endpoint,
                body: {
                    weeks: 4,
                    weeklyDedication: 10,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property("error");
                expect(response.body.error).to.include("Invalid topics");
            });
        });

        it("should return 400 for invalid weeks (zero)", () => {
            cy.request({
                method: "POST",
                url: endpoint,
                body: {
                    topics: ["Math", "Physics"],
                    weeks: 0,
                    weeklyDedication: 10,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property("error");
                expect(response.body.error).to.include(
                    "Weeks must be a positive number"
                );
            });
        });

        it("should return 400 for invalid weeklyDedication (negative)", () => {
            cy.request({
                method: "POST",
                url: endpoint,
                body: {
                    topics: ["Math", "Physics"],
                    weeks: 4,
                    weeklyDedication: -5,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property("error");
                expect(response.body.error).to.include(
                    "Weekly dedication must be a positive number"
                );
            });
        });

        it("should return 400 for invalid startDate", () => {
            cy.request({
                method: "POST",
                url: endpoint,
                body: {
                    topics: ["Math", "Physics"],
                    weeks: 4,
                    weeklyDedication: 10,
                    startDate: "invalid-date",
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property("error");
                expect(response.body.error).to.include("Invalid start date");
            });
        });
    });

    describe("Valid Requests", () => {
        const validRequest = {
            topics: ["Algebra", "Calculus", "Geometry", "Trigonometry"],
            weeks: 4,
            weeklyDedication: 10,
        };

        it("should return 200 for valid request", () => {
            cy.request("POST", endpoint, validRequest).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.headers["content-type"]).to.include(
                    "application/json"
                );
            });
        });

        it("should return plan with correct structure", () => {
            cy.request("POST", endpoint, validRequest).then((response) => {
                expect(response.body).to.have.property("weeks");
                expect(response.body).to.have.property("metadata");
                expect(response.body.metadata).to.have.property(
                    "origin"
                );
                expect(response.body.metadata).to.have.property("generatedAt");
                expect(new Date(response.body.metadata.generatedAt)).to.be.a(
                    "date"
                );
            });
        });

        it("should return correct number of weeks", () => {
            cy.request("POST", endpoint, validRequest).then((response) => {
                expect(response.body.weeks).to.have.length(validRequest.weeks);
            });
        });

        it("should cover all topics in the plan", () => {
            cy.request("POST", endpoint, validRequest).then((response) => {
                const allTopicsInPlan = response.body.weeks.flatMap(
                    (week: any) => week.topics
                );
                validRequest.topics.forEach((topic: string) => {
                    expect(allTopicsInPlan).to.include(topic);
                });
            });
        });

        it("should have activities and valid estimated hours for each week", () => {
            cy.request("POST", endpoint, validRequest).then((response) => {
                response.body.weeks.forEach((week: any) => {
                    expect(week.activities).to.be.an("array").and.not.be.empty;
                    expect(week.estimatedHours)
                        .to.be.a("number")
                        .and.be.greaterThan(0);
                    expect(week.estimatedHours).to.be.at.most(
                        validRequest.weeklyDedication
                    );
                });
            });
        });
    });
});
