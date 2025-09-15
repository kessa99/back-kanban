/*
    formatResponse is a function that formats the response to the client.
    It is used to format the response to the client.
    It is used to handle the response to the client.
    It is used to handle the response to the client.
    status: success, error, notFound, badRequest, unauthorized, forbidden, internalServerError
    message: string success, error, notFound, badRequest, unauthorized, forbidden, internalServerError
    content: any
*/

import { Response } from "express";
import { STATUS_CODES } from "http";

export const formatResponse = (res: Response, statusCode: number, status: string, message: string, content: any) => {
  return res.status(statusCode).json({
    status,
    message,
    content,
  });
};