import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import { cleanup } from "../src/db/cleanup"

const routePath = "/ezelectronics" //Base route path for the API

//Default user information. We use them to create users and evaluate the returned values
const product = { sellingPrice: 200, model: "iPhone 13", category: 'Smartphone', arrivalDate: "2024-01-01", details: "", quantity: 1}
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" }
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
    await request(app).post(`${routePath}/products`).set("Cookie", managerCookie).send(product).expect(200)
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
    await postUser(manager)
    customerCookie = await login(customer)
    managerCookie = await login(manager)
})

afterAll( async() => {
    await cleanup();
});
describe('POST /carts', () => {
    test('should add a product to the current cart', async () => {
        await postProduct()
        await request(app)
            .post(`${routePath}/carts`).set("Cookie", customerCookie).send({ model: product.model })
            .expect(200)
        const response = await request(app)
            .get(`${routePath}/carts`).set("Cookie", customerCookie)
            .expect(200);
        expect(response.body.products)
            .toEqual([{"category": product.category, "model": product.model, "price": product.sellingPrice, "quantity": product.quantity}]);
    });
    test('should return a 404 error if model does not represent an existing product', async () => {
        const model = "NonExistentModel";
        await request(app)
            .post(`${routePath}/carts`).set("Cookie", customerCookie).send({ model }).expect(404);
    });
});
describe('GET /carts', () => {
    test('should return the current cart of the logged in user', async () => {
        await request(app)
            .get(`${routePath}/carts`).set("Cookie", customerCookie)
            .expect(200)
    });
});
describe('GET /carts/history', () => {
    test('should return the history of paid carts for the logged in user', async () => {
        const response = await request(app)
            .get(`${routePath}/carts/history`).set("Cookie", customerCookie)
            .expect(200)
        expect(response.body).toBeInstanceOf(Array);
    });
});
describe('DELETE /carts/products/:model', () => {
    test('should remove a product instance from the current cart', async () => {
        await request(app)
            .delete(`${routePath}/carts/products/${product.model}`).set("Cookie", customerCookie)
            .expect(200)
    });
    test('should return a 404 error if model represents a product that is not in the cart', async () => {
        const model = "NonExistentModel";
        await request(app)
            .delete(`${routePath}/carts/products/${model}`).set("Cookie", customerCookie).expect(404);
    });
});
describe("DELETE /carts/current", () => {
    test("should delete current cart", async () => {
        await request(app)
            .delete(`${routePath}/carts/current`).set("Cookie", customerCookie)
            .expect(200)
    })
})
describe('DELETE /carts', () => {
    test('should delete all existing carts', async () => {
        await request(app)
            .delete(`${routePath}/carts`).set("Cookie", managerCookie)
            .expect(200)
    });
});
describe('GET /carts/all', () => {
    test('should return all carts of all users', async () => {         
        const response = await request(app)
            .get(`${routePath}/carts/all`).set("Cookie", managerCookie)
            .expect(200)
        expect(response.body).toBeInstanceOf(Array);
    });
});
describe('PATCH /carts', () => {
    // test('should simulate payment for the current cart', async () => {
    //     await request(app)
    //         .patch(`${routePath}/carts`).set("Cookie", customerCookie)
    //         .expect(200)
    //     const response = await getCurrentCart();
    //     expect(response.body.paid).toBe(true);
    //     expect(response.body.paymentDate).not.toBeNull();
    // });
    test('should return a 404 error if there is no unpaid cart', async () => {
        await request(app)
            .patch(`${routePath}/carts`).set("Cookie", customerCookie).expect(404);
    });
    // test('should return a 400 error if the cart contains no product', async () => {
    //     // Assuming an unpaid cart with no products exists
    //     await request(app).patch(`${baseUrl}/carts`).set("Cookie", customerCookie).expect(400);
    // });
    // test('should return a 409 error if a product in the cart has 0 available quantity', async () => {
    //     const model = "iPhone 13";
    //     // Assuming the product quantity is 0
    //     await addToCart(model);
    //     await request(app).patch(`${baseUrl}/carts`).set("Cookie", customerCookie).expect(409);
    // });
    // test('should return a 409 error if a product quantity in the cart exceeds available stock', async () => {
    //     const model = "iPhone 13";
    //     // Assuming the product quantity in stock is less than required
    //     await addToCart(model);
    //     await request(app).patch(`${baseUrl}/carts`).set("Cookie", customerCookie).expect(409);
    // });
});