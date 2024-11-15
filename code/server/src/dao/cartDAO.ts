import db from "../db/db";
import { Cart, ProductInCart } from "../components/cart";
import { User } from "../components/user";
import {  EmptyProductStockError, ProductNotFoundError} from "../errors/productError";
import { ConflictWithProductQuantity, CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError } from "../errors/cartError";

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {

    /**
     * Adds a product to the user's cart. If the product is already in the cart, the quantity should be increased by 1.
     * If the product is not in the cart, it should be added with a quantity of 1.
     * If there is no current unpaid cart in the database, then a new cart should be created.
     * @param user - The user to whom the product should be added.
     * @param productId - The model of the product to add.
     * @returns A Promise that resolves to `true` if the product was successfully added.
     */
    addToCart(user: User, productId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            // Check if there is an unpaid cart for the user
            const findCartSql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
            db.get(findCartSql, [user.username], (err: Error | null, cart: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                const addProductToCart = (cartId: number) => {
                    // First, check the current stock of the product
                    const checkStockSql = "SELECT quantity FROM products WHERE model = ?";
                    db.get(checkStockSql, [productId], (err: Error | null, result: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (!result) {
                            reject(new ProductNotFoundError());
                            return;
                        }
                        if (result.quantity == 0) {
                            reject(new EmptyProductStockError());
                            return;
                        }
    
                        // Check if the product is already in the cart
                        const findProductSql = "SELECT * FROM cart_products WHERE cart_id = ? AND model = ?";
                        db.get(findProductSql, [cartId, productId], (err: Error | null, product: any) => {
                            if (err) {
                                reject(err);
                                return;
                            }
    
                            if (product) {
                                // If product is already in the cart, increase the quantity by 1
                                const updateProductSql = "UPDATE cart_products SET quantity = quantity + 1 WHERE cart_id = ? AND model = ?";
                                db.run(updateProductSql, [cartId, productId], (err: Error | null) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    // Update total in the cart
                                    const updateTotalSql = "UPDATE carts SET total = total + (SELECT sellingPrice FROM products WHERE model = ?) WHERE cart_id = ?";
                                    db.run(updateTotalSql, [productId, cartId], (err: Error | null) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        resolve(true);
                                    });
                                });
                            } else {
                                // If product is not in the cart, add it with quantity 1
                                const addProductSql = "INSERT INTO cart_products (cart_id, model, quantity, category, price) VALUES (?, ?, 1, (SELECT category FROM products WHERE model = ?), (SELECT sellingPrice FROM products WHERE model = ?))";
                                db.run(addProductSql, [cartId, productId, productId, productId], (err: Error | null) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    // Update total in the cart
                                    const updateTotalSql = "UPDATE carts SET total = total + (SELECT sellingPrice FROM products WHERE model = ?) WHERE cart_id = ?";
                                    db.run(updateTotalSql, [productId, cartId], (err: Error | null) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        resolve(true);
                                    });
                                });
                            }
                        });
                    });
                };
    
                if (cart) {
                    addProductToCart(cart.cart_id);
                } else {
                    const createCartSql = "INSERT INTO carts (customer, paid, paymentDate, total) VALUES (?, 0, NULL, 0)";
                    db.run(createCartSql, [user.username], (err: Error | null) => {
                        if (err) {
                            // console.error("Error creating new cart:", err);
                            reject(err);
                            return;
                        }
                        const getNewCartIdSql = "SELECT cart_id FROM carts WHERE customer = ? AND paid = 0 ORDER BY cart_id DESC LIMIT 1";
                        db.get(getNewCartIdSql, [user.username], (err: Error | null, newCart: any) => {
                            if (err) {
                                console.error("Error retrieving new cart ID:", err);
                                reject(err);
                                return;
                            }
                            addProductToCart(newCart.cart_id);
                        });
                    });
                }
            });
        });

        }

    /**
     * Retrieves the current cart for a specific user.
     * @param user - The user for whom to retrieve the cart.
     * @returns A Promise that resolves to the user's cart or an empty one if there is no current cart.
     */
    getCart(user: User): Promise<Cart> {
        return new Promise<Cart>((resolve, reject) => {
            // Check if there is an unpaid cart for the user
            const findCartSql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
            db.get(findCartSql, [user.username], (err: Error | null, cartRow: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (cartRow) {
                    // If there is an unpaid cart, retrieve the products in it
                    const findProductsSql = "SELECT * FROM cart_products WHERE cart_id = ?";
                    db.all(findProductsSql, [cartRow.cart_id], (err: Error | null, productRows: any[]) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const products: ProductInCart[] = productRows.map(row => new ProductInCart(row.model, row.quantity, row.category, row.price));
                        const cart = new Cart(cartRow.customer, cartRow.paid, cartRow.paymentDate, cartRow.total, products);
                        resolve(cart);
                    });
                } else {
                    // If there is no unpaid cart, return an empty cart
                    const emptyCart = new Cart(user.username, false, "", 0, []);
                    resolve(emptyCart);
                }
            });
        });
    }

    /**
     * Checks out the user's cart. We assume that payment is always successful, there is no need to implement anything related to payment.
     * @param user - The user whose cart should be checked out.
     * @returns A Promise that resolves to `true` if the cart was successfully checked out.
     */
    checkoutCart(user: User): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const findCartSql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
            db.get(findCartSql, [user.username], (err: Error | null, cart: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!cart) {
                    reject(new CartNotFoundError());
                    return;
                }
                if (cart.customer !== user.username) {
                    reject(new WrongUserCartError());
                    return;
                }
                if (cart.total === 0) {
                    reject(new EmptyCartError());
                    return;
                }
    
                // Check each product in the cart
                const findProductsSql = "SELECT * FROM cart_products WHERE cart_id = ?";
                db.all(findProductsSql, [cart.cart_id], (err: Error | null, productRows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
    
                    const productChecks = productRows.map(productRow => {
                        return new Promise<void>((resolve, reject) => {
                            const checkStockSql = "SELECT quantity FROM products WHERE model = ?";
                            db.get(checkStockSql, [productRow.model], (err: Error | null, result: any) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                if (!result) {
                                    reject(new ProductNotFoundError());
                                    return;
                                }
                                if (result.quantity < productRow.quantity) {
                                    reject(new ConflictWithProductQuantity());
                                    return;
                                }
                                // Decrease the product quantity in the inventory
                                const decreaseQuantitySql = "UPDATE products SET quantity = quantity - ? WHERE model = ?";
                                db.run(decreaseQuantitySql, [productRow.quantity, productRow.model], (err: Error | null) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    resolve();
                                });
                            });
                        });
                    });
    
                    Promise.all(productChecks)
                        .then(() => {
                            const checkoutSql = "UPDATE carts SET paid = 1, paymentDate = ? WHERE cart_id = ?";
                            db.run(checkoutSql, [new Date().toISOString().slice(0, 10), cart.cart_id], (err: Error | null) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(true);
                            });
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            });
        });
    }


    /**
     * Retrieves all paid carts for a specific customer.
     * @param user - The customer for whom to retrieve the carts.
     * @returns A Promise that resolves to an array of carts belonging to the customer.
     * Only the carts that have been checked out should be returned, the current cart should not be included in the result.
     */
    getCustomerCarts(user: User): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            // Find all paid carts for the user
            const findCartsSql = "SELECT * FROM carts WHERE customer = ? AND paid = 1";
            db.all(findCartsSql, [user.username], (err: Error | null, cartRows: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (cartRows.length === 0) {
                    resolve([]);
                    return;
                }

                const carts: Cart[] = [];
                let processedCarts = 0;

                cartRows.forEach(cartRow => {
                    const findProductsSql = "SELECT * FROM cart_products WHERE cart_id = ?";
                    db.all(findProductsSql, [cartRow.cart_id], (err: Error | null, productRows: any[]) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const products: ProductInCart[] = productRows.map(row => new ProductInCart(row.model, row.quantity, row.category, row.price));
                        const cart = new Cart(cartRow.customer, cartRow.paid, cartRow.paymentDate, cartRow.total, products);
                        carts.push(cart);
                        processedCarts++;

                        if (processedCarts === cartRows.length) {
                            resolve(carts);
                        }
                    });
                });
            });
        });
    }

    /**
     * Removes one product unit from the current cart. In case there is more than one unit in the cart, only one should be removed.
     * @param user The user who owns the cart.
     * @param product The model of the product to remove.
     * @returns A Promise that resolves to `true` if the product was successfully removed.
     */
    removeProductFromCart(user: User, product: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // Check if the product exists in the database
            const sqlProductCheck = "SELECT * FROM products WHERE model = ?";
            db.get(sqlProductCheck, [product], (err: Error | null, product: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!product) {
                    reject(new ProductNotFoundError());
                    return;
                }});
            // Find the unpaid cart for the user
            const findCartSql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
            db.get(findCartSql, [user.username], (err: Error | null, cartRow: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!cartRow) {
                    // No unpaid cart found
                    reject(new CartNotFoundError());
                    return;
                }

                const cartId = cartRow.cart_id;
                // Find the product in the cart
                const findProductSql = "SELECT * FROM cart_products WHERE cart_id = ? AND model = ?";
                db.get(findProductSql, [cartId, product], (err: Error | null, productRow: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (!productRow) {
                        // Product not found in cart
                        reject(new ProductNotInCartError());
                        return;
                    }

                    if (productRow.quantity > 1) {
                        // If more than one unit, decrease the quantity by 1
                        const updateProductSql = "UPDATE cart_products SET quantity = quantity - 1 WHERE cart_id = ? AND model = ?";
                        db.run(updateProductSql, [cartId, product], (err: Error | null) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            // update total in the cart
                            const updateTotalSql = "UPDATE carts SET total = total - (SELECT sellingPrice FROM products WHERE model = ?) WHERE cart_id = ?";
                            db.run(updateTotalSql, [product, cartId], (err: Error | null) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(true);
                            });
                        });
                    } else {
                        // If only one unit, remove the product from the cart
                        const deleteProductSql = "DELETE FROM cart_products WHERE cart_id = ? AND model = ?";
                        db.run(deleteProductSql, [cartId, product], (err: Error | null) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            // update total in the cart
                            const updateTotalSql = "UPDATE carts SET total = total - (SELECT sellingPrice FROM products WHERE model = ?) WHERE cart_id = ?";
                            db.run(updateTotalSql, [product, cartId], (err: Error | null) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(true);
                            });
                        });
                    }
                });
            });
        });
    }

    /**
     * Removes all products from the current cart.
     * @param user - The user who owns the cart.
     * @returns A Promise that resolves to `true` if the cart was successfully cleared.
     */
    clearCart(user: User): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // Find the unpaid cart for the user
            const findCartSql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
            db.get(findCartSql, [user.username], (err: Error | null, cartRow: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!cartRow) {
                    // No unpaid cart found
                    reject(new CartNotFoundError());
                    return;
                }

                const cartId = cartRow.cart_id;
                // Remove all products from the cart
                const clearCartSql = "DELETE FROM cart_products WHERE cart_id = ?";
                db.run(clearCartSql, [cartId], (err: Error | null) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    // set total to 0
                    const updateTotalSql = "UPDATE carts SET total = 0 WHERE cart_id = ?";
                    db.run(updateTotalSql, [cartId], (err: Error | null) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    });
                });
            });
        });
    }

    /**
     * Deletes all carts of all users.
     * @returns A Promise that resolves to `true` if all carts were successfully deleted.
     */
    deleteAllCarts(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const deleteCartsSql = "DELETE FROM carts";
            const deleteCartProductsSql = "DELETE FROM cart_products";
            db.serialize(() => {
                db.run(deleteCartProductsSql, [], (err: Error | null) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    db.run(deleteCartsSql, [], (err: Error | null) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    });
                });
            });
        });
    }

    /**
     * Retrieves all carts in the database.
     * @returns A Promise that resolves to an array of carts.
     */
    getAllCarts(): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            const findCartsSql = "SELECT * FROM carts";
            db.all(findCartsSql, [], (err: Error | null, cartRows: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (cartRows.length === 0) {
                    resolve([]);
                    return;
                }

                const carts: Cart[] = [];
                let processedCarts = 0;

                cartRows.forEach(cartRow => {
                    const findProductsSql = "SELECT * FROM cart_products WHERE cart_id = ?";
                    db.all(findProductsSql, [cartRow.cart_id], (err: Error | null, productRows: any[]) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const products: ProductInCart[] = productRows.map(row => new ProductInCart(row.model, row.quantity, row.category, row.price));
                        const cart = new Cart(cartRow.customer, cartRow.paid, cartRow.paymentDate, cartRow.total, products);
                        carts.push(cart);
                        processedCarts++;

                        if (processedCarts === cartRows.length) {
                            resolve(carts);
                        }
                    });
                });
            });
        });
    }

}

export default CartDAO