import { FAV_ID_LOCAL_STORAGE, PHOTOS_URL } from "../../src/lib/const";
import { devices } from "../utils";

devices.map((device) => {
  describe("unhappy path", () => {
    it("should display error if req to PHOTOS_URL fails", () => {
      cy.intercept(PHOTOS_URL, { statusCode: 500 });

      cy.visit("/");

      cy.findByText("Unexpected error occured").should("exist");
    });
  });
  describe("happy path", () => {
    beforeEach(() => {
      cy.viewport(device);
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
        // normally would go for cypress-pipe to avoid explicit timeeouts
        .wait(1000)
        .click()
        .then(() => cy.url().should("contain", `photos/${idSelected}`));
    });
    it("if tail of photos list is in viewport extra 50 photos are loaded", () => {
      let idSelected;
      cy.visit("/");
      cy.findAllByRole("img").should("have.length", 50);

      cy.wait(1000);
      cy.scrollTo("bottom");

      cy.findAllByRole("img").should("have.length", 100);
    });

    it("toggles favourite and saves to local storage when Star is clicked", () => {
      cy.visit("/");

      cy.findAllByTestId("fav-star").should("have.length", 50).first().click();

      cy.window().then((win) => {
        const parsed = JSON.parse(
          win.localStorage.getItem(FAV_ID_LOCAL_STORAGE)
        );

        expect(Array.isArray(parsed)).to.be.true;
        expect(parsed.length).to.eq(1);
      });
    });
  });
});
