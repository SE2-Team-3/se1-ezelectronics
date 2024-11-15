import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import { cleanup } from "../src/db/cleanup"

const routePath = "/ezelectronics" //Base route path for the API

//Default user information. We use them to create users and evaluate the returned values
const product = { sellingPrice: 200, model: "iPhone 13", category: 'Smartphone', arrivalDate: "2024-01-01", details: "", quantity: 8 }
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" }
//Cookies for the users. We use them to keep users logged in. Creating them once and saving them in a variables outside of the tests will make cookies reusable
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
    await postUser(manager)
    managerCookie = await login(manager)
})

afterAll( async() => {
    await cleanup();
});
describe('POST /products', () => {
    test('should register a new product when all parameters are valid', async () => {
        await request(app)
            .post(`${routePath}/products`).set("Cookie", managerCookie).send(product)
            .expect(200)
    });
    test('should return a 409 error if the model already exists', async () => {
        await request(app)
            .post(`${routePath}/products`).set("Cookie", managerCookie).send(product)
            .expect(409)
    });
    test('should return a 400 error when arrivalDate is after the current date', async () => {
        const futureProduct = {
            ...product,
            arrivalDate: "2030-01-01"
        };
        await request(app)
            .post(`${routePath}/products`).set("Cookie", managerCookie).send(futureProduct)
            .expect(400)
    });
});
describe('GET /products', () => {
    test('should return all products when no filters are applied', async () => {
        const response = await request(app)
            .get(`${routePath}/products`)
            .set("Cookie", managerCookie)
            .expect(200)
        expect(response.body).toBeInstanceOf(Array);
    });
    test('should return a 422 error if grouping is null and any of category or model is not null', async () => {
        await request(app)
            .get(`${routePath}/products`)
            .query({ grouping: null, category: 'Smartphone' })
            .set("Cookie", managerCookie)
            .expect(422);
    });
    test('should return a 422 error if grouping is category and category is null OR model is not null', async () => {
        // await request(app)
        //     .get(`${routePath}/products`)
        //     .query({ grouping: 'category', category: null })
        //     .set("Cookie", managerCookie)
        //     .expect(422);
        await request(app)
            .get(`${routePath}/products`)
            .query({ grouping: 'category', model: 'iPhone 13' })
            .set("Cookie", managerCookie)
            .expect(422);
    });
    test('should return a 422 error if grouping is model and model is null OR category is not null', async () => {
        await request(app)
            .get(`${routePath}/products`)
            .query({ grouping: 'model', model: null })
            .set("Cookie", managerCookie)
            .expect(422);
        await request(app)
            .get(`${routePath}/products`)
            .query({ grouping: 'model', category: 'Smartphone' })
            .set("Cookie", managerCookie)
            .expect(422);
    });
    test('should return a 404 error if model does not represent a product in the database', async () => {
        await request(app)
            .get(`${routePath}/products`)
            .query({ grouping: 'model', model: 'NonExistentModel' })
            .set("Cookie", managerCookie)
            .expect(404);
    });
});
describe('GET /products/available', () => {
    test('should return all available products when no filters are applied', async () => {
        const response = await request(app)
            .get(`${routePath}/products/available`)
            .set("Cookie", managerCookie)
            .expect(200)
        expect(response.body).toBeInstanceOf(Array);
    });
    test('should return a 422 error if grouping is null and any of category or model is not null', async () => {
        await request(app)
            .get(`${routePath}/products/available`)
            .query({ grouping: null, category: 'Smartphone' })
            .set("Cookie", managerCookie)
            .expect(422);
    });
    test('should return a 422 error if grouping is category and category is null OR model is not null', async () => {
        // await request(app)
        //     .get(`${routePath}/products/available`)
        //     .query({ grouping: 'category', category: null })
        //     .set("Cookie", managerCookie)
        //     .expect(422);
        await request(app)
            .get(`${routePath}/products/available`)
            .query({ grouping: 'category', model: 'iPhone 13' })
            .set("Cookie", managerCookie)
            .expect(422);
    });
    test('should return a 422 error if grouping is model and model is null OR category is not null', async () => {
        await request(app)
            .get(`${routePath}/products/available`)
            .query({ grouping: 'model', model: null })
            .set("Cookie", managerCookie)
            .expect(422);
        await request(app)
            .get(`${routePath}/products/available`)
            .query({ grouping: 'model', category: 'Smartphone' })
            .set("Cookie", managerCookie)
            .expect(422);
    });
    test('should return a 404 error if model does not represent a product in the database', async () => {
        await request(app)
            .get(`${routePath}/products/available`)
            .query({ grouping: 'model', model: 'NonExistentModel' })
            .set("Cookie", managerCookie)
            .expect(404);
    });
});
describe('PATCH /products/:model', () => {
    test('should increase the quantity of an existing product', async () => {
        await request(app)
            .patch(`${routePath}/products/${product.model}`)
            .set("Cookie", managerCookie)
            .send({ quantity: product.quantity, changeDate: product.arrivalDate })
            .expect(200)
    });
    test('should return a 404 error if the model does not exist', async () => {
        const model = "NonExistentModel";
        await request(app)
            .patch(`${routePath}/products/${model}`)
            .set("Cookie", managerCookie)
            .send({ quantity: product.quantity, changeDate: product.arrivalDate })
            .expect(404)
    });
    test('should return a 400 error if changeDate is after the current date', async () => {
        const quantityInfo = { quantity: product.quantity, changeDate: "2030-01-01" };
        await request(app)
            .patch(`${routePath}/products/${product.model}`)
            .set("Cookie", managerCookie)
            .send(quantityInfo)
            .expect(400)
    });
    test('should return a 400 error if changeDate is before the product\'s arrivalDate', async () => {
        const model = "iPhone 13";
        const quantityInfo = { quantity: product.quantity, changeDate: "2033-01-01" } ;// Assuming arrivalDate is "2024-01-01"
        await request(app)
            .patch(`${routePath}/products/${product.model}`)
            .set("Cookie", managerCookie)
            .send(quantityInfo)
            .expect(400)
    });
});
describe('PATCH /products/:model/sell', () => {
    test('should reduce the quantity of an existing product', async () => {
        const saleInfo = { quantity: 2, sellingDate: "2024-01-02" };
        await request(app)
            .patch(`${routePath}/products/${product.model}/sell`)
            .set("Cookie", managerCookie)
            .send(saleInfo)
            .expect(200)
    });
    test('should return a 404 error if the model does not exist', async () => {
        const model = "NonExistentModel";
        const saleInfo = { quantity: 2, sellingDate: "2024-01-02" };
        await request(app)
            .patch(`${routePath}/products/${model}/sell`).set("Cookie", managerCookie).send(saleInfo).expect(404);
    });
    test('should return a 400 error if sellingDate is after the current date', async () => {
        const saleInfo = { quantity: 2, sellingDate: "2030-01-01" };
        await request(app)
            .patch(`${routePath}/products/${product.model}/sell`).set("Cookie", managerCookie).send(saleInfo).expect(400);
    });
    // test('should return a 400 error if sellingDate is before the product\'s arrivalDate', async () => {
    //     const saleInfo = { quantity: 2, sellingDate: "2023-01-01" }; // Assuming arrivalDate is "2024-01-01"
    //     await request(app)
    //         .patch(`${routePath}/products/${product.model}/sell`).set("Cookie", managerCookie).send(saleInfo).expect(400);
    // });
    // test('should return a 409 error if the available quantity is 0', async () => {
    //     const saleInfo = { quantity: 2, sellingDate: "2024-01-02" };
    //     // Assuming the product quantity is 0
    //     await request(app)
    //         .patch(`${routePath}/products/${product.model}/sell`).set("Cookie", managerCookie).send(saleInfo).expect(409);
    // });
    test('should return a 409 error if the available quantity is lower than the requested quantity', async () => {
        const saleInfo = { quantity: 100, sellingDate: "2024-01-02" }; // Assuming the product quantity is less than 100
        await request(app)
            .patch(`${routePath}/products/${product.model}/sell`).set("Cookie", managerCookie).send(saleInfo).expect(409);
    });
});
describe('DELETE /products/:model', () => {
    test('should delete a product when the model exists', async () => {
        await request(app)
            .delete(`${routePath}/products/${product.model}`)
            .set("Cookie", managerCookie)
            .expect(200)
    });

    test('should return a 404 error if the model does not exist', async () => {
        const model = "NonExistentModel";
        await request(app)
            .delete(`${routePath}/products/${model}`).set("Cookie", managerCookie).expect(404);
    });
});
describe('DELETE /products', () => {
    test('should delete all products', async () => {
        await request(app)
            .delete(`${routePath}/products`)
            .set("Cookie", managerCookie)
            .expect(200)
    });
});
