import { FAV_ID_LOCAL_STORAGE, PHOTOS_URL } from "../../src/lib/const";

describe("happy path", () => {
  beforeEach(() => {
    cy.viewport("macbook-16");
  });
  it("renders one image", () => {
    cy.visit("/photos/1");
    cy.findAllByRole("img").should("exist");
  });
  it("should go to / upon click on Go to galery", () => {
    cy.visit("/photos/1");
    cy.findByText("Go to galery").click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  });
});
