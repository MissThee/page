java执行 class文件是将包名转换为路径
如:
(前提是classpath环境变量加了 .; 值，即当前目录到环境变量中)
shell中执行：java test.jdbc.Test1
是执行classpath目录 test/jdbc/Test1.class 文件

引用jar包 
使用-cp  参数分号分隔；第一参数设置classpath路径，.代表当前目录；其余参数为列出引用的jar包。
java -cp .;xxx.jar Xxx.class    当前目录jar包

java -cp .;* Xxx.class    当前目录所有jar包

java -cp .;C:\lib\xxxjar Xxx.class    绝对路径jar包
