import { expect, jest, test, afterEach, beforeEach, describe } from '@jest/globals';
import Authenticator from '../../src/routers/auth';
import { Utility } from '../../src/utilities';
import { User } from "../../src/components/user"
const passport = require('passport');

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
});

describe('isAdminOrManager', () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            isAuthenticated: jest.fn(),
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

     test('should call next if user is authenticated and an admin', () => {
        req.isAuthenticated.mockReturnValue(true);
        req.user = { role: 'Admin' };
        jest.spyOn(Utility, 'isAdmin').mockReturnValue(true);
        jest.spyOn(Utility, 'isManager').mockReturnValue(false);
        Authenticator.prototype.isAdminOrManager(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
    test('should call next if user is authenticated and a manager', () => {
        req.isAuthenticated.mockReturnValue(true);
        req.user = { role: 'Manager' };
        jest.spyOn(Utility, 'isAdmin').mockReturnValue(false);
        jest.spyOn(Utility, 'isManager').mockReturnValue(true);

        Authenticator.prototype.isAdminOrManager(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
    test('should return 401 if user is authenticated but not an admin or manager', () => {
        req.isAuthenticated.mockReturnValue(true);
        req.user = { role: 'Customer' };
        jest.spyOn(Utility, 'isAdmin').mockReturnValue(false);
        jest.spyOn(Utility, 'isManager').mockReturnValue(false);

        Authenticator.prototype.isAdminOrManager(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not an admin or manager", status: 401 });
    });

    test('should return 401 if user is not authenticated', () => {
        req.isAuthenticated.mockReturnValue(false);

        Authenticator.prototype.isAdminOrManager(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not an admin or manager", status: 401 });
    });
});
describe('isAdmin', () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            isAuthenticated: jest.fn(),
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('should call next if user is authenticated and an admin', () => {
        req.isAuthenticated.mockReturnValue(true);
        req.user = { role: 'Admin' };
        jest.spyOn(Utility, 'isAdmin').mockReturnValue(true);

        Authenticator.prototype.isAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('should return 401 if user is authenticated but not an admin', () => {
        req.isAuthenticated.mockReturnValue(true);
        req.user = { role: 'Customer' };
        jest.spyOn(Utility, 'isAdmin').mockReturnValue(false);

        Authenticator.prototype.isAdmin(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not an admin", status: 401 });
    });

    test('should return 401 if user is not authenticated', () => {
        req.isAuthenticated.mockReturnValue(false);

        Authenticator.prototype.isAdmin(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not an admin", status: 401 });
    });
});
describe('isManager', () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            isAuthenticated: jest.fn(),
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('should call next if user is authenticated and a manager', () => {
        req.isAuthenticated.mockReturnValue(true);
        req.user = { role: 'Manager' };
        jest.spyOn(Utility, 'isManager').mockReturnValue(true);

        Authenticator.prototype.isManager(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('should return 401 if user is authenticated but not a manager', () => {
        req.isAuthenticated.mockReturnValue(true);
        req.user = { role: 'Customer' };
        jest.spyOn(Utility, 'isManager').mockReturnValue(false);

        Authenticator.prototype.isManager(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not a manager", status: 401 });
    });

    test('should return 401 if user is not authenticated', () => {
        req.isAuthenticated.mockReturnValue(false);

        Authenticator.prototype.isManager(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not a manager", status: 401 });
    });
});
describe('isCustomer', () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            isAuthenticated: jest.fn(),
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('should call next if user is authenticated and a customer', () => {
        req.isAuthenticated.mockReturnValue(true);
        req.user = { role: 'Customer' };
        jest.spyOn(Utility, 'isCustomer').mockReturnValue(true);

        Authenticator.prototype.isCustomer(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('should return 401 if user is authenticated but not a customer', () => {
        req.isAuthenticated.mockReturnValue(true);
        req.user = { role: 'Manager' };
        jest.spyOn(Utility, 'isCustomer').mockReturnValue(false);

        Authenticator.prototype.isCustomer(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not a customer", status: 401 });
    });

    test('should return 401 if user is not authenticated', () => {
        req.isAuthenticated.mockReturnValue(false);

        Authenticator.prototype.isCustomer(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not a customer", status: 401 });
    });
});
describe('isLoggedIn', () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            isAuthenticated: jest.fn()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('should call next if user is authenticated', () => {
        req.isAuthenticated.mockReturnValue(true);

        Authenticator.prototype.isLoggedIn(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('should return 401 if user is not authenticated', () => {
        req.isAuthenticated.mockReturnValue(false);

        Authenticator.prototype.isLoggedIn(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Unauthenticated user", status: 401 });
    });
});