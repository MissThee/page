"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 5] = "Left";
    Direction[Direction["Right"] = 6] = "Right";
})(Direction || (Direction = {}));
var DirectionStr;
(function (DirectionStr) {
    DirectionStr["Up"] = "UP";
    DirectionStr["Down"] = "DOWN";
    DirectionStr["Left"] = "LEFT";
    DirectionStr["Right"] = "RIGHT";
    DirectionStr[DirectionStr["Center"] = void 0] = "Center";
})(DirectionStr || (DirectionStr = {}));
//枚举值可以是表达式
var FileAccess;
(function (FileAccess) {
    // constant members
    FileAccess[FileAccess["None"] = 0] = "None";
    FileAccess[FileAccess["Read"] = 2] = "Read";
    FileAccess[FileAccess["Write"] = 4] = "Write";
    FileAccess[FileAccess["ReadWrite"] = 6] = "ReadWrite";
    // computed member
    FileAccess[FileAccess["G"] = "123".length] = "G";
})(FileAccess || (FileAccess = {}));
//当所有枚举成员都拥有字面量枚举值时,枚举成员成为了类型
var ShapeKind;
(function (ShapeKind) {
    ShapeKind[ShapeKind["Circle"] = 0] = "Circle";
    ShapeKind[ShapeKind["Square"] = 1] = "Square";
})(ShapeKind || (ShapeKind = {}));
var c = {
    kind: ShapeKind.Square,
    radius: 100,
};
//可以将枚举对象作为参数传入
var E;
(function (E) {
    E[E["X"] = 0] = "X";
    E[E["Y"] = 1] = "Y";
    E[E["Z"] = 2] = "Z";
})(E || (E = {}));
function f(obj) {
    return obj.X;
}
f(E);
// 反向映射
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
})(Enum || (Enum = {}));
var nameOfA = Enum[Enum.A]; // "A"
