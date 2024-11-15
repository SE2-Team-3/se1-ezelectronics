import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import { cleanup } from "../src/db/cleanup"


const routePath = "/ezelectronics" //Base route path for the API

//Default user information. We use them to create users and evaluate the returned values
const product = { sellingPrice: 200, model: "iPhone 13", category: 'Smartphone', arrivalDate: "2024-01-01", details: "", quantity: 8 }
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" }
const review = {model: 'model1', user: 'user1', score:5, comment: 'Great product'}
//Cookies for the users. We use them to keep users logged in. Creating them once and saving them in a variables outside of the tests will make cookies reusable
let customerCookie: string
let managerCookie: string

//Helper function that creates a new user in the database.
//Can be used to create a user before the tests or in the tests
//Is an implicit test because it checks if the return code is successful
const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
        .expect(200)
}

const postProduct = async () => {
    await postUser(manager)
    managerCookie = await login(manager)
    await request(app)
    .post(`${routePath}/products`).set("Cookie", managerCookie).send(product)
    .expect(200)
}

//Helper function that logs in a user and returns the cookie
//Can be used to log in a user before the tests or in the tests
const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    // Handle the specific case for 401 error
                    if (res && res.status === 401) {
                        reject(new Error('Unauthorized: Invalid username or password'))
                    } else {
                        reject(err)
                    }
                } else if (res.status === 401) {
                    // Handle the case where no error but status is 401
                    reject(new Error('Unauthorized: Invalid username or password'))
                } else {
                    resolve(res.header["set-cookie"][0])
                }
            })
    })
}

beforeAll(async () => {
    await cleanup()
    await new Promise(resolve => setTimeout(resolve, 15000))
    await postUser(customer)
    customerCookie = await login(customer)
})

afterAll( async() => {
    await cleanup();
});
describe('POST /reviews/:model', () => {
    test("should add a new review for a product", async () => {
        await postProduct()
        await request(app)
            .post(`${routePath}/reviews/${product.model}`).set("Cookie", customerCookie).send(review)
            .expect(200)
    })
    test('should return a 404 error if model does not represent an existing product', async () => {
        const model = "NonExistentModel";
        await request(app)
            .post(`${routePath}/reviews/${model}`).set("Cookie", customerCookie).send(review)
            .expect(404)
    });
    test('should return a 409 error if there is an existing review for the product made by the customer', async () => {
        await request(app)
            .post(`${routePath}/reviews/${product.model}`).set("Cookie", customerCookie).send(review)
            .expect(409)
    });
});
describe('GET /reviews/:model', () => {
    test('should return all reviews for a specific product', async () => {
        const response = await request(app)
            .get(`${routePath}/reviews/${product.model}`).set("Cookie", customerCookie)
            .expect(200)
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((review: any) => {
        expect(review.model).toBe(product.model);
        });
    });
    test('should return a 404 error if model does not represent an existing product', async () => {
        await request(app)
            .get(`${routePath}/reviews/`).set("Cookie", customerCookie)
            .expect(404)
    });
});
describe('DELETE /ezelectronics/reviews/:model', () => {
    test('should delete the review made by the current user for a specific product', async () => {
        await request(app)
            .delete(`${routePath}/reviews/${product.model}`).set("Cookie", customerCookie)
            .expect(200)
    });
    test('should return a 404 error if model does not represent an existing product', async () => {
        const model = "NonExistentModel";
        await request(app)
            .delete(`${routePath}/reviews/${model}`).set("Cookie", customerCookie)
            .expect(404)
    });
    test('should return a 404 error if the current user does not have a review for the product', async () => {
        await request(app)
            .delete(`${routePath}/reviews/${product.model}`).set("Cookie", customerCookie)
            .expect(404)
    });
});
describe('DELETE /reviews/:model/all', () => {
    // adminCookie ? 
    test('should delete all reviews of a specific product', async () => {
        await request(app)
            .delete(`${routePath}/reviews/${product.model}/all`).set("Cookie", managerCookie)
            .expect(200)
    });
    test('should return a 404 error if model does not represent an existing product', async () => {
        const model = "NonExistentModel";
        await request(app)
            .delete(`${routePath}/reviews/${model}/all`).set("Cookie", managerCookie)
            .expect(404)
    });
});
describe("DELETE /review", () => {
    test("should delete all reviews of all existing products", async () => {
        await request(app)
            .delete(`${routePath}/reviews`).set("Cookie", managerCookie)
            .expect(200)

    })
})