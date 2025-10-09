describe("Home page", () => {
  it("should load and show the heading", () => {
    cy.visit("/");
    cy.contains("a", "Upload File");
    cy.contains("a", "Compare Dates");
    cy.contains("a", "Year Watch");
    cy.contains("a", "Statistics");
    cy.contains("a", "All Data");
    cy.contains("a", "World Map");
  });

  it("can click a button", () => {
    cy.intercept("GET", "/api/imdb-ratings/file-names").as("getFileNames");

    cy.visit("/");
    cy.get("button").contains("Upload").click();
    
    cy.wait("@getFileNames").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="file-input"]').selectFile('cypress/fixtures/09.10.2025.csv', { force: true });

    cy.get('input[type="file"]').then(($input) => {
      const files = $input[0].files;
      expect(files[0].name).to.equal('09.10.2025.csv');
    });
  });
});
