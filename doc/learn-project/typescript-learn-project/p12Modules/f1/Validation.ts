//导出声明
//加上export之后，使用import导入后才可用。不加export，直接暴露在全局中，外部可直接使用
export interface StringValidator {
    isAcceptable(s: string): boolean;
}

//导入语句：
// import {StringValidator} from "./Validation";

namespace validator {
    //加上export之后，使用import导入后才可用。不加export则只能在本命名空间使用，不能在外部使用
    export interface StringValidator1 {
        isAcceptable(s: string): boolean;
    }
}

//导入语句：
// import StringValidator = validator.StringValidator; Validation.StringValidator

