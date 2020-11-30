export {}

// Disposable Mixin
class Disposable {
    isDisposed: boolean | undefined;

    dispose() {
        this.isDisposed = true;
    }

}

// Activatable Mixin
class Activatable {
    isActive: boolean | undefined;

    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }
}

//此处使用implements仅继承属性，而不继承实现
class SmartObject implements Disposable, Activatable {
    constructor() {
        setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
    }

    interact() {
        this.activate();
    }
    //以下属性、方法 为占位用
    // Disposable
    isDisposed: boolean = false;
    dispose: () => void = () => {
    };
    // Activatable
    isActive: boolean = false;
    activate: () => void = () => {
    };
    deactivate: () => void = () => {
    };
}

//将后面类中的属性与方法赋予到SmartObject
applyMixins(SmartObject, [Disposable, Activatable]);

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
