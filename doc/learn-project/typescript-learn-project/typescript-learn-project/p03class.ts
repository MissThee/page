namespace p03class {
    //类
    class Greeter {
        greeting: string;

        constructor(message: string) {
            this.greeting = message;
        }

        greet() {
            return "Hello, " + this.greeting;
        }
    }

    let greeter = new Greeter("world");
    console.log(greeter.greet())
    console.log("--------------------------------------")
    {
        //类继承
        class Animal {
            move(distanceInMeters: number = 0) {
                console.log(`Animal moved ${distanceInMeters}m.`);
            }
        }

        class Dog extends Animal {
            bark() {
                console.log('Woof! Woof!');
            }
        }

        const dog = new Dog();
        dog.bark();
        dog.move(10);
        dog.bark();
    }
    console.log("--------------------------------------")
    {
        class Animal {
            name: string;

            constructor(theName: string) {
                this.name = theName;
            }

            move(distanceInMeters: number = 0) {
                console.log(`Animal moved ${distanceInMeters}m.`);
            }
        }

        class Dog extends Animal {
            //子类构造函数必须调用基类构造函数。
            weight: number;

            constructor(name: string) {
                // this.weight=100;//不正确，子类构造函数里访问this前，必须调用super()
                super(name);
                this.weight = 100;
            }

            bark() {
                console.log('Woof! Woof!');
            }

            move(distanceInMeters: number = 0) {
                console.log(`Dog ran ${distanceInMeters}m.`);
            }
        }

        let dog = new Dog("D1");
        console.log(dog.name);
    }
    console.log("--------------------------------------")
    {
        //类含义private/protected属性，赋值兼容性
        class Animal {
            private name: string;

            constructor(theName: string) {
                this.name = theName;
            }
        }

        class Rhino extends Animal {
            constructor() {
                super("Rhino");
            }
        }

        class Employee {
            private name: string;

            constructor(theName: string) {
                this.name = theName;
            }
        }

        let animal: Animal;
        let rhino = new Rhino();
        let employee = new Employee("Bob");

        animal = rhino;
        // animal = employee; // 错误: Animal 与 Employee 不兼容。
        // 因 employee中private的name 与 Animal中private的name 不是同一来源；protected规则相同
        // 若两个name属性均为public，则兼容，不关心来源
    }
    console.log("--------------------------------------")
    {
        //修饰符
        class Person {
            private age: number = 16;
            protected name: string;

            protected constructor(theName: string) {
                this.name = theName;
            }
        }

        // Employee 能够继承 Person
        class Employee extends Person {
            constructor(name: string) {
                super(name);
                console.log(this.name);//可访问基类中protected修饰的属性
                // console.log(this.age);//不能访问基类中protected修饰的属性
            }

            public getInfo() {
                return `My name is ${this.name}.`;
            }
        }

        let howard = new Employee("Howard");
        // let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.
    }
    console.log("--------------------------------------")
    {
        //readonly 修饰符
        class Octopus {
            readonly name: string;
            readonly numberOfLegs: number = 8;

            constructor(theName: string) {
                this.name = theName;
            }
        }

        let dad = new Octopus("Man with the 8 strong legs");
        //dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
        //简化以上类中属性的声明与赋值
        class OctopusNeo {
            readonly numberOfLegs: number = 8;

            constructor(readonly name: string) {
            }
        }

        let octopusNeo = new OctopusNeo("O1");
        console.log(octopusNeo.name);
    }
    console.log("--------------------------------------")
    {
        //存取器，使用getters/setters
        {//未使用存取器的类
            class Employee {
                fullName: string = "";
            }

            let employee = new Employee();
            employee.fullName = "BobSmith";
            if (employee.fullName) {
                console.log(employee.fullName);
            }
        }
        {
            class Employee {
                private _fullName: string = "";
                private _sex: string = "unknown";

                get fullName(): string {
                    console.log("LOG:get fullName");
                    return this._fullName;
                }

                set fullName(newName: string) {
                    console.log("LOG:change fullName");
                    this._fullName = newName;
                }

                get sex(): string {//只有get的存取器会被认定为readonly
                    return this._sex;
                }

            }

            let employee = new Employee();
            employee.fullName = "Dark Smith";
            // employee.sex="123";//只有get的存取器会被认定为readonly
            console.log(employee.fullName);
        }
    }
    {
        //静态属性
        class Grid {
            static readonly origin = {x: 0, y: 0};

            constructor(public scale: number) {
                //使用Grid.访问静态属性
                console.log(Grid.origin.x / scale, Grid.origin.y / scale)
            }
        }

        //使用Grid.访问静态属性
        console.log(Grid.origin.x)
    }
    {
        //抽象类
        abstract class Animal {
            abstract makeSound(): void;//抽象方法，子类必须实现
            move(): void {//普通方法，子类会继承
                console.log('roaming the earch...');
            }
        }

        class Dog extends Animal {
            makeSound(): void {
            }

            goHome(): void {
            }
        }

        let dog: Animal = new Dog();
        dog.makeSound();
        // dog.goHome();//声明了dog为Animal类型，则实例无法访问Animal类中未出现的方法
        let dog1 = new Dog();
        dog1.makeSound();
        dog1.goHome();
    }
    {
        //类当做接口使用
        class Point {
            x: number = 0;
            y: number = 0;

        }

        interface Point3d extends Point {
            z: number;
        }

        let point3d: Point3d = {x: 1, y: 2, z: 3};
    }
}
