package test.jdbc;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.*;
import java.util.Arrays;

public class Test3Stream {
  static final String DB_URL = "jdbc:mysql://localhost/test";
  static final String USER = "root";
  static final String PASS = "1qazxsw2!";

  public static void main(String[] args) {
    File file = new File(System.getProperty("user.dir") + "/src/main/java/test/jdbc/text.txt");
    try (
      Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
    ) {
      //添加一条数据
      try (
        PreparedStatement preparedStatement = conn.prepareStatement("INSERT INTO stream_data(data) VALUES (?)");
        FileInputStream fIS = new FileInputStream(file);
      ) {
        preparedStatement.setAsciiStream(1, fIS, (int) file.length());
        preparedStatement.execute();
      }
      //查询数据
      try (
        Statement statement = conn.createStatement();
        ResultSet rs = statement.executeQuery("SELECT data FROM stream_data WHERE id=1");
      ) {
        if (rs.next()) {
          InputStream xmlInputStream = rs.getAsciiStream(1);
          int c;
          ByteArrayOutputStream bos = new ByteArrayOutputStream();
          while ((c = xmlInputStream.read()) != -1) {
            bos.write(c);
          }
          System.out.println(bos.toString());
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    System.out.println("Goodbye!");
  }
}
