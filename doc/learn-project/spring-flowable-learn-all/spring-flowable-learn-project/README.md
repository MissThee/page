# DisciplineInspectionCommission
# 项目约定
## 1. http请求类型（待定）
  | http方法 | 资源操作 | 幂等 | 安全 |  数据操作动作  |
  | :------: | :------: | :------: | :------: |  :------: |
  | POST | SELECT | √ | √ | 查 |
  | PUT | INSERT | × | × | 增 |
  | PATCH | UPDATE | √ | × | 改 |
  | DELETE | DELETE | √ | × | 删 |
  - 幂等性：对同一接口的多次访问，得到的资源状态是相同的。
  - 安全性：对该接口访问，不会使服务器资源的状态发生变化。

## 2. controller接口
### url
>  url中不出现`select`,`insert`,`update`,`delete`,`find`,`set`,`get`等增删改查相关动词。因接口请求类型已经区分了各种动作，无需再在url中出现此类词语

### 返回值格式
1. 返回值为json数据时,格式为
   ```json
   {
       "result":true,
       "data":{},
       "msg":"附加消息"
   }
   ```
    提供`com.dic.common.tool.Res`静态类可直接包装为以上格式
2. 返回值为其他类型数据时自行处理

## 3. 代码生成
  1. 生成的代码中，Model实体类，统一移动到common中的`com.dic.common.db.entity`下，保持每个Model与数据库表内容完全一一对应。
  2. 若原Model中参数不能满足需求，自行创建相关DTO等实体类使用
