describe("Compare Dates", () => {
    it("should load and show the heading", () => {
        cy.intercept("GET", "http://localhost:8080/api/imdb-ratings/file-names").as("getFileNames");
        cy.visit("/compare");
        cy.wait("@getFileNames").its("response.statusCode").should("eq", 200);

        cy.contains("p", "It will compare the number of votes for the entries.");
    });

    it("should show two date dropdowns", () => {
        cy.intercept("GET", "http://localhost:8080/api/imdb-ratings/file-names").as("getFileNames");
        cy.visit("/compare");
        cy.wait("@getFileNames").its("response.statusCode").should("eq", 200);

        cy.get('[data-testid="select-from-date"]').should('exist');
        cy.get('[data-testid="select-to-date"]').should('exist');
    });

    it("should load all available dates", () => {
        cy.intercept("GET", "http://localhost:8080/api/imdb-ratings/file-names").as("getFileNames");
        cy.visit("/compare");
        cy.wait("@getFileNames").its("response.statusCode").should("eq", 200);

        cy.get('[data-testid="select-from-date"]').find('div').click();
        cy.get('li').should('have.length', 11);
    });

    it("should load all dates from second dropdown", () => {
        cy.intercept("GET", "http://localhost:8080/api/imdb-ratings/file-names").as("getFileNames");
        cy.visit("/compare");
        cy.wait("@getFileNames").its("response.statusCode").should("eq", 200);

        cy.get('[data-testid="select-to-date"]').find('div').click();
        cy.get('li').should('have.length', 11);
    });
});
