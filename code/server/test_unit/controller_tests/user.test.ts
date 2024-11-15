import { test, expect, jest } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { User, Role } from "../../src/components/user"

jest.mock("../../src/dao/userDAO")
jest.mock("../../src/components/user")

//Example of a unit test for the createUser method of the UserController
//The test checks if the method returns true when the DAO method returns true
//The test also expects the DAO method to be called once with the correct parameters

test("createUser should return true", async () => {
    const testUser = { //Define a test user object
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    
    jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true); //Mock the createUser method of the DAO
    const controller = new UserController(); //Create a new instance of the controller
    //Call the createUser method of the controller with the test user object
    const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);

    //Check if the createUser method of the DAO has been called once with the correct parameters
    expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role);
    expect(response).toBe(true); //Check if the response is true
});
test("getAllUsers should return an array", async () => {
    jest.spyOn(UserDAO.prototype, "getAllUsers").mockResolvedValueOnce([])
    const controller = new UserController();
    const response = await controller.getUsers();
    expect(UserDAO.prototype.getAllUsers).toHaveBeenCalledTimes(1);
    expect(response).toBeInstanceOf(Array);
    expect(response).toEqual([])
});
test("getUsersByRole should return an array", async () => {
    const role = "Manager"

    jest.spyOn(UserDAO.prototype, "getUsersByRole").mockResolvedValueOnce([])
    const controller = new UserController();
    const response = await controller.getUsersByRole(role);
    expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith(role);
    expect(response).toEqual([]);
});
// test("getUserByUsername should return user", async () => {
//     const user = { //Define a test user object
//         username: "test",
//         name: "test",
//         surname: "test",
//         password: "test",
//         role: Role.MANAGER,
//         address: 'test',
//         birthdate: ''
//     }
//     const testUser = new User(user.username, user.name, user.surname, user.role, user.address, user.birthdate);

//     jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(testUser)
//     const controller = new UserController();
//     const response = await controller.getUserByUsername(testUser, user.username);
//     expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
//     expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(user.username);
//     expect(response).toBe(testUser);
// });
test("deleteUser should return true", async () => {
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

    jest.spyOn(UserDAO.prototype, "deleteUserByUsername").mockResolvedValueOnce(true)
    const controller = new UserController();
    const response = await controller.deleteUser(testUser, user.username);
    expect(UserDAO.prototype.deleteUserByUsername).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.deleteUserByUsername).toHaveBeenCalledWith(testUser, user.username);
    expect(response).toBe(true);
});
test("deleteAll should return true", async () => {
    jest.spyOn(UserDAO.prototype, "deleteAllNonAdminUsers").mockResolvedValueOnce(true)
    const controller = new UserController();
    const response = await controller.deleteAll();
    expect(UserDAO.prototype.deleteAllNonAdminUsers).toHaveBeenCalledTimes(1);
    expect(response).toBe(true);
});
test("updateUserInfo should return user", async () => {
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

    jest.spyOn(UserDAO.prototype, "updateUserInfo").mockResolvedValueOnce(testUser)
    const controller = new UserController();
    const response = await controller.updateUserInfo(testUser, user.name, user.surname, user.address, user.birthdate, user.username);
    expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledWith(testUser, user.username, user.name, user.surname, user.address, user.birthdate);
    expect(response).toBe(testUser);
});