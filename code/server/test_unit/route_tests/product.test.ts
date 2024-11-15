import { expect, jest, test, afterEach } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"

import ProductController from "../../src/controllers/productController"
import { Category } from "../../src/components/product"; 
import Authenticator from "../../src/routers/auth"
jest.mock("../../src/routers/auth")
const baseURL = "/ezelectronics"

afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
});
const errorMessage = 'Internal Server Error';
const product = { sellingPrice: 200, model: "iPhone 13", category: Category.SMARTPHONE, arrivalDate: "2024-01-01", details: "", quantity: 8 }

test("registerProducts It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce() 
    const response = await request(app).post(baseURL + `/products`).send(product);
    expect(response.status).toBe(200) 
    expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(1)
})
test('registerProducts should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, 'registerProducts').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).post(baseURL + `/products`).send(product);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("changeProductQuantity It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(product.quantity) 
    const response = await request(app).patch(baseURL + `/products/:${product.model}`).send(product);
    expect(response.status).toBe(200) 
    expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1)
})
test('changeProductQuantity should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, 'changeProductQuantity').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).patch(baseURL + `/products/:${product.model}`).send(product);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("sellProduct It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(product.quantity) 
    const response = await request(app).patch(baseURL + `/products/:${product.model}/sell`).send(product);
    expect(response.status).toBe(200) 
    expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1)
})
test('sellProduct should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, 'sellProduct').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).patch(baseURL + `/products/:${product.model}/sell`).send(product);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("getProducts It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce([product]) 
    const response = await request(app).get(baseURL + `/products`);
    expect(response.status).toBe(200) 
    expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1)
})
test('getProducts should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, 'getProducts').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).get(baseURL + `/products`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("getAvailableProducts It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce([product]) 
    const response = await request(app).get(baseURL + `/products/available`);
    expect(response.status).toBe(200) 
    expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledTimes(1)
})
test('getAvailableProducts should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, 'getAvailableProducts').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).get(baseURL + `/products/available`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("deleteAllProducts It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, "deleteAllProducts").mockResolvedValueOnce(true) 
    const response = await request(app).delete(baseURL + `/products`);
    expect(response.status).toBe(200) 
    expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledTimes(1)
})
test('deleteAllProducts should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, 'deleteAllProducts').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).delete(baseURL + `/products`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("deleteProduct It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, "deleteProduct").mockResolvedValueOnce(true) 
    const response = await request(app).delete(baseURL + `/products/:${product.model}`);
    expect(response.status).toBe(200) 
    expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(1)
})
test('deleteProduct should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ProductController.prototype, 'deleteProduct').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).delete(baseURL + `/products/:${product.model}`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});