import { expect, jest, test, afterEach } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import Authenticator from "../../src/routers/auth"
jest.mock("../../src/routers/auth")
import ReviewController from "../../src/controllers/reviewController"




const baseURL = "/ezelectronics"
afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
});
const errorMessage = 'Internal Server Error';
const review = {model: 'model1', user: 'user1', score:5, comment: 'Great product', date:'2990-01-01' }

test("addReview It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce() 
    const response = await request(app).post(baseURL + `/reviews/${review.model}`).send(review);
    expect(response.status).toBe(200) 
    expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(1)
})
test('addReview should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, 'addReview').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).post(baseURL + `/reviews/:${review.model}`).send(review);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("getProductReviews It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce([review]) 
    const response = await request(app).get(baseURL + `/reviews/:${review.model}`);
    expect(response.status).toBe(200) 
    expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledTimes(1)
})
test('getProductReviews should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, 'getProductReviews').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).get(baseURL + `/reviews/:${review.model}`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});

test("deleteReview It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValueOnce() 
    const response = await request(app).delete(baseURL + `/reviews/:${review.model}`);
    expect(response.status).toBe(200);
    expect(ReviewController.prototype.deleteReview).toHaveBeenCalledTimes(1);
})
test('deleteReview should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isCustomer').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, 'deleteReview').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).delete(baseURL + `/reviews/:${review.model}`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("deleteReviewsOfProduct It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce() 
    const response = await request(app).delete(baseURL + `/reviews/:${review.model}/all`);
    expect(response.status).toBe(200) 
    expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1)
})
test('deleteReviewsOfProduct should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, 'deleteReviewsOfProduct').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).delete(baseURL + `/reviews/:${review.model}/all`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});
test("deleteAllReviews It should return a 200 success code", async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce() 
    const response = await request(app).delete(baseURL + `/reviews`);
    expect(response.status).toBe(200) 
    expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledTimes(1)
})
test('deleteAllReviews should handle errors and return a 503 error code', async () => {
    jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, 'isAdminOrManager').mockImplementationOnce((req, res, next) => next());
    jest.spyOn(ReviewController.prototype, 'deleteAllReviews').mockRejectedValueOnce(new Error(errorMessage));
    const response = await request(app).delete(baseURL + `/reviews`);
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe(errorMessage);
});