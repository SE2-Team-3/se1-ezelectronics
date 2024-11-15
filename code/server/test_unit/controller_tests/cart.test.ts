import { test, expect, jest, beforeEach } from "@jest/globals";
import CartController from "../../src/controllers/cartController";
import CartDAO from "../../src/dao/cartDAO";
import { User, Role } from "../../src/components/user";
import { Cart, ProductInCart } from "../../src/components/cart";
import { Category } from "../../src/components/product"; // Import the Category enum

jest.mock("../../src/dao/cartDAO");
jest.mock("../../src/components/user");

beforeEach(() => {
    jest.resetAllMocks(); // Reset all mocks before each test
});
//
// Example of a unit test for the addToCart method of the CartController
// The test checks if the method returns true when the DAO method returns true
// The test also expects the DAO method to be called once with the correct parameters

test("addToCart should return true when product is successfully added", async () => {
    const testUser = { // Define a test user object
        username: "testUser",
        password: "password",
        role: Role.CUSTOMER,
        name: "Test",
        surname: "User",
        birthdate: "2000-01-01",
        address: "123 Test Street" // Add the address property
    };
    const productModel = "iPhone13";
    
    jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(true); // Mock the addToCart method of the DAO
    const controller = new CartController(); // Create a new instance of the controller
    // Call the addToCart method of the controller with the test user object
    const response = await controller.addToCart(testUser, productModel);

    // Check if the addToCart method of the DAO has been called once with the correct parameters
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledWith(testUser, productModel);
    expect(response).toBe(true); // Check if the response is true
});

// Test for the getCart method of the CartController
test("getCart should return the current cart if it exists", async () => {
    const testUser = { // Define a test user object
        username: "testUser",
        password: "password",
        role: Role.CUSTOMER,
        name: "Test",
        surname: "User",
        birthdate: "2000-01-01",
        address: "123 Test Street" // Add the address property
    };

    const mockCart = new Cart("testUser", false, "", 200, [new ProductInCart("iPhone13", 1, Category.SMARTPHONE, 200)]);
    
    jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(mockCart); // Mock the getCart method of the DAO
    const controller = new CartController(); // Create a new instance of the controller
    // Call the getCart method of the controller with the test user object
    const response = await controller.getCart(testUser);

    // Check if the getCart method of the DAO has been called once with the correct parameters
    expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
    expect(response).toEqual(mockCart); // Check if the response is the mock cart
});

test("getCart should return an empty cart if no unpaid cart exists", async () => {
    const testUser = { // Define a test user object
        username: "testUser",
        password: "password",
        role: Role.CUSTOMER,
        name: "Test",
        surname: "User",
        birthdate: "2000-01-01",
        address: "123 Test Street" // Add the address property
    };

    const emptyCart = new Cart(testUser.username, false, "", 0, []);
    
    jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(emptyCart); // Mock the getCart method of the DAO
    const controller = new CartController(); // Create a new instance of the controller
    // Call the getCart method of the controller with the test user object
    const response = await controller.getCart(testUser);

    // Check if the getCart method of the DAO has been called once with the correct parameters
    expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
    expect(response).toEqual(emptyCart); // Check if the response is the empty cart
});

// Test for the checkoutCart method of the CartController
test("checkoutCart should return true when the cart is successfully checked out", async () => {
    const testUser = { // Define a test user object
        username: "testUser",
        password: "password",
        role: Role.CUSTOMER,
        name: "Test",
        surname: "User",
        birthdate: "2000-01-01",
        address: "123 Test Street" // Add the address property
    };

    jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true); // Mock the checkoutCart method of the DAO
    const controller = new CartController(); // Create a new instance of the controller
    // Call the checkoutCart method of the controller with the test user object
    const response = await controller.checkoutCart(testUser);

    // Check if the checkoutCart method of the DAO has been called once with the correct parameters
    expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledWith(testUser);
    expect(response).toBe(true); // Check if the response is true
});

// Test for the getCustomerCarts method of the CartController
test("getCustomerCarts should return an array of paid carts for the user", async () => {
    const testUser = { // Define a test user object
        username: "testUser",
        password: "password",
        role: Role.CUSTOMER,
        name: "Test",
        surname: "User",
        birthdate: "2000-01-01",
        address: "123 Test Street" // Add the address property
    };

    const mockCarts = [
        new Cart("testUser", true, "2024-05-02", 200, [new ProductInCart("iPhone13", 1, Category.SMARTPHONE, 200)]),
        new Cart("testUser", true, "2024-06-15", 400, [new ProductInCart("MacBookPro", 1, Category.LAPTOP, 400)])
    ];
    
    jest.spyOn(CartDAO.prototype, "getCustomerCarts").mockResolvedValueOnce(mockCarts); // Mock the getCustomerCarts method of the DAO
    const controller = new CartController(); // Create a new instance of the controller
    // Call the getCustomerCarts method of the controller with the test user object
    const response = await controller.getCustomerCarts(testUser);

    // Check if the getCustomerCarts method of the DAO has been called once with the correct parameters
    expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledWith(testUser);
    expect(response).toEqual(mockCarts); // Check if the response is the mock carts array
});

// Test for the removeProductFromCart method of the CartController
test("removeProductFromCart should return true when product is successfully removed", async () => {
    const testUser = { // Define a test user object
        username: "testUser",
        password: "password",
        role: Role.CUSTOMER,
        name: "Test",
        surname: "User",
        birthdate: "2000-01-01",
        address: "123 Test Street"
    };
    const productModel = "iPhone13";

    jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValueOnce(true); // Mock the removeProductFromCart method of the DAO
    const controller = new CartController(); // Create a new instance of the controller
    // Call the removeProductFromCart method of the controller with the test user object
    const response = await controller.removeProductFromCart(testUser, productModel);

    // Check if the removeProductFromCart method of the DAO has been called once with the correct parameters
    expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser, productModel);
    expect(response).toBe(true); // Check if the response is true
});

// Test for the clearCart method of the CartController
test("clearCart should return true when the cart is successfully cleared", async () => {
    const testUser = { // Define a test user object
        username: "testUser",
        password: "password",
        role: Role.CUSTOMER,
        name: "Test",
        surname: "User",
        birthdate: "2000-01-01",
        address: "123 Test Street"
    };

    jest.spyOn(CartDAO.prototype, "clearCart").mockResolvedValueOnce(true); // Mock the clearCart method of the DAO
    const controller = new CartController(); // Create a new instance of the controller
    // Call the clearCart method of the controller with the test user object
    const response = await controller.clearCart(testUser);

    // Check if the clearCart method of the DAO has been called once with the correct parameters
    expect(CartDAO.prototype.clearCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.clearCart).toHaveBeenCalledWith(testUser);
    expect(response).toBe(true); // Check if the response is true
});

// Test for the deleteAllCarts method of the CartController
test("deleteAllCarts should return true when all carts are successfully deleted", async () => {
    jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValueOnce(true); // Mock the deleteAllCarts method of the DAO
    const controller = new CartController(); // Create a new instance of the controller
    // Call the deleteAllCarts method of the controller
    const response = await controller.deleteAllCarts();

    // Check if the deleteAllCarts method of the DAO has been called once
    expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
    expect(response).toBe(true); // Check if the response is true
});

// Test for the getAllCarts method of the CartController
test("getAllCarts should return an array of all carts", async () => {
    const mockCarts = [
        new Cart("testUser", true, "2024-05-02", 200, [new ProductInCart("iPhone13", 1, Category.SMARTPHONE, 200)]),
        new Cart("anotherUser", false, "", 0, [])
    ];

    jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValueOnce(mockCarts); // Mock the getAllCarts method of the DAO
    const controller = new CartController(); // Create a new instance of the controller
    // Call the getAllCarts method of the controller
    const response = await controller.getAllCarts();

    // Check if the getAllCarts method of the DAO has been called once
    expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledTimes(1);
    expect(response).toEqual(mockCarts); // Check if the response is the mock carts array
});