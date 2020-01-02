package test.jdbc;
//STEP 1. Import required packages

import java.sql.*;

public class Test2Transaction {
  static final String DB_URL = "jdbc:mysql://localhost/test";
  static final String USER = "root";
  static final String PASS = "1qazxsw2!";

  public static void main(String[] args) {
    try (
      Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
      Statement statement = conn.createStatement()
    ) {
      conn.setAutoCommit(false);//取消自动提交，改为手动提交
      statement.executeUpdate("INSERT INTO student(name ,age) values ('aaa',111) ");
      Savepoint savePoint1 = conn.setSavepoint("savePoint1");//创建存储点，可以在回滚时回滚到指定位置
      statement.executeUpdate("INSERT INTO student(name ,age) values ('bbb',222) ");
//    conn.rollback();//回滚所有
      conn.rollback(savePoint1);//回滚至指定位置
      conn.commit();//提交所有
    } catch (Exception e) {
      e.printStackTrace();
    }
    System.out.println("Goodbye!");
  }
}
