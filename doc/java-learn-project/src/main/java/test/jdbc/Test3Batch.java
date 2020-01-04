package test.jdbc;

import java.sql.*;
import java.util.Arrays;

public class Test3Batch {
  static final String DB_URL = "jdbc:mysql://localhost/test";
  static final String USER = "root";
  static final String PASS = "1qazxsw2!";

  public static void main(String[] args) {
    try (
      Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
      Statement statement = conn.createStatement();
      PreparedStatement preparedStatement = conn.prepareStatement("INSERT INTO student(name ,age) values (?,?) ");
    ) {
      //批量处理一般应配合事务一同使用，这在编码上不是必须的，但在逻辑上可保证批处理统一提交或回滚
      //1. Statement使用batch
      conn.setAutoCommit(false);
      statement.addBatch("INSERT INTO student(name ,age) values ('aaa',111) ");
      statement.addBatch("INSERT INTO student(name ,age) values ('bbb',222) ");
      int[] count = statement.executeBatch();//执行
      conn.commit();//提交所有
      System.out.println(Arrays.toString(count));
      //2. PreparedStatement使用batch
      //添加一条数据
      preparedStatement.setInt(2, 13);
      preparedStatement.setString(1, "AAA");
      preparedStatement.addBatch();
      //添加第二条数据
      preparedStatement.setInt(2, 13);
      preparedStatement.setString(1, "BBB");
      preparedStatement.addBatch();
      int[] count1 = preparedStatement.executeBatch();//执行
      System.out.println(Arrays.toString(count1));
      conn.commit();

    } catch (Exception e) {
      e.printStackTrace();
    }
    System.out.println("Goodbye!");
  }
}
