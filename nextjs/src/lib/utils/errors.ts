import { NextResponse } from 'next/server';

export type ErrorResponse = {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
};

export function createErrorResponse(
  status: number,
  name: string,
  message: string,
  details?: any
) {
  return NextResponse.json(
    {
      error: {
        status,
        name,
        message,
        details,
      },
    },
    { status }
  );
}

export const Errors = {
  notFound: (message = 'Resource not found') =>
    createErrorResponse(404, 'NotFoundError', message),
  badRequest: (message = 'Bad request', details?: any) =>
    createErrorResponse(400, 'BadRequestError', message, details),
  unauthorized: (message = 'Unauthorized') =>
    createErrorResponse(401, 'UnauthorizedError', message),
  forbidden: (message = 'Forbidden') =>
    createErrorResponse(403, 'ForbiddenError', message),
  internal: (message = 'Internal server error') =>
    createErrorResponse(500, 'InternalServerError', message),
  validation: (details: any) =>
    createErrorResponse(400, 'ValidationError', 'Validation failed', details),
};
