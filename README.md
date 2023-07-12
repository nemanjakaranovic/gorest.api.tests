# gorest.api.tests
 Test automation for REST API 
 
 ## API Documentation
 https://gorest.co.in/

 ## Used libraries:
 - Supretest
 - Mocha
 - Chai
 - FakerJS
 - dotenv
  
## Tests
Test file contains 6 tests which make one integration scenario.

## Runing tests
1. Clone this repo
2. Obtain API token from https://gorest.co.in/ 
3. Create .env file at root and define token <code>BEARER_TOKEN='here_goes_your_api_token'</code>
4. Execute <code>npm install</code>
5. Execute tests with <code>npx mocha api.test.js</code> or with runing the script <code>npm run mocha-test</code>

