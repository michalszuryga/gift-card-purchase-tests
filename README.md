## **Gift card purchase - automated tests with use of Cypress framework**

## How to run tests
**1. Clone the Repository:**

Clone the GitHub repository containing the Cypress tests to your local machine using the following command: 

    git clone michalszuryga/gift-card-purchase-tests

**2. Install Dependencies:**

Navigate to the project directory and install the necessary dependencies by running:

    npm install

3. Launch Cypress Test Runner by executing following command: 

    npx cypress open

4. Select E2E Testing and choose browser of your choice

5. Click on **'buy-a-gift-card-page.cy.js'** test file

  

## Bugs found:

- 'Required' message won't disappear when 'Other' amount and then 50/100/150 euros is selected

- It is possible to enter any amount in the Other field, graphic presentation of gift card and total cost summary look not aligned when great amount is entered

- 'Terms &amp; Conditions' in page footer displayed with not parsed '&amp' character

- Card details pass with any CVC and expiry date - probably thing more related to test data than acutal bug

Example bug description attached in a separate file **'Bug.txt'**

  
  

## Notes:

- One suggestion: there could be a validation put in place to check if emails are different when 'Send to someone' option is used
