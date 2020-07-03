//接口
namespace p02interface {
//属性类型接口
    interface LabelledValue {
        label: string;
        readonly name: string;//只读属性
        title?: string;//可选参数，加?
        // [propName: string]: any;
    }

    function printText(labelledObj: LabelledValue) {
        console.log('输出labelledObj', labelledObj);
        // labelledObj.name="改名字";//错误，readonly只能在创建时赋值，不能再修改
    }

//传入的对象中，有string类型的label属性即可。
    let myObj = {size: 10, label: "theLabel!!!", name: '321'};
    printText(myObj);
//传入的参数若为对象字面量，则不能出现接口中没有的属性，否则typescript编译报错
    printText({label: "theLabel!!!", name: '321'});//size不能出现在这里
    printText({size: 10, label: "theLabel!!!", name: '321'} as LabelledValue);//使用断言可传入多余的属性
// printText({size:10,label: "theLabel!!!",name:'321'});//可以在接口中增加[propName: string]: any;来接收额外的属性
    console.log("-----------------------------------------")

//函数类型接口
    interface SearchFunc {
        //表明函数参数类型
        (source: string, subString: string): string;
    }

    let mySearch: SearchFunc;
    mySearch = function (src, sub) {
        return "1";
    };
    console.log("-----------------------------------------")

    interface StringArray {
        [index: number]: string;
    }

    let myArray: StringArray;
    myArray = ["Bob", "Fred"];
    console.log(myArray);
    console.log(myArray[0]);
    console.log(myArray[1]);
    console.log(myArray[100]);
    console.log(myArray[101]);
    console.log("-----------------------------------------")

    interface StringObject {
        [index: number]: string;
    }

    let myObject: StringObject;
    myObject = {100: "Bob", 101: "Fred"};
    console.log(myObject);
    console.log(myObject[0]);
    console.log(myObject[1]);
    console.log(myObject[100]);
    console.log(myObject[101]);
    console.log("-----------------------------------------")

    class Animal {
        name: string = "";

        constructor(name: string) {
            this.name = name;
        }
    }

    class Dog extends Animal {
        bark(): void {
            console.log("wang wang wang")
        };
    }

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
// interface ArrayNotOkay {
//     [x: number]: Animal;
//     [x: string]: Dog;
// }
// 正确，数字索引的返回值，必须是字符串索引返回值类型的子类型
    interface AnimalObjOkay {
        //number类型索引返回值（Dog），为string类型返回值（Animal）的子类
        //使用 number来索引时，JS会将它转换成string然后再去索引对象。 也就是说用 100（一个number）去索引等同于使用"100"（一个string）去索引，因此两者需要保持一致。
        [x: string]: Animal;

        [x: number]: Dog;
    }

    let animalObjOkay: AnimalObjOkay = {100: new Dog("D1"), 101: new Dog("D2")};
    console.log('输出animalObjOkay', animalObjOkay);
    console.log(animalObjOkay[0]);
    console.log(animalObjOkay[100]);
    console.log("-----------------------------------------")

// interface NumberDictionary {
//     [index: string]: number;
//
//     length: number;    // 正确，length是number类型，与[index: string]: number的类型一致
//     name: string    // 错误，name是string乐行，与[index: string]: number的类型不一致
// }
//
// let numberDictionary: NumberDictionary;
// numberDictionary = {'myKey': 1, length: 2, name: "3"};
// console.log(numberDictionary);
    console.log("-----------------------------------------")

//类接口
    interface TestClockInterface {
        currentTime: Date;

        setTime(d: Date): void;
    }

    class Clock implements TestClockInterface {
        //继承了接口，必须实现接口内部的声明。否则编译报错
        currentTime: Date;

        setTime(d: Date) {
            this.currentTime = d;
        }

        constructor(h: number, m: number) {
            this.currentTime = new Date();
        }
    }

    console.log("-----------------------------------------")

//将类赋值给变量时使用的接口
    class FakeNum {
        constructor(_val: string) {
        }

        static aa = 'xx'
        static bb = 11
    }

    interface FakeNum2 {
        //声明构造函数的参数类型
        new(val: string): FakeNum

        aa: string
        bb: number
    }

    let kk: FakeNum2 = FakeNum;
    console.log("-----------------------------------------")
//当使用implements继承接口时，仅检查实例部分，constructor存在于类的静态部分，所以不在检查的范围内，此处会报错，提示没有实现new (hour: number, minute: number);
// interface ClockConstructor {
//     new (hour: number, minute: number);
// }
// class Clock implements ClockConstructor {
//     constructor(h: number, m: number) { }
// }
    console.log("-----------------------------------------");

    interface ClockInterface {
        tick(): void;
    }

    class DigitalClock implements ClockInterface {
        constructor(h: number, m: number) {
        }

        tick() {
            console.log("tock tick");
        }
    }

    class AnalogClock implements ClockInterface {
        constructor(h: number, m: number) {
        }

        tick() {
            console.log("tick tock");
        }
    }

//使用额外的接口与函数，实现接口对构造函数的声明
    interface ClockConstructor {
        new(hour: number, minute: number): ClockInterface;
    }

    function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
        return new ctor(hour, minute);
    }

    let digital = createClock(DigitalClock, 12, 17);
    let analog = createClock(AnalogClock, 7, 32);
    console.log("-----------------------------------------");

//类继承接口
    interface Inter1 {
        func1(): void;
    }

    interface Inter2 {
        func2(): void;
    }

    class Func implements Inter1, Inter2 {
        func1(): void {
        }

        func2(): void {
        }
    }

    console.log("-----------------------------------------");

//接口继承接口
    interface Shape {
        color: string;
    }

    interface PenStroke {
        penWidth: number;
    }

    interface Square extends Shape, PenStroke {
        sideLength: number;
    }

    let square = <Square>{};//<Square>强制类型转换，断言类型
    console.log('输出square', square);//{}
    square.color = "blue";
    square.sideLength = 10;
    square.penWidth = 5.0;

}
