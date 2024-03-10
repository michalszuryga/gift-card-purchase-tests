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
  cy.get("a[data-action='tabs#showSendToOther']").click();
  cy.get("input[data-target='email.purchaserEmailInput']").type(email);
  cy.get("input[data-target='name.purchaserFirstNameInput']").type(firstName);
  cy.get("input[data-target='name.purchaserLastNameInput']").type(lastName);
  cy.get("input[data-target='email.recipientEmailInput']").type(recipientEmail);
  cy.get("textarea").type(message);
}

export function verifySummaryPage(cardValue, receiptEmail, giftCardEmail) {
  cy.contains(".text-3xl", "Summary").should("exist");

  cy.contains(".text-center.text-l", "Value of gift card")
    .next()
    .should("contain", `$${cardValue}.00`);
  cy.contains(".text-center.text-l", "Total cost")
    .next()
    .should("contain", `$${cardValue}.00`);
  cy.contains(".text-center.text-l", "Send receipt to")
    .next()
    .should("contain", receiptEmail);
  cy.contains(".text-center.text-l", "Send gift card to")
    .next()
    .should("contain", giftCardEmail);
}

export function testEmails(cardValue, email) {
  cy.wait(10000);
  cy.request("GET", `https://api.testsendr.link/?email=${email}`).then(
    (response) => {
      expect(response.status).to.equal(200);
      const sortedEmails = response.body.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      sortedEmails.forEach((email, index) => {
        if (index === 0 || index === 1) {
          if (email.from === "info@new-york-salon.phorest.com") {
            expect(email.subject).to.equal("Your Receipt for Arden Courts");
            expect(email.text).to.include(
              "Your Receipt Your RECEIPT from 100 Juniper Street 3rd Floor, Philadelphia, PA, 19107 (176) 512-5663 x3 demousa@phorest.com Vat No: 000000000000 TRANSACTION DETAILS Date"
            );
            getGiftCardCode().then((code) => {
              expect(email.text).to.contain(code);
            });
          } else if (email.from === "info@arden-courts.phorest.com") {
            expect(email.subject).to.equal(
              `You've been sent a $${cardValue}.00 gift card for Demo US!`
            );
            expect(email.text).to.include(
              "Email Template This card can be redeemed at Demo US and is valid until"
            );
            getGiftCardCode().then((code) => {
              expect(email.text).to.include(code);
            });
          }
        }
      });
    }
  );
}

export function testGiftCardEmail(
  cardValue,
  giftCardEmail,
  firstName,
  lastName
) {
  cy.wait(10000);
  cy.request("GET", `https://api.testsendr.link/?email=${giftCardEmail}`).then(
    (response) => {
      expect(response.status).to.equal(200);
      const sortedEmails = response.body.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      sortedEmails.forEach((giftCardEmail) => {
        expect(giftCardEmail.from).to.equal("info@arden-courts.phorest.com");
        expect(giftCardEmail.subject).to.equal(
          `You've been sent a $${cardValue}.00 gift card for Demo US!`
        );
        expect(giftCardEmail.text).to.contain(
          `Email Template ${firstName} ${lastName} has sent you a $${cardValue}.00 Gift Card This is a test message This card can be redeemed at Demo US and is valid until`
        );
        getGiftCardCode().then((code) => {
          expect(giftCardEmail.text).to.include(code);
        });
      });
    }
  );
}

export function getGiftCardCode() {
  return cy.get('p[data-target="stripe-serial.serialSpan"]').invoke("text");
}

export function fillInCardDetails() {
  const cardNumber = "4111111111111111";
  const validUntil = "1224";
  const cvc = "999";

  cy.wait(2000);
  iFrameHandling('input[placeholder="Card number"]').type(cardNumber);
  iFrameHandling('input[placeholder="MM / YY"]').type(validUntil);
  iFrameHandling('input[placeholder="CVC"]').type(cvc);
  cy.contains("button", "Submit").click({force:true});
}

function iFrameHandling(selector, input) {
  return cy.get(".__PrivateStripeElement > iframe").then(($element) => {
    const $body = $element.contents().find("body");
    return cy.wrap($body).find(selector);
  });
}

export function generateRandomEmail() {
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${randomString}@testsendr.link`;
}
