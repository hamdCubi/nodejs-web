const ErrorCode = {
    // Authentication and User Management
    USER_NOT_FOUND: 'ERR_USER_NOT_FOUND',
    INVALID_CREDENTIALS: 'ERR_INVALID_CREDENTIALS',
    EMAIL_ALREADY_EXISTS: 'ERR_EMAIL_ALREADY_EXISTS',
    USERNAME_ALREADY_EXISTS: 'ERR_USERNAME_ALREADY_EXISTS',
    UNAUTHORIZED: 'ERR_UNAUTHORIZED',
    ACCESS_DENIED: 'ERR_ACCESS_DENIED',
    ACCOUNT_DISABLED: 'ERR_ACCOUNT_DISABLED',
    TOKEN_EXPIRED: 'ERR_TOKEN_EXPIRED',
    INVALID_TOKEN: 'ERR_INVALID_TOKEN',
    PASSWORD_RESET_FAILED: 'ERR_PASSWORD_RESET_FAILED',
  
    // Validation Errors
    VALIDATION_ERROR: 'ERR_VALIDATION_ERROR',
    UNHANDLED_ERROR: 'UNHANDLED_ERROR',
    INVALID_VALUE_ERROR: 'INVALID_VALUE_ERROR',
    MISSING_REQUIRED_FIELDS: 'ERR_MISSING_REQUIRED_FIELDS',
    INVALID_EMAIL_FORMAT: 'ERR_INVALID_EMAIL_FORMAT',
    INVALID_PHONE_NUMBER: 'ERR_INVALID_PHONE_NUMBER',
  
    // Database Operations
    DATABASE_ERROR: 'ERR_DATABASE_ERROR',
    ITEM_NOT_FOUND: 'ERR_ITEM_NOT_FOUND',
    DUPLICATE_ENTRY: 'ERR_DUPLICATE_ENTRY',
    QUERY_FAILED: 'ERR_QUERY_FAILED',
  
    // Server and Network Issues
    SERVER_ERROR: 'ERR_SERVER_ERROR',
    NETWORK_ERROR: 'ERR_NETWORK_ERROR',
    SERVICE_UNAVAILABLE: 'ERR_SERVICE_UNAVAILABLE',
    TIMEOUT_ERROR: 'ERR_TIMEOUT_ERROR',
  
    // File Handling
    FILE_UPLOAD_ERROR: 'ERR_FILE_UPLOAD_ERROR',
    FILE_NOT_FOUND: 'ERR_FILE_NOT_FOUND',
    FILE_TYPE_ERROR: 'FILE_TYPE_ERROR',
  };
  
  module.exports = ErrorCode;
  