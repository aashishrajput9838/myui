/**
 * Custom error classes and error handling utilities
 */

export class AppError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = "UNKNOWN_ERROR") {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class ScreenshotError extends AppError {
  constructor(message: string) {
    super(message, "SCREENSHOT_ERROR");
    this.name = "ScreenshotError";
  }
}

export class FirebaseError extends AppError {
  constructor(message: string, code: string = "FIREBASE_ERROR") {
    super(message, code);
    this.name = "FirebaseError";
  }
}

/**
 * Handle errors and return user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
