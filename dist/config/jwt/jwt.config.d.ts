import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const JwtConfigService_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtConfigService extends JwtConfigService_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        id: any;
        email: any;
        role: any;
        teamId: any;
        otpVerified: any;
    }>;
}
export {};
