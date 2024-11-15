import { test, expect, jest } from "@jest/globals"
import ProductController from "../../src/controllers/productController"
import ProductDAO from "../../src/dao/productDAO";

jest.mock("../../src/dao/productDAO")

test("registerProducts void", async () => {
    const product = {
        model: 'test',
        category: 'test',
        quantity: 3,
        details: '',
        sellingPrice: 300,
        arrivalDate: ''
    }
    
    const spy = jest.spyOn(ProductDAO.prototype, "registerProducts");
    const controller = new ProductController(); 
    await controller.registerProducts(product.model, product.category, product.quantity, product.details, product.sellingPrice, product.arrivalDate);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product.model, product.category, product.quantity, product.details, product.sellingPrice, product.arrivalDate);
    spy.mockRestore();
});


test("changeProductQuantity should return number", async () => {
    const model = 'test'
    const newQuantity = 3
    const changeDate = ''

    const spy = jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockResolvedValueOnce(newQuantity);
    const controller = new ProductController(); 
    const response = await controller.changeProductQuantity(model, newQuantity, changeDate);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model, newQuantity, changeDate);
    expect(response).toEqual(newQuantity);
    spy.mockRestore();
});

test("sellProduct should return number", async () => {
    const model = 'test'
    const quantity = 3
    const sellingDate = ''

    const spy = jest.spyOn(ProductDAO.prototype, "sellProduct").mockResolvedValueOnce(quantity);
    const controller = new ProductController(); 
    const response = await controller.sellProduct(model, quantity, sellingDate);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model, quantity, sellingDate);
    expect(response).toEqual(quantity);
    spy.mockRestore();
});

test("getProducts should return an array", async () => {
    const model = 'test'
    const category = 'Smartphone'
    const grouping = ''

    const spy = jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce([]);
    const controller = new ProductController(); 
    const response = await controller.getProducts(grouping, category, model);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(grouping, category, model);
    expect(response).toEqual([]);
    spy.mockRestore();
});

test("getAvailableProducts should return an array", async () => {
    const model = 'test'
    const category = 'Smartphone'
    const grouping = ''

    const spy = jest.spyOn(ProductDAO.prototype, "getAvailableProducts").mockResolvedValueOnce([]);
    const controller = new ProductController(); 
    const response = await controller.getAvailableProducts(grouping, category, model);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(grouping, category, model);
    expect(response).toEqual([]);
    spy.mockRestore();
});

test("deleteAllProducts should return true", async () => {
    const spy = jest.spyOn(ProductDAO.prototype, "deleteAllProducts").mockResolvedValueOnce(true);
    const controller = new ProductController(); 
    const response = await controller.deleteAllProducts();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(response).toBe(true);
    spy.mockRestore();
});

test("deleteProduct should return true", async () => {
    const model = 'test'

    const spy = jest.spyOn(ProductDAO.prototype, "deleteProduct").mockResolvedValueOnce(true);
    const controller = new ProductController(); 
    const response = await controller.deleteProduct(model);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model);
    expect(response).toBe(true);
    spy.mockRestore();
});