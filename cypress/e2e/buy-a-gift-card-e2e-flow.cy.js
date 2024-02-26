/// <reference types="cypress" />
import * as mainPage from "../support/buy-a-gift-card-page.js";

describe("Verify purchasing gift card flow", () => {
  beforeEach(() => {
    cy.visit("https://gift-cards.phorest.com/salons/demous#");
  });

  it("Check 'Send to me' purchasing gift card flow", () => {
    const email = mainPage.generateRandomEmail();
    const firstName = "Michal";
    const lastName = "Szuryga";
    const cardValue = "50";

    cy.get("#option50").click();
    mainPage.fillInSendToMeData(email, firstName, lastName);
    cy.get("[data-target='checkout.checkoutButton']")
      .contains("Checkout")
      .click();
    mainPage.verifySummaryPage(cardValue, email, email);
    cy.get('[data-action="confirm#confirmAction"]').click();
    mainPage.fillInCardDetails();
    mainPage.testEmails(cardValue, email);
  });

  it("Check 'Send to someone' purchasing gift card flow", () => {
    const email = mainPage.generateRandomEmail();
    const firstName = "Michal";
    const lastName = "Szuryga";
    const giftCardEmail = mainPage.generateRandomEmail();
    const cardValue = "100";
    const message = "This is a test message";

    cy.get("#option100").click();
    mainPage.fillInSendToSomeoneElseData(
      email,
      firstName,
      lastName,
      giftCardEmail,
      message
    );
    cy.get("[data-target='checkout.checkoutButton']")
      .contains("Checkout")
      .click();
    mainPage.verifySummaryPage(cardValue, email, giftCardEmail);
    cy.get('[data-action="confirm#confirmAction"]').click();
    mainPage.fillInCardDetails();
    mainPage.testEmails(cardValue, email);
    mainPage.testGiftCardEmail(cardValue, giftCardEmail, firstName, lastName);
  });
});
