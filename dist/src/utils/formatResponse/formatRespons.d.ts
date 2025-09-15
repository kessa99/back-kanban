import { Response } from "express";
export declare const formatResponse: (res: Response, statusCode: number, status: string, message: string, content: any) => Response<any, Record<string, any>>;
