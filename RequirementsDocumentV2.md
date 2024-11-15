# Requirements Document - future EZElectronics

Date:

Version: V2 - description of EZElectronics in FUTURE form (as proposed by the team)

| Version number | Change |
| :------------: | :----: |
|  V 2.0 | Stakeholders, Context Diagram, Interfaces,Stories and personas|
|  V 2.1 | Functional Requirements, Non-Functional Requirements|
|  V 2.2 | Usecases and Scenarios|
|  V 2.3 | Deployment Diagram|
|  V 2.4 | Project Management|

# Contents

- [Requirements Document - future EZElectronics](#requirements-document---future-ezelectronics)
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
| Stakeholder1: users | persons interact with the system in different roles|
| Stakeholder2: admins |persons in charge of managing the database|
| Stakeholder3: payment service |Platforms in charge of managing the transaction and payment|

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
A dedicated gaming streamer in need of a powerful gaming PC and a high-quality webcam to elevate their streaming setup. Request of delivery service is possible if it is available for selected product, in addition, after buying the device he could be able to leave review.

#### Persona 2: Small Business Owner

**Story:**  
A small business owner searching for reliable and cost-effective electronics gadgets for their store.

#### Persona 3: Laptop Brand Sales Representative

**Story:**  
As a Manager representing the laptop brand, this individual aims to expand their market reach by selling their products on our website. They are free to add any details about their product like image and color also they can add delivery service for their gadgets. They can also view all their listed products and manage them with ease.

#### Persona 4: System Administrator

**Story:**  
As the system administrator, this individual oversees the technical aspects and security of our platform. They are responsible for configuring and maintaining servers, monitoring system performance, and implementing security measures to protect user data.They have access level to block any fake users or scam in order to improve security level. 

# Functional and non functional requirements

## Functional Requirements
|  ID       | Description                                    |
| :---:     | :------------------------------------------:   |
| FR1       |Authorize & Authenticate|
| FR1.1     |Create new users|
| FR1.2     |Log in|
| FR1.3     |Users manage their profiles|
| FR1.4     |Users delete their profiles|
| FR1.5     |Users manage their passwords|
| FR1.6     |Users retrieve the forgotten passwords|
| FR1.7     |Users delete their profiles|
| FR1.8     |Log out|
| FR2       |Get users|
| FR2.1     |Get all users|
| FR2.2     |Get users by specific role|
| FR2.3     |Get users by specific username|                 |
| FR2.4     |Delete by specific username|                 |
| FR3       | Manage Products                                |
| FR3.1     | Add Products                                   |
| FR3.2     | Mark Products As Sold                          |
| FR3.3     | Register New Products Arrival                  |
| FR3.4     | Delete Product By Code                         |
| FR4     | Retrieve Products And Filter                   |
| FR4.1  | Retrieve Product by code                       |
| FR4.2   | Retrieve product list                          |
| FR4.3   | Filter product list by sold or not             |
| FR4.4   | Retrieve all Products                          |
| FR4.5   | Filter Products By Category                    |
| FR4.6   | Filter Products By Model                       |
| FR5   | Retrieve product list filter by price            |
| FR6     | Return current cart                            |
| FR6.1   | Add a product                                  |
| FR6.2   | Add delivery service                         |
| FR6.3   | Add quantity of product                          |
| FR6.4   | Delete a product                               |
| FR6.5   | Checkout the cart                               |
| FR6.6   | Pay total of cart                               |
| FR6.7   | Delete cart                                    |
| FR7     | Return history of carts                    |
| FR7.1   | Add review of product                               |

## Non Functional Requirements


|   ID    | Type (efficiency, reliability, ..) | Description | Refers to |
| :-----: | :--------------------------------: | :---------: | :-------: |
|  NFR1   |Reliability|The application should maintain an availability rate of 99.|FR1, FR3, FR4, FR5, FR6, FR7
|  NFR2  | Efficiency  |    The page weight should not exceed 1000 kilobytes         | FR1 - FR7          |
|  NFR3  | Efficiency  |    the web page should load from 0 to 3 seconds            | FR1, FR3, FR4, FR5, FR6, FR7         |
|  NFR3  | Efficiency  |   Response time for api requests should be < 0.5 seconds   |     FR1 - FR7        |
|  NFR4  | Usability       | Users should be able to the app with no training in less than 5 minutes      |      FR3, FR6     |
|  NFR6| Security   |   Only the system data administrator can assign roles and change access permissions to the system          |      FR1, FR2     |

# Use case diagram and use cases

## Use case diagram
![UsecaseV2](/uploads/9dcd1871ab0edc570e5a15ecf18eb2cd/UsecaseV2.jpeg)

### Use case 1, UC1 (Register)
| Actors Involved  | Users |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user have already the app|
|  Post condition  |user have an account|
| Nominal Scenario |user decide to start using the app|
|     Variants     ||
|  Exceptions      |username or email is already registered|
|  Exceptions      |password mismatch|
##### Scenario 1.1

|  Scenario 1.1 |Register|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user does not have an account|
| Post condition |user is registered|
|     Step#      |Description|
|       1        |user clicks on the "create an account"|
|       2        |user enters name, surname, username, Email, password|
|       3        |user confirms password|
|       4        |user chooses the role between "Customer and Manager"|
|       5        |user clicks on "Create account"|
|       6        |system confirms the registration after checking if the user does not exist|
|       7       |user is registered and logged in|

##### Scenario 1.2

|  Scenario 1.2 |Username or Email  already exists|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is not registered|
| Post condition |user is not registered|
|     Step#      |Description|
|  **Precondition**  | User attempts to sign up using a username or email that already exists. |
| **Postcondition** | An Error 409 is returned, and no new account is created.                   |
|     **Step #**      | **Description**                                                           |
|       1        | User sends a request to create a new account with the required fields.     |
|       2        | The system checks if the password was entered twice and matches in both cases. |
|       3        | The passwords match in both cases and the system proceeds to the next step. |
|       4        | The system checks whether the username or email already exists for another user.    |
|       5        | The username or email is found to be already registered.                  |
|       6        | The system responds with an Error 409 and does not create a new account.   |


#### Scenario 1.3

|   Scenario 1.3   |      Password Mismatch                                                                      |
|:----------------:|:--------------------------------------------------------------------------:|
|  **Precondition**  | User chooses a new username and a new email not previously registered in the system. |
| **Postcondition** | The system detects a mismatch in the password entries, and no new account is created. |
|     **Step #**      | **Description**                                                           |
|       1        | User submits a sign-up request with all required fields: username, email, name, surname, and password entered twice. |
|       2        | The system checks if the password was entered twice and matches in both cases. |
|       3        | The passwords do not match, and the system prompts the user to correct the passwords. |
|       4        | The user either corrects the password mismatch or cancels the registration. |

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
|       1        |user enters username ,password|
|       2        |user clicks on the "login"|
|       3        |system checks if username and password is correct|
|       4        |user is logged successfully|
##### Scenario 2.2

|  Scenario 2.2 | Wrong password or username|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is not logged|
| Post condition |user is logged|
|     Step#      |Description|
|       1        |user enters username, password|
|       2        |user clicks on the "login"|
|       3        |system found username or password is wrong|
|       4        |Error- Username or password is wrong|
|       5        |system asks to enter the data again|

### Use Case 3, UC3 (Profile Management)

| User             |                                                                                       |
|:----------------:|:-------------------------------------------------------------------------------------:|
| **Precondition** | The user must be registered and logged into the system.                                |
| **Postcondition**| Depending on the scenario, various changes to the user's account are applied and confirmed. |
| **Nominal Scenario** | User manages their account details or settings after logging in.                     |
| **Variants**     | 1. User changes their password while logged in. <br> 2. User changes their forgotten password through email verification. <br> 3. User views their account details like name, surname, email, username, role. <br> 4. User changes account details like name, surname, email, or username. <br>  5. User delete their account. |
| **Exceptions**   | Errors related to unauthorized access, invalid inputs, or failure in updating the database. |

#### Scenario 3.1 

|   Scenario 3.1       | Password Change                                        |
| :------------------: | :---------------------------------------------------------------------------------: |
| **Precondition**     | User is logged in and knows their current password.                                 |
| **Postcondition**    | User's password is successfully changed.                                            |
| **Step #**           | **Description**                                                                     |
| 1                    | User navigates to the change password section in their account settings.            |
| 2                    | User inputs their current password followed by the new password twice.              |
| 3                    | The system verifies the current password and checks the new password for compliance.|
| 4                    | Upon successful validation, the system updates the password.                        |

#### Scenario 3.2 

|   Scenario 3.2       | Change Forgotten Password  |
| :------------------: | :---------------------------------------------------------------------------------: |
| **Precondition**     | User cannot log in and opts to reset their password.                                |
| **Postcondition**    | User's password is reset, and they are able to log in with the new password.        |
| **Step #**           | **Description**                                                                     |
| 1                    | User selects the 'Forgot Password' option on the login page.                        |
| 2                    | User enters their email address and requests a password reset link.                 |
| 3                    | The system sends a reset link to the provided email address.                        |
| 4                    | User clicks on the reset link and enters a new password twice.                      |
| 5                    | The system updates the password upon successful validation.                         |

#### Scenario 3.3

|   Scenario 3.3       | View Account Details |
| :------------------: | :---------------------------------------------------------------------------------: |
| **Precondition**     | User is logged into their account.                                                  |
| **Postcondition**    | User views their account details.                                                   |
| **Step #**           | **Description**                                                                     |
| 1                    | User navigates to the account details section within their profile.                 |
| 2                    | The system displays the user's name, surname, email, username, and role.            |

#### Scenario 3.4

|   Scenario 3.4       |  Change Account Details |
| :------------------: | :---------------------------------------------------------------------------------: |
| **Precondition**     | User is logged into their account.                                                  |
| **Postcondition**    | User's account details are updated.                                                 |
| **Step #**           | **Description**                                                                     |
| 1                    | User navigates to the edit section of their account details.                        |
| 2                    | User updates the desired fields (name, surname, email, username).                   |
| 3                    | The system validates and saves the changes.                                         |
#### Scenario 3.5

|   Scenario 3.5     | User permanently deletes their account.                             |
| :-----------------:|:-------------------------------------------------------------------:|
| **Precondition**   | User is logged into their account and wishes to delete it permanently. |
| **Postcondition**  | User's account is permanently deleted from the system.              |
| **Step #**         | **Description**                                                     |
| 1                  | User navigates to the account settings.                             |
| 2                  | User selects the option to permanently delete their account.        |
| 3                  | User confirms their decision to delete the account permanently.     |
| 4                  | The system verifies the user's identity and confirms the action.    |
| 5                  | Upon successful verification and confirmation, the system permanently deletes the account and all associated data. |

### Use case 4, UC4 (Log out)
| Actors Involved  | User |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user is logged in|
|  Post condition  |user is logged out|
| Nominal Scenario |user decides to logout |
|     Variants     ||
|  Exceptions      ||

##### Scenario 4.1

|  Scenario 4.1 | Log out|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user is logged in|
| Post condition |user is logged out|
|     Step#      |Description|
|       1        |user clicks on the logout button|
|       2        |user is logged out successfully|

### Use case 5, UC5 (Get users)
| Actors Involved  | Admin |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user logged in as admin|
|  Post condition  |list of users are called in array|
| Nominal Scenario |admin calls users |
|     Variants     | admin wants to get all users <br/> admin wants to get users with specific roles <br/> admin wants to get users with specific username |
|  Exceptions      |username does not exist in database|

##### Scenario 5.1

|  Scenario 5.1 | Get all users|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user logged in as admin|
| Post condition |call all users|
|     Step#      |Description|
|       1        |admin requests all users|
|       2        |system checks the admin access level|
|       3        |all users are return in array|

##### Scenario 5.2

|  Scenario 5.2 | Get a user with specific username|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user logged in as admin|
| Post condition |call user with specific username|
|     Step#      |Description|
|       1        |admin requests a specific username|
|       2        |system checks the admin access level|
|       3        |system checks if the username is in database|
|       4        |a specific user is shown|
##### Scenario 5.3

|  Scenario 5.3 | Specific username not found|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user logged in as admin|
| Post condition |call user with specific username|
|     Step#      |Description|
|       1        |admin requests a specific username|
|       2        |system checks the admin access level|
|       3        |username is not found in database|
|       4        |Error-404 user not found|

##### Scenario 5.4

|  Scenario 5.4 | Get users with specific role|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user logged in as admin|
| Post condition |call users with specific role|
|     Step#      |Description|
|       1        |admin requests users with specific role|
|       2        |system checks the admin access level|
|       3        |system return all users with specific role in array|

### Use case 6, UC6 (Delete specific username)
| Actors Involved  | Admin |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user logged in as admin|
|  Post condition  |specific username is deleted|
| Nominal Scenario |admin requests to delete a specific user name|
|     Variants     ||
|  Exceptions      |username not found|

##### Scenario 6.1

|  Scenario 6.1 |  Delete a specific username|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user logged in as admin|
| Post condition |specific username is deleted|
|     Step#      |Description|
|       1        |admin click "delete username"|
|       2        |system check admin access level|
|       3        |admin enters the username|
|       4        |system checks if username is already in database|
|       5       |system shows username|
|       6        |admin confirms to delete the username|
|       7        |username is deleted|

### Use case 7, UC7 (Block/Unblock  username)
| Actors Involved  | Admin |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user logged in as admin|
|  Post condition  |specific username is blocked or unblocked|
| Nominal Scenario |admin requests to delete a specific user name|
|     Variants     ||
|  Exceptions      |username not found|

##### Scenario 7.1

|  Scenario 7.1 |  Block/Unblock username|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user logged in as admin|
| Post condition |specific username is blocked/unblocked|
|     Step#      |Description|
|       1        |admin click “block/unblock username"|
|       2        |system check admin access level|
|       3        |admin enters the username|
|       4        |system checks if username is already in database|
|       5        |system shows username|
|       6        |admin confirms to block/unblock the username|
|       7        |username is blocked/unblocked|

### Use case 8, UC8 (Manage Products)


| Actors Involved  |   User (Manager)                                                                    |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User should be logged in with role as Manager |
|  Post condition  |After managing products, the system updates the database with any changes made |
| Nominal Scenario |  User, logged in with role as Manager, efficiently manages products by creating new ones, deleting old ones, registering arrivals, and marking them as sold.     |
|     Variants     | User wants to add a product <br/> User wants to mark products as sold <br/> user wants to register the arrival date of products  <br/> User wants to delete a product                 |
|    Exceptions    |   If there is a product with the same code 409 error is shown              |


##### Scenario 8.1


|  Scenario 8.1  |      Add A Product                                                                     |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  |  User is logged in |
| Post condition |  The product is added to the database successfully|
|     Step#      |                                Description                                 |
|       1        |   User submits a request to add a product                                                                        |
|       2        |   System checks the request parameters and constraints                                                                        |
|       3        |   System if validation passes system adds the product                                                                         |

##### Scenario 8.2

|  Scenario 8.2  |     Register Arrival Date Of Product With Quantity                                                                                                                     |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in |
| Post condition | Products' of the same model arrival date along with the quantity is successfully registered  |
|     Step#      |                                Description                                 |
|       1        |   User submits request to register arrival of products of the same model with the quantity.                                                                       |
|       2        |   System validates the request by checking if it satisfies the constraints, and then updates the quantity of products belonging to the same class with the arrival date.                                                                   |

##### Scenario 8.3

|  Scenario 8.3  |     Mark Products As Sold              |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in  |
| Post condition | Product is successfully marked as sold  |
|     Step#      |                                Description                                 |
|       1        |    User submits a request to mark a product as sold and includes all necessary information.                                                                   |
|       2        |    System validates the request parameters and constraints, and updates the product's status to sold if validation passes.                                                                         |


##### Scenario 8.4

|  Scenario 8.4  |     Delete Product By Code              |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in  |
| Post condition | Product is successfully deleted |
|     Step#      |                                Description                                 |
|       1        |    User submits a product code to request deletion of product.                                                              |
|       2        |   System validates the request parameters and constraints, and deletes product                                                         |


##### Scenario 8.5

|  Scenario 8.5  |     Product is already sold            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and requests to mark product as sold  | 
| Post condition | Error returned and no changes are made  |
|     Step#      |                                Description                                 |
|       1        |   User: User submits a request to mark a product as sold and includes all necessary information.                                                                   |
|       2        |   System: System checks the requests and finds that the product status is sold.                   |
|   3    |    System: returns error, notifying the user that the product has already been sold.                                                                           |

##### Scenario 8.6

|  Scenario 8.6  |     Invalid Selling Date            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and requests to mark product as sold  | 
| Post condition | Error returned and no changes are made  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to mark a product as sold and specifies the selling date.                                                                 |
|       2        |   System checks the requests and finds that the selling date is after the current date or before the product arrival.                   |
|   3    |    System returns error, notifying the user that the selling date cannot be after the current date or before the product arrival date.                                                                          |


##### Scenario 8.7

|  Scenario 8.7  |     User attempts to mark a non-existent product as sold             |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and requests to mark product as sold  | 
| Post condition | Error returned and no changes are made  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to mark a product as sold and includes all necessary information.                                                                   |
|       2        |   System checks the requests and finds that the product code doesn't exist in the database                   |
|   3    |    System returns error 404, indicating that the product doesn't exist.                                                                      |


##### Scenario 8.8

|  Scenario 8.8  |     Invalid Arrival Date           |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and requests to register arrival date | 
| Post condition | Error returned and no changes are made  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to register an arrival date.                                                                   |
|       2        |   System checks the requests and finds that the arrival date is after the current date                |
|   3    |    System: returns an error.                                                                |


##### Scenario 8.9

|  Scenario 8.9  |  User tries to insert a product that already exists                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and wants to add a product |
| Post condition | Error returned  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request to add a product                                                                 |
|       2        |   system checks the request and finds that the product code already exists.                                                                         |
|      3       |        System returns a 409 error indicating that the product already exists in the database                                                                    |

##### Scenario 8.10

|  Scenario 8.10  |  User attempts to delete a non-existent product.                                           |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and wants to delete a product |
| Post condition | Error returned  |
|     Step#      |                                Description                                 |
|       1        |   User submits a request with product code to delete the product                                                                 |
|       2        |   system checks the request and finds that the product code doesn't exist.                                                                         |
|      3       |        System returns a 404 error indicating that the product doesn't exist in the database 


### Use case 9, UC9 (Retrieve And Filter Listed Products)

| Actors Involved  |     User (Manager)                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User is logged in as manager |
|  Post condition  |  The user can view the list of products they have listed with filters  |
| Nominal Scenario |    The user logs in as manager, clicks on dashboard (product management section), User applies filter to view listed products that are sold or not, user can search the product        |
|     Variants     |    User wants to view all their listed products <br/> User wants to filter listed products based on sold or not sold <br/> User wants to search a specific listed product by code.          |
|    Exceptions    | Empty list as user hasn't listed any products yet                      |

##### Scenario 9.1


|  Scenario 9.1  |      Retrieve All Listed Products                                                                      |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User logs in |
| Post condition |  User views the list of all their listed products |
|     Step#      |                                Description                                 |
|       1        |   User Logs in                                                                          |
|       2        |   System retrieves all the listed products                                                                         |


##### Scenario 9.2

|  Scenario 9.2  |     Retrieve Listed Products With Sold/ Not Sold Filter                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and clicks on sold button |
| Post condition | system retrieves products that are Sold successfully  |
|     Step#      |                                Description                                 |
|       1        |   User requests to see their products that have been sold                                                                   |
|       2        |   System retrieves the list of products that have been                                                                 |


##### Scenario 9.3

|  Scenario 9.3  |     Search For Listed Product                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and searches for  a specific model they have listed  |
| Post condition | System successfully retrieves listed products matching the specified model.|
|     Step#      |                                Description                                 |
|       1        |   User searches a model to filter                                                                         |
|       2        |   System retrieves the products with the specified model                                                                         |

##### Scenario 9.4

|  Scenario 9.4  |    No Product Listed By Manager                                                   |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged and view the list of listed products |
| Post condition | System retrieves an empty list of product |
|     Step#      |                                Description                                 |
|       1        |   User logs in and hasn't listed any products yet                                                                       |
|       2        |   System retrieves an empty list                                                                   |

### Use case 10, UC10 (Manage Product Details)

| Actors Involved  |     User (Manager)                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User is logged in as manager and selects a product to edit from the listed products list |
|  Post condition  |  The User can add or edit product related information  |
| Nominal Scenario |    The user logs in as manager, clicks on dashboard (product management section), user views the listed products, user selects a product to edit.        |
|     Variants     |    User wants to upload pictures for thier listed products <br/> User wants to edit product details
|    Exceptions    | Incorrect Format    |


##### Scenario 10.1

|  Scenario 10.1  |      User Uploads Picture For Listed Product                                                                      |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User logs in and selects a product to upload pictures for it |
| Post condition |  Picture is successfully uploaded for the product |
|     Step#      |                                Description                                 |
|       1        |   User selects the product to edit                                                                          |
|       2        |   User chooses to upload a picture for the product|
| 3         | User: selects an image file|
| 4         | System: validates the image, and successfully updates the product picture


##### Scenario 10.2

|  Scenario 10.2  |   User Edits Product Details                                                                   |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and selects a product to change details |
| Post condition | Product Details are changed successfully |
|     Step#      |                                Description                                 |
|       1        |   User selects the product to edit
|       2      |   User updates the product details such as color, promotional status, delivery status, shipping cost, delivery date, price, or title.|
|       3     |  User saves the changes|
|       4     | System validates the changes and updates product details such as color, promotional status, delivery status, shipping cost, delivery date, price, or title

##### Scenario 10.3

|  Scenario 10.3  |  Invalid Image Format Uploaded                                                   |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in as a manager and selects a product to edit |
| Post condition | Error message is displayed, and the picture is not uploaded |
|     Step#      |                                Description                                 |
|       1        |   User selects the product to edit
|       2      |   User attempts to upload a picture for the product and selects an image|
|       3     |  System validates the image format|
|       4     | System displays an error message indicating an invalid format, and picture is not uploaded |

##### Scenario 10.4

|  Scenario 10.4  |  Error Editing Product Details                                                 |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in as a manager and selects a product to edit |
| Post condition | Error message is displayed, and the product details are not updated |
|     Step#      |                                Description                                 |
|       1        |   User selects the product to edit and modifies the details.
|       2      |   User the entered price, title, or details is not in a valid format|
|       3     |  System displays an error message
|       4     |  System Prompts the user to correct the errors |

### Use case 11, UC11 ( Delivery service)

| Actors Involved  |     User (Manager)                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User is logged in as manager and selects a product that delivery service is available for|
|  Post condition  |  The User added delivery service with all details  |
| Nominal Scenario |    The user logs in as manager, clicks on dashboard (product management section), user views the listed products, user selects a product to add delivery service.        |
|     Variants     |  | 
|    Exceptions    |    |


##### Scenario 11.1

|  Scenario 11.1  |      User  adds delivery service for a product                                                                     |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User logs in and selects a product to add delivery service|
| Post condition |  Delivery service is successfully added for the product |
|     Step#      |                                Description                                 |
|       1        |   User: selects the product to edit                                                                          |
|       2        |   User : defines delivery method, delivery date and also shipping cost|
| 3     | System:  updates the product details for delivery service|

### Use case 12, UC12(Retrieve Products And Filter)

| Actors Involved  |   User (Customer)                                                                    |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User should be logged in |
|  Post condition  | User retrieves  the list of products based on the specified filters. |
| Nominal Scenario |User logs in, explores available products, filters by category, model type, and sold status as needed.   |
|     Variants     |   User wants to view all the products <br/>    User wants to view products in a specific category <br/>   User wants to view products of a particular model type <br/> User wants to view a specific product <br/> User wants to filter products based on whether they have been sold or not.
|    Exceptions    |   If there is no product matching the specified request, systems notifies the user               |

##### Scenario 12.1


|  Scenario 12.1  |      Retrieve All Products                                                                      |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User logs in |
| Post condition |  User views the list of all products |
|     Step#      |                                Description                                 |
|       1        |   User Logs in                                                                          |
|       2        |   System Retrieves all the products                                                                          |

##### Scenario 12.2

|  Scenario 12.2  |     Retrieve Products With Optional Parameter                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and clicks on sold or available button |
| Post condition | system retrieves products that are Sold or Not sold successfully  |
|     Step#      |                                Description                                 |
|       1        |   User requests product with Optional parameter (Sold = yes) or (Sold = no)                                                                        |
|       2        |   System Retrieves the list of products that are available or have been sold                                                                         |


##### Scenario 12.3

|  Scenario 12.3  |     Retrieve Products By Category                                                                      |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User clicks on a category after logging in |
| Post condition | System retrieves products of the selected category  |
|     Step#      |                                Description                                 |
|       1        |   User requests product of a specific category by clicking on one of the categories                                                                    |
|       2        |   System retrieves products of the specified category                                                                         |

##### Scenario 12.4

|  Scenario 12.4  |     Retrieve Products By Model                                                                      |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and searches for specific model |
| Post condition | System successfully retrieves products matching the specified model.|
|     Step#      |                                Description                                 |
|       1        |   User Searches a model to filter                                                                         |
|       2        |   System retrieves the products with the specified model                                                                         |


##### Scenario 12.5

|  Scenario 12.5  |     Retrieve Products By Code                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and selects a product from the list |
| Post condition | system retrieves the product with the specific code successfully  |
|     Step#      |                                Description                                 |
|       1        |   User selects a product by code                                                                       |
|       2        |   system returns the product with the specified code                                                                             |


##### Scenario 12.6

|  Scenario 12.6  |     Unable To Retrieve Products By Code                                                                    |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is logged in and selects a product from the list |
| Post condition | system is unable to retrieve the product with the specific code.  |
|     Step#      |                                Description                                 |
|       1        |   User selects a product by code                                                                       |
|       2        |   system checks the database and doesn't find a product with the specified code
|       3        |   system returns error 404                                                        |


### Use case 13, UC13 (Retrieve Products Sorted By Price)

| Actors Involved  |     User (Customer)                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User is logged in as customer|
|  Post condition  |  The User can view products sorted by increasing or decreasing price   |
| Nominal Scenario |    The user logs in as customer, user views the list of all products, applies price filter     |
|     Variants     |    User wants to view products by decreasing price <br/> User wants to view products by increasing price
|    Exceptions    |                |

##### Scenario 13.1

|  Scenario 13.1  |  Retrieve Products Sorted by Increasing Price |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User Logs in And selects Increasing Price Filter |
| Post condition | Products are order by increasing price |
|     Step#      |                                Description                                 |
|       1        |   User selects increasing price filter
|       2    | System displays products list in increasing price order |

##### Scenario 13.2

|  Scenario 13.1  |  Retrieve Products Sorted by Decreasing Price |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User Logs in And selects Decreasing Price Filter |
| Post condition | Products are order by decreasing price |
|     Step#      |                                Description                                 |
|       1        |   User selects decreasing price filter
|       2    | System displays products list in decreasing price order |


### Use case 14, UC14 (Return current cart)
| Actors Involved  | user(Custome) |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |user logged in as customer role|
|  Post condition  |cart is shown|
| Nominal Scenario |customer calls current cart |
|     Variants     |customer may have many carts|
|  Exceptions      |role of logged in user is not customer|

##### Scenario 14.1

|  Scenario 14.1 |  Return current cart|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user logged in as customer role|
| Post condition |current cart is shown to user|
|     Step#      |Description|
|       1        |customer click on the "cart"|
|       2        |system checks that if role of user is customer|
|       3        |customer will get all unpaid cart and choose one|
|       4        |system shows the selected current cart|

### Use case 15, UC15 (Add product)
| Actors Involved  | User,Customer |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |customer has at least one current cart|
|  Post condition  |products are added into cart|
| Nominal Scenario |customer adds the product |
|     Variants     |                      |
|  Exceptions 404  |product id does not represent an existing product|
|  Exceptions 409  |product id is already in another cart|
|  Exceptions 409  |product id represents a product that is sold out|

##### Scenario 15.1

|  Scenario 15.1 |  Add product to cart |
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |  User has at least one cart and adds a product to cart|
| Post condition | products are added to cart|
|     Step#      |Description|
|       1        |customer clicks "add a product"|
|       2        |system check that if the cart exist|
|       3        |selected product added into cart|

##### Scenario 15.2

|  Scenario 15.2 | Non-existant product|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | User tries to add product to cart|
| Post condition | product is not added to current cart|
|     Step#      |Description|
|       1        |customer clicks "add a product"|
|       2        |system check that if the cart exist|
|       3        |productId is not exist|
|       4        |Error 404 -productId not found|
|       5        |system asks to select another product|

##### Scenario 15.3

|  Scenario 15.3 | Product is sold out|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | User tries to add product to cart|
| Post condition | product is not added to current cart|
|     Step#      |Description|
|       1        |customer selects the product|
|       2        |system check that if cart exist|
|       3        |productId is sold out|
|       4        |Error 409 -productId is sold out|

##### Scenario 15.4

|  Scenario 15.4 | Product is already in another cart|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | product is not added to current cart|
| Post condition | product is not added to current cart|
|     Step#      |Description|
|       1        |customer selects the product|
|       2        |system check that if cart exist|
|  3    |productId is already is in another current cart which is unpaid|
|       4        |Error 409 -productId is already in another cart|
|       5  |system shows other current card with the selected productId|

### Use case 16, UC16 (Delete product)
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

##### Scenario 16.1

|  Scenario 16.1 | Delete product from cart|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user called the current cart|
| Post condition |selected product is removed from current cart|
|     Step#      |Description|
|       1        |customer selects the product which should be removed|
|       2        |system removes selected productId|

##### Scenario 16.2

|  Scenario 16.2 |Product is not in the cart|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user called the current cart|
| Post condition |selected product is not removed from current cart|
|     Step#      |Description|
|       1        |customer selects the product which should be removed|
|       2        |the productId is not in the cart|
|       3        |error 404-the productId is not found|
|       4        |system asks user to select another product|

##### Scenario 16.3

|  Scenario 16.3 | Cart not found|
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

##### Scenario 16.4

|  Scenario 16.4 | Product not found|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user called the current cart|
| Post condition |selected product is not removed from current cart|
|     Step#      |Description|
|       1        |customer selects the product which should be removed|
|       2        |productId does not exist|
|       3        |error-404 selected product does not exist|
|       4        |system asks user to select another productId|

##### Scenario 16.5

|  Scenario 16.5 | Product sold out |
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |user called the current cart|
| Post condition |selected product is not removed from current cart|
|     Step#      |Description|
|       1        |customer selects the product that should be removed|
|       2        |selected product is already sold out|
|       3        |error-409 selected product has been already sold out|

### Use case 17, UC17 (Checkout Cart)
| Actors Involved  |  User (customer) |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | customer wants to review current cart|
|  Post condition  | the list of added products with their details are shown to customer|
| Nominal Scenario | customer wants to review everything before payment|
|     Variants     | customer may remove the selected product <br/> customer add delivery service if it’s available |
|    Exceptions    | product is sold out in the period that customer was selecting other products |

##### Scenario 17.1

|  Scenario 17.1  |checkout the cart|
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | customer wants to review the shopping|
| Post condition |list of selected product by customer is shown|
| Step# |  Description |
| 1|  customer selects the checkout|
| 2|  system shows the list of selected products with their details|
| 3|  customer confirms the checkout|

##### Scenario 17.2

|  Scenario 17.2  |delete a product|
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | customer is in checkout page|
| Post condition |selected product by customer is deleted|
| Step# |  Description |
| 1|  customer wants to delete a product from the list of shopping|
| 2|  system deletes the selected product from checkout list|
| 3|  system updates the list and total|
| 4|  customer confirms the checkout|

##### Scenario 17.3

|  Scenario 17.3  |checkout is not confirmed|
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | customer can not confirm the checkout|
| Post condition | checkout is not confirmed|
| Step# |  Description |
| 1|  customer confirms the checkout|
| 2|  product in the checkout list has been sold out|
| 3|  Erro- selected product is sold out|
| 4|  slected product is removed from the list|
| 5|  system asks customer to choose another product|

##### Scenario 17.4

|  Scenario 17.4  |   add quantity of product to cart|
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Customer wants to add the quantity of selected product |
| Post condition |selected product with the quantity is added to current cart|
| Step# |  Description |
| 1|  customer choose the quantity of product that is needed |
| 2| system checks that if the selected quantity is not more than the whole quantity of selected product|
| 3|system confrims the quantity|
| 4|product with selected quantity is added to cart|

##### Scenario 17.5

|  Scenario 17.5  | quantity of product is not accepted|
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Customer can not add the quantity of selected product |
| Post condition |selected product with the quantity is not added to current cart|
| Step# |  Description |
| 1|  customer choose the quantity of product that is needed |
| 2| system does not confirm the quantity because the quantity is greater than the total number of product in the stock|
| 3|Error- change the quantity|
| 4|show the whole quantity of the selected product|

##### Scenario 17.6

|  Scenario 17.6  | Customer adds delivery service|
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Customer can use delivery service defined for selected product |
| Post condition | delivery service of selected product is added|
| Step# |  Description |
| 1|  customer add delivery service defined by manager for the product |
| 2| system confirms the delivery service|
| 3| shipping cost is added to total|
| 4|user is ready to checkout|

### Use case 18, UC18 (Transaction Management)
| Actors Involved  |  User (customer) |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | customer confirmed the checkout and ready to pay total|
|  Post condition  | the cart is paid and receipt is sent in customer profile|
| Nominal Scenario | customer wants to pay the total of cart|
|     Variants     | |
|    Exceptions    |the transaction is failed|

##### Scenario 18.1

|  Scenario 18.1 |  pay selected cart|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |current cart is not paid yet|
| Post condition |current cart paid and save in user's profile|
|     Step#      |Description|
|       1        |customer confirms the total of checkout|
|       2        |customer chooses the payment method|
|       3        |transaction completes successfully|
|       4        |system give a receipt to customer |
|       5        |receipt with specified date is saved to profile|

##### Scenario 18.2

|  Scenario 18.2 | failure transaction|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  |current cart is ready to pay|
| Post condition |current cart is not paid|
|     Step#      |Description|
|       1        |customer confirms the total|
|       2        |customer chooses the payment method|
|       3        |transaction does not complete successfully|
|       4        |transaction failed|
|       5        |save cart as a current cart|
|       6        |system asks to try again|


### Use case 19, UC19 (Return history of carts)
| Actors Involved  | User(Customer) |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |carts in user profile with paid true |
|  Post condition  |list of carts with detail will show to customer|
| Nominal Scenario |customer calls history of carts in the list|
|     Variants     |  customer may return the history of carts to leave product rate                    |
|  Exceptions   ||

##### Scenario 19.1

|  Scenario 19.1 | Return history of carts|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | cart saved in user profile with paid true|
| Post condition | customer can see a list of the history of carts with details of products|
|     Step#      |Description|
|       1        |customer calls the history of carts|
|       2        |system select all carts with paid true|
|       3        |system shows the list with detail|
##### Scenario 19.2

|  Scenario 19.2 | Add product rate|
| :------------: | :------------------------------------------------------------------------:|
|  Precondition  | cart saved in user profile with paid true|
| Post condition | customer can see a list of the history of carts with details of products|
|     Step#      |Description|
|       1        |customer selects a product|
|       2        |customer adds product rate|
|       3        |system confirms the rate|
|       34       |product rate is saved|




# Glossary

![GlossaryV2](/uploads/4dac10398a7eb97a8aafa04dd246af99/GlossaryV2.jpeg)

# System Design

\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram

![DeploymentDiagramV1](/uploads/ab8bb6099fa75b713f81ce302d559722/DeploymentDiagramV1.jpeg)
