/// <reference types="cypress" />

describe("Verify Page Elements", () => {
  beforeEach(() => {
    cy.visit("https://gift-cards.phorest.com/salons/demous#");
  });

  it("Should display the header", () => {
    cy.get("header > p")
      .should("have.text", "Demo US")
      .should("have.css", "font-size", "18px");
    cy.get("header > span")
      .should("have.text", "Buy a Gift Card")
      .should("have.css", "font-size", "14px");
    cy.log("Page header & subheader displayed correctly");
  });

  it("Should display the Gift Card value section header", () => {
    cy.contains("Gift Card Value").should("have.css", "font-weight", "600");
  });

  it("Should allow to select any amount available", () => {
    const value = "100";

    cy.get("li:nth-child(4) > label > span").click();
    cy.get("li:nth-child(4) > div > input").as("otherBox").type(`${value}`);
    cy.get("#voucher-image-value").should("contain", `$${value}.00`);
    cy.contains("Total cost").next("span").should("have.text", `$${value}.00`);
  });

  it("Fill in 'Send to me' section", () => {
    const email = "test@test.com";
    const firstName = "First name";
    const lastName = "Last name";
    cy.get("input[data-target='email.purchaserEmailInput']").type(email);
    cy.get("input[data-target='name.purchaserFirstNameInput']").type(firstName);
    cy.get("input[data-target='name.purchaserLastNameInput']").type(lastName);
    cy.get("div[data-target='email.purchaserEmailError']").should(
      "have.class",
      "input-error hidden"
    );
  });

  it.skip("Check footer", () => { //BUG
    const contactInfo = [
      "Arden Courts",
      "Central Park South, New York, 11122-2233, United States",
      "demousa@phorest.com",
      "(176) 512-5663 x3",
    ];
    const footerLinks = [
      { text: "Phorest", url: "https://www.phorest.com/contact/" },
      {
        text: "Terms & Conditions",
        url: "https://demous.phorest.me/book/terms",
      },
      {
        text: "Cancellation Policy",
        url: "https://demous.phorest.me/book/terms#cancellation",
      },
      {
        text: "Privacy Policy",
        url: "https://demous.phorest.me/book/phorest_privacy",
      },
    ];

    cy.get("#footer .flex.flex-col.lg\\:flex-row p").each(($p, index) => {
      cy.wrap($p).should("contain.text", contactInfo[index]);
    });
    cy.get(
      "#footer div.flex.flex-row.flex-wrap.max-w-sm.lg\\:max-w-xl.mx-auto.justify-around a"
    ).each(($a, index) => {
      cy.request(footerLinks[index].url).then((response) => {
        expect(response.status).to.be.eq(200);
      });
      expect($a.text()).to.eq(footerLinks[index].text);
      expect($a).to.have.attr("href", footerLinks[index].url);
    });
  });
});
