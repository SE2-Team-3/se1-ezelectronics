# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph
![DependencyGraph](/uploads/94779666ad3e201e0fb1d6dfc23284ed/DependencyGraph.jpeg)

# Integration approach
First, we start with unit testing by testing all functions according to the API and scenarios progressively, then we chcked all functionalities like a black box test to ensure that everything works, after all we moved toward integration tests,.

# Tests

# Unit_Tests
## Dao_User.test
| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
| User logs in with success| getIsUserAuthenticated                 |     unit        |  WB/ Statement Coverage              |
| Return error if user is not found | getIsUserAuthenticated | unit | WB/ Statement Coverage |
| Create a new user successfully | createUser | unit | WB/ Statement Coverage |
| Return error 409 if username already exists | createUser | unit | WB/ Statement Coverage |
| Retrieve user by username successfully | getUserByUsername | unit | WB/ Statement Coverage |
| Return error 404 if user is not found | getUserByUsername | unit | WB/ Statement Coverage |
| Retrieve all users successfully | getAllUsers | unit | WB/ Statement Coverage |
| Retrieve users by role successfully | getUsersByRole | unit | WB/ Statement Coverage |
| Reject if no users are found | getUsersByRole | unit | WB/ Statement Coverage |
| Delete user by username successfully | deleteUserByUsername | unit | WB/ Statement Coverage |
| Return error 404 if user is not found | deleteUserByUsername | unit | WB/ Statement Coverage |
| Return error 401 if the role is not admin | deleteUserByUsername | unit | WB/ Statement Coverage |
| Return error 401 if the username is another admin | deleteUserByUsername | unit | WB/ Statement Coverage |
| Delete all non-admin users successfully | deleteAllNonAdminUsers | unit | WB/ Statement Coverage |
| Update user info successfully | updateUserInfo | unit | WB/ Statement Coverage |
| Return error 400 if birthdate is in the future | updateUserInfo | unit | WB/ Statement Coverage |
| Return error 404 if user is not found | updateUserInfo | unit | WB/ Statement Coverage |

## Dao_Product.test
| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
| Return all products if no grouping is provided | getProducts | unit | WB/ Statement Coverage |
| Return error 422 if no grouping howerver, category is not null | getProducts | unit | WB/ Statement Coverage |
| Return error 422 if no grouping howerver,model is not null | getProducts | unit | WB/ Statement Coverage |
| Return products filtered by category | getProducts | unit | WB/ Statement Coverage |
|Return the product filtered by model| getProducts | unit | WB/ Statement Coverage |
| Return error 422 if grouping howerver, category or model is null | getProducts | unit | WB/ Statement Coverage |
| Return Error 404 if no products are found| getProducts | unit | WB/ Statement Coverage |
| Return all available products if no grouping is provided | getAvailableProducts | unit | WB/ Statement Coverage |
| Return error 422 if no grouping howerver, category is not null | getAvailableProducts | unit | WB/ Statement Coverage |
| Return error 422 if no grouping howerver,model is not null | getAvailableProducts | unit | WB/ Statement Coverage 
|Return available products filtered by category| getAvailableProducts | unit | WB/ Statement Coverage |
|Return the available product filtered by model| getAvailableProducts | unit | WB/ Statement Coverage |
| Return error 422 if grouping howerver, category or model is null | getAvailableProducts | unit | WB/ Statement Coverage |
|Return error 404 if Product model not found| getAvailableProducts | unit | WB/ Statement Coverage |
|Return error 404 if no product found| getAvailableProducts | unit | WB/ Statement Coverage |
| Register a new product when the model does not already exist | registerProducts | unit | WB/ Statement Coverage |
| Register a new product when the model does not already exist and arrival date is null| registerProducts | unit | WB/ Statement Coverage |
| Return error 409 if the model already exists   | registerProducts | unit | WB/ Statement Coverage |
|Return error 400 if arrival date is after current date| registerProducts | unit | WB/ Statement Coverage |
| Delete a product when the model exists | deleteProduct | unit | WB/ Statement Coverage |
| Return error 404 if the model does not exist | deleteProduct | unit | WB/ Statement Coverage |
| Delete all products successfully | deleteAllProducts | unit | WB/ Statement Coverage |
| Return error if the role is not admin or manager | deleteAllProducts | unit | WB/ Statement Coverage |
| Increase the quantity of an existing product | changeProductQuantity | unit | WB/ Statement Coverage |
| Return error 404 if the product model does not exist | changeProductQuantity | unit | WB/ Statement Coverage |
| Return error 400 if the change date is in the future| changeProductQuantity | unit | WB/ Statement Coverage |
| Return error 400 if the change date is before arrival date| changeProductQuantity | unit | WB/ Statement Coverage |
| Decrease the quantity of an existing product | sellProduct | unit | WB/ Statement Coverage |
| Return error 404 if the product does not exist | sellProduct | unit | WB/ Statement Coverage |
| Return error 409 if the available quantity of model is lower than the requested quantity | sellProduct | unit | WB/ Statement Coverage |
| Return error 409 if the available quantity of model is lower than the requested quantity | sellProduct | unit | WB/ Statement Coverage |
| Return error 400 if selling date is after the current date | sellProduct | unit | WB/ Statement Coverage |
| Return error 400 if the product selling date is earlier than arrival date | sellProduct | unit | WB/ Statement Coverage |

## Dao_Cart.test
| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
| Add a product to an existing cart successfully | addToCart | unit | WB/ Statement Coverage |
| Increase the quantity of a product if it is already in the cart | addToCart | unit | WB/ Statement Coverage |
| Return error 409 if the product is out of stock | addToCart | unit | WB/ Statement Coverage |
| Retrieve the current cart if it exists | getCart | unit | WB/ Statement Coverage |
| Return an empty cart if no unpaid cart exists | getCart | unit | WB/ Statement Coverage |
| Checkout the cart successfully | checkoutCart | unit | WB/ Statement Coverage |
| Return error 404 if no unpaid cart exists | checkoutCart | unit | WB/ Statement Coverage |
|Return error 400 if the cart total is 0 | checkoutCart | unit | WB/ Statement Coverage |
|Return error if the cart belongs to a different user | checkoutCart | unit | WB/ Statement Coverage |
| Retrieve the history of paid carts for the user | getCustomerCarts | unit | WB/ Statement Coverage |
| Return an empty array if no paid carts exist | getCustomerCarts | unit | WB/ Statement Coverage |
| Remove a product from the cart successfully  | removeProductFromCart | unit | WB/ Statement Coverage |
| Return error 404 if no unpaid cart exists  | removeProductFromCart | unit | WB/ Statement Coverage |
|Return error 404 if the product model is not in the cart  | removeProductFromCart | unit | WB/ Statement Coverage |
| Clear the cart successfully | clearCart | unit | WB/ Statement Coverage |
| Return error 404 if no unpaid cart exists | clearCart | unit | WB/ Statement Coverage |
| Delete all carts and their products successfully | deleteAllCarts | unit | WB/ Statement Coverage |
| Retrieve all carts successfully | getAllCarts | unit | WB/ Statement Coverage |
| Return an empty array if no carts exist | getAllCarts | unit | WB/ Statement Coverage |

## Dao_Review.test
| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
| Add a review successfully | addReview | unit | WB/ Statement Coverage |
| Return error 409 if review already exists | addReview | unit | WB/ Statement Coverage |
| Return error 404 if product model is not exists | addReview | unit | WB/ Statement Coverage |
| Retrieve product reviews successfully | getProductReviews | unit | WB/ Statement Coverage |
| Delete review successfully | deleteReview | unit | WB/ Statement Coverage |
| Return error 404 if no review found | deleteReview | unit | WB/ Statement Coverage |
| Return error 404 if product model is not found | deleteReview | unit | WB/ Statement Coverage |
| Delete reviews of a product successfully | deleteReviewsOfProduct | unit | WB/ Statement Coverage |
| Return error 404 if product model is not found | deleteReviewsOfProduct | unit | WB/ Statement Coverage |
| Delete all reviews successfully | deleteAllReviews | unit | WB/ Statement Coverage |
# Integration_Tests
## Dao_User.test
| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
| It will return a 200 success code and create a new user| POST /users                 |     integration        |  WB/ Statement Coverage              |
| Return error 409 if at least one request body parameter is empty/missing| POST /users  |     integration        |  WB/ Statement Coverage              |
| User will log in successfully| POST /sessions  |     integration        |  WB/ Statement Coverage              |
| It will show the information to user | GET /sessions/current  |     integration        |  WB/ Statement Coverage              |
| User will log out successfully | DELETE /sessions/current  |     integration        |  WB/ Statement Coverage              |
| It will return an array of users| GET /users | integration | WB/ Statement Coverage |
|It will return an array of users with a specific role| GET /users/roles/:role | integration | WB/ Statement Coverage |
|It returns error 404 if the role is not valid|GET /users/roles/:role| integration | WB/ Statement Coverage |
|It will return an array of users with a specific username| GET /users/:username | integration | WB/ Statement Coverage |
|It returns error 404 if the username is not valid| GET /users/:username | integration | WB/ Statement Coverage |
|It will return a 200 success code and create a new user| PATCH /users/:username | integration | WB/ Statement Coverage |
|It will return error 400 if the birthdate is not valid| PATCH /users/:username | integration | WB/ Statement Coverage |
|It will delete a specific username|DELETE /users/:username | integration | WB/ Statement Coverage |
|It will delete all usernames| DELETE /users | integration | WB/ Statement Coverage |

## Dao_Product.test
| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
| It will register a new product when all parameters are valid| POST /products | integration | WB/ Statement Coverage |
| It will return error 409 if the model already exists| POST /products | integration | WB/ Statement Coverage |
| It will return error 400 when arrivalDate is after the current date| POST /products | integration | WB/ Statement Coverage |
| It will return all products when no filters are applied| GET /products| integration | WB/ Statement Coverage |
| It will return a 422 error if grouping is null and any of category or model is not null| GET /products| integration | WB/ Statement Coverage |
| It will return a 422 error if grouping is category and category is null OR model is not null| GET /products| integration | WB/ Statement Coverage |
| It will return a 422 error if grouping is model and model is null OR category is not null| GET /products| integration | WB/ Statement Coverage |
| It will return a 404 error if model does not represent a product in the database| GET /products| integration | WB/ Statement Coverage |
| It will return all available products when no filters are applied| GET /products/available| integration | WB/ Statement Coverage |
| It will return a 422 error if grouping is null and any of category or model is not null| GET /products/available| integration | WB/ Statement Coverage |
| It will return a 422 error if grouping is category and category is null OR model is not null| GET /products/available| integration | WB/ Statement Coverage |
| It will return a 422 error if grouping is model and model is null OR category is not null| GET /products/available| integration | WB/ Statement Coverage |
| It will return a 404 error if model does not represent a product in the database| GET /products/available| integration | WB/ Statement Coverage |
| It will increase the quantity of an existing product| PATCH /products/:model| integration | WB/ Statement Coverage |
| It will return a 404 error if the model does not exist| PATCH /products/:model| integration | WB/ Statement Coverage |
| It will return a 400 error if changeDate is after the current date| PATCH /products/:model| integration | WB/ Statement Coverage |
| It will return a 400 error if change date is before the product's arrival date| PATCH /products/:model| integration | WB/ Statement Coverage |
| It will reduce the quantity of an existing product| PATCH /products/:model/sell| integration | WB/ Statement Coverage |
| It will return a 404 error if the model does not exist| PATCH /products/:model/sell| integration | WB/ Statement Coverage |
| It will return a 400 error if selling date is after the current date| PATCH /products/:model/sell| integration | WB/ Statement Coverage |
| It will return a 400 error if selling date is before the product's arrival date| PATCH /products/:model/sell| integration | WB/ Statement Coverage |
| It will return a 409 error if the available quantity is 0| PATCH /products/:model/sell| integration | WB/ Statement Coverage |
| It will return a 409 error if the available quantity is lower than the requested quantity| PATCH /products/:model/sell| integration | WB/ Statement Coverage |
| It will delete a product when the model exists| DELETE /products/:model| integration | WB/ Statement Coverage |
| It will return a 404 error if the model does not exist| DELETE /products/:model| integration | WB/ Statement Coverage |
| It will delete all products| DELETE /products | integration | WB/ Statement Coverage |
## Dao_Cart.test
| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
| It will add a product to the current cart | POST /carts | integration | WB/ Statement Coverage |
| It will return a 404 error if model does not represent an existing product | POST /carts | integration | WB/ Statement Coverage |
| It will return a 409 error if model represents a product whose available quantity is 0 | POST /carts | integration | WB/ Statement Coverage |
| It will return the current cart of the logged in user | GET /carts | integration | WB/ Statement Coverage |
| It will return the history of paid carts for the logged in user | GET /carts/history | integration | WB/ Statement Coverage |
| It will remove a product instance from the current cart | DELETE /carts/products/:model | integration | WB/ Statement Coverage |
| It will return a 404 error if model represents a product that is not in the cart | DELETE /carts/products/:model | integration | WB/ Statement Coverage |
|It will delete current cart of logged in user | DELETE /carts/current | integration | WB/ Statement Coverage |
|It will delete all existing carts | DELETE /carts | integration | WB/ Statement Coverage |
|It will return all carts of all users | GET /carts/all | integration | WB/ Statement Coverage |
|It will simulate payment for the current cart | PATCH /carts | integration | WB/ Statement Coverage |
|It will return a 404 error if there is no unpaid cart | PATCH /carts | integration | WB/ Statement Coverage |
|It will return a 400 error if the cart contains no product | PATCH /carts | integration | WB/ Statement Coverage |
|It will return a 409 error if a product in the cart has 0 available quantity | PATCH /carts | integration | WB/ Statement Coverage |
|It will return a 409 error if a product quantity in the cart exceeds available stock | PATCH /carts | integration | WB/ Statement Coverage |
## Dao_Review.test
| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
| It will add a new review for a product | POST /reviews/:model | integration | WB/ Statement Coverage |
| It will return a 404 error if model does not represent an existing product | POST /reviews/:model | integration | WB/ Statement Coverage |
| It will return a 409 error if there is an existing review for the product made by the customer | POST /reviews/:model | integration | WB/ Statement Coverage |
| It will return all reviews for a specific product | GET /reviews/:model | integration | WB/ Statement Coverage |
| It will return a 404 error if model does not represent an existing product | GET /reviews/:model | integration | WB/ Statement Coverage |
| It will delete the review made by the current user for a specific product | DELETE/reviews/:model | integration | WB/ Statement Coverage |
| It will return a 404 error if model does not represent an existing product | DELETE/reviews/:model | integration | WB/ Statement Coverage |
| It will return a 404 error if the current user does not have a review for the product | DELETE/reviews/:model | integration | WB/ Statement Coverage |
| It will delete all reviews of a specific product | DELETE /reviews/:model/all | integration | WB/ Statement Coverage |
| It will return a 404 error if model does not represent an existing product | DELETE /reviews/:model/all | integration | WB/ Statement Coverage |
| It will delete all reviews of all existing products | DELETE /review | integration | WB/ Statement Coverage |

# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Description|  Test(s) |
| :--------------------------------: | :-----: | :-----:|
|                FR1                 |   Manage Account      |       |
| FR1.1 |  Login    |  Unit(getIsUserAuthenticated) Integration(POST /sessions)   |
| FR1.2 |  Logout   | Unit(getIsUserAuthenticated) Integration (DELETE /sessions/current)       |
|  FR1.3  | Create a new user account | Unit(createUser) Integration(POST /users)|
| **FR2** |   **Manage users**                        ||
|  FR2.1  |Show the list of all users | Unit(getAllUsers) Integration(GET /users)|
|  FR2.2  |Show the list of all users with a specific role | Unit(getUsersByRole) Integration(GET /users/roles/:role)|
|  FR2.3  |Show the information of a single user |Unit(getUserByUsername) Integration(GET /sessions/current)|
|  FR2.4  |Update the information of a single user |Unit(updateUserInfo) Integration(GET /sessions/current)|
|  FR2.5  |Delete a single _non Admin_ user |Unit(deleteUserByUsername) Integration(DELETE /users/:username)|
|  FR2.6  |Delete all _non Admin_ users|Unit(deleteAllNonAdminUsers) Integration(DELETE /users) |
| **FR3** | **Manage products**                       ||
|  FR3.1  | Register a set of new products|Unit(registerProducts) Integration(POST /products)|
|  FR3.2  | Update the quantity of a product |Unit(changeProductQuantity) Integration(PATCH /products/:model)|
|  FR3.3  | Sell a product |Unit(sellProduct) Integration(PATCH /products/:model/sell)|
|  FR3.4  |Show the list of all products|Unit(getProducts) Integration(GET /products)|
| FR3.4.1 |Show the list of all available products|Unit(getAvailableProducts) Integration(GET /products/available)|
|  FR3.5  | Show the list of all products with the same category| Unit(getProducts) Integration (GET /products) |
| FR3.5.1 | Show the list of all available products with the same category |Unit(getAvailableProducts) Integration(GET /products/available)|
|  FR3.5  | Show the list of all products with the same model|Unit(getProducts) Integration (GET /products) |
| FR3.5.1 |  Show the list of all available products with the same model | Unit(getAvailableProducts) Integration(GET /products/available)|
|  FR3.6  |Delete a product | Unit(deleteProduct) Integration(DELETE /products/:model)|
|  FR3.7  |Delete all products |Unit(deleteAllProducts) Integration(DELETE /products)|
| **FR4** |     **Manage reviews**                       ||
|  FR4.1  | Add a new review to a product|Unit(addReview) Integration(POST /reviews/:model)|
|  FR4.2  | Get the list of all reviews assigned to a product        |Unit(getProductReviews) Integration(GET /reviews/:model)|
|  FR4.3  |Delete a review given to a product|Unit(deleteReview) Integration(DELETE/reviews/:model)|
|  FR4.4  | Delete all reviews of a product| Unit(deleteReviewsOfProduct) Integration(DELETE /reviews/:model/all)|
|  FR4.5  |               Delete all reviews of all products               |Unit(deleteAllReviews) Integration(DELETE /review)|
| **FR5** |   **Manage carts**                        ||
|  FR5.1  |Show the information of the current cart|Unit(getCart) Integration(GET /carts)|
|  FR5.2  | Add a product to the current cart|Unit(addToCart) Integration(POST /carts)|
|  FR5.3  |Checkout the current cart |Unit(checkoutCart) Integration(PATCH /carts)|
|  FR5.4  |Show the history of the paid carts|Unit(getCustomerCarts) Integration(GET /carts/history)|
|  FR5.5  |Remove a product from the current cart|Unit(removeProductFromCart) Integration(DELETE /carts/products/:model)|
|  FR5.6  |Delete the current cart|Unit(clearCart) Integration(DELETE /carts/current) |
|  FR5.7  |See the list of all carts of all users|Unit(getAllCarts) Integration(GET /carts/all)|
|  FR5.8  |Delete all carts |Unit(deleteAllCarts) Integration(DELETE /carts)|

## Coverage white box
## Integration_Test
![Integration](/uploads/f4662a3b6ec42abe7152b0b57de419b9/Integration.jpeg)
## Unit_Test
![photo_2024-06-12_15.54.42](/uploads/8d24182a66c29e2b09ca1c3388b5bf44/photo_2024-06-12_15.54.42.jpeg)
## Coverage white box after official test
## Integration_Test
![IntegrationTest](/uploads/a1dfcd6d711c4adf185221626bd9e1cc/IntegrationTest.jpeg)
## Unit_Test
![UnitTest](/uploads/ed39c39a3c5abb268367be84adaae94c/UnitTest.jpeg)
## Official_Test
![OfficialTest](/uploads/e31989a0614c76d339320cde4f1a7abc/OfficialTest.jpeg)