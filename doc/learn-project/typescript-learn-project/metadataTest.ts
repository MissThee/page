
function df(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

//装饰器工厂。
function d1(metadataValue: string): ClassDecorator {
    return function (target) {//装饰器
        Reflect.defineMetadata('metaKey1', metadataValue, target);
    };
}

//重载构造函数
function d11<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

function d2(metadataValue: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('metaKey2', metadataValue, target, propertyKey);
    };
}

@df
@d11
@d1('admin')
class Post {
    param1: string = "123";

    constructor() {
        this.param1 = 'hahaha';
    }

    // @Reflect.metadata('metaKey2', 'zxc')//设置一个meta值：key为metaKey2，目标为new Post()，propertyKey为param1Value，value为zxc
    @d2("zxc")
    public param1Value() {
        return this.param1;
    }
}

//获取静态类的meta值，参数(metaKey,被标注的类)
const metadata = Reflect.getMetadata('metaKey1', Post);
//获取静态类的meta值，参数(metaKey,被标注的方法的类的实例，被标注的方法名)
const metadata1 = Reflect.getMetadata('metaKey2', new Post(), 'param1Value');

console.log(metadata);
console.log(metadata1);
