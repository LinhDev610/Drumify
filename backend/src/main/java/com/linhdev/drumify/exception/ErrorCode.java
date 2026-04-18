package com.linhdev.drumify.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // SYSTEM
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    BAD_REQUEST(1002, "Bad request", HttpStatus.BAD_REQUEST),
    EXTERNAL_SERVICE_ERROR(1003, "External service connection error", HttpStatus.BAD_GATEWAY),
    EXTERNAL_SERVICE_VALIDATION_ERROR(1022, "External service validation error", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND(1004, "Resource not found", HttpStatus.NOT_FOUND),
    CLIENT_ABORTED(1005, "Client aborted connection", HttpStatus.BAD_REQUEST),

    // USER / AUTHENTICATION / AUTHORIZATION (10xx)
    USER_EXISTED(1010, "Username already exists, please choose another one", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1011, "Email already exists, please choose another one", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1012, "User does not exist", HttpStatus.NOT_FOUND),
    USERNAME_IS_MISSING(1013, "Please enter username", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(1014, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1015, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1016, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1017, "You do not have permission", HttpStatus.FORBIDDEN),
    ACCOUNT_LOCKED(1018, "Your account has been locked. Please contact support.", HttpStatus.UNAUTHORIZED),
    INVALID_DOB(1019, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INVALID_OTP(1020, "Invalid OTP code, please try again", HttpStatus.BAD_REQUEST),
    EMAIL_SEND_FAILED(1021, "Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR),

    // PROMOTION (20xx)
    PROMOTION_NOT_EXISTED(2001, "Promotion does not exist", HttpStatus.NOT_FOUND),
    PROMOTION_NOT_PENDING(2002, "Promotion is not in pending state", HttpStatus.BAD_REQUEST),
    INVALID_PROMOTION_SCOPE(2003, "Invalid promotion scope", HttpStatus.BAD_REQUEST),
    PROMOTION_PRODUCT_CONFLICT(2004, "Some products already have active promotions", HttpStatus.BAD_REQUEST),
    PROMOTION_CODE_ALREADY_EXISTS(2005, "Promotion code already exists", HttpStatus.BAD_REQUEST),
    PROMOTION_OVERLAP_CONFLICT(
            2006, "Promotion overlaps with another program in the same period", HttpStatus.BAD_REQUEST),

    // VOUCHER (30xx)
    VOUCHER_NOT_EXISTED(3001, "Voucher does not exist", HttpStatus.NOT_FOUND),
    VOUCHER_CODE_ALREADY_EXISTS(3002, "Voucher code already exists", HttpStatus.BAD_REQUEST),
    VOUCHER_NOT_PENDING(3003, "Voucher is not in pending state", HttpStatus.BAD_REQUEST),
    VOUCHER_EXPIRED(3004, "Voucher has expired", HttpStatus.BAD_REQUEST),
    VOUCHER_SOLD_OUT(3005, "Voucher is sold out", HttpStatus.BAD_REQUEST),
    INVALID_VOUCHER_MINIMUM(3006, "Does not meet the minimum value requirement for voucher", HttpStatus.BAD_REQUEST),
    INVALID_VOUCHER_SCOPE(3007, "Invalid voucher scope", HttpStatus.BAD_REQUEST),
    VOUCHER_USAGE_LIMIT_EXCEEDED(3008, "You have exceeded the usage limit  for this voucher", HttpStatus.BAD_REQUEST),
    VOUCHER_ALREADY_USED(3009, "Cannot apply voucher", HttpStatus.BAD_REQUEST),

    // BANNER (40xx)
    BANNER_NOT_EXISTED(4001, "Banner does not exist", HttpStatus.NOT_FOUND),

    // REVIEW (50xx)
    REVIEW_NOT_EXISTED(5001, "Review does not exist", HttpStatus.NOT_FOUND),

    // PRODUCT & CATEGORY (60xx)
    PRODUCT_NOT_EXISTED(6001, "Product does not exist", HttpStatus.NOT_FOUND),
    OUT_OF_STOCK(6002, "Out of stock", HttpStatus.BAD_REQUEST),
    PRODUCT_ALREADY_EXISTS(6003, "Product code already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(6004, "Category does not exist", HttpStatus.NOT_FOUND),
    CATEGORY_ALREADY_EXISTS(6005, "Category code or name already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_HAS_PRODUCTS(6006, "Cannot delete category because it contains products", HttpStatus.BAD_REQUEST),
    CATEGORY_HAS_SUBCATEGORIES(6007, "Cannot delete category because it has subcategories", HttpStatus.BAD_REQUEST),

    // ORDER - SHIPMENT - CART - ADDRESS (70xx)
    CART_ITEM_NOT_EXISTED(7001, "Product does not exist in cart", HttpStatus.NOT_FOUND),
    ORDER_NOT_EXISTED(7002, "Order does not exist", HttpStatus.NOT_FOUND),
    ADDRESS_NOT_EXISTED(7004, "Address does not exist", HttpStatus.NOT_FOUND),
    SHIPMENT_NOT_EXISTED(7005, "Shipment does not exist", HttpStatus.NOT_FOUND),

    // FILE UPLOAD (80xx)
    FILE_UPLOAD_FAILED(8001, "Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR),

    // TICKET & NOTIFICATION (90xx)
    TICKET_NOT_EXISTED(9001, "Ticket does not exist", HttpStatus.NOT_FOUND),
    NOTIFICATION_NOT_EXISTED(9002, "Notification does not exist", HttpStatus.NOT_FOUND);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.statusCode = statusCode;
        this.message = message;
    }

    private final int code;
    private final HttpStatusCode statusCode;
    private final String message;
}
