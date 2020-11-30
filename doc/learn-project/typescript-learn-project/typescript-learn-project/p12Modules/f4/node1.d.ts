//声明外部模块
declare module "urlUtil" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse(urlStr: string, parseQueryString?: any, slashesDenoteHost?: any): Url;
}
declare module "hot-new-module";//外部模块简写，可表示任意类型模块
//模块声明通配符
declare module "*!text" {
    const content: string;
    export default content;
}
declare module "json!*" {
    const value: any;
    export default value;
}

