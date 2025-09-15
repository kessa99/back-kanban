"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseModule = void 0;
const common_1 = require("@nestjs/common");
const firebase_config_1 = require("src/config/firebase/firebase.config");
let FirebaseModule = class FirebaseModule {
};
exports.FirebaseModule = FirebaseModule;
exports.FirebaseModule = FirebaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: 'FIREBASE_ADMIN',
                useValue: firebase_config_1.default,
            },
            {
                provide: 'FIRESTORE',
                useValue: firebase_config_1.default.firestore(),
            },
            {
                provide: 'FIREBASE_AUTH',
                useValue: firebase_config_1.default.auth(),
            },
        ],
        exports: ['FIREBASE_ADMIN', 'FIRESTORE', 'FIREBASE_AUTH'],
    })
], FirebaseModule);
//# sourceMappingURL=firebase.module.js.map