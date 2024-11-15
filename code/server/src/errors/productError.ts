const PRODUCT_NOT_FOUND = "Product not found"
const PRODUCT_ALREADY_EXISTS = "The product already exists"
const PRODUCT_SOLD = "Product already sold"
const EMPTY_PRODUCT_STOCK = "Product stock is empty"
const LOW_PRODUCT_STOCK = "Product stock cannot satisfy the requested quantity"
const INVALID_PARAMETER = "Invalid parameter combination. Ensure the correct parameters are provided based on the specified grouping"
const INVALID_SELLING_DATE = "The selling date is invalid"


class InvalidArrivalDate extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = "The arrival date is invalid"
        this.customCode = 400
    }
}

class ChangeDateBeforeArrivalError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = "The selling date cannot be before the arrival date"
        this.customCode = 400
    }
}

class ChangeDateInFutureError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = "change date is after the current date"
        this.customCode = 400
    }

}

class InvalidSellingDateError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = INVALID_SELLING_DATE
        this.customCode = 400
    }
}


/**
 * Represents an error that occurs when an invalid category is provided.
 */
class InvalidParameterCombinationError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = INVALID_PARAMETER;
        this.customCode = 422;
    }
}


/**
 * Represents an error that occurs when a product is not found.
 */
class ProductNotFoundError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = PRODUCT_NOT_FOUND
        this.customCode = 404
    }
}

/**
 * Represents an error that occurs when a product id already exists.
 */
class ProductAlreadyExistsError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = PRODUCT_ALREADY_EXISTS
        this.customCode = 409
    }
}

/**
 * Represents an error that occurs when a product is already sold.
 */
class ProductSoldError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = PRODUCT_SOLD
        this.customCode = 409
    }
}

class EmptyProductStockError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = EMPTY_PRODUCT_STOCK
        this.customCode = 409
    }
}

class LowProductStockError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = LOW_PRODUCT_STOCK
        this.customCode = 409
    }
}

export {InvalidArrivalDate,ChangeDateInFutureError, ChangeDateBeforeArrivalError, ProductNotFoundError, ProductAlreadyExistsError, ProductSoldError, EmptyProductStockError, LowProductStockError, InvalidParameterCombinationError, InvalidSellingDateError }