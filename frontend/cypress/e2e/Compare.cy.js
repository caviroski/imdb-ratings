describe("Compare Dates", () => {
    if("should load and show the heading", () => {
        cy.visit("/compare");
        cy.contains("h1", "Compare Dates");
    });
});