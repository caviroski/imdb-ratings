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

    it("should select from first dropdown and second should have one less date available", () => {
        cy.intercept("GET", "http://localhost:8080/api/imdb-ratings/file-names").as("getFileNames");
        cy.visit("/compare");
        cy.wait("@getFileNames").its("response.statusCode").should("eq", 200);

        cy.get('[data-testid="select-from-date"]').find('div').click();
        cy.get('li').first().click();

        cy.get('[data-testid="select-to-date"]').find('div').click();
        cy.get('li').should('have.length', 10);
    });

    it("should select from second dropdown and there is data in the table", () => {
        cy.intercept("GET", "http://localhost:8080/api/imdb-ratings/file-names").as("getFileNames");
        cy.visit("/compare");
        cy.wait("@getFileNames").its("response.statusCode").should("eq", 200);

        cy.get('[data-testid="select-from-date"]').find('div').click();
        cy.get('li').first().click();

        cy.get('[data-testid="select-to-date"]').find('div').click();
        cy.get('li').first().click();

        cy.get('[data-id="1"]').should('exist');
        cy.get('[data-id="1"]').contains("2025-05-07");
        cy.get('[data-id="1"]').contains("376");
        cy.get('[data-id="1"]').contains("382");
        cy.get('[data-id="2"]').should('exist');
        cy.get('[data-id="2"]').contains("2025-05-03");
        cy.get('[data-id="2"]').contains("1208");
        cy.get('[data-id="2"]').contains("1221");
        cy.get('[data-id="3"]').should('exist');
        cy.get('[data-id="3"]').contains("2025-04-29");
        cy.get('[data-id="3"]').contains("46");
        cy.get('[data-id="3"]').contains("49");
    });
});
