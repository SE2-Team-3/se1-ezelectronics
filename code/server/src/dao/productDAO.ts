import db from "../db/db";
import { Product } from "../components/product";
import {InvalidArrivalDate, ProductNotFoundError,ChangeDateInFutureError, ChangeDateBeforeArrivalError, ProductAlreadyExistsError, EmptyProductStockError, LowProductStockError, InvalidParameterCombinationError, InvalidSellingDateError } from "../errors/productError";
/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {

    /**
     * Returns all products in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    getProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            // check if grouping is null and any of the category or model is not null
            if (grouping === null && (category !== null || model !== null)) {
                reject(new InvalidParameterCombinationError());
                return;
            }
    
            let sql = `SELECT * FROM products WHERE 1=1`; // Ensure the base query is valid
            const params: any[] = [];
    
            // Treat undefined the same as null
            grouping = grouping === undefined ? null : grouping;
            category = category === undefined ? null : category;
            model = model === undefined ? null : model;
    
            switch (grouping) {
                case null:
                    break; // No grouping, fetch all available products
                case "category":
                    if (model !== null || category === null || !["Smartphone", "Laptop", "Appliance"].includes(category)) {
                        reject(new InvalidParameterCombinationError());
                        return;
                    }
                    sql += ` AND category = ?`;
                    params.push(category);
                    break;
                case "model":
                    if (!model || category !== null) {
                        reject(new InvalidParameterCombinationError());
                        return;
                    }
                    sql += ` AND model = ?`;
                    params.push(model);
                    
                    // Check if the model exists in the database
                    const sqlCheckModel = `SELECT COUNT(*) as count FROM products WHERE model = ?`;
                    db.get(sqlCheckModel, [model], (err: Error | null, row: any) => {
                        if (err) {
                            reject(new Error("Database query failed"));
                            return;
                        }
                        if (row.count === 0) {
                            reject(new ProductNotFoundError());
                            return;
                        }
                    });
                    break;
                default:
                    reject(new InvalidParameterCombinationError());
                    return;
            }
    
            db.all(sql, params, (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(new Error("Database query failed"));
                    return;
                }
                if (rows.length === 0) {
                    // Check if the entire products table is empty
                    const sqlCheckEmpty = `SELECT COUNT(*) as count FROM products`;
                    db.get(sqlCheckEmpty, [], (err: Error | null, row: any) => {
                        if (err) {
                            reject(new Error("Database query failed"));
                            return;
                        }
                        if (row.count === 0) {
                            resolve([]); // Return empty array if the table is empty
                        } else {
                            resolve([]); // Return empty array if no products match the query
                        }
                    });
                    return;
                }
                const products: Product[] = rows.map(row => ({
                    sellingPrice: row.sellingPrice,
                    model: row.model,
                    category: row.category,
                    arrivalDate: row.arrivalDate,
                    details: row.details,
                    quantity: row.quantity
                }));
                resolve(products);
            });
        });
    }

    /**
     * Returns all available products (with a quantity above 0) in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    getAvailableProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            // check if grouping is null and any of the category or model is not null
            if (grouping === null && (category !== null || model !== null)) {
                reject(new InvalidParameterCombinationError());
                return;
            }
    
            let sql = `SELECT * FROM products WHERE quantity > 0`; // Ensure the base query is valid
            const params: any[] = [];
    
            // Treat undefined the same as null
            grouping = grouping === undefined ? null : grouping;
            category = category === undefined ? null : category;
            model = model === undefined ? null : model;
    
            switch (grouping) {
                case null:
                    break; // No grouping, fetch all available products
                case "category":
                    if (model !== null || category === null || !["Smartphone", "Laptop", "Appliance"].includes(category)) {
                        reject(new InvalidParameterCombinationError());
                        return;
                    }
                    sql += ` AND category = ?`;
                    params.push(category);
                    break;
                case "model":
                    if (!model || category !== null) {
                        reject(new InvalidParameterCombinationError());
                        return;
                    }
                    sql += ` AND model = ?`;
                    params.push(model);
                    break;
                default:
                    reject(new InvalidParameterCombinationError());
                    return;
            }
    
            db.all(sql, params, (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(new Error("Database query failed"));
                    return;
                }
                if (rows.length === 0) {
                    if (grouping === "category") {
                        resolve([]);
                    } else if (grouping === "model") {
                        // Check if the model exists in the database
                        const sqlCheckModel = `SELECT * FROM products WHERE model = ?`;
                        db.all(sqlCheckModel, [model], (err: Error | null, rows: any[]) => {
                            if (err) {
                                reject(new Error("Database query failed"));
                                return;
                            }
                            if (rows.length === 0) {
                                reject(new ProductNotFoundError());
                            } else {
                                resolve([]);
                            }
                        });
                    } else {
                        reject(new ProductNotFoundError());
                    }
                    return;
                }
                const products: Product[] = rows.map(row => ({
                    sellingPrice: row.sellingPrice,
                    model: row.model,
                    category: row.category,
                    arrivalDate: row.arrivalDate,
                    details: row.details,
                    quantity: row.quantity
                }));
                resolve(products);
            });
        });
    }

    /**
     * Registers a new product concept (model, with quantity defining the number of units available) in the database.
     * @param model The unique model of the product.
     * @param category The category of the product.
     * @param quantity The number of units of the new product.
     * @param details The optional details of the product.
     * @param sellingPrice The price at which one unit of the product is sold.
     * @param arrivalDate The optional date in which the product arrived.
     * @returns A Promise that resolves to nothing.
     */
    registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (arrivalDate == null) {
                arrivalDate = new Date().toISOString().slice(0,10); // Format as YYYY-MM-DD
            } else {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(arrivalDate)) {
                    reject(new InvalidParameterCombinationError()); // 422 error for invalid date format
                    return;
                }
                const [year, month, day] = arrivalDate.split('-').map(Number);
                const isValidDate = (y: number, m: number, d: number) => {
                    const date = new Date(y, m - 1, d);
                    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
                };
                if (!isValidDate(year, month, day)) {
                    reject(new InvalidParameterCombinationError()); // 422 error for invalid date
                    return;
                }
                const arrivalDateObj = new Date(arrivalDate);
                const currentDate = new Date();
                if (arrivalDateObj > currentDate) {
                    reject(new InvalidArrivalDate()); // 400 error when arrivalDate is after the current date
                    return;
                }
            }

            if (
                !model || 
                model == "" || 
                (category !== "Smartphone" && category !== "Laptop" && category !== "Appliance") ||
                quantity <= 0 || 
                isNaN(quantity) || 
                sellingPrice <= 0 || 
                isNaN(sellingPrice) 
            ) {
                reject(new InvalidParameterCombinationError());
                return;
            }

            const sqlCheck = "SELECT model FROM products WHERE model = ?";
            db.get(sqlCheck, [model], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    reject(new ProductAlreadyExistsError());
                    return;
                }

                const sqlInsert = "INSERT INTO products (model, category, quantity, details, sellingPrice, arrivalDate) VALUES (?, ?, ?, ?, ?, ?)";
                db.run(sqlInsert, [model, category, quantity, details, sellingPrice, arrivalDate], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    /**
     * Deletes a product from the database identified by its model.
     * @param model The model of the product to delete.
     * @returns A Promise that resolves to true if the product has been successfully deleted.
     */
    deleteProduct(model: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const sqlCheck = "SELECT model FROM products WHERE model = ?";
            db.get(sqlCheck, [model], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    reject(new ProductNotFoundError());
                    return;
                }

                const sqlDelete = "DELETE FROM products WHERE model = ?";
                db.run(sqlDelete, [model], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(true);
                });
            });
        });
    }

    /**
     * Deletes all products from the database.
     * @returns A Promise that resolves to `true` if all products have been successfully deleted.
     */
    deleteAllProducts(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const sql = "DELETE FROM products";
            db.run(sql, [], (err: Error | null) => {
                if (err) {
                    reject(err);
                    return;
                }
                // Ensure the database is empty by checking the count of products
                const sqlCheck = "SELECT COUNT(*) as count FROM products";
                db.get(sqlCheck, [], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (row.count === 0) {
                        resolve(true);
                    } else {
                        reject(new Error("Failed to delete all products"));
                    }
                });
            });
        });
    }

     /**
     * Increases the available quantity of a product through the addition of new units.
     * @param model The model of the product to increase.
     * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
     * @param changeDate The optional date in which the change occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */

     changeProductQuantity(model: string, newQuantity: number, changeDate: string | null): Promise<number> {
         return new Promise<number>((resolve, reject) => {

             if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
                 reject(new InvalidParameterCombinationError());
                 return;
             }

             if (!changeDate) {
                 changeDate = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD
             } else {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(changeDate)) {
                    reject(new InvalidParameterCombinationError()); // 422 error for invalid date format
                    return;
                }
                const [year, month, day] = changeDate.split('-').map(Number);
                const isValidDate = (y: number, m: number, d: number) => {
                    const date = new Date(y, m - 1, d);
                    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
                };
                if (!isValidDate(year, month, day)) {
                    reject(new InvalidParameterCombinationError()); // 422 error for invalid date
                    return;
                }
             }

             const sqlSelect = "SELECT quantity, arrivalDate FROM products WHERE model = ?";
             db.get(sqlSelect, [model], (err: Error | null, row: any) => {
                 if (err) {
                     reject(err);
                     return;
                 }
                 if (!row) {
                     reject(new ProductNotFoundError());
                     return;
                 }

                 const changeDateObj = new Date(changeDate);
                 const currentDate = new Date();
                 const arrivalDate = new Date(row.arrivalDate);

                 if (changeDateObj > currentDate) {
                     reject(new ChangeDateInFutureError());
                     return;
                 }

                 if (changeDateObj < arrivalDate) {
                     reject(new ChangeDateBeforeArrivalError());
                     return;
                 }

                 const sqlUpdate = "UPDATE products SET quantity = quantity + ? WHERE model = ?";
                 db.run(sqlUpdate, [newQuantity, model], (err: Error | null) => {
                     if (err) {
                         reject(err);
                         return;
                     }
                     db.get(sqlSelect, [model], (err: Error | null, row: any) => {
                         if (err) {
                             reject(err);
                             return;
                         }
                         resolve(row.quantity);
                     });
                 });
             });
         });
     }
    /**
     * Decreases the available quantity of a product through the sale of units.
     * @param model The model of the product to sell.
     * @param quantity The number of product units that were sold.
     * @param sellingDate The optional date in which the sale occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    sellProduct(model: string, quantity: number, sellingDate: string | null): Promise<number> {
        return new Promise<number>((resolve, reject) => {

            if (sellingDate == null) {
                sellingDate = new Date().toISOString().slice(0,10); // Format as YYYY-MM-DD
            } else {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(sellingDate)) {
                    reject(new InvalidParameterCombinationError()); // 422 error for invalid date format
                    return;
                }
                const [year, month, day] = sellingDate.split('-').map(Number);
                const isValidDate = (y: number, m: number, d: number) => {
                    const date = new Date(y, m - 1, d);
                    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
                };
                if (!isValidDate(year, month, day)) {
                    reject(new InvalidParameterCombinationError()); // 422 error for invalid date
                    return;
                }
            }

            const sqlSelect = "SELECT quantity, arrivalDate FROM products WHERE model = ?";
            db.get(sqlSelect, [model], (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    reject(new ProductNotFoundError());
                    return;
                }
                
                if (row.quantity < quantity) {
                    reject(new LowProductStockError());
                    return;
                }

                if (row.quantity == 0) { 
                    reject(new EmptyProductStockError());
                    return;
                }

                if(new Date(sellingDate) > new Date()){
                    reject(new InvalidSellingDateError());
                    return;
                }
                
                if(new Date(sellingDate) < new Date(row.arrivalDate)){
                    reject(new InvalidSellingDateError());
                    return;
                }

                const sqlUpdate = "UPDATE products SET quantity = quantity - ? WHERE model = ?";
                db.run(sqlUpdate, [quantity, model], (err: Error | null) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    db.get(sqlSelect, [model], (err: Error | null, row: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(row.quantity);
                    });
                });
            });
        });
    }
}

export default ProductDAO