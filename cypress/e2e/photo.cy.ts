import { PHOTOS_URL } from "../../src/lib/const";
import { devices } from "../utils";

devices.map((d) => {
  describe("error path", () => {
    it("should display error if req to PHOTOS_URL/photoId fails", () => {
      cy.intercept(`${PHOTOS_URL}/1`, { statusCode: 500 });

      cy.visit("/photos/1");

      cy.findByText("Unexpected error occured").should("exist");
    });
  });
  describe("happy path", () => {
    beforeEach(() => {
      cy.viewport(d);
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
});
