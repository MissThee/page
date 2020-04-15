// cosnole.error('I get called from print.js!');
// import _ from 'lodash';
//
// console.log(
//     _.join(['Another', 'module', 'loaded!'], ' ')
// );

function getComponent() {
    return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
        let element = document.createElement('div');
        element.innerHTML = _.join(['Hello', 'webpack'], ' ');
        return element;
    }).catch(() => 'An error occurred while loading the component');
}

function onload() {
    const body=document.getElementsByTagName('body')[0];
    getComponent().then(c => {
        body.append(c)
    });
    body.append(aButton())
}

window.onload = onload;//此处为引用，不是调用，不加括号，否则onload拿到的是方法的执行结果，会导致方法在文档加载完成前执行

function aButton() {
    let button = document.createElement('button');
    button.innerHTML = 'Click me and look at the console!';
    button.onclick = () => import(/* webpackChunkName: "another" */ './another').then(module => {
        let print = module.default;
        print();
    });
    return button
}
