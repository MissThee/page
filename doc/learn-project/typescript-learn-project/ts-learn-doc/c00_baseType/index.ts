// boolean 布尔
let isDone: boolean = false;

// number 数字
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;

// string 字符串
let name: string = "bob";
name = "smith";

// array 数组
let list: number[] = [1, 2, 3];
let listType: Array<number> = [1, 2, 3];// 加泛型

// tuple 元组
let x: [string, number];
x = ['hello', 10]; // OK
// x = [10, 'hello']; // Error

// enum 枚举
enum Color {Red, Green, Blue}//默认从0开始编号
let c: Color = Color.Green;

enum Color1 {Red, Green = 3, Blue}
let colorName: string = Color1[3];
console.log(colorName);// 'Green'

// any 忽略类型检查
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;

//void
function warnUser(): void {
    console.log("This is my warning message");
}
let unusableUndefined: void = undefined;//声明一个void类型的变量只能为它赋予undefined和null：
let unusableNull: void = null;//声明一个void类型的变量只能为它赋予undefined和null：

// Null 和 Undefined
let u: undefined = undefined;
let n: null = null;
//默认情况下null和undefined是所有类型的子类型。可以把 null和undefined赋值给number类型的变量。然而，当你指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自


//在 Typescript 中，只要文件存在 import 或 export 关键字，都被视为 module;否则视为全局内容
export {}
