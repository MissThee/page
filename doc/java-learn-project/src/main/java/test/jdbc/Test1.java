package test.jdbc;

import java.sql.*;

public class Test1 {
  static final String DB_URL = "jdbc:mysql://localhost/test";
  static final String USER = "root";
  static final String PASS = "1qazxsw2!";

  public static void main(String[] args) {
    //使用try-with-resources释放资源（对象继承了AutoCloseable就可以）
    try (
      //Class.forName("com.mysql.jdbc.Driver");//注册驱动
      Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);//创建连接
      Statement statement = conn.createStatement();//创建sql语句对象：
      ResultSet rs = statement.executeQuery("SELECT * FROM student");//执行静态sql语句，无参数

//      PreparedStatement preparedStatement = conn.prepareStatement("SELECT * FROM student where id < ?");//执行带参数sql语句
//      preparedStatement.setInt(1, 10);//设置sql语句参数。第一个为参数下标1开始，第二个为参数值。
//      ResultSet rs2 = preparedStatement.executeQuery();

//      CallableStatement callableStatement = conn.prepareCall("{call getEmpName (?, ?)}");//执行存储过程
//      callableStatement.setString(1, "a");
//      callableStatement.setString(2, "a");
//      ResultSet rs3 = callableStatement.executeQuery();
    ) {

      //遍历结果
      while (rs.next()) {
        //通过列名获取值
        int id = rs.getInt("id");
        int age = rs.getInt("age");
        System.out.println("ID: " + id + ", Age: " + age);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    System.out.println("Goodbye!");
  }
}
