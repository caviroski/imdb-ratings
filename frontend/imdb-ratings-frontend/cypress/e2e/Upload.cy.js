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

  it("shows error on invalid file upload extension", () => {
    cy.visit("/");
    cy.get("button").contains("Upload").click();
    cy.get('[data-testid="file-input"]').selectFile('cypress/fixtures/invalid-file.txt', { force: true });
    cy.contains("Please upload a valid CSV file.");
  });

  it("shows error on invalid file upload date format", () => {
    cy.visit("/");
    cy.get("button").contains("Upload").click();
    cy.get('[data-testid="file-input"]').selectFile('cypress/fixtures/15.15.2025.csv', { force: true });
    cy.contains("Please upload file with valid date format dd.mm.yyyy.");
  });

  it("shows success message on valid file upload", () => {
    cy.intercept("POST", "http://localhost:8080/api/imdb-ratings/upload").as("fileUpload");
    cy.visit("/");
    cy.get("button").contains("Upload").click();
    cy.get('[data-testid="file-input"]').selectFile('cypress/fixtures/09.10.2025.csv', { force: true });
    cy.wait("@fileUpload").its("response.statusCode").should("eq", 200);
    cy.contains("Upload successful!");
  });

  it("shows error message on failed file upload", () => {
    cy.intercept("POST", "http://localhost:8080/api/imdb-ratings/upload", {
      statusCode: 500,
      body: {},
    }).as("fileUploadFail");
    cy.visit("/");
    cy.get("button").contains("Upload").click();
    cy.get('[data-testid="file-input"]').selectFile('cypress/fixtures/09.10.2025.csv', { force: true });
    cy.wait("@fileUploadFail").its("response.statusCode").should("eq", 500);
    cy.contains("Upload failed.");
  });

  it("click on fill missng countries button", () => {
    cy.intercept("POST", "http://localhost:8080/api/imdb-ratings/fill-missing-countries", {
      statusCode: 200,
      body: {},
    }).as("fillMissingCountries");
    cy.visit("/");
    cy.get("button").contains("Fill Missing Countries").click();
    cy.wait("@fillMissingCountries").its("response.statusCode").should("eq", 200);
    cy.contains("Missing countries filled successfully.");
  });

  it("shows error message on failed fill missing countries", () => {
    cy.intercept("POST", "http://localhost:8080/api/imdb-ratings/fill-missing-countries", {
      statusCode: 500,
      body: {},
    }).as("fillMissingCountriesFail");
    cy.visit("/");
    cy.get("button").contains("Fill Missing Countries").click();
    cy.wait("@fillMissingCountriesFail").its("response.statusCode").should("eq", 500);
    cy.contains("Failed to fill missing countries - Request failed with status code 500");
  });

  it("navigates to Compare Dates page", () => {
    cy.visit("/");
    cy.get("a").contains("Compare Dates").click();
    cy.url().should("include", "/compare");
    cy.contains("It will compare the number of votes for the entries.");
  });

  it("ul list should have 7 li elements", () => {
    cy.visit("/");
    cy.get("ul").find("li").should("have.length", 7);
  });

  it("click on delete date should work", () => {
    cy.intercept("DELETE", "http://localhost:8080/api/imdb-ratings/delete-by-file/25.09.2025", {
      statusCode: 200,
      body: "Cleaned file data from 20 entries for file: 25.09.2025",
      headers: { "Content-Type": "text/plain" }
    }).as("deleteDate");
    cy.visit("/");
    cy.get('[data-testid="delete-button-25.09.2025"]').click();
    cy.get("button").contains("Agree").click();
    cy.wait("@deleteDate").its("response.statusCode").should("eq", 200);
    cy.contains("Cleaned file data from");
  });
});
