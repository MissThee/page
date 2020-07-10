"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainValidator = exports.ZipCodeValidator = exports.numberRegexp = void 0;
exports.numberRegexp = /^[0-9]+$/;
//可直接使用export导出此类；或不在此使用export，使用导出语句统一导出
var ZipCodeValidator = /** @class */ (function () {
    function ZipCodeValidator() {
    }
    ZipCodeValidator.prototype.isAcceptable = function (s) {
        return s.length === 5 && exports.numberRegexp.test(s);
    };
    return ZipCodeValidator;
}());
exports.ZipCodeValidator = ZipCodeValidator;
exports.mainValidator = ZipCodeValidator;
