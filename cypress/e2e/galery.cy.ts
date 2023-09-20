import { PHOTOS_URL } from "../../src/lib/const";

const setViewport = {
  iphone12() {},
};

describe("happy path", () => {
  describe("iphone 8", () => {
    it("displays 10 photos", () => {
      cy.viewport("iphone-8");
      cy.intercept(PHOTOS_URL, { fixture: "photos.json" }).as("getPhotos");
      cy.intercept("https://via.placeholder.com/150/*", {
        fixture: "thumb-150x150.png,null",
      }).as("photoRequest");

      cy.visit("/");
      cy.findAllByRole("img").should("have.length", 10);
    });
  });
  describe("iphone 12", () => {
    it.only("displays 10 photos", () => {
      cy.viewport("macbook-16");
      cy.intercept(PHOTOS_URL, { fixture: "photos.json" }).as("getPhotos");
      cy.intercept("https://via.placeholder.com/150/*", {
        fixture: "thumb-150x150.png,null",
      }).as("photoRequest");

      cy.visit("/");
    });
  });
});
