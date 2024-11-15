import { expect, jest, it, describe, afterEach } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"


import UserController from "../../src/controllers/userController"
import Authenticator from "../../src/routers/auth"
import { Role } from "../../src/components/user"
jest.mock("../../src/routers/auth")

const baseURL = "/ezelectronics"
const testUser = { //Define a test user object
    username: "test",
    name: "test",
    surname: "test",
    password: "test",
    role: Role.MANAGER,
    address: 'test',
    birthdate: '1990-01-01'
}
const errorMessage = 'Internal Server Error';

afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
});
//Example of a unit test for the POST ezelectronics/users route
//The test checks if the route returns a 200 success code
//The test also expects the createUser method of the controller to be called once with the correct parameters
describe('UserRoutes', () => {
    it("createUser It should return a 200 success code", async () => {
        jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
        const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
        expect(response.status).toBe(200) //Check if the response status is 200
        expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
        //Check if the createUser method has been called with the correct parameters
        expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
            testUser.name,
            testUser.surname,
            testUser.password,
            testUser.role)
    })
    it("createUser It should return error 503", async () => {
        jest.spyOn(UserController.prototype, "createUser").mockRejectedValueOnce(new Error(errorMessage))
        const response = await request(app).post(baseURL + "/users")
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('error');
    })

    it("getUsers It should return a 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce([]) 
        const response = await request(app).get(baseURL + "/users")
        expect(response.status).toBe(200) 
        expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(1)
    })

    it('getUsers should handle errors and return a 503 error code', async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, 'getUsers').mockRejectedValueOnce(new Error(errorMessage));
        const response = await request(app).get(baseURL + "/users");
        expect(response.status).toBe(503);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(errorMessage);
    });

    it("getUsersByRole It should return a 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce([testUser]) 
        const response = await request(app).get(baseURL + `/users/roles/${testUser.role}`)
        expect(response.status).toBe(200) 
        expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1)
    });

    it('getUsersByRole should handle errors and return a 503 error code', async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, 'getUsersByRole').mockRejectedValueOnce(new Error(errorMessage));
        const response = await request(app).get(baseURL + `/users/roles/${testUser.role}`);
        expect(response.status).toBe(503);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(errorMessage);
    });

    it("getUserByUsername It should return a 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(testUser) 
        const response = await request(app).get(baseURL + `/users/${testUser.username}`)
        expect(response.status).toBe(200) 
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1)
    })

    it('getUserByUsername should handle errors and return a 503 error code', async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, 'getUserByUsername').mockRejectedValueOnce(new Error(errorMessage));
        const response = await request(app).get(baseURL + `/users/${testUser.username}`);
        expect(response.status).toBe(503);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(errorMessage);
    });

    it("deleteUser It should return a 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true) 
        const response = await request(app).delete(baseURL + `/users/${testUser.username}`)
        expect(response.status).toBe(200) 
        expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1)
    })

    it('deleteUser should handle errors and return a 503 error code', async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, 'deleteUser').mockRejectedValueOnce(new Error(errorMessage));
        const response = await request(app).delete(baseURL + `/users/${testUser.username}`);
        expect(response.status).toBe(503);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(errorMessage);
    });

    it("deleteAll It should return a 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, "deleteAll").mockResolvedValueOnce(true) 
        const response = await request(app).delete(baseURL + `/users`)
        expect(response.status).toBe(200) 
        expect(UserController.prototype.deleteAll).toHaveBeenCalledTimes(1)
    })

    it('deleteAll should handle errors and return a 503 error code', async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, 'isAdmin').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, 'deleteAll').mockRejectedValueOnce(new Error(errorMessage));
        const response = await request(app).delete(baseURL + "/users");
        expect(response.status).toBe(503);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(errorMessage);
    });

    it("updateUserInfo It should return a 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(testUser) 
        const response = await request(app).patch(baseURL + `/users/${testUser.username}`).send(testUser)
        expect(response.status).toBe(200) 
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1)
    })

    it('updateUserInfo should handle errors and return a 503 error code', async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(UserController.prototype, 'updateUserInfo').mockRejectedValueOnce(new Error(errorMessage));
        const response = await request(app).patch(baseURL + `/users/${testUser.username}`).send(testUser);
        expect(response.status).toBe(503);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(errorMessage);
    });
})

describe('AuthRoutes', () => {
    it("login It should return a 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, "login").mockResolvedValueOnce(true) 
        const response = await request(app).post(baseURL + "/sessions").send({username: testUser.username, password: testUser.password })
        expect(response.status).toBe(200) 
        expect(Authenticator.prototype.login).toHaveBeenCalledTimes(1)
    })
    it('login should handle errors and return a 401 error code', async () => {
        jest.spyOn(Authenticator.prototype, 'login').mockRejectedValueOnce(new Error(errorMessage));
        const response = await request(app).post(baseURL + "/sessions").send({username: testUser.username, password: testUser.password });
        expect(response.status).toBe(401);
    });
    it("logout It should return a 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, "logout").mockResolvedValueOnce(true) 
        const response = await request(app).delete(baseURL + "/sessions/current")
        expect(response.status).toBe(200) 
        expect(Authenticator.prototype.logout).toHaveBeenCalledTimes(1)
    })
    it('logout should handle errors and return a 503 error code', async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        jest.spyOn(Authenticator.prototype, 'logout').mockRejectedValueOnce(new Error(errorMessage));
        const response = await request(app).delete(baseURL + "/sessions/current");
        expect(response.status).toBe(503);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(errorMessage);
    });
    it("current It should return a 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementationOnce((req, res, next) => next());
        const response = await request(app).get(baseURL + "/sessions/current")
        expect(response.status).toBe(200) 
    })
})
