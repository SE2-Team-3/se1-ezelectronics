import { expect, jest, test, afterEach } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"

import CartController from "../../src/controllers/cartController"
import { ProductInCart } from "../../src/components/cart";
import { Category } from "../../src/components/product"; 
import Authenticator from "../../src/routers/auth"
jest.mock("../../src/routers/auth")

const baseURL = "/ezelectronics"

afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
});
const errorMessage = 'Internal Server Error';
const product = {model: 'iPhone13'}
const cart = {customer: 'testUser', paid: true, paymentDate:'1990-01-01', total: 320, products: [new ProductInCart("iPhone13", 1, Category.SMARTPHONE, 200)]}

test("getCart It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(cart) 
    const response = await request(app).get(baseURL + `/carts`);
    expect(response.status).toBe(200) 
    expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
})
test('getCart should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, 'getCart').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).get(baseURL + `/carts`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("addToCart It should return a 200 success code for adding a product", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true);
    const response = await request(app).post(baseURL + `/carts`).send(product);
    expect(response.status).toBe(200);
    expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
});
test("addToCart should handle errors and return a 503 error code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).post(baseURL + `/carts`).send(product);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("checkoutCart It should return a 200 success code for adding a product", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true);
    const response = await request(app).patch(baseURL + `/carts`);
    expect(response.status).toBe(200);
    expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
});
test("checkoutCart should handle errors and return a 503 error code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).patch(baseURL + `/carts`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("getCustomerCarts It should return a 200 success code for adding a product", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([cart]);
    const response = await request(app).get(baseURL + `/carts/history`);
    expect(response.status).toBe(200);
    expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
});
test("getCustomerCarts should handle errors and return a 503 error code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "getCustomerCarts").mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).get(baseURL + `/carts/history`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("removeProductFromCart It should return a 200 success code for adding a product", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true);
    const response = await request(app).delete(baseURL + `/carts/products/${product.model}`);
    expect(response.status).toBe(200);
    expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
});
test("removeProductFromCart should handle errors and return a 503 error code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).delete(baseURL + `/carts/products/:${product.model}`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("clearCart It should return a 200 success code for adding a product", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true);
    const response = await request(app).delete(baseURL + `/carts/current`);
    expect(response.status).toBe(200);
    expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1);
});
test("clearCart should handle errors and return a 503 error code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "clearCart").mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).delete(baseURL + `/carts/current`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("deleteAllCarts It should return a 200 success code for adding a product", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true);
    const response = await request(app).delete(baseURL + `/carts`);
    expect(response.status).toBe(200);
    expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
});
test("deleteAllCarts should handle errors and return a 503 error code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "deleteAllCarts").mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).delete(baseURL + `/carts`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("getAllCarts It should return a 200 success code for adding a product", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValueOnce([cart]);
    const response = await request(app).get(baseURL + `/carts/all`);
    expect(response.status).toBe(200);
    expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1);
});
test("getAllCarts should handle errors and return a 503 error code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(CartController.prototype, "getAllCarts").mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).get(baseURL + `/carts/all`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
