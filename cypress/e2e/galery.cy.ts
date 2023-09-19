import { PHOTOS_URL } from "../../src/lib/const";

const setViewport = {
  iphone12() {
    cy.viewport("iphone-8");
  },
};

describe("happy path", () => {
  describe("iphone 12", () => {
    before(() => {
      setViewport.iphone12();
    });
    it("displays 3 photos", () => {
      cy.intercept(PHOTOS_URL, { fixture: "photos.json" }).as("getPhotos");
      cy.intercept("https://via.placeholder.com/150/*", {
        fixture: "thumb-150x150.png,null",
      }).as("photoRequest");

      cy.visit("/");
    });
  });
});
