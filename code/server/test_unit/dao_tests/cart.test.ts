import { test, expect, jest, beforeEach, describe, it, afterAll } from "@jest/globals";
import CartDAO from "../../src/dao/cartDAO";
import { User, Role } from "../../src/components/user";
import db from "../../src/db/db"; 
import { EmptyProductStockError, ProductNotFoundError } from "../../src/errors/productError";
import { CartNotFoundError, WrongUserCartError, EmptyCartError, ProductNotInCartError } from "../../src/errors/cartError";
import { Cart, ProductInCart } from "../../src/components/cart"; // Import Cart and ProductInCart classes
import { Category } from "../../src/components/product"; 
import { Database } from "sqlite3"

jest.mock("../../src/db/db"); // Mock the db module

beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
});
afterAll(() => {
    jest.clearAllMocks();
});

jest.mock("../../src/db/db"); // Corrected mock path

beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
});
describe('addToCart', () => {
    // Test for the addToCart method of the CartDAO
    // test("should return true when product is successfully added to an existing cart", async () => {
    //     const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
    //     const productId = "iPhone13";
    //     const cartId = 1;

    //     (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
    //         if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
    //             callback(null, { cart_id: cartId }); // Mock existing unpaid cart
    //         } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
    //             callback(null, { quantity: 10 }); // Mock product stock
    //         } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
    //             callback(null, null); // Mock product not in cart
    //         }
    //     });

    //     (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
    //         callback(null); // Mock successful database run
    //     });

    //     const dao = new CartDAO();
    //     const result = await dao.addToCart(testUser, productId);

    //     expect(result).toBe(true);
    //     expect(db.get).toHaveBeenCalledTimes(3); // Check that db.get was called three times
    //     expect(db.run).toHaveBeenCalledTimes(3); // Check that db.run was called three times
    // });

    // test("should increase the quantity of the product if it is already in the cart", async () => {
    //     const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
    //     const productId = "iPhone13";
    //     const cartId = 1;

    //     (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
    //         if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
    //             callback(null, { cart_id: cartId }); // Mock existing unpaid cart
    //         } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
    //             callback(null, { quantity: 10 }); // Mock product stock
    //         } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
    //             callback(null, { quantity: 1 }); // Mock product in cart
    //         }
    //     });

    //     (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
    //         callback(null); // Mock successful database run
    //     });

    //     const dao = new CartDAO();
    //     const result = await dao.addToCart(testUser, productId);

    //     expect(result).toBe(true);
    //     expect(db.get).toHaveBeenCalledTimes(3); // Check that db.get was called three times
    //     expect(db.run).toHaveBeenCalledTimes(3); // Check that db.run was called three times
    // });

    test("should throw an EmptyProductStockError if the product is out of stock", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: 1 }); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 0 }); // Mock out of stock
            }
        });

        const dao = new CartDAO();
        await expect(dao.addToCart(testUser, productId)).rejects.toThrow(EmptyProductStockError);

        expect(db.get).toHaveBeenCalledTimes(2); // Check that db.get was called twice
    });
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // it('has no product and no cart', async () => {
    //     const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
    //     const productId = "iPhone13";
    //     const cartId = 1;
    //     const newCartId = 2;
    //     const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
    //         if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
    //             callback(null, null); // Mock existing unpaid cart
    //         } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
    //             callback(null, { quantity: 10 }); // Mock product stock
    //         } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
    //             callback(null, null); // Mock product not in cart
    //         }
    //         return {} as Database
    //     });
    //     const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
    //         if (sql.includes("INSERT INTO carts (customer, paid, paymentDate, total) VALUES (?, 0, NULL, 0)")) {
    //         //    this.lastID = newCartId; // Mock new cart ID
    //         } 
    //         callback(null)
    //         return {} as Database
    //     });
        
    //     const dao = new CartDAO();
    //     const result = await dao.addToCart(testUser, productId);
    //     expect(result).toBe(true);
    //     mockDBGet.mockRestore()
    //     mockDBRun.mockRestore()
    // });
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });
    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: cartId }); // Mock existing unpaid cart
            }
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });
    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new ProductNotFoundError();
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: cartId }); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 0 }); // Mock product stock
            }
            callback(null, null)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e).toEqual(error);
        }
        mockDBGet.mockRestore()
    });
    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: cartId }); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 10 }); // Mock product stock
            }
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });
    it('should reject on database error mockDBRun has product', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: cartId }); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 10 }); // Mock product stock
            } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, { quantity: 1 }); // Mock product not in cart
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    it('should reject on database error mockDBRun has product', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new Error('Database error');
        const updateProductSql = "UPDATE cart_products SET quantity = quantity + 1 WHERE cart_id = ? AND model = ?";
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: cartId }); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 10 }); // Mock product stock
            } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, { quantity: 1 }); // Mock product not in cart
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if(sql === updateProductSql )callback(null)
            callback(error)
            return {} as Database
        });
        
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    it('should reject on database error mockDBRun has product', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new Error('Database error');
        const updateProductSql = "UPDATE cart_products SET quantity = quantity + 1 WHERE cart_id = ? AND model = ?";
        const updateTotalSql = "UPDATE carts SET total = total + (SELECT sellingPrice FROM products WHERE model = ?) WHERE cart_id = ?";
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: cartId }); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 10 }); // Mock product stock
            } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, { quantity: 1 }); // Mock product not in cart
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if(sql === updateProductSql )callback(null)
            else if (sql === updateTotalSql) callback(null)
            callback(error)
            return {} as Database
        });
        
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    it('should reject on database error mockDBRun has no product', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: cartId }); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 10 }); // Mock product stock
            } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, null); // Mock product not in cart
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    it('should reject on database error mockDBRun has no product', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new Error('Database error');
        const addProductSql = "INSERT INTO cart_products (cart_id, model, quantity, category, price) VALUES (?, ?, 1, (SELECT category FROM products WHERE model = ?), (SELECT sellingPrice FROM products WHERE model = ?))";
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: cartId }); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 10 }); // Mock product stock
            } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, null); // Mock product not in cart
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if(sql === addProductSql) callback(null)
            callback(error)
            return {} as Database
        });
        
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    it('should reject on database error mockDBRun has no product', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new Error('Database error');
        const addProductSql = "INSERT INTO cart_products (cart_id, model, quantity, category, price) VALUES (?, ?, 1, (SELECT category FROM products WHERE model = ?), (SELECT sellingPrice FROM products WHERE model = ?))";
        const updateTotalSql = "UPDATE carts SET total = total + (SELECT sellingPrice FROM products WHERE model = ?) WHERE cart_id = ?";
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, { cart_id: cartId }); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 10 }); // Mock product stock
            } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, null); // Mock product not in cart
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if(sql === addProductSql) callback(null)
            else if(sql === updateTotalSql) callback(null)
            callback(error)
            return {} as Database
        });
        
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    it('should reject on database error mockDBRun has no product and no cart', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const error = new Error('Database error');
        const addProductSql = "INSERT INTO cart_products (cart_id, model, quantity, category, price) VALUES (?, ?, 1, (SELECT category FROM products WHERE model = ?), (SELECT sellingPrice FROM products WHERE model = ?))";
        const updateTotalSql = "UPDATE carts SET total = total + (SELECT sellingPrice FROM products WHERE model = ?) WHERE cart_id = ?";
        const decreaseProductQuantitySql = "UPDATE products SET quantity = quantity - 1 WHERE model = ?";
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, null); // Mock existing unpaid cart
            } else if (sql.includes("SELECT quantity FROM products WHERE model = ?")) {
                callback(null, { quantity: 10 }); // Mock product stock
            } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, null); // Mock product not in cart
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if(sql === addProductSql) callback(null)
            else if(sql === updateTotalSql) callback(null)
            else if(sql === decreaseProductQuantitySql) callback(null)
            callback(error)
            return {} as Database
        });
        
        const dao = new CartDAO();
        try {
            await dao.addToCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });

});
describe('getCart', () => {
    test("should return the current cart if it exists", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const cartId = 1;

        const mockCartRow: { cart_id: number; customer: string; paid: boolean; paymentDate: string | null; total: number } = {
            cart_id: cartId,
            customer: "testUser",
            paid: false,
            paymentDate: null,
            total: 200
        };
        const mockProductRows: { model: string; quantity: number; category: string; price: number }[] = [
            { model: "iPhone13", quantity: 1, category: "Smartphone", price: 200 }
        ];

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, mockCartRow); // Mock existing unpaid cart
            }
        });

        (db.all as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ?")) {
                callback(null, mockProductRows); // Mock products in the cart
            }
        });

        const dao = new CartDAO();
        const result = await dao.getCart(testUser);

        expect(result).toBeInstanceOf(Cart);
        expect(result.customer).toBe("testUser");
        expect(result.paid).toBe(false);
        expect(result.total).toBe(200);
        expect(result.products).toHaveLength(1);
        expect(result.products[0].model).toBe("iPhone13");
        expect(result.products[0].quantity).toBe(1);
        expect(result.products[0].category).toBe("Smartphone");
        expect(result.products[0].price).toBe(200);
        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.all).toHaveBeenCalledTimes(1); // Check that db.all was called once
    });

    test("should return an empty cart if no unpaid cart exists", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, null); // Mock no existing unpaid cart
            }
        });

        const dao = new CartDAO();
        const result = await dao.getCart(testUser);

        expect(result).toBeInstanceOf(Cart);
        expect(result.customer).toBe("testUser");
        expect(result.paid).toBe(false);
        expect(result.total).toBe(0);
        expect(result.products).toHaveLength(0);
        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.all).toHaveBeenCalledTimes(0); // Check that db.all was not called
    });

    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");

        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.getCart(testUser);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });
    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const cartId = 1;

        const mockCartRow: { cart_id: number; customer: string; paid: boolean; paymentDate: string | null; total: number } = {
            cart_id: cartId,
            customer: "testUser",
            paid: false,
            paymentDate: null,
            total: 200
        };
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockCartRow)
            return {} as Database
        });
        const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
            callback(error); 
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.getCart(testUser);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBAll.mockRestore()
        mockDBGet.mockRestore()
    });
});
describe('checkoutCart', () => {
    // Test for the checkoutCart method of the CartDAO
    // test("should return true when the cart is successfully checked out", async () => {
    //     const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
    //     const cartId = 1;

    //     const mockCart = { cart_id: cartId, customer: "testUser", paid: false, paymentDate: "", total: 200 };

    //     (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
    //         if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
    //             callback(null, mockCart); // Mock existing unpaid cart
    //         }
    //     });

    //     (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
    //         callback(null); // Mock successful database run
    //     });

    //     const dao = new CartDAO();
    //     const result = await dao.checkoutCart(testUser);

    //     expect(result).toBe(true);
    //     expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
    //     expect(db.run).toHaveBeenCalledTimes(1); // Check that db.run was called once
    // });

    test("should throw CartNotFoundError if no unpaid cart exists", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, null); // Mock no existing unpaid cart
            }
        });

        const dao = new CartDAO();
        await expect(dao.checkoutCart(testUser)).rejects.toThrow(CartNotFoundError);

        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.run).toHaveBeenCalledTimes(0); // Check that db.run was not called
    });

    test("should throw WrongUserCartError if the cart belongs to a different user", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const mockCart = { cart_id: 1, customer: "differentUser", paid: false, paymentDate: "", total: 200 };

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, mockCart); // Mock existing unpaid cart for a different user
            }
        });

        const dao = new CartDAO();
        await expect(dao.checkoutCart(testUser)).rejects.toThrow(WrongUserCartError);

        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.run).toHaveBeenCalledTimes(0); // Check that db.run was not called
    });

    test("should throw EmptyCartError if the cart total is 0", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const mockCart = { cart_id: 1, customer: "testUser", paid: false, paymentDate: "", total: 0 };

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, mockCart); // Mock existing unpaid cart with total 0
            }
        });

        const dao = new CartDAO();
        await expect(dao.checkoutCart(testUser)).rejects.toThrow(EmptyCartError);

        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.run).toHaveBeenCalledTimes(0); // Check that db.run was not called
    });

    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.checkoutCart(testUser);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });

    // it('should reject on database error mockDBRun', async () => {
    //     const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
    //     const cartId = 1;

    //     const mockCart = { cart_id: cartId, customer: "testUser", paid: false, paymentDate: "", total: 200 };
    //     const error = new Error('Database error');
    //     const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
    //         callback(null, mockCart)
    //         return {} as Database
    //     });
    //     const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
    //         callback(error)
    //         return {} as Database
    //     });
    //     const dao = new CartDAO();
    //     try {
    //         await dao.checkoutCart(testUser);
    //     } catch (e) {
    //         expect(e.message).toBe("Database error");
    //     }
    //     mockDBGet.mockRestore()
    //     mockDBRun.mockRestore()
    // });
    
});
describe('getCustomerCarts', () => {
    // Test for the getCustomerCarts method of the CartDAO
    test("should return an array of paid carts for the user", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");

        const mockCartRows = [
            { cart_id: 1, customer: "testUser", paid: true, paymentDate: "2023-01-01", total: 200 },
            { cart_id: 2, customer: "testUser", paid: true, paymentDate: "2023-02-01", total: 300 }
        ];

        const mockProductRows = [
            { model: "iPhone13", quantity: 1, category: "Smartphone", price: 200 },
            { model: "MacBookPro", quantity: 1, category: "Laptop", price: 300 }
        ];

        (db.all as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 1")) {
                callback(null, mockCartRows); // Mock paid carts
            } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ?")) {
                callback(null, mockProductRows); // Mock products in the cart
            }
        });

        const dao = new CartDAO();
        const result = await dao.getCustomerCarts(testUser);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(2);

        expect(result[0].customer).toBe("testUser");
        expect(result[0].paid).toBe(true);
        expect(result[0].paymentDate).toBe("2023-01-01");
        expect(result[0].total).toBe(200);
        expect(result[0].products).toHaveLength(2);
        expect(result[0].products[0].model).toBe("iPhone13");
        expect(result[0].products[0].quantity).toBe(1);
        expect(result[0].products[0].category).toBe("Smartphone");
        expect(result[0].products[0].price).toBe(200);

        expect(result[1].customer).toBe("testUser");
        expect(result[1].paid).toBe(true);
        expect(result[1].paymentDate).toBe("2023-02-01");
        expect(result[1].total).toBe(300);
        expect(result[1].products).toHaveLength(2);
        expect(result[1].products[1].model).toBe("MacBookPro");
        expect(result[1].products[1].quantity).toBe(1);
        expect(result[1].products[1].category).toBe("Laptop");
        expect(result[1].products[1].price).toBe(300);

        expect(db.all).toHaveBeenCalledTimes(3); // Check that db.all was called three times
    });

    test("should return an empty array if no paid carts exist", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");

        (db.all as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 1")) {
                callback(null, []); // Mock no paid carts
            }
        });

        const dao = new CartDAO();
        const result = await dao.getCustomerCarts(testUser);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(0); // Check that the result is an empty array
        expect(db.all).toHaveBeenCalledTimes(1); // Check that db.all was called once
    });
    it('should reject on database error mockDBAll', async () => {
        const error = new Error('Database error');
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
            callback(error); 
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.getCustomerCarts(testUser);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBAll.mockRestore()
    });
    it('should reject on database error mockDBAll', async () => {
        const error = new Error('Database error');
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const mockCartRows = [
            { cart_id: 1, customer: "testUser", paid: true, paymentDate: "2023-01-01", total: 200 },
            { cart_id: 2, customer: "testUser", paid: true, paymentDate: "2023-02-01", total: 300 }
        ];
        const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 1")) {
                callback(null, mockCartRows); // Mock paid carts
            }
            callback(error); 
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.getCustomerCarts(testUser);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBAll.mockRestore()
    });
});
describe('removeProductFromCart', () => {
    // Test for the removeProductFromCart method of the CartDAO
    // test("should decrease the quantity if more than one unit exists", async () => {
    //     const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
    //     const productId = "iPhone13";
    //     const cartId = 1;

    //     const mockCartRow = { cart_id: cartId };
    //     const mockProductRow = { model: productId, quantity: 2 };

    //     (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
    //         if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
    //             callback(null, mockCartRow); // Mock existing unpaid cart
    //         } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
    //             callback(null, mockProductRow); // Mock product in cart with quantity 2
    //         }
    //     });

    //     (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
    //         callback(null); // Mock successful database run
    //     });

    //     const dao = new CartDAO();
    //     const result = await dao.removeProductFromCart(testUser, productId);

    //     expect(result).toBe(true);
    //     expect(db.get).toHaveBeenCalledTimes(2); // Check that db.get was called twice
    //     expect(db.run).toHaveBeenCalledTimes(2); // Check that db.run was called twice
    // });

    // test("should remove the product if only one unit exists", async () => {
    //     const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
    //     const productId = "iPhone13";
    //     const cartId = 1;

    //     const mockCartRow = { cart_id: cartId };
    //     const mockProductRow = { model: productId, quantity: 1 };

    //     (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
    //         if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
    //             callback(null, mockCartRow); // Mock existing unpaid cart
    //         } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
    //             callback(null, mockProductRow); // Mock product in cart with quantity 1
    //         }
    //     });

    //     (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
    //         callback(null); // Mock successful database run
    //     });

    //     const dao = new CartDAO();
    //     const result = await dao.removeProductFromCart(testUser, productId);

    //     expect(result).toBe(true);
    //     expect(db.get).toHaveBeenCalledTimes(2); // Check that db.get was called twice
    //     expect(db.run).toHaveBeenCalledTimes(2); // Check that db.run was called twice
    // });

    // test("should throw CartNotFoundError if no unpaid cart exists", async () => {
    //     const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
    //     const productId = "iPhone13";

    //     (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
    //         if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
    //             callback(null, null); // Mock no unpaid cart
    //         }
    //     });

    //     const dao = new CartDAO();
    //     await expect(dao.removeProductFromCart(testUser, productId)).rejects.toThrow(CartNotFoundError);

    //     expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
    // });

    // test("should throw ProductNotInCartError if the product is not in the cart", async () => {
    //     const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
    //     const productId = "iPhone13";
    //     const cartId = 1;

    //     const mockCartRow = { cart_id: cartId };

    //     (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
    //         if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
    //             callback(null, mockCartRow); // Mock existing unpaid cart
    //         } else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
    //             callback(null, null); // Mock product not in cart
    //         }
    //     });

    //     const dao = new CartDAO();
    //     await expect(dao.removeProductFromCart(testUser, productId)).rejects.toThrow(ProductNotInCartError);

    //     expect(db.get).toHaveBeenCalledTimes(2); // Check that db.get was called twice
    // });

    it('should reject on database error mockDBRun quantity>1', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const mockCartRow = { cart_id: cartId };
        const mockProductRow = { model: productId, quantity: 2 };
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, mockCartRow); // Mock existing unpaid cart
            }else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, mockProductRow); // Mock product in cart with quantity 2
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.removeProductFromCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });

    it('should reject on database error mockDBRun quantity>1', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const mockCartRow = { cart_id: cartId };
        const mockProductRow = { model: productId, quantity: 2 };
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, mockCartRow); // Mock existing unpaid cart
            }else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, mockProductRow); // Mock product in cart with quantity 2
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if(sql === 'UPDATE cart_products SET quantity = quantity - 1 WHERE cart_id = ? AND model = ?') callback(null)
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.removeProductFromCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });

    it('should reject on database error mockDBRun', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const mockCartRow = { cart_id: cartId };
        const mockProductRow = { model: productId, quantity: 1 };
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, mockCartRow); // Mock existing unpaid cart
            }else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, mockProductRow); // Mock product in cart with quantity 2
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.removeProductFromCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });

    it('should reject on database error mockDBRun', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const mockCartRow = { cart_id: cartId };
        const mockProductRow = { model: productId, quantity: 1 };
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, mockCartRow); // Mock existing unpaid cart
            }else if (sql.includes("SELECT * FROM cart_products WHERE cart_id = ? AND model = ?")) {
                callback(null, mockProductRow); // Mock product in cart with quantity 2
            }
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if(sql === 'DELETE FROM cart_products WHERE cart_id = ? AND model = ?') callback(null)
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.removeProductFromCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });

    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const cartId = 1;
        const mockCartRow = { cart_id: cartId };
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, mockCartRow); // Mock existing unpaid cart
            }
            callback(error)
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.removeProductFromCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });

    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const productId = "iPhone13";
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.removeProductFromCart(testUser, productId);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });
});
describe('clearCart', () => {
    // Test for the clearCart method of the CartDAO
    test("should remove all products from the cart and set total to 0", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const cartId = 1;

        const mockCartRow = { cart_id: cartId };

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, mockCartRow); // Mock existing unpaid cart
            }
        });

        (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(null); // Mock successful database run
        });

        const dao = new CartDAO();
        const result = await dao.clearCart(testUser);

        expect(result).toBe(true);
        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
        expect(db.run).toHaveBeenCalledTimes(2); // Check that db.run was called twice
    });

    test("should throw CartNotFoundError if no unpaid cart exists", async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");

        (db.get as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            if (sql.includes("SELECT * FROM carts WHERE customer = ? AND paid = 0")) {
                callback(null, null); // Mock no unpaid cart
            }
        });

        const dao = new CartDAO();
        await expect(dao.clearCart(testUser)).rejects.toThrow(CartNotFoundError);

        expect(db.get).toHaveBeenCalledTimes(1); // Check that db.get was called once
    });

    it('should reject on database error mockDBGet', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.clearCart(testUser);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });
    it('should reject on database error mockDBRun', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const cartId = 1;
        const mockCartRow = { cart_id: cartId };
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockCartRow)
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.clearCart(testUser);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
    it('should reject on database error mockDBRun', async () => {
        const testUser = new User("testUser", "Test", "User", Role.CUSTOMER, "123 Test Street", "2000-01-01");
        const cartId = 1;
        const mockCartRow = { cart_id: cartId };
        const clearCartSql = "DELETE FROM cart_products WHERE cart_id = ?";
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, mockCartRow)
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if (sql === clearCartSql) {
                callback(null);
            }
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.clearCart(testUser);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
        mockDBRun.mockRestore()
    });
});
describe('deleteAllCarts', () => {
    // Test for the deleteAllCarts method of the CartDAO
    test("should delete all carts and their products", async () => {

        const mockDBSerialize = jest.spyOn(db, "serialize").mockImplementation((fn: Function) => {
            fn();
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });

        const dao = new CartDAO();
        const result = await dao.deleteAllCarts();
        expect(result).toBe(true);
        mockDBSerialize.mockRestore()
        mockDBRun.mockRestore() // Check that db.run was called twice
    });
    it('should reject on database error mockDBRun', async () => {
        const error = new Error('Database error');
        const mockDBSerialize = jest.spyOn(db, "serialize").mockImplementation((fn: Function) => {
            fn();
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.deleteAllCarts();
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBSerialize.mockRestore()
        mockDBRun.mockRestore()
    });
    it('should reject on database error mockDBRun', async () => {
        const error = new Error('Database error');
        const mockDBSerialize = jest.spyOn(db, "serialize").mockImplementation((fn: Function) => {
            fn();
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if (sql === "DELETE FROM cart_products") {
                callback(null);
            }
            callback(error)
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.deleteAllCarts();
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBSerialize.mockRestore()
        mockDBRun.mockRestore()
    });
});
// Test for the getAllCarts method of the CartDAO
describe('getAllCarts', () => {
    const mockCartRows = [
        { cart_id: 1, customer: "testUser1", paid: true, paymentDate: "2023-01-01", total: 200 }
    ];
    const productRows = [
        { model: 'Product1', quantity: 2, category: 'Category1', price: 50 },
    ];

    it('should success', async () => {
        const mockDBALL = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            if (sql === "SELECT * FROM carts") {
                callback(null, mockCartRows);
            } else if (sql === "SELECT * FROM cart_products WHERE cart_id = ?") {
                callback(null, productRows);
            }
            return {} as Database
        });
        const dao = new CartDAO();
        const result = await dao.getAllCarts();
        expect(result.length).toBe(1);
        expect(result[0].products.length).toBe(1);
        mockDBALL.mockRestore()
    });
    it('should empty success', async () => {
        const mockDBALL = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            if (sql === "SELECT * FROM carts") {
                callback(null, []);
            }
            return {} as Database
        });
        const dao = new CartDAO();
        const result = await dao.getAllCarts();
        expect(result).toEqual([]);
        mockDBALL.mockRestore()
    });
    it('should reject on database error mockDBAll', async () => {
        const error = new Error('Database error');
        const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
            callback(error); 
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.getAllCarts();
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBAll.mockRestore()
    });
    it('should reject on database error mockDBAll', async () => {
        const error = new Error('Database error');
        const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
            if (sql === "SELECT * FROM carts") {
               callback(null, mockCartRows);
            }
            callback(error); 
            return {} as Database
        });
        const dao = new CartDAO();
        try {
            await dao.getAllCarts();
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBAll.mockRestore()
    });
});
