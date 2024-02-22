export function verifyGiftCardOtherValue(value){
    cy.get('li:nth-child(4) > label > span').click();
    cy.get('li:nth-child(4) > div > input').as('otherBox').type(`${value}`);
    cy.get('#voucher-image-value').should('contain', `$${value}.00`)
    cy.contains('Total cost').next('span').should('have.text', `$${value}.00`)
}

export function fillInSendToMeData(email, firstName, lastName){
    cy.get("input[data-target='email.purchaserEmailInput']").type(email);
    cy.get("input[data-target='name.purchaserFirstNameInput']").type(firstName);
    cy.get("input[data-target='name.purchaserLastNameInput']").type(lastName);
}

export function fillInSendToSomeoneElseData(email, firstName, lastName, recipientEmail, message){
    cy.get("input[data-target='tabs.sendToOtherTab']").click();
    cy.get("input[data-target='email.purchaserEmailInput']").type(email);
    cy.get("input[data-target='name.purchaserFirstNameInput']").type(firstName);
    cy.get("input[data-target='name.purchaserLastNameInput']").type(lastName);
    cy.get("input[data-target='email.recipientEmailInput']").type(recipientEmail);
    cy.get("input[data-target='email.recipientMessageInput']").type(message);

}