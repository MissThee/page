"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var metadataTest;
(function (metadataTest) {
    function df(constructor) {
        Object.seal(constructor);
        Object.seal(constructor.prototype);
    }
    //装饰器工厂。
    function d1(metadataValue) {
        return function (target) {
            Reflect.defineMetadata('metaKey1', metadataValue, target);
        };
    }
    //重载构造函数
    function d11(constructor) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.newProperty = "new property";
                _this.hello = "override";
                return _this;
            }
            return class_1;
        }(constructor));
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
            df,
            d11,
            d1('admin')
        ], Post);
        return Post;
    }());
    //获取静态类的meta值，参数(metaKey,被标注的类)
    var metadata = Reflect.getMetadata('metaKey1', Post);
    //获取静态类的meta值，参数(metaKey,被标注的方法的类的实例，被标注的方法名)
    var metadata1 = Reflect.getMetadata('metaKey2', new Post(), 'param1Value');
    console.log(metadata);
    console.log(metadata1);
})(metadataTest || (metadataTest = {}));
