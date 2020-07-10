//可使用以下语句导入模块
import {StringValidator} from "./Validation";
import { StringValidator as SV } from "./Validation";
import * as Validator from "./Validation";
export const numberRegexp = /^[0-9]+$/;
//可直接使用export导出此类；或不在此使用export，使用导出语句统一导出
class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
//导出语句
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };//可使用as进行重命名
