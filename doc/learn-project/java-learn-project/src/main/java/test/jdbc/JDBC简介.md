常见的 JDBC 组件
JDBC 的 API 提供了以下接口和类：
1. **DriverManager** ：这个类管理一系列数据库驱动程序。匹配连接使用通信子协议从 JAVA 应用程序中请求合适的数据库驱动程序。识别 JDBC 下某个子协议的第一驱动程序将被用于建立数据库连接。
2. **Driver** : 这个接口处理与数据库服务器的通信。你将很少直接与驱动程序互动。相反，你使用 DriverManager 中的对象，它管理此类型的对象。它也抽象与驱动程序对象工作相关的详细信息。
3. **Connection** : 此接口具有接触数据库的所有方法。该连接对象表示通信上下文，即，所有与数据库的通信仅通过这个连接对象进行。
4. **Statement** : 使用创建于这个接口的对象将 SQL 语句提交到数据库。除了执行存储过程以外，一些派生的接口也接受参数。
5. **ResultSet** : 在你使用语句对象执行 SQL 查询后，这些对象保存从数据获得的数据。它作为一个迭代器，让您可以通过它的数据来移动。
6. **SQLException** : 这个类处理发生在数据库应用程序的任何错误。


1. 连接数据库
   当你加载了驱动程序之后，你可以通过 DriverManager.getConnection() 方法建立一个连接。为方便参考，以下列出了三个加载 DriverManager.getConnection() 方法：
   1. getConnection(String url)
      + 参数格式：jdbc:oracle:driver:username/password@database
   2. getConnection(String url, Properties prop)
      + 参数格式：jdbc:oracle:thin:@amrood:1521:EMP
      + 其中Properties
        ```
        Properties info = new Properties( );
        info.put( "user", "root" );
        info.put( "password", "123" );
        ```
   3. getConnection(String url, String user, String password)
      + 参数格式：root 123 jdbc:oracle:thin:@amrood:1521:EMP

2. Statement 对象
   1. Statement	可以正常访问数据库，适用于运行静态 SQL 语句。 Statement 接口不接受参数。
   2. PreparedStatement	计划多次使用 SQL 语句， PreparedStatement 接口运行时接受输入的参数。
   3. CallableStatement	适用于当你要访问数据库存储过程的时候， CallableStatement 接口运行时也接受输入的参数。

3. ResultSet 对象
   1. JDBC 提供了连接方法通过下列创建语句来生成你所需的 ResultSet 对象：
      + createStatement(int RSType, int RSConcurrency);
      + prepareStatement(String SQL, int RSType, int RSConcurrency);
      + prepareCall(String sql, int RSType, int RSConcurrency);
      + 其中RSType

        | 类型 | 描述 |
        | --- | --- |
        | ResultSet.TYPE_FORWARD_ONLY | 光标只能在结果集中向前移动。默认值 |
        | ResultSet.TYPE_SCROLL_INSENSITIVE | 光标可以向前和向后移动。当结果集创建后，其他人对数据库的操作不会影响结果集的数据。|
        | ResultSet.TYPE_SCROLL_SENSITIVE. | 光标可以向前和向后移动。当结果集创建后，其他人对数据库的操作会影响结果集的数据。|
      + 其中RSConcurrency

        | 并发性 | 描述 |
        | --- | --- |
        | ResultSet.CONCUR_READ_ONLY | 创建一个只读结果集。这是默认的值|
        | ResultSet.CONCUR_UPDATABLE | 创建一个可修改的结果集。|
      + 其中TYPE_SCROLL_SENSITIVE，其他人对数据库的操作会影响结果集的数据，原因：
        + ResultSet 查询出结果后，查询结果被数据库缓存，而返回的内容为结果数据在数据库底层定位记录的索引值。
        + 当next遍历ResultSet时，每次都会再次查询对应的数据值
        + 更新敏感：会反映到结果集中。查询结果中的数据被更新时，被缓存的数据也被更新，读取到改变后的值
        + 删除/新增不敏感：不会及时地反映到结果集中。删除操作，此过程中数据库删除操作仅为做标记，此记录不被检索，但被缓存的数据仍存在，仍可读取；新增操作，新增的记录不会立即记录到已经查询完的结果中，不会被读取。
