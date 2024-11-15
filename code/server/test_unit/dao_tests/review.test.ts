import { describe, expect, beforeAll, afterAll, jest, it, beforeEach, afterEach } from "@jest/globals"

import ReviewDAO from "../../src/dao/reviewDAO"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { User, Role } from "../../src/components/user"
import { ExistingReviewError, NoReviewProductError  } from "../../src/errors/reviewError";
import { ProductNotFoundError } from "../../src/errors/productError";
jest.mock("../../src/db/db.ts")
jest.mock("../../src/components/user")

const review = {model: 'model1', user: 'user1', score:5, comment: 'Great product'}
let reviewDAO: ReviewDAO;

beforeAll(() => {
    reviewDAO = new ReviewDAO();
});

afterAll(() => {
    jest.clearAllMocks();
});

describe('addReview', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a review successfully', async () => {
        const model = "iPhone 13";
        const user = "user1";
        const score = 4;
        const comment = "Great product!";
        const date = new Date().toISOString().split('T')[0];

        (db.get as jest.Mock)
            .mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
                callback(null, { model }); // Mock product exists
            })
            .mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
                callback(null, null); // Mock no existing review by user
            });

        (db.run as jest.Mock).mockImplementation((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(null); // Mock successful insertion
        });

        await expect(reviewDAO.addReview(model, user, score, comment)).resolves.toBeUndefined();

        expect(db.get).toHaveBeenCalledTimes(2);
        expect(db.run).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledWith(
            "INSERT INTO reviews(model, user, score, date, comment) VALUES(?, ?, ?, ?, ?)",
            [model, user, score, date, comment],
            expect.any(Function)
        );
    });

    it('should throw ProductNotFoundError when adding a review for a non-existent product', async () => {
        const model = "Nonexistent Model";
        const user = "user1";
        const score = 4;
        const comment = "Great product!";

        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, null); // Mock product does not exist
        });

        await expect(reviewDAO.addReview(model, user, score, comment)).rejects.toThrow(ProductNotFoundError);

        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(0);
    });

    it('should throw ExistingReviewError when adding a review for a product that already has a review by the same user', async () => {
        const model = "iPhone 13";
        const user = "user1";
        const score = 4;
        const comment = "Great product!";

        (db.get as jest.Mock)
            .mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
                callback(null, { model }); // Mock product exists
            })
            .mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
                callback(null, { user }); // Mock existing review by user
            });

        await expect(reviewDAO.addReview(model, user, score, comment)).rejects.toThrow(ExistingReviewError);

        expect(db.get).toHaveBeenCalledTimes(2);
        expect(db.run).toHaveBeenCalledTimes(0);
    });
});
describe('getProductReviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve product reviews successfully', async () => {
        const model = "iPhone 13";
        const mockReviews = [
            { model: "iPhone 13", user: "user1", score: 4, date: "2024-06-27", comment: "Great product!" },
            { model: "iPhone 13", user: "user2", score: 5, date: "2024-06-26", comment: "Awesome phone!" }
        ];

        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { model }); // Mock product exists
        });

        (db.all as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            callback(null, mockReviews); // Mock reviews found
        });

        const result = await reviewDAO.getProductReviews(model);

        expect(result).toHaveLength(2);
        expect(result[0].model).toBe("iPhone 13");
        expect(result[0].user).toBe("user1");
        expect(result[0].score).toBe(4);
        expect(result[0].date).toBe("2024-06-27");
        expect(result[0].comment).toBe("Great product!");

        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.all).toHaveBeenCalledTimes(1);
    });

    it('should throw ProductNotFoundError when trying to retrieve reviews for a non-existent product', async () => {
        const model = "Nonexistent Model";

        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, null); // Mock product does not exist
        });

        await expect(reviewDAO.getProductReviews(model)).rejects.toThrow(ProductNotFoundError);

        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.all).toHaveBeenCalledTimes(0);
    });


});
describe('deleteReview', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a review when it exists', async () => {
        const model = "iPhone 13";
        const user = "user1";

        // Mock product exists
        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { model }); // Mock product found
        });

        // Mock review exists
        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { model, user }); // Mock review found
        });

        // Mock deletion successful
        (db.run as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(null); // Mock successful deletion
        });

        const dao = new ReviewDAO();
        await dao.deleteReview(model, user);

        expect(db.run).toHaveBeenCalledTimes(1); // Check db.run call
    });

    it('should throw ProductNotFoundError when product does not exist', async () => {
        const model = "NonExistentModel";
        const user = "user1";

        // Mock product not found
        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, null); // Mock product not found
        });

        const dao = new ReviewDAO();
        await expect(dao.deleteReview(model, user)).rejects.toThrow(ProductNotFoundError);

        expect(db.get).toHaveBeenCalledTimes(1); // Check db.get call
        expect(db.run).not.toHaveBeenCalled(); // Ensure db.run was not called
    });

    it('should throw NoReviewProductError when review does not exist', async () => {
        const model = "iPhone 13";
        const user = "NonExistentUser";

        // Mock product exists
        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { model }); // Mock product found
        });

        // Mock review not found
        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, null); // Mock review not found
        });

        const dao = new ReviewDAO();
        await expect(dao.deleteReview(model, user)).rejects.toThrow(NoReviewProductError);

        expect(db.get).toHaveBeenCalledTimes(2); // Check db.get calls
        expect(db.run).not.toHaveBeenCalled(); // Ensure db.run was not called
    });


});
describe('deleteReviewsOfProduct', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete reviews of a product successfully', async () => {
        const model = "iPhone 13";

        // Mock product exists in database
        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { model }); // Mock product found
        });

        // Mock successful review deletion
        (db.run as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(null); // Mock successful deletion
        });

        const dao = new ReviewDAO();
        await dao.deleteReviewsOfProduct(model);

        expect(db.get).toHaveBeenCalledTimes(1); // Check db.get call
        expect(db.run).toHaveBeenCalledTimes(1); // Check db.run call
        expect(db.run).toHaveBeenCalledWith("DELETE FROM reviews WHERE model = ?", [model], expect.any(Function)); // Check SQL query and parameters
    });

    it('should throw ProductNotFoundError when product does not exist', async () => {
        const model = "Non-existent Model";

        // Mock product does not exist in database
        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, null); // Mock product not found
        });

        const dao = new ReviewDAO();
        await expect(dao.deleteReviewsOfProduct(model)).rejects.toThrowError(ProductNotFoundError);

        expect(db.get).toHaveBeenCalledTimes(1); // Check db.get call
        expect(db.run).not.toHaveBeenCalled(); // Ensure db.run was not called
    });

    it('should throw an error when deletion fails', async () => {
        const model = "iPhone 13";
        const errorMessage = "Database error";

        // Mock product exists in database
        (db.get as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null, row: any) => void) => {
            callback(null, { model }); // Mock product found
        });

        // Mock deletion failure
        (db.run as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(new Error(errorMessage)); // Mock deletion failure
        });

        const dao = new ReviewDAO();
        await expect(dao.deleteReviewsOfProduct(model)).rejects.toThrow(errorMessage);

        expect(db.get).toHaveBeenCalledTimes(1); // Check db.get call
        expect(db.run).toHaveBeenCalledTimes(1); // Check db.run call
        expect(db.run).toHaveBeenCalledWith("DELETE FROM reviews WHERE model = ?", [model], expect.any(Function)); // Check SQL query and parameters
    });

});
describe('deleteAllReviews', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete all reviews successfully', async () => {
        // Mock successful deletion
        (db.run as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(null); // Mock successful deletion
        });

        const dao = new ReviewDAO();
        await dao.deleteAllReviews();

        expect(db.run).toHaveBeenCalledTimes(1); // Check db.run call
        expect(db.run).toHaveBeenCalledWith("DELETE FROM reviews", [], expect.any(Function)); // Check SQL query and parameters
    });

    it('should throw an error when deletion fails', async () => {
        const errorMessage = "Database error";
        
        // Mock deletion failure
        (db.run as jest.Mock).mockImplementationOnce((sql: string, params: any[], callback: (err: Error | null) => void) => {
            callback(new Error(errorMessage)); // Mock deletion failure
        });

        const dao = new ReviewDAO();
        await expect(dao.deleteAllReviews()).rejects.toThrow(errorMessage);

        expect(db.run).toHaveBeenCalledTimes(1); // Check db.run call
        expect(db.run).toHaveBeenCalledWith("DELETE FROM reviews", [], expect.any(Function)); // Check SQL query and parameters
    });

});