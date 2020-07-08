namespace p06Enums {
    {
        //枚举。默认元素值从0开始
        enum Direction {
            Up,
            Down,
            Left,
            Right
        }

        console.log('Direction', Direction);
    }
    {
        //使用
        enum Direction1 {
            Up = 1,//使用初始化器，给元素指定值。之后的值会依次递增
            Down,
            Left = 6,
            Right,
        }

        console.log('Direction1', Direction1);

    }

    //枚举类型中所有成员都有字面量值时，可作为类型使用
    function getNum() {
        return 6;
    }

    {
        // Dog为动态值，此时枚举成员不能作为类型使用
        // enum MyEnum {
        //     Dog = getNum(),
        //     Cat=0,
        // }
        // interface testInter {
        //     param: MyEnum.Cat;//出错
        // }

        //枚举成员作为类型使用
        enum MyEnum {
            Dog,
            Cat
        }

        interface testInter {
            param: MyEnum.Cat;
        }
    }

    //运行时枚举
    enum E {
        X, Y, Z
    }

    function f(obj: { X: number }) {
        return obj.X;
    }

    f(E);//正确，E中含有X属性，可赋值给f中的参数

    {
        // 反向映射
        enum Enum {
            A,
            B = "b"
        }

        let a = Enum.A;
        let b = Enum.B;
        let nameOfA = Enum[a]; // "A"
        // let nameOfB = Enum[b];//错误，只有值为数字类型的枚举成员有反向映射
    }
    {
        //const枚举
        //只能使用常量枚举表达式
        const enum Directions {
            Up,
            Down,
            Left = Down * 2,
            Right,
            // A=getNum()//错误
        }

        //常量枚举使用的地方，编译后全部替换为其值
        let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]

    }

    //外部枚举
    //外部枚举中，没有初始化方法的成员，被认为是需要经过计算的，不能当做常量赋值
    declare enum Enum {
        A = 1,
        B,
        C = 2
    }

    interface testInter1 {
        // param: Enum.A;//此处不能使用其作为类型
    }
}
