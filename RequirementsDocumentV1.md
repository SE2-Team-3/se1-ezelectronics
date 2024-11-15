# Requirements Document - current EZElectronics

Date:

Version: V1 - description of EZElectronics in CURRENT form (as received by teachers)

| Version number | Change |
| :------------: | :----: |
|  V 1.0 | Stakeholders, Context Diagram, Interfaces, Stories and personas|
|  V 1.1 | Functional Requirements, Non-Functional Requirements|
|  V 1.2 | Usecases and Scenarios|
|  V 1.3 | Deployment Diagram|
|  V 1.4 | Project Management|
# Contents

- [Requirements Document - current EZElectronics](#requirements-document---current-ezelectronics)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
    - [Use case 1, UC1](#use-case-1-uc1)
      - [Scenario 1.1](#scenario-11)
      - [Scenario 1.2](#scenario-12)
      - [Scenario 1.x](#scenario-1x)
    - [Use case 2, UC2](#use-case-2-uc2)
    - [Use case x, UCx](#use-case-x-ucx)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

EZElectronics (read EaSy Electronics) is a software application designed to help managers of electronics stores to manage their products and offer them to customers through a dedicated website. Managers can assess the available products, record new ones, and confirm purchases. Customers can see available products, add them to a cart and see the history of their past purchases.

# Stakeholders

| Stakeholder name | Description |
| :--------------: | :---------: |
| Stakeholder1:users | persons interact with the system in different roles|
| Stakeholder2:admins |persons in charge of managing the database|
# Context Diagram and interfaces

## Context Diagram
![ContextDiagram](/uploads/4665fd77ed1bf8f07dcd43528aa179d1/ContextDiagram.png)

## Interfaces

|   Actor   | Logical Interface | Physical Interface |
| :-------: | :---------------: | :----------------: |
| Actor 1: user|GUI|  PC/Smartphone                  |
| Actor 2: admin |GUI|  PC              |

# Stories and personas



#### Persona 1: Professional Gaming Streamer

**Story:**  
A dedicated gaming streamer in need of a powerful gaming PC and a high-quality webcam to elevate their streaming setup.

#### Persona 2: Small Business Owner

**Story:**  
A small business owner searching for reliable and cost-effective electronic gadgets for their store.

#### Persona 3: Laptop Brand Sales Representative

**Story:**  
As a Manager representing the laptop brand, this individual aims to expand their market reach by selling their products on our website.

#### Persona 4: System Administrator

**Story:**  
As the system administrator, this individual oversees the technical aspects and security of our platform. They are responsible for configuring and maintaining servers, monitoring system performance, and implementing security measures to protect user data.

# Functional and non functional requirements

## Functional Requirements


|  ID       | Description                                    |
| :---:     | :------------------------------------------:   |
| FR1       |Authorize & Authenticate|
| FR1.1     |Create new users|
| FR1.2     |Log in|
| FR1.2     |Log out|
| FR2       |Get users|
| FR2.1     |Get all users|
| FR2.2     |Get users by specific role|
| FR2.3     |Get users by specific username|                 |
| FR2.4     |Delete users by specific username|                 |
| FR3       | Manage Products                                |
| FR3.1     | Add Products                                   |
| FR3.2     | Mark Products As Sold                          |
| FR3.3     | Register New Products Arrival                  |
| FR3.4     | Delete Product By Code                         |
| FR4     | Retrieve Products And Filter                   |
| FR4.1  | Retrieve Product by code                       |
| FR4.2   | Retrieve all Products                          |
| FR4.3   | Filter Products By Category                    |
| FR4.4   | Filter Products By Model                       |
| FR5     | Return current cart                            |
| FR5.1   | Add a product                                  |
| FR5.2   | Delete a product                               |
| FR5.3   | Delete cart                                    |
| FR6     | Return history of carts                    |

## Non Functional Requirements


|   ID    | Type (efficiency, reliability, ..) | Description | Refers to |
| :-----: | :--------------------------------: | :---------: | :-------: |
|  NFR1   |Reliability|The application should maintain an availability rate of 99.|FR1, FR3, FR4, FR5, FR6
|  NFR2  | Efficiency  |    The page weight should not exceed 1000 kilobytes         | FR1 - FR6          |
|  NFR3  | Efficiency  |    the web page should load from 0 to 3 seconds            | FR1, FR3, FR4, FR5, FR6          |
|  NFR3  | Efficiency  |   Response time for api requests should be < 0.5 seconds   |     FR1 - FR6        |
|  NFR4  | Usability       | Users should be able to the app with no training in less than 5 minutes      |      FR3, FR5     |
# Use case diagram and use cases

## Use case diagram

![UsecaseV1](/uploads/7a31830730e12ff54bcf9ec07df1e36b/UsecaseV1.jpeg)

### Use case 1, UC1 (Register)
| Actors Involved  | Users |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user have already the app|
|  Post condition  |user have an account|
| Nominal Scenario |user decide to start using the app|
|     Variants     ||
|  Exceptions      |user is already registered|

##### Scenario 1.1

|  Scenario 1.1 |Register|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user does not have an account|
| Post condition |user is registered|
|     Step#      |Description|
|       1        |user clicks on "create an account"|
|       2        |user enters name, surname, username, password|
|       3        |user chooses the role between "Customer and Manager"|
|       4        |user clicks on "Create account"|
|       5        |system confirms the registration after checking if the user does not exist|
|       6       |user is registered and logged in|
##### Scenario 1.2

|  Scenario 1.2 |User already exists|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is not registered|
| Post condition |user is not registered|
|     Step#      |Description|
|       1        |user clicks on the "create an account"|
|       2        |user enters name, surname, username,password|
|       3        |user chooses the role between "Customer and Manager"|
|       4        |system finds the username in the database|
|       5        |Error409- user is already exists|
|       6        |system asks to enter data again|
### Use case 2, UC2 (Login)
| Actors Involved  | User |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user starts using app|
|  Post condition  |user is logged|
| Nominal Scenario |user decides to login |
|     Variants     ||
|  Exceptions      |wrong username or password|

##### Scenario 2.1

|  Scenario 2.1 | Login|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user decides to login|
| Post condition |user is logged|
|     Step#      |Description|
|       1        |user enters their username and password|
|       2        |user chooses the role|
|       3        |user clicks on the "login"|
|       4        |system checks if the username and password are correct|
|       5        |user is logged successfully|
##### Scenario 2.2

|  Scenario 2.2 | Wrong password or username|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is not logged|
| Post condition |user is logged|
|     Step#      |Description|
|       1        |user enters username, password|
|       2        |user chooses the role|
|       3        |user clicks on the "login"|
|       4        |system finds that the username or password is wrong|
|       5        |Error- Username or password is wrong|
|       6        |system asks to enter the data again|

### Use case 3, UC3 (Log out)
| Actors Involved  | User |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user is logged in|
|  Post condition  |user is logged out|
| Nominal Scenario |user decides to logout |
|     Variants     ||
|  Exceptions      ||

##### Scenario 3.1

|  Scenario 3.1 | Log out|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is logged in|
| Post condition |user is logged out|
|     Step#      |Description|
|       1        |user clicks on the logout button|
|       2        |user is logged out successfully|
### Use case 4, UC4 (Get users)
| Actors Involved  | Admin |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user is logged in as admin|
|  Post condition  |list of users are called in array format|
| Nominal Scenario |admin retrieves users |
|     Variants     | admin wants to get all users <br/> admin wants to get users with specific roles <br/> admin wants to get users with specific username |
|  Exceptions      |username does not exist in database|

##### Scenario 4.1

|  Scenario 4.1 | Get all users|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is logged in as admin|
| Post condition |retrieve all users|
|     Step#      |Description|
|       1        |admin requests the list of all users|
|       2        |system checks the admin access level|
|       3        |all users are return in array|
##### Scenario 4.2

|  Scenario 4.2 | Get a user with specific username|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is logged in as admin|
| Post condition |retrieves user with specific username|
|     Step#      |Description|
|       1        |admin requests a specific username|
|       2        |system checks the admin access level|
|       3        |system checks if the username is in database|
|       4        |a specific user is shown|
##### Scenario 4.3

|  Scenario 4.3 | Specific username not found|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is logged in as admin|
| Post condition |retrieve user with specific username|
|     Step#      |Description|
|       1        |admin requests a specific username|
|       2        |system checks the admin access level|
|       3        |username is not found in database|
|       4        |Error-404 user not found|
##### Scenario 4.4

|  Scenario 4.4 | Get users with specific role|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is logged in as admin|
| Post condition |call users with specific role|
|     Step#      |Description|
|       1        |admin requests users with specific role|
|       2        |system checks the admin access level|
|       3        |system return all users with specific role in array|
### Use case 5, UC5 (Delete specific username)
| Actors Involved  | Admin |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user logged in as admin|
|  Post condition  |specific username is deleted|
| Nominal Scenario |admin requests to delete a specific user name|
|     Variants     ||
|  Exceptions      |username not found|

##### Scenario 5.1

|  Scenario 5.1 |  Delete a specific username|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is logged in as admin|
| Post condition |specific username is deleted|
|     Step#      |Description|
|       1        |admin click "delete username"|
|       2        |system checks admin access level|
|       3        |admin enters the username|
|       4        |system checks if username is already in the database|
|       4        |system shows the username|
|       4        |admin confirms to delete the username|
|       4        |username is deleted|

### Use case 6, UC6 (Manage Products)


| Actors Involved  |   User (Manager)                                                                    |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User should be logged in with role as Manager |
|  Post condition  |After managing products, the system updates the database with any changes made |
| Nominal Scenario |  User, logged in with role as Manager, efficiently manages products by creating new ones,deleting old ones, registering arrivals, and marking them as sold.     |
|     Variants     | User wants to add a product <br/> User wants to mark products as sold <br/> user wants to register the arrival date of products  <br/> User wants to delete a product                 |
|    Exceptions    |   If there is a product with the same code 409 error is shown              |


##### Scenario 6.1


|  Scenario 6.1  |      Add A Product                                                                     |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  |  User is logged in |
| Post condition |  The product is added to the database successfully|
|     Step#      |                                Description                                 |
|       1        |   User submits a request to add a product                                                                        |
|       2        |   System checks the request parameters and constraints                                                                        |
|       3        |   System if validation passes system adds the product                                                                         |

##### Scenario 6.2

|  Scenario 6.2  |     Register Arrival Date Of Product With Quantity                                                                                                                     |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in |
| Post condition | Products' of the same model arrival date along with the quantity is successfully registered  |
|     Step#      |                                Description                                 |
|       1        |   User submits request to register arrival of products of the same model with the quantity.                                                                       |
|       2        |   System validates the request by checking if it satisfies the constraints, and then updates the quantity of products belonging to the same class with the arrival date.                                                                   |

##### Scenario 6.3

|  Scenario 6.3  |     Mark Products As Sold              |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in  |
| Post condition | Product is successfully marked as sold  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to mark a product as sold and includes all necessary information.                                                                   |
|       2        |   System validates the request parameters and constraints, and updates the product's status to sold if validation passes.                                                                         |


##### Scenario 6.4

|  Scenario 6.4  |     Delete Product By Code              |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in  |
| Post condition | Product is successfully deleted |
|     Step#      |                                Description                                 |
|       1        |   User submits a product code to request deletetion of product.                                                              |
|       2        |   System validates the request parameters and constraints, and deletes product                                                         |


##### Scenario 6.5

|  Scenario 6.5  |     Product is already sold            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and requests to mark product as sold  | 
| Post condition | Error returned and no changes are made  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to mark a product as sold and includes all necessary information.                                                                   |
|       2        |   System checks the requests and finds that the product status is sold.                   |
|   3    |    System returns error, notifying the user that the product has already been sold.                                                                           |

##### Scenario 6.6

|  Scenario 6.6  |     Invalid Selling Date            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and requests to mark product as sold  | 
| Post condition | Error returned and no changes are made  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to mark a product as sold and specifies the selling date.                                                                 |
|       2        |   System checks the requests and finds that the selling date is after the current date or before the product arrival.                   |
|   3    |    System returns error, notifying the user that the selling date cannot be after the current date or before the product arrival date.                                                                          |


##### Scenario 6.7

|  Scenario 6.7  |     User attempts to mark a non-existent product as sold             |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and requests to mark product as sold  | 
| Post condition | Error returned and no changes are made  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to mark a product as sold and includes all necessary information.                                                                   |
|       2        |   System checks the requests and finds that the product code doesn't exist in the database                   |
|   3    |    System returns error 404, indicating that the product doesn't exist.                                                                      |


##### Scenario 6.8

|  Scenario 6.8  |     Invalid Arrival Date           |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and requests to register arrival date | 
| Post condition | Error returned and no changes are made  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to to register an arrival date.                                                                   |
|       2        |   System checks the requests and finds that the arrival date is after the current date                |
|   3    |    System returns an error.                                                                |


##### Scenario 6.9

|  Scenario 6.9  |  User tries to insert a product that already exists                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and wants to add a product |
| Post condition | Error returned  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to add a product                                                                 |
|       2        |   System checks the request and finds that the product code already exists.                                                                         |
|      3       |        System returns a 409 error indicating that the product already exists in the database                                                                    |

##### Scenario 6.10

|  Scenario 6.10  |  User attempts to delete a non-existent product.                                           |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and wants to delete a product |
| Post condition | Error returned  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request with product code to delete the product                                                                 |
|       2        |   system checks the request and finds that the product code doesn't exist.                                                                         |
|      3       |        System returns a 404 error indicating that the product doesn't exist in the database                                                                    |

### Use case 7, UC7 (Retrieve Products And Filter)

| Actors Involved  |   User                                                                    |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User should be logged in as Customer or Manager |
|  Post condition  | User retrieves the the list of products based on the specified filters. |
| Nominal Scenario |User logs in, explores available products, filters by category, model type, and sold status as needed.   |
|     Variants     |   User wants to view all the products <br/>    User wants to view products in a specific category <br/>   User wants to view products of a particular model type <br/> User wants to view a specific product <br/> User wants to filter products based on whether they have been sold or not.
|    Exceptions    |   If there is no product matching the specified request, systems notifies the user               |

##### Scenario 7.1


|  Scenario 7.1  |      Retrieve All Products                                                                      |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in |
| Post condition |  User views the list of all products |
|     Step#      |                                Description                                 |
|       1        |   User is logged in and views the main the products page.                                                               |
|       2        |   System retrieves and shows all the products to the user                                                                          |


##### Scenario 7.2

|  Scenario 7.2  |     Retrieve Products With Optional Parameter                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and clicks on sold or available button |
| Post condition | system retrieves products that are Sold or Not sold successfully  |
|     Step#      |                                Description                                 |
|       1        |   User requests product with Optional parameter (Sold = yes) or (Sold = no)                                                                        |
|       2        |   System retrieves the list of products that are available or have been sold                                                                         |



##### Scenario 7.3

|  Scenario 7.3  |     Retrieve Products By Category                                                                      |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User clicks on a category after logging in |
| Post condition | System retrieves products of the selected category  |
|     Step#      |                                Description                                 |
|       1        |   User requests product of a specific category by clicking on one of the categories                                                                    |
|       2        |   System retrieves products of the specified category                                                                         |


##### Scenario 7.4

|  Scenario 7.4  |     Retrieve Products By Model                                                                      |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and searches for a specific model |
| Post condition | System successfully retrieves products matching the specified model.|
|     Step#      |                                Description                                 |
|       1        |   User searches a model to filter                                                                         |
|       2        |   System retrieves the products with the specified model                                                                         |


##### Scenario 7.5

|  Scenario 7.5  |     Retrieve Products By Code                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and selects a product from the list |
| Post condition | system retrieves the product with the specific code successfully  |
|     Step#      |                                Description                                 |
|       1        |   User selects a product by code                                                                       |
|       2        |   system returns the product with the spcified code                                                                             |


##### Scenario 7.6

|  Scenario 7.6  |     Unable To Retrieve Products By Code                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and selects a product from the list |
| Post condition | system is unable to retrieve the product with the specific code.  |
|     Step#      |                                Description                                 |
|       1        |   User selects a product by code                                                                       |
|       2        |   system check the database and doesn't find a product with the specified code
|       3        |   system returns error 404                                                        |

### Use case 8, UC8 (Return current cart)
| Actors Involved  | User(Customer) |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user logged in as customer role|
|  Post condition  |cart is shown|
| Nominal Scenario |customer calls current cart |
|     Variants     |customer may have many carts|
|  Exceptions      |role of logged in user is not customer|

##### Scenario 8.1

|  Scenario 8.1 |  Return current cart|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user logged in as customer role|
| Post condition |curent cart is shown to user|
|     Step#      |Description|
|       1        |customer click on the "cart"|
|       2        |system checks that if role of user is customer|
|       3        |customer will get all unpaid cart and choose one|
|       4        |system shows the selected current cart|

### Use case 9, UC9 (Add product)
| Actors Involved  | User(Customer) |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |customer has at least one current cart|
|  Post condition  |products are added into cart|
| Nominal Scenario |customer adds product |
|     Variants     |                      |
|  Exceptions 404  |product id does not represent an existing product|
|  Exceptions 409  |product id is already in another cart|
|  Exceptions 409  |product id represents a product that is sold out|
##### Scenario 9.1

|  Scenario 9.1 |  Add prodcut to cart |
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | customer has at least one cart|
| Post condition | products are added to cart|
|     Step#      |Description|
|       1        |customer clicks "add a product"|
|       2        |system checks if the cart exists|
|       3        |selected product adds into cart|

##### Scenario 9.2

|  Scenario 9.2 | Non-existant product|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | user is logged in and requests to add product to cart|
| Post condition | product is not added to current cart|
|     Step#      |Description|
|       1        |customer clicks "add a product"|
|       2        |system check that if cart exist|
|       3        |productId is not exist|
|       4        |Error 404 -productId not found|
|       5        |system asks to enter another productId|

##### Scenario 9.3

|  Scenario 9.3 | Product is sold out|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | user is logged in and tries to add product to cart|
| Post condition | product is not added to current cart|
|     Step#      |Description|
|       1        |customer will select the product|
|       2        |system check that if cart exist|
|       3        |productId is sold out|
|       4        |Error 409 -productId is sold out|

##### Scenario 9.4

|  Scenario 9.4 | Product is already in another cart|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | user is logged in and tries to add product to cart|
| Post condition | product is not added to current cart|
|     Step#      |Description|
|       1        |customer tries to add a product with same productId|
|       2        |system check that if cart exist|
|  3    |productId is already is in another current cart which is unpaid|
|       4        |Error 409 -productId is already in another cart|
|       5  |system shows other current card with the selected productId|

### Use case 10, UC10 (Delete prodcut)
| Actors Involved  | User(Customer) |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user logged in as customer role|
|  Post condition  |productId is deleted from the current cart|
| Nominal Scenario |customer deletes a product from current cart|
|     Variants     ||
|  Exceptions 404      |productId it is not in the current cart|
|  Exceptions 404      |user does not have any cart|
|  Exceptions 404      |productId is not exist at all|
|  Exceptions 409      |productId has been already sold out|

##### Scenario 10.1

|  Scenario 10.1 | Delete product from cart|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user called the current cart|
| Post condition |selected product is removed from current cart|
|     Step#      |Description|
|       1        |customer selects the product which should be removed|
|       2        |system removes selected productId|

##### Scenario 10.2

|  Scenario 10.2 |Product is not in the cart|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user called the current cart|
| Post condition |selected product is not removed from current cart|
|     Step#      |Description|
|       1        |customer selects the product with the prodict id which should be removed|
|       2        |the product is not in the cart|
|       3        |error 404-the productId is not found|
|       4        |system asks user to enter another productId|

##### Scenario 10.3

|  Scenario 10.3 | Cart not found|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user called the current cart|
| Post condition |selected product is not removed from current cart|
|     Step#      |Description|
|       1        |customer selects the product which should be removed|
|       2        |there is no current cart for user|
|       3        |system checks the role of user|
|       4        |system confirm the user is customer|
|       5        |error-404 cart not found|
|       6        |system asks user to add at least one cart|

##### Scenario 10.4

|  Scenario 10.4 | Product not found|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user called the current cart|
| Post condition |selected product is not removed from current cart|
|     Step#      |Description|
|       1        |customer selects the product with the productId which should be removed|
|       2        |productId does not exist|
|       3        |error-404 selected product does not exist|
|       4        |system asks user to enter another productId|

##### Scenario 10.5

|  Scenario 10.5 | Product sold out |
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user called the current cart|
| Post condition |selected product is not removed from current cart|
|     Step#      |Description|
|       1        |customer selects the product which should be removed|
|       2        |selected prodcut is already sold out|
|       3        |error-409 selected product has been already sold out|


### Use case 11, UC11 (Ruturn history of carts)
| Actors Involved  | User(Customer) |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |carts in user profile with paid as true|
|  Post condition  |list of carts with detail will show to customer|
| Nominal Scenario |customer calls history of carts in the list|
|     Variants     |                      |
|  Exceptions   ||

##### Scenario 11.1

|  Scenario 11.1 | Return history of carts|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | cart saved in user profile with paid as true|
| Post condition | cutomer can see a list of the history of carts|
|     Step#      |Description|
|       1        |customer calls the history of carts|
|       2        |system select all carts with paid true|
|       3        |system shows the list with detail|

# Glossary

![GlossaryV1](/uploads/358d0d378c6d0f4ee71fb056223e1732/GlossaryV1.jpeg)

# System Design

\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram

![DeploymentDiagramV1](/uploads/ab8bb6099fa75b713f81ce302d559722/DeploymentDiagramV1.jpeg)
