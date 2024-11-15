import db from "../db/db"
import { ProductReview } from "../components/review"
import { ExistingReviewError, NoReviewProductError } from "../errors/reviewError";
import { ProductNotFoundError } from "../errors/productError";
/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {

    /**
     * Adds a new review for a product.
     * @param model The model of the product to review.
     * @param user The username of the user who made the review.
     * @param score The score assigned to the product, in the range [1, 5].
     * @param comment The comment made by the user.
     * @returns A Promise that resolves to nothing.
     */
    addReview(model: string, user: string, score: number, comment: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // Check if the product exists in the database
            const sqlProductCheck = "SELECT * FROM products WHERE model = ?";
            db.get(sqlProductCheck, [model], (err: Error | null, product: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!product) {
                    reject(new ProductNotFoundError());
                    return;
                }

                // Check if the review exists in the database
                const sqlCheck = "SELECT * FROM reviews WHERE model = ? AND user = ?";
                db.get(sqlCheck, [model, user], (err: Error | null, review: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (review) {
                        reject(new ExistingReviewError());
                        return;
                    }

                    // Add the review to the database
                    const date = new Date().toISOString().split('T')[0];
                    const sqlInsert = "INSERT INTO reviews(model, user, score, date, comment) VALUES(?, ?, ?, ?, ?)";
                    db.run(sqlInsert, [model, user, score, date, comment], (err: Error | null) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
            });
        });
    }

    /**
     * Returns all reviews for a product.
     * @param model The model of the product to get reviews from.
     * @returns A Promise that resolves to an array of ProductReview objects.
     */
    getProductReviews(model: string): Promise<ProductReview[]> {
        return new Promise<ProductReview[]>((resolve, reject) => {
            const sqlProductCheck = "SELECT * FROM products WHERE model = ?";
            db.get(sqlProductCheck, [model], (err: Error | null, product: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!product) {
                    reject(new ProductNotFoundError()); // Reject with ProductNotFoundError if no product found
                    return;
                }
    
                const sql = "SELECT * FROM reviews WHERE model = ?";
                db.all(sql, [model], (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (rows.length === 0) {
                        resolve([]); // Ensure empty array is returned if no reviews found
                        return;
                    }
                    const reviews: ProductReview[] = rows.map(row => {
                        const formattedDate = new Date(row.date).toISOString().split('T')[0];
                        return new ProductReview(row.model, row.user, row.score, formattedDate, row.comment);
                    });
                    resolve(reviews);
                });
            });
        });
    }

    /**
     * Deletes the review made by a user for a product.
     * @param model The model of the product to delete the review from.
     * @param user The user who made the review to delete.
     * @returns A Promise that resolves to nothing.
     */
    deleteReview(model: string, user: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // Check if the product exists in the database
            const sqlProductCheck = "SELECT * FROM products WHERE model = ?";
            db.get(sqlProductCheck, [model], (err: Error | null, product: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!product) {
                    reject(new ProductNotFoundError());
                    return;
                }

                // Check if the user has a review for the product
                const sqlReviewCheck = "SELECT * FROM reviews WHERE model = ? AND user = ?";
                db.get(sqlReviewCheck, [model, user], (err: Error | null, review: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!review) {
                        reject(new NoReviewProductError());
                        return;
                    }

                    // Delete the review
                    const sqlDelete = "DELETE FROM reviews WHERE model = ? AND user = ?";
                    db.run(sqlDelete, [model, user], (err: Error | null) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
            });
        });
    }

    /**
     * Deletes all reviews for a product.
     * @param model The model of the product to delete the reviews from.
     * @returns A Promise that resolves to nothing.
     */
    deleteReviewsOfProduct(model: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // Check if the product exists in the database
            const sqlProductCheck = "SELECT * FROM products WHERE model = ?";
            db.get(sqlProductCheck, [model], (err: Error | null, product: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!product) {
                    reject(new ProductNotFoundError());
                    return;
                }

                // Delete the reviews
                const sqlDelete = "DELETE FROM reviews WHERE model = ?";
                db.run(sqlDelete, [model], (err: Error | null) => {
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
     * Deletes all reviews of all products.
     * @returns A Promise that resolves to nothing.
     */
    deleteAllReviews(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM reviews";
            db.run(sql, [], (err: Error | null) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

}

export default ReviewDAO;