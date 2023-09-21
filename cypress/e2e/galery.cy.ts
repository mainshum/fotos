import { PHOTOS_URL } from "../../src/lib/const";

describe("happy path", () => {
  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.intercept(PHOTOS_URL, { fixture: "photos.json" }).as("getPhotos");
    cy.intercept("https://via.placeholder.com/150/*", {
      fixture: "thumb-150x150.png,null",
    });
  });
  it("show 50 photos initially", () => {
    cy.visit("/");
    cy.findAllByRole("img").should("have.length", 50);
  });
  it("click on photo with id X goes to /photo/X", () => {
    let idSelected;
    cy.visit("/");
    cy.findAllByRole("listitem")
      .first()
      .then(($el) => {
        const id = $el.data("photo-id");
        expect(id).to.exist;

        idSelected = id;
      })
      .click()
      .then(() => cy.url().should("contain", `photos/${idSelected}`));
  });
  it.only("if tail of photos list is in viewport extra 50 photos are loaded", () => {
    let idSelected;
    cy.visit("/");
    cy.findAllByRole("img").should("have.length", 50);

    cy.scrollTo("bottom");

    cy.findAllByRole("img").should("have.length", 100);
  });
});
