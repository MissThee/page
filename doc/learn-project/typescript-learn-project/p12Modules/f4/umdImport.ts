import { isPrime } from "./umdExport";
isPrime(2);
// mathLib.isPrime(2); // 错误: 不能在模块内使用全局定义（文件内使用了import/export则认定为模块）
