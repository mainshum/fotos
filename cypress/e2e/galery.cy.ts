import { FAV_ID_LOCAL_STORAGE, PHOTOS_URL } from "../../src/lib/const";

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
  it("if tail of photos list is in viewport extra 50 photos are loaded", () => {
    let idSelected;
    cy.visit("/");
    cy.findAllByRole("img").should("have.length", 50);

    cy.scrollTo("bottom");

    cy.findAllByRole("img").should("have.length", 100);
  });

  it.only("toggles favourite and saves to local storage when Star is clicked", () => {
    cy.visit("/");

    cy.findAllByTestId("fav-star").should("have.length", 50).first().click();

    cy.window().then((win) => {
      const parsed = JSON.parse(win.localStorage.getItem(FAV_ID_LOCAL_STORAGE));

      expect(Array.isArray(parsed)).to.be.true;
      expect(parsed.length).to.eq(1);
    });
  });
});
