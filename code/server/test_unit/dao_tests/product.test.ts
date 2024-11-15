import { test, expect, jest, beforeEach, afterAll, describe } from "@jest/globals";
import ProductDAO from "../../src/dao/productDAO";
import db from "../../src/db/db"; // Import the database instance
import { Product, Category } from "../../src/components/product";
import { 
    ProductNotFoundError,
    ProductAlreadyExistsError,
    EmptyProductStockError,
    LowProductStockError,
    InvalidParameterCombinationError,
    InvalidSellingDateError,
    ChangeDateInFutureError, 
    ChangeDateBeforeArrivalError, 
} from "../../src/errors/productError";
import { Database } from "sqlite3"

jest.mock("../../src/db/db"); // Mock the db module

beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
});
afterAll(() => {
    jest.clearAllMocks();
});

describe('getProducts', () => {
    let productDAO: ProductDAO;

    beforeEach(() => {
        productDAO = new ProductDAO();
        jest.clearAllMocks();
    });

    test("should return all products if no grouping is provided", async () => {
        const mockProducts = [
            { sellingPrice: 200, model: "iPhone 13", category: "Smartphone", arrivalDate: "2024-01-01", details: "", quantity: 8 },
            { sellingPrice: 1000, model: "MacBook Pro", category: "Laptop", arrivalDate: "2024-01-01", details: "", quantity: 5 }
        ];
        (db.all as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            callback(null, mockProducts);
        });

        const result = await productDAO.getProducts(null, null, null);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual(new Product(200, "iPhone 13", Category.SMARTPHONE, "2024-01-01", "", 8));
        expect(result[1]).toEqual(new Product(1000, "MacBook Pro", Category.LAPTOP, "2024-01-01", "", 5));
        expect(db.all).toHaveBeenCalledTimes(1);
    });

    test("should return products filtered by category", async () => {
        const mockProducts = [
            { sellingPrice: 200, model: "iPhone 13", category: "Smartphone", arrivalDate: "2024-01-01", details: "", quantity: 8 }
        ];
        (db.all as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            callback(null, mockProducts);
        });

        const result = await productDAO.getProducts("category", "Smartphone", null);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(new Product(200, "iPhone 13", Category.SMARTPHONE, "2024-01-01", "", 8));
        expect(db.all).toHaveBeenCalledTimes(1);
    });

    test("should return error InvalidParameterCombinationError when category is null and model is provided", async () => {
        const error = new InvalidParameterCombinationError();
        await expect(productDAO.getProducts("category", null, "iPhone 13")).rejects.toThrow(error);
        expect(db.all).toHaveBeenCalledTimes(0);
    });

    test("should return error InvalidParameterCombinationError when model is not provided and category is provided", async () => {
        const error = new InvalidParameterCombinationError();
        await expect(productDAO.getProducts("model", "Smartphone", null)).rejects.toThrow(error);
        expect(db.all).toHaveBeenCalledTimes(0);
    });

    test("should return error InvalidParameterCombinationError for invalid grouping", async () => {
        const error = new InvalidParameterCombinationError();
        await expect(productDAO.getProducts("test", null, null)).rejects.toThrow(error);
        expect(db.all).toHaveBeenCalledTimes(0);
    });

    test("should return the product filtered by model", async () => {
        const mockProducts = [
            { sellingPrice: 200, model: "iPhone 13", category: "Smartphone", arrivalDate: "2024-01-01", details: "", quantity: 8 }
        ];
        (db.all as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            callback(null, mockProducts);
        });

        const result = await productDAO.getProducts("model", null, "iPhone 13");

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(new Product(200, "iPhone 13", Category.SMARTPHONE, "2024-01-01", "", 8));
        expect(db.all).toHaveBeenCalledTimes(1);
    });

    test("should throw ProductNotFoundError when the model does not exist", async () => {
        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { count: 0 });
        });

        await expect(productDAO.getProducts("model", null, "Nonexistent Model")).rejects.toThrow(ProductNotFoundError);
        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.all).toHaveBeenCalledTimes(1);
    });

    test("should return an empty array when there are no products available", async () => {
        (db.all as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            callback(null, []);
        });

        const result = await productDAO.getProducts(null, null, null);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(0);
        expect(db.all).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if there's a database error during the query", async () => {
        (db.all as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            callback(new Error("Database query failed"), null);
        });

        await expect(productDAO.getProducts(null, null, null)).rejects.toThrow("Database query failed");
        expect(db.all).toHaveBeenCalledTimes(1);
    });
});
describe('getAvailableProducts', () => {
    let productDAO: ProductDAO;

    beforeEach(() => {
        productDAO = new ProductDAO();
        jest.clearAllMocks();
    });

    test("should return all available products if no grouping is provided", async () => {
        const mockProducts = [
            { sellingPrice: 200, model: "iPhone 13", category: "Smartphone", arrivalDate: "2024-01-01", details: "", quantity: 8 },
            { sellingPrice: 1000, model: "MacBook Pro", category: "Laptop", arrivalDate: "2024-01-01", details: "", quantity: 5 }
        ];
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockProducts) 
            return {} as Database
        });

        const result = await productDAO.getAvailableProducts(null, null, null);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(2);

        expect(result[0]).toEqual(new Product(200, "iPhone 13", Category.SMARTPHONE, "2024-01-01", "", 8));
        expect(result[1]).toEqual(new Product(1000, "MacBook Pro", Category.LAPTOP, "2024-01-01", "", 5));

        expect(db.all).toHaveBeenCalledTimes(1);
        mockDBAll.mockRestore();
    });

    test("should throw InvalidParameterCombinationError if invalid grouping is provided", async () => {
        await expect(productDAO.getAvailableProducts('test', null, null)).rejects.toThrow(InvalidParameterCombinationError);
        expect(db.all).toHaveBeenCalledTimes(0);
    });

    test("should throw InvalidParameterCombinationError if model is provided with category", async () => {
        await expect(productDAO.getAvailableProducts('model', 'Smartphone', null)).rejects.toThrow(InvalidParameterCombinationError);
        expect(db.all).toHaveBeenCalledTimes(0);
    });

    test("should throw InvalidParameterCombinationError if category grouping is missing category", async () => {
        await expect(productDAO.getAvailableProducts('category', null, null)).rejects.toThrow(InvalidParameterCombinationError);
        expect(db.all).toHaveBeenCalledTimes(0);
    });

    test("should return available products filtered by category", async () => {
        const mockProducts = [
            { sellingPrice: 200, model: "iPhone 13", category: "Smartphone", arrivalDate: "2024-01-01", details: "", quantity: 8 }
        ];

        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockProducts) 
            return {} as Database
        });

        const result = await productDAO.getAvailableProducts("category", "Smartphone", null);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);

        expect(result[0]).toEqual(new Product(200, "iPhone 13", Category.SMARTPHONE, "2024-01-01", "", 8));

        expect(db.all).toHaveBeenCalledTimes(1);
        mockDBAll.mockRestore();
    });

    test("should return available products filtered by model", async () => {
        const mockProducts = [
            { sellingPrice: 200, model: "iPhone 13", category: "Smartphone", arrivalDate: "2024-01-01", details: "", quantity: 8 }
        ];

        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, mockProducts) 
            return {} as Database
        });

        const result = await productDAO.getAvailableProducts("model", null, "iPhone 13");

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);

        expect(result[0]).toEqual(new Product(200, "iPhone 13", Category.SMARTPHONE, "2024-01-01", "", 8));

        expect(db.all).toHaveBeenCalledTimes(1);
        mockDBAll.mockRestore();
    });

    test("should return empty array if no products are found for valid grouping", async () => {
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, []); // No products found
            return {} as Database;
        });

        const result = await productDAO.getAvailableProducts("category", "Smartphone", null);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(0);

        expect(db.all).toHaveBeenCalledTimes(1);
        mockDBAll.mockRestore();
    });

    test("should throw ProductNotFoundError if no products are found and model does not exist", async () => {
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            if (sql.includes('model = ?')) {
                callback(null, []); // No products found for model
            } else {
                callback(null, [{ model: "Nonexistent Model" }]); // Model check
            }
            return {} as Database;
        });

        await expect(productDAO.getAvailableProducts("model", null, "Nonexistent Model")).rejects.toThrow(ProductNotFoundError);

        expect(db.all).toHaveBeenCalledTimes(2);
        mockDBAll.mockRestore();
    });
});
describe('registerProducts', () => {
    test("should register a new product when the model does not already exist", async () => {
        const model = "iPhone 13";
        const category = "Smartphone";
        const quantity = 5;
        const details = "";
        const sellingPrice = 200;
        const arrivalDate = "2024-01-01";

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT model FROM products WHERE model = ?")) {
                callback(null, null); // Mock no existing product with this model
            }
        });

        (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
            if (sql.includes("INSERT INTO products")) {
                callback(null); // Mock successful insert
            }
        });

        const dao = new ProductDAO();
        await dao.registerProducts(model, category, quantity, details, sellingPrice, arrivalDate);

        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.run).toHaveBeenCalledTimes(1); // Check that db.run was called once
    });
    test("should register a new product when the model does not already exist and arrivalDate is null", async () => {
        const model = "iPhone 13";
        const category = "Smartphone";
        const quantity = 5;
        const details = "";
        const sellingPrice = 200;

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT model FROM products WHERE model = ?")) {
                callback(null, null); // Mock no existing product with this model
            }
        });

        (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
            if (sql.includes("INSERT INTO products")) {
                callback(null); // Mock successful insert
            }
        });

        const dao = new ProductDAO();
        await dao.registerProducts(model, category, quantity, details, sellingPrice, null);

        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.run).toHaveBeenCalledTimes(1); // Check that db.run was called once
    });
    test("should throw ProductAlreadyExistsError if the model already exists", async () => {
        const model = "iPhone 13";
        const category = "Smartphone";
        const quantity = 5;
        const details = "";
        const sellingPrice = 200;
        const arrivalDate = "2024-01-01";

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT model FROM products WHERE model = ?")) {
                callback(null, { model }); // Mock existing product with this model
            }
        });

        const dao = new ProductDAO();
        await expect(dao.registerProducts(model, category, quantity, details, sellingPrice, arrivalDate)).rejects.toThrow(ProductAlreadyExistsError);

        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.run).toHaveBeenCalledTimes(0); // Check that db.run was not called
    });
//     test("should throw an error if an error occurs during the insert", async () => {
//         const model = "iPhone 13";
//         const category = "Smartphone";
//         const quantity = 5;
//         const details = "";
//         const sellingPrice = 200;
//         const arrivalDate = "2024-01-01";

//         (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
//             if (sql.includes("SELECT model FROM products WHERE model = ?")) {
//                 callback(null, null); // Mock no existing product with this model
//             }
//         });

//         (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
//             if (sql.includes("INSERT INTO products")) {
//                 callback(new Error("Insert error")); // Mock an error during insert
//             }
//         });

//         const dao = new ProductDAO();
//         await expect(dao.registerProducts(model, category, quantity, details, sellingPrice, arrivalDate)).rejects.toThrow("Insert error");

//         expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
//         expect(db.run).toHaveBeenCalledTimes(1); // Check that db.run was called once
//     });
//     test("should throw an error if an error occurs during the check", async () => {
//         const model = "iPhone 13";
//         const category = "Smartphone";
//         const quantity = 5;
//         const details = "";
//         const sellingPrice = 200;
//         const arrivalDate = "2024-01-01";

//         (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
//             if (sql.includes("SELECT model FROM products WHERE model = ?")) {
//                 callback(new Error("Check error"), null); // Mock an error during the check
//             }
//         });

//         const dao = new ProductDAO();
//         await expect(dao.registerProducts(model, category, quantity, details, sellingPrice, arrivalDate)).rejects.toThrow("Check error");

//         expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
//         expect(db.run).toHaveBeenCalledTimes(0); // Check that db.run was not called
//     });
//     // Test for the registerProducts method with the current date as the arrival date
//     //test("registerProducts should use the current date as the arrival date if it is not provided", async () => {
//     //    const model = "iPhone 13";
//     //    const category = "Smartphone";
//     //    const quantity = 5;
//     //    const details = "";
//     //    const sellingPrice = 200;
//     //
//     //    (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
//     //        if (sql.includes("SELECT model FROM products WHERE model = ?")) {
//     //            callback(null, null); // Mock no existing product with this model
//     //        }
//     //    });
//     //
//     //    (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
//     //        callback(null); // Mock successful insert
//     //    });
//     //
//     //    const dao = new ProductDAO();
//     //    const currentDate = new Date().toISOString().split('T')[0];
//     //    await dao.registerProducts(model, category, quantity, details, sellingPrice, null);
//     //
//     //    expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
//     //    expect(db.run).toHaveBeenCalledWith(expect.anything(), [model, category, quantity, details, sellingPrice, currentDate], expect.anything());
//     //    expect(db.run).toHaveBeenCalledTimes(1); // Check that db.run was called once
//     //});

});
describe('deleteProduct', () => {
    let productDAO: ProductDAO;

    beforeEach(() => {
        productDAO = new ProductDAO();
        jest.clearAllMocks();
    });

    test("should delete a product when the model exists", async () => {
        const model = "iPhone 13";

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT model FROM products WHERE model = ?")) {
                callback(null, { model }); // Mock existing product with this model
            }
        });

        (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
            if (sql.includes("DELETE FROM products WHERE model = ?")) {
                callback(null); // Mock successful delete
            }
        });

        const result = await productDAO.deleteProduct(model);

        expect(result).toBe(true);
        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(1);
    });

    test("should throw ProductNotFoundError when the model does not exist", async () => {
        const model = "Nonexistent Model";

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT model FROM products WHERE model = ?")) {
                callback(null, null); // Mock non-existing product
            }
        });

        await expect(productDAO.deleteProduct(model)).rejects.toThrow(ProductNotFoundError);

        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(0);
    });

    test("should throw an error if there's a database error during model check", async () => {
        const model = "iPhone 13";

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT model FROM products WHERE model = ?")) {
                callback(new Error("Database error"), null); // Mock database error
            }
        });

        await expect(productDAO.deleteProduct(model)).rejects.toThrow("Database error");

        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(0);
    });

    test("should throw an error if there's a database error during deletion", async () => {
        const model = "iPhone 13";

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT model FROM products WHERE model = ?")) {
                callback(null, { model }); // Mock existing product with this model
            }
        });

        (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
            if (sql.includes("DELETE FROM products WHERE model = ?")) {
                callback(new Error("Deletion error")); // Mock database error during deletion
            }
        });

        await expect(productDAO.deleteProduct(model)).rejects.toThrow("Deletion error");

        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(1);
    });
});
describe('deleteAllProducts', () => {
//     // Test for the deleteAllProducts method when all products are successfully deleted
    test("should delete all products", async () => {
        (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(null); // Mock successful delete
        });

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { count: 0 }); // Mock successful count check
        });
        const dao = new ProductDAO();
        const result = await dao.deleteAllProducts();

        expect(result).toBe(true);
        expect(db.run).toHaveBeenCalledTimes(1); // Check that db.run was called once
        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
    });

    test("should throw an error if an error occurs during the delete", async () => {
        (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(new Error("Delete all error")); // Mock an error during delete
        });

        const dao = new ProductDAO();
        await expect(dao.deleteAllProducts()).rejects.toThrow("Delete all error");

        expect(db.run).toHaveBeenCalledTimes(1); // Check that db.run was called once
        expect(db.get).not.toHaveBeenCalled(); // Check that db.get was not called
    });
});
describe('changeProductQuantity', () => {
    test("should increase the quantity of an existing product", async () => {
       const model = "iPhone 13";
       const newQuantity = 5;
       const changeDate = "2024-01-01";
    
    
       const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, { quantity: newQuantity })
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
            callback(null); 
            return {} as Database
        });
    
       const dao = new ProductDAO();
       const result = await dao.changeProductQuantity(model, newQuantity, changeDate);
    
       expect(result).toBe( newQuantity);
       expect(db.get).toHaveBeenCalledTimes(2); // Check that db.get was called twice
       expect(db.run).toHaveBeenCalledTimes(1); // Check that db.run was called once
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    test("should increase the quantity of an existing product and changeDate null", async () => {
       const model = "iPhone 13";
       const newQuantity = 5;
    
    
       const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, { quantity: newQuantity })
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
            callback(null); 
            return {} as Database
        });
    
       const dao = new ProductDAO();
       const result = await dao.changeProductQuantity(model, newQuantity, null);
    
       expect(result).toBe( newQuantity);
       expect(db.get).toHaveBeenCalledTimes(2); // Check that db.get was called twice
       expect(db.run).toHaveBeenCalledTimes(1); // Check that db.run was called once
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    test("should throw ProductNotFoundError if the product does not exist", async () => {
        const model = "iPhone 13";
        const newQuantity = 5;
        const changeDate = "2024-01-01";

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, null);
        });

        const dao = new ProductDAO();
        await expect(dao.changeProductQuantity(model, newQuantity, changeDate)).rejects.toThrow(ProductNotFoundError);

        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.run).toHaveBeenCalledTimes(0); // Check that db.run was not called
    });
    test("should throw ChangeDateInFutureError", async () => {
        const model = "iPhone 13";
        const newQuantity = 5;
        const changeDate = "2025-01-01";
    
        const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, { quantity: newQuantity })
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
            callback(null); 
            return {} as Database
        });
    
        const dao = new ProductDAO();
        await expect(dao.changeProductQuantity(model, newQuantity, changeDate)).rejects.toThrow(ChangeDateInFutureError);
        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called twice
        expect(db.run).toHaveBeenCalledTimes(0); // Check that db.run was called once
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    test("should throw ChangeDateBeforeArrivalError", async () => {
        const model = "iPhone 13";
        const newQuantity = 5;
        const changeDate = "2024-01-01";
        const arrivalDate = "2025-01-01";
    
        const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, { quantity: newQuantity, arrivalDate })
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
            callback(null); 
            return {} as Database
        });
    
        const dao = new ProductDAO();
        await expect(dao.changeProductQuantity(model, newQuantity, changeDate)).rejects.toThrow(ChangeDateBeforeArrivalError);
        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called twice
        expect(db.run).toHaveBeenCalledTimes(0); // Check that db.run was called once
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    test('should reject on database error during check mockDBGet', async () => {
        const model = "iPhone 13";
        const newQuantity = 5;
        const changeDate = "2024-01-01";
        const error = new Error('Database error');
        const dao = new ProductDAO();
        const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(error); // No existing review
            return {} as Database
        });
        try {
            await dao.changeProductQuantity(model, newQuantity, changeDate)
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });
    test("should reject on database error during check mockDBRun", async () => {
        const dao = new ProductDAO();
        const error = new Error('Database error');
        const model = "iPhone 13";
        const newQuantity = 5;
        const changeDate = "2024-01-01";
    
    
       const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, { quantity: newQuantity })
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
            callback(error); 
            return {} as Database
        });
    
        try {
            await dao.changeProductQuantity(model, newQuantity, changeDate);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }

        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
        
    });
    test("should reject on database error during check mockDBGet", async () => {
        const dao = new ProductDAO();
        const error = new Error('Database error');
        const model = "iPhone 13";
        const newQuantity = 5;
        const changeDate = "2024-01-01";
    
    
        const mockDBGet = jest.spyOn(db, 'get').mockImplementationOnce((sql, params, callback) => {
            callback(null, { quantity: newQuantity })
            return {} as Database
        }).mockImplementationOnce((sql, params, callback) => {
            callback(error); 
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
            callback(null); 
            return {} as Database
        });
    
        try {
            await dao.changeProductQuantity(model, newQuantity, changeDate);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }

        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
        
    });
});
describe('sellProduct', () => {
    let productDAO: ProductDAO;

    beforeEach(() => {
        productDAO = new ProductDAO();
        jest.clearAllMocks();
    });

    test("should successfully sell a product with valid data", async () => {
        const model = "iPhone 13";
        const quantity = 2;
        const sellingDate = "2024-06-25";
        const initialQuantity = 10;

        (db.get as jest.Mock)
            .mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
                callback(null, { quantity: initialQuantity, arrivalDate: "2024-01-01" });
            })
            .mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
                callback(null, { quantity: initialQuantity - quantity });
            });

        (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(null);
        });

        const result = await productDAO.sellProduct(model, quantity, sellingDate);
        expect(result).toBe(initialQuantity - quantity);
        expect(db.get).toHaveBeenCalledTimes(2);
        expect(db.run).toHaveBeenCalledTimes(1);
    });

    test("should throw InvalidParameterCombinationError for invalid date format", async () => {
        const model = "iPhone 13";
        const quantity = 2;
        const sellingDate = "25-06-2024";

        await expect(productDAO.sellProduct(model, quantity, sellingDate)).rejects.toThrow(InvalidParameterCombinationError);
        expect(db.get).toHaveBeenCalledTimes(0);
        expect(db.run).toHaveBeenCalledTimes(0);
    });

    test("should throw InvalidParameterCombinationError for logically invalid date", async () => {
        const model = "iPhone 13";
        const quantity = 2;
        const sellingDate = "2024-02-30"; // Invalid date

        await expect(productDAO.sellProduct(model, quantity, sellingDate)).rejects.toThrow(InvalidParameterCombinationError);
        expect(db.get).toHaveBeenCalledTimes(0);
        expect(db.run).toHaveBeenCalledTimes(0);
    });

    test("should throw ProductNotFoundError when the product is not found", async () => {
        const model = "Nonexistent Model";
        const quantity = 2;
        const sellingDate = "2024-06-25";

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, null);
        });

        await expect(productDAO.sellProduct(model, quantity, sellingDate)).rejects.toThrow(ProductNotFoundError);
        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(0);
    });

    test("should throw LowProductStockError when there is insufficient stock", async () => {
        const model = "iPhone 13";
        const quantity = 20;
        const sellingDate = "2024-06-25";
        const initialQuantity = 10;

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { quantity: initialQuantity, arrivalDate: "2024-01-01" });
        });

        await expect(productDAO.sellProduct(model, quantity, sellingDate)).rejects.toThrow(LowProductStockError);
        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(0);
    });

    test("should throw InvalidSellingDateError when selling date is in the future", async () => {
        const model = "iPhone 13";
        const quantity = 2;
        const sellingDate = "2025-06-25";
        const initialQuantity = 10;

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { quantity: initialQuantity, arrivalDate: "2024-01-01" });
        });

        await expect(productDAO.sellProduct(model, quantity, sellingDate)).rejects.toThrow(InvalidSellingDateError);
        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(0);
    });

    test("should throw InvalidSellingDateError when selling date is before arrival date", async () => {
        const model = "iPhone 13";
        const quantity = 2;
        const sellingDate = "2023-12-31"; // Before arrival date
        const initialQuantity = 10;

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { quantity: initialQuantity, arrivalDate: "2024-01-01" });
        });

        await expect(productDAO.sellProduct(model, quantity, sellingDate)).rejects.toThrow(InvalidSellingDateError);
        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(0);
    });
});