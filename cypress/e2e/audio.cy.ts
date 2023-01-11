describe("Audio Player", () => {
  it("plays audio", () => {
    cy.visit("/");
    cy.get(".track:first").click();
    cy.get("#play-button").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);

    cy.get("#player-play").click();
  });
});
