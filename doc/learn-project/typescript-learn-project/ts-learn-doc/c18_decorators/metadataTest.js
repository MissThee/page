"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); //引入依赖，使编译后的js文件可使用 Reflect.defineMetadata() 等方法
var metadataTest;
(function (metadataTest) {
    var target = { a: 1 };
    //给指定对象设置元数据 metadataValue
    Reflect.defineMetadata('metaKey1', "哈哈哈", target);
    Reflect.defineMetadata('metaKey2', "嘿嘿嘿", target, "laugh");
    //从指定对象获取元数据
    console.log(Reflect.getMetadata('metaKey1', target)); //哈哈哈
    console.log(Reflect.getMetadata('metaKey2', target, 'laugh')); //嘿嘿嘿
    function d1(metadataValue) {
        return function (target) {
            Reflect.defineMetadata('metaKey1', metadataValue, target);
        };
    }
    function d2(metadataValue) {
        return function (target, propertyKey, descriptor) {
            Reflect.defineMetadata('metaKey2', metadataValue, target, propertyKey);
        };
    }
    var Post = /** @class */ (function () {
        function Post() {
            this.param1 = "123";
            this.param1 = 'hahaha';
        }
        // @Reflect.metadata('metaKey2', 'zxc')//设置一个meta值：key为metaKey2，目标为new Post()，propertyKey为param1Value，value为zxc
        Post.prototype.param1Value = function () {
            return this.param1;
        };
        __decorate([
            d2("zxc")
        ], Post.prototype, "param1Value", null);
        Post = __decorate([
            d1('admin')
        ], Post);
        return Post;
    }());
    //获取meta值，参数(metaKey, target)
    var metadata = Reflect.getMetadata('metaKey1', Post);
    //获取meta值，参数(metaKey, target, propertyKey)
    var metadata1 = Reflect.getMetadata('metaKey2', new Post(), 'param1Value');
    console.log(metadata);
    console.log(metadata1);
    // 几个默认的元数据键
    // 类型元数据使用元数据键"design:type"
    // 参数类型元数据使用元数据键"design:paramtypes"
    // 返回值类型元数据使用元数据键"design:returntype"
    function logType(target, key) {
        var t = Reflect.getMetadata("design:type", target, key);
        console.log(key, t, t.name);
    }
    var Demo = /** @class */ (function () {
        function Demo() {
            this.attr1 = "zxc1";
            this.attr2 = "asd2";
        }
        __decorate([
            logType
        ], Demo.prototype, "attr1", void 0);
        __decorate([
            logType,
            Reflect.metadata("design:type", Number) //自行注入类型信息，此时logType中使用getMetadata方法获取类型，为此处注入的类型，而不是属性本身的类型
        ], Demo.prototype, "attr2", void 0);
        return Demo;
    }());
})(metadataTest || (metadataTest = {}));
