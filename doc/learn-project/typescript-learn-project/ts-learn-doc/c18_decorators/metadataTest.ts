import "reflect-metadata";//引入依赖，使编译后的js文件可使用 Reflect.defineMetadata() 等方法
namespace metadataTest {

    let target = {a: 1};
    //给指定对象设置元数据 metadataValue
    Reflect.defineMetadata('metaKey1', "哈哈哈", target);
    Reflect.defineMetadata('metaKey2', "嘿嘿嘿", target, "laugh");
    //从指定对象获取元数据
    console.log(Reflect.getMetadata('metaKey1', target));//哈哈哈
    console.log(Reflect.getMetadata('metaKey2', target, 'laugh'));//嘿嘿嘿

    function d1(metadataValue: string): ClassDecorator {
        return function (target) {//装饰器
            Reflect.defineMetadata('metaKey1', metadataValue, target);
        };
    }

    function d2(metadataValue: string) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            Reflect.defineMetadata('metaKey2', metadataValue, target, propertyKey);
        };
    }

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

//获取meta值，参数(metaKey, target)
    const metadata = Reflect.getMetadata('metaKey1', Post);
//获取meta值，参数(metaKey, target, propertyKey)
    const metadata1 = Reflect.getMetadata('metaKey2', new Post(), 'param1Value');

    console.log(metadata);
    console.log(metadata1);

    // 几个默认的元数据键
    // 类型元数据使用元数据键"design:type"
    // 参数类型元数据使用元数据键"design:paramtypes"
    // 返回值类型元数据使用元数据键"design:returntype"
    function logType(target: any, key: string) {
        var t = Reflect.getMetadata("design:type", target, key);
        console.log(key, t, t.name);
    }

    class Demo {
        @logType
        public attr1: string = "zxc1";
        @logType
        @Reflect.metadata("design:type", Number)//自行注入类型信息，此时logType中使用getMetadata方法获取类型，为此处注入的类型，而不是属性本身的类型
        public attr2: string = "asd2";
    }

}
