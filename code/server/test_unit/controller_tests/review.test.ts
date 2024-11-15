import { test, expect, jest } from "@jest/globals"
import ReviewController from "../../src/controllers/reviewController"
import ReviewDAO from "../../src/dao/reviewDAO";
import { User, Role } from "../../src/components/user"

jest.mock("../../src/dao/reviewDAO")
jest.mock("../../src/components/user")


test("addReview void", async () => {
    const model = 'model'
    const score = 3
    const comment = "good"
    const user = { //Define a test user object
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: Role.MANAGER,
        address: 'test',
        birthdate: ''
    }
    const testUser = new User(user.username, user.name, user.surname, user.role, user.address, user.birthdate);
    
    const spy = jest.spyOn(ReviewDAO.prototype, "addReview");
    const controller = new ReviewController(); 
    await controller.addReview(model, testUser,score, comment );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model, testUser.username, score, comment);
    spy.mockRestore();
});

test("getProductReviews should return an array", async () => {
    const model = 'model'
    
    const spy = jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValueOnce([]);
    const controller = new ReviewController(); 
    const response = await controller.getProductReviews(model);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model);
    expect(response).toBeInstanceOf(Array);
    expect(response).toEqual([])
    spy.mockRestore();
});

test("deleteReview void", async () => {
    const model = 'model'
    const user = { //Define a test user object
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: Role.MANAGER,
        address: 'test',
        birthdate: ''
    }
    const testUser = new User(user.username, user.name, user.surname, user.role, user.address, user.birthdate);
    
    const spy = jest.spyOn(ReviewDAO.prototype, "deleteReview");
    const controller = new ReviewController(); 
    await controller.deleteReview(model, testUser);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model, testUser.username);
    spy.mockRestore();
});

test("deleteReviewsOfProduct void", async () => {
    const model = 'model'
    
    const spy = jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct");
    const controller = new ReviewController(); 
    await controller.deleteReviewsOfProduct(model);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model);
    spy.mockRestore();
});

test("deleteAllReviews void", async () => {
    const model = 'model'
    
    const spy = jest.spyOn(ReviewDAO.prototype, "deleteAllReviews");
    const controller = new ReviewController(); 
    await controller.deleteAllReviews();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
});