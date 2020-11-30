export {}
enum Direction {
    Up,//默认值为0开始数字
    Down,
    Left = 5, //中间赋值后，后面的元素依次增长
    Right
}

enum DirectionStr {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
    Center,//非数字枚举必须显示赋值
}

//枚举值可以是表达式
enum FileAccess {
    // constant members
    None,
    Read = 1 << 1,
    Write = 1 << 2,
    ReadWrite = Read | Write,
    // computed member
    G = "123".length
}

//当所有枚举成员都拥有字面量枚举值时,枚举成员成为了类型
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle; //使用枚举类型
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square,    //  Error!
    radius: 100,
}

//可以将枚举对象作为参数传入
enum E {
    X, Y, Z
}

function f(obj: { X: number }) {
    return obj.X;
}

f(E);

// 反向映射
enum Enum {
    A
}

let nameOfA = Enum[Enum.A]; // "A"


