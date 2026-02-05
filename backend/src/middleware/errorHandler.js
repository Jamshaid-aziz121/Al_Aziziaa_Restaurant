/**
 * Comprehensive error handling middleware for the Aziz Restaurant Platform
 */

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error with context
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Determine status code based on error type
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError' || err.name === 'JoiValidationError') {
    statusCode = 400;
    message = 'Validation Error: ' + (err.details ? err.details.map(detail => detail.message).join(', ') : message);
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized: Invalid or expired token';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden: Insufficient permissions';
  } else if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Request Error: ' + message;
  } else if (err.code === 'P2002') {
    // Prisma unique constraint violation
    statusCode = 409;
    message = 'Conflict: Resource already exists';
  } else if (err.code === 'P2025') {
    // Prisma record not found
    statusCode = 404;
    message = 'Not Found: ' + (err.meta?.cause || 'Resource not found');
  } else if (err.code === 'P2003') {
    // Prisma foreign key constraint violation
    statusCode = 400;
    message = 'Bad Request: Invalid reference';
  }

  // Don't expose stack trace in production
  const errorResponse = {
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    ...(statusCode >= 500 && { errorId: generateErrorId() }),
  };

  res.status(statusCode).json(errorResponse);
};

// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Generate a unique error ID for tracking
const generateErrorId = () => {
  return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

module.exports = {
  errorHandler,
  notFound,
};