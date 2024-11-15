import { describe, expect, beforeAll, afterAll, jest, it } from "@jest/globals"

import UserDAO from "../../src/dao/userDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { User, Role } from "../../src/components/user"
import { 
    UserAlreadyExistsError,
    UserNotFoundError,
    UserIsAdminError,
    InvalidBirthDateError,
    UserNotAdminError,
    UnauthorizedUserError
} from "../../src/errors/userError";

jest.mock("crypto")
jest.mock("../../src/db/db.ts")
jest.mock("../../src/components/user")

let userDAO: UserDAO;

beforeAll(() => {
    userDAO = new UserDAO();
});

afterAll(() => {
    jest.clearAllMocks();
});

describe('getIsUserAuthenticated', () => {
    const username = "test"
    const password = 'test'
    const salt = 'test'

    it("should resolve true", async () => {
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, {username, password, salt})
            return {} as Database
        });
        const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
            return Buffer.from("hashedPassword")
        })
        const mockTimingSafeEqual = jest.spyOn(crypto, "timingSafeEqual").mockImplementation((a, b) => {return true})
        const result = await userDAO.getIsUserAuthenticated(username, password)
        expect(result).toBe(true)
        mockTimingSafeEqual.mockRestore()
        mockDBGet.mockRestore()
        mockScrypt.mockRestore()
    });
    it("should resolve timingSafeEqual is false", async () => {
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, {username, password, salt})
            return {} as Database
        });
        const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
            return Buffer.from("hashedPassword")
        })
        const mockTimingSafeEqual = jest.spyOn(crypto, "timingSafeEqual").mockImplementation((a, b) => {return false})
        const result = await userDAO.getIsUserAuthenticated(username, password)
        expect(result).toBe(false)
        mockTimingSafeEqual.mockRestore()
        mockDBGet.mockRestore()
        mockScrypt.mockRestore()
    });
    it("should resolve timingSafeEqual is false", async () => {
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const result = await userDAO.getIsUserAuthenticated(username, password)
        expect(result).toBe(false)
        mockDBGet.mockRestore()
    });
    it('should reject with Database error', async () => {
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });

        try {
            await await userDAO.getIsUserAuthenticated(username, password)
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });
    it('should reject on unexpected error', async () => {
        const error = new Error('Unexpected error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            throw(error);
        });
        try {
            await userDAO.getIsUserAuthenticated(username, password)
        } catch (e) {
            expect(e.message).toBe("Unexpected error");
        }
        mockDBGet.mockRestore()
    });
});

//Example of unit test for the createUser method
//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods to simulate the hashing of the password
//It then calls the createUser method and expects it to resolve true
describe('createUser', () => {
    const user = { //Define a test user object
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: Role.MANAGER,
        address: 'test',
        birthdate: ''
    }
    it("should resolve true", async () => {
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
            return (Buffer.from("salt"))
        })
        const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (passwordHex, hashedPassword) => {
            return Buffer.from("hashedPassword")
        })
        const result = await userDAO.createUser(user.username, user.name, user.surname, user.password, user.role)
        expect(result).toBe(true)
        mockRandomBytes.mockRestore()
        mockDBRun.mockRestore()
        mockScrypt.mockRestore()
    });
    // it('should reject with Database error mockDBRun', async () => {
    //     const error = new Error('Database error');
    //     const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
    //         callback(error)
    //         return {} as Database
    //     });
    //     try {
    //         await userDAO.createUser(user.username, user.name, user.surname, user.password, user.role)
    //     } catch (e) {
    //         expect(e.message).toBe("Database error");
    //     }
    //     mockDBRun.mockRestore();
    // });
    it('should reject with Database error mockDBRun username already exist', async () => {
        const error = new Error('UNIQUE constraint failed: users.username');
        const errorUser = new UserAlreadyExistsError()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        try {
            await userDAO.createUser(user.username, user.name, user.surname, user.password, user.role)
        } catch (e) {
            expect(e).toEqual(errorUser);
        }
        mockDBRun.mockRestore();
    });
    it('should reject on unexpected error', async () => {
        const error = new Error('Unexpected error');
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            throw(error);
        });
        try {
            await userDAO.createUser(user.username, user.name, user.surname, user.password, user.role)
        } catch (e) {
            expect(e.message).toBe("Unexpected error");
        }
        mockDBRun.mockRestore()
    });
})
describe('getUserByUsername', () => {
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

    it('should resolve with user if user is found', async () => {
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, user) 
            return {} as Database
        });
        const result = await userDAO.getUserByUsername(user.username);
        expect(result).toStrictEqual(testUser);
        mockDBGet.mockRestore();
    });

    it('should reject with UserNotFoundError if user is not found', async () => {
        const error = new UserNotFoundError()
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null)
            return {} as Database
        });
        try {
            await userDAO.getUserByUsername(user.username)
        } catch (e) {
            expect(e).toEqual(error);
        }
        mockDBGet.mockRestore()
    });

    it('should reject with Database error', async () => {
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });

        try {
            await userDAO.getUserByUsername(user.username)
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore()
    });
    it('should reject on unexpected error', async () => {
        const error = new Error('Unexpected error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            throw(error);
        });
        try {
            await userDAO.getUserByUsername(user.username)
        } catch (e) {
            expect(e.message).toBe("Unexpected error");
        }
        mockDBGet.mockRestore()
    });
})
describe('getAllUsers', () => {
    
    it('should resolve with array of users', async () => {
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, []) 
            return {} as Database
        });
        const result = await userDAO.getAllUsers();
        expect(result).toStrictEqual([]);
        mockDBAll.mockRestore();
    });
    it('should reject with Database error', async () => {
        const error = new Error('Database error');
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });

        try {
            await userDAO.getAllUsers()
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBAll.mockRestore()
    });
    it('should reject on unexpected error', async () => {
        const error = new Error('Unexpected error');
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            throw(error);
        });
        try {
            await userDAO.getAllUsers()
        } catch (e) {
            expect(e.message).toBe("Unexpected error");
        }
        mockDBAll.mockRestore()
    });
    
})
describe('getUsersByRole', () => {
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
    it('should resolve with array of users', async () => {
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [user]) 
            return {} as Database
        });
        const result = await userDAO.getUsersByRole(user.role);
        expect(result).toStrictEqual([testUser]);
        mockDBAll.mockRestore();
    });
    it('should reject with UserNotFoundError if user is not found', async () => {
        const error = new UserNotFoundError()
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, null) 
            return {} as Database
        });
        try {
            await userDAO.getUsersByRole(user.role)
        } catch (e) {
            expect(e).toEqual(error);
        }
        mockDBAll.mockRestore()
    });
    it('should reject with Database error', async () => {
        const error = new Error('Database error');
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });

        try {
            await userDAO.getUsersByRole(user.role)
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBAll.mockRestore()
    });
    it('should reject on unexpected error', async () => {
        const error = new Error('Unexpected error');
        const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            throw(error);
        });
        try {
            await userDAO.getUsersByRole(user.role)
        } catch (e) {
            expect(e.message).toBe("Unexpected error");
        }
        mockDBAll.mockRestore()
    });
})
describe('deleteUserByUsername', () => {
    const user = { //Define a test user object
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: Role.ADMIN,
        address: 'test',
        birthdate: ''
    }
    it('should resolve  true ', async () => {
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, user ) 
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const result = await userDAO.deleteUserByUsername(user, user.username);
        expect(result).toStrictEqual(true);
        mockDBGet.mockRestore();
        mockDBRun.mockRestore();
    });
    it('should resolve UserNotFoundError', async () => {
        const error = new UserNotFoundError()
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null) 
            return {} as Database
        });

        try {
            await userDAO.deleteUserByUsername(user, user.username);
        } catch (e) {
            expect(e).toEqual(error);
        }
        mockDBGet.mockRestore();
    });
    it('should reject with Database error DBRun', async () => {
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, user ) 
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        
        try {
            await userDAO.deleteUserByUsername(user, user.username);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore();
        mockDBRun.mockRestore();
    });
    it('should reject with Database error mockDBGet', async () => {
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(error) 
            return {} as Database
        });
        try {
            await userDAO.deleteUserByUsername(user, user.username);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore();
    });
    it('should reject with error UnauthorizedUserError', async () => {
        const newUser = {
            ...user,
            role: Role.MANAGER
        };
        const error = new UnauthorizedUserError()
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { username: 'user2' } ) 
            return {} as Database
        });
        try {
            await userDAO.deleteUserByUsername(newUser, 'user2');
        } catch (e) {
            expect(e).toEqual(error);
        }
        mockDBGet.mockRestore();
    });
    it('should reject with error UnauthorizedUserError isAdmin', async () => {
        const error = new UnauthorizedUserError()
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { username: 'user2', role: Role.ADMIN } ) 
            return {} as Database
        });
        try {
            await userDAO.deleteUserByUsername(user, 'user2');
        } catch (e) {
            expect(e).toEqual(error);
        }
        mockDBGet.mockRestore();
    });
    it('should reject on unexpected error', async () => {
        const error = new Error('Unexpected error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            throw(error);
        });
        try {
            await userDAO.deleteUserByUsername(user, user.username);
        } catch (e) {
            expect(e.message).toBe("Unexpected error");
        }
        mockDBGet.mockRestore()
    });
})

describe('deleteAllNonAdminUsers', () => {
    it('should resolve true', async () => {
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const result = await userDAO.deleteAllNonAdminUsers();
        expect(result).toStrictEqual(true);
        mockDBRun.mockRestore();
    });
    it('should reject with Database error', async () => {
        const error = new Error('Database error');
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        try {
            await userDAO.deleteAllNonAdminUsers();
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBRun.mockRestore();
    });
    it('should reject on unexpected error', async () => {
        const error = new Error('Unexpected error');
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            throw(error);
        });
        try {
            await userDAO.deleteAllNonAdminUsers();
        } catch (e) {
            expect(e.message).toBe("Unexpected error");
        }
        mockDBRun.mockRestore()
    });
})

describe('updateUserInfo', () => {
    const user = { //Define a test user object
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: Role.ADMIN,
        address: 'test',
        birthdate: '1990-01-01'
    }
    const testUser = new User(user.username, user.name, user.surname, user.role, user.address, user.birthdate);

    it('should resolve true ', async () => {
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, user ) 
            return {} as Database
        });
        const result = await userDAO.updateUserInfo(user, user.username, user.name, user.surname, user.address, user.birthdate);
        expect(result).toStrictEqual(testUser);
        mockDBGet.mockRestore();
        mockDBRun.mockRestore();
    });
    it('should reject with InvalidBirthDateError if birthdate is in the future', async () => {
        const error = new InvalidBirthDateError()
        const newUser = {...user, birthdate:'2990-01-01' }
        try {
            await userDAO.updateUserInfo(newUser, newUser.username, newUser.name, newUser.surname, newUser.address, newUser.birthdate);
        } catch (e) {
            expect(e).toEqual(error);
        }
    });
    it('should reject with UserNotAdminError', async () => {
        const error = new UserNotAdminError()
        const newUser = {...user, role: Role.MANAGER }
        try {
            await userDAO.updateUserInfo(newUser, 'user2', newUser.name, newUser.surname, newUser.address, newUser.birthdate);
        } catch (e) {
            expect(e).toEqual(error);
        }
    });
    it('should reject with Database error mockDBGet', async () => {
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(error) 
            return {} as Database
        });
        try {
            await userDAO.updateUserInfo(user, user.username, user.name, user.surname, user.address, user.birthdate);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore();
    });
    it('should reject with Database error UserNotFoundError', async () => {
        const error = new UserNotFoundError()
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null) 
            return {} as Database
        });
        try {
            await userDAO.updateUserInfo(user, user.username, user.name, user.surname, user.address, user.birthdate);
        } catch (e) {
            expect(e).toEqual(error);
        }
        mockDBGet.mockRestore();
    });
    it('should reject with Database error mockDBRun', async () => {
        const error = new Error('Database error');
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, user ) 
            return {} as Database
        });
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(error)
            return {} as Database
        });
        try {
            await userDAO.updateUserInfo(user, user.username, user.name, user.surname, user.address, user.birthdate);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBRun.mockRestore();
        mockDBGet.mockRestore();
    });
    it('should reject with Database error mockDBGet', async () => {
        const error = new Error('Database error');
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const mockDBGet = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null, user ) 
            return {} as Database
        }).mockImplementationOnce((sql, params, callback) => {
            callback(error) 
            return {} as Database
        });
        try {
            await userDAO.updateUserInfo(user, user.username, user.name, user.surname, user.address, user.birthdate);
        } catch (e) {
            expect(e.message).toBe("Database error");
        }
        mockDBGet.mockRestore();
        mockDBRun.mockRestore();
    });
    it('should reject with Database error UserNotFoundError', async () => {
        const error = new UserNotFoundError()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const mockDBGet = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null, user ) 
            return {} as Database
        }).mockImplementationOnce((sql, params, callback) => {
            callback(null) 
            return {} as Database
        });
        try {
            await userDAO.updateUserInfo(user, user.username, user.name, user.surname, user.address, user.birthdate);
        } catch (e) {
            expect(e).toEqual(error);
        }
        mockDBGet.mockRestore();
        mockDBRun.mockRestore();
    });
    it('should reject on unexpected error', async () => {
        const error = new Error('Unexpected error');
        const mockDBRun = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            throw(error);
        });
        try {
            await userDAO.updateUserInfo(user, user.username, user.name, user.surname, user.address, user.birthdate);
        } catch (e) {
            expect(e.message).toBe("Unexpected error");
        }
        mockDBRun.mockRestore()
    });
})