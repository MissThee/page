查看运行中容器  
```
docker ps
```  
查看所有容器  
```
docker ps -a
```  
查看所有镜像  
```
docker image
```  
运行镜像，i输入，t交互模式，d在后台运行  
```
docker run -it -p <主机(宿主)端口>:<docker容器端口> -e  <设置环境变量:username="ritchie"> --name <自定义容器名称> <镜像id> -d <id>  /bin/bash
```  
停止容器  
```
docker stop
```  
删除容器  
```
docker rm <id>
```  
进入镜像
```
docker exec -it <镜像id> bash
```
宿主与镜像文件拷贝
```
docker cp <镜像id>:<镜像中绝对路径> <本机路径，相对路径则从cmd的当前目录开始>
```


### 操作所有容器：
容器停止  
```
docker stop $(docker ps -aq)
```  
容器删除  
```
docker rm $(docker ps -aq)
```  
镜像删除  
```
docker rmi $(docker images -q)
```  
