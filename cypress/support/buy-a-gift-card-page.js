export function verifyGiftCardOtherValue(value) {
  cy.get("li:nth-child(4) > label > span").click();
  cy.get("li:nth-child(4) > div > input").as("otherBox").type(`${value}`);
  cy.get("#voucher-image-value").should("contain", `$${value}.00`);
  cy.contains("Total cost").next("span").should("have.text", `$${value}.00`);
}

export function fillInSendToMeData(email, firstName, lastName) {
  cy.get("input[data-target='email.purchaserEmailInput']").type(email);
  cy.get("input[data-target='name.purchaserFirstNameInput']").type(firstName);
  cy.get("input[data-target='name.purchaserLastNameInput']").type(lastName);
}

export function fillInSendToSomeoneElseData(
  email,
  firstName,
  lastName,
  recipientEmail,
  message
) {
  cy.get("input[data-target='tabs.sendToOtherTab']").click();
  cy.get("input[data-target='email.purchaserEmailInput']").type(email);
  cy.get("input[data-target='name.purchaserFirstNameInput']").type(firstName);
  cy.get("input[data-target='name.purchaserLastNameInput']").type(lastName);
  cy.get("input[data-target='email.recipientEmailInput']").type(recipientEmail);
  cy.get("input[data-target='email.recipientMessageInput']").type(message);
}

export function verifySummaryPage(cardValue, email) {
  cy.contains(".text-3xl", "Summary").should("exist");
  cy.contains(".text-center.text-l", "Value of gift card")
    .next()
    .should("contain", `$${cardValue}.00`);
  cy.contains(".text-center.text-l", "Total cost")
    .next()
    .should("contain", `$${cardValue}.00`);
  cy.contains(".text-center.text-l", "Send receipt to")
    .next()
    .should("contain", email);
  cy.contains(".text-center.text-l", "Send gift card to")
    .next()
    .should("contain", email);
}

export function verifySuccessPage() {} //TODO

export function testEmails(cardValue) {
  cy.wait(15000);
  cy.request(
    "GET",
    "https://api.testsendr.link/?email=michal@testsendr.link"
  ).then((response) => {
    expect(response.status).to.equal(200);
    console.log(response.body);

    const sortedEmails = response.body.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedEmails.forEach((email, index) => {
      if (index === 0 || index === 1) {
        if (email.from === "info@new-york-salon.phorest.com") {
          expect(email.subject).to.equal("Your Receipt for Arden Courts");
          expect(email.text).to.include(
            "Your Receipt Your RECEIPT from Central Park South, Central Park South, New York, New York, 11122-2233 (176) 512-5663 x3 demousa@phorest.com Vat No: 000000000000 TRANSACTION DETAILS Date"
          );
        } else if (email.from === "info@arden-courts.phorest.com") {
          expect(email.subject).to.equal(
            `You've been sent a $${cardValue}.00 gift card for Demo US!`
          );
          expect(email.text).to.include(
            "Email Template This card can be redeemed at Demo US and is valid until"
          );
        }
      }
    });
  });
}

export function fillInCardDetails() {
  const cardNumber = "4111111111111111";
  const validUntil = "1224";
  const cvc = "999";

  cy.wait(2000);
  iFrameHandling('input[placeholder="Card number"]', cardNumber);
  iFrameHandling('input[placeholder="MM / YY"]', validUntil);
  iFrameHandling('input[placeholder="CVC"]', cvc);
  cy.contains("button", "Submit").click();
}

function iFrameHandling(selector, input) {
  cy.get(".__PrivateStripeElement > iframe").then(($element) => {
    const $body = $element.contents().find("body");
    let stripe = cy.wrap($body);
    stripe.find(selector).type(input, { force: true });
  });
}
