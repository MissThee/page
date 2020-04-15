package com.missthee.nettytest;

import com.missthee.nettytest.config.PropertiesHelper;
import com.missthee.nettytest.handler.http.HttpServerHandler;
import com.missthee.nettytest.handler.socket.DiscardServerHandler;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import io.netty.handler.stream.ChunkedWriteHandler;
import io.netty.util.concurrent.EventExecutorGroup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class NettyServer {
    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;
    private EventExecutorGroup threadPool;
    private Logger logger = LoggerFactory.getLogger(NettyServer.class);

    public void run() {
        //读取配置文件
        PropertiesHelper ph = new PropertiesHelper();
        String host = ph.get("server.host");
        int port = Integer.parseInt(ph.get("server.port"));
        final boolean isSocket = Boolean.parseBoolean(ph.get("server.is-socket"));
        //Group：群组，Loop：循环，Event：事件，这几个东西联在一起，相比大家也大概明白它的用途了。
        //Netty内部都是通过线程在处理各种数据，EventLoopGroup就是用来管理调度他们的，注册Channel，管理他们的生命周期。
        //NioEventLoopGroup是一个处理I/O操作的多线程事件循环
        //bossGroup作为boss,接收传入连接
        //因为bossGroup仅接收客户端连接，不做复杂的逻辑处理，为了尽可能减少资源的占用，取值越小越好
        bossGroup = new NioEventLoopGroup(1);//一个线程也可同时处理多个连接，只是当并发量高时可能性能不足
        //workerGroup作为worker，处理boss接收的连接的流量和将接收的连接注册进入这个worker
        workerGroup = new NioEventLoopGroup();//默认使用：逻辑处理器数*2，最小为1
        // 用户自定义的ThreadPool
        threadPool = new NioEventLoopGroup();
        //ServerBootstrap负责建立服务端
        ServerBootstrap serverBootstrap = new ServerBootstrap();
        serverBootstrap.group(bossGroup, workerGroup)//此处可以只使用一个工作组，用来接收和处理业务逻辑，但当业务逻辑占比较大时，会影响接收客户端连接
                //指定使用NioServerSocketChannel产生一个Channel用来接收连接
                .channel(NioServerSocketChannel.class)
//                .channelFactory( new ReflectiveChannelFactory<>(NioServerSocketChannel.class))
                .childHandler(
                        //ChannelInitializer用于配置一个新的Channel
                        //用于向你的Channel当中添加ChannelInboundHandler的实现
                        new ChannelInitializer<SocketChannel>() {
                            public void initChannel(SocketChannel ch) {
                                //ChannelPipeline用于存放管理ChannelHandel
                                //ChannelHandler用于处理请求响应的业务逻辑相关代码
                                ChannelPipeline pipeline = ch.pipeline();
                                if (isSocket) {
                                    // 自定义处理handler
                                    pipeline.addLast(threadPool, new DiscardServerHandler(false));
                                } else {

                                    pipeline.addLast("http-decoder", new HttpRequestDecoder());// 请求解码器

                                    pipeline.addLast("http-encoder", new HttpResponseEncoder());// 响应转码器
//                                  pipeline.addLast("http-encoder", new HttpServerCodec());//相当于增加了以上两个
                                    // 将HTTP消息的多个部分合成一条完整的HTTP消息
                                    pipeline.addLast("http-aggregator", new HttpObjectAggregator(65535));
                                    // 新增ChunkedHandler，主要作用是支持异步发送大的码流（例如大文件传输），但是不占用过多的内存，防止发生java内存溢出错误
                                    pipeline.addLast("http-chunked", new ChunkedWriteHandler());
                                    // 用于下载文件
//                                    ch.pipeline().addLast(new HttpDownloadHandler());
                                    // 自定义处理handler
                                    pipeline.addLast(threadPool, "http-server", new HttpServerHandler());
                                }
                            }
                        }
                )
                //对Channel进行一些配置，注意以下是socket的标准参数
                //option是为了NioServerSocketChannel设置的，用来接收传入连接的
                .option(ChannelOption.SO_BACKLOG, 128)//BACKLOG用于构造服务端套接字ServerSocket对象，标识当服务器请求处理线程全满时，用于临时存放已完成三次握手的请求的队列的最大长度。如果未设置或所设置的值小于1，Java将使用默认值50。
                //childOption 是用来给父级ServerChannel之下的Channels设置参数的
                .childOption(ChannelOption.TCP_NODELAY, true)//启用TCP_NODELAY，关闭小包转发算法，可使小包响应速度提升
                .childOption(ChannelOption.SO_KEEPALIVE, true);//是否启用心跳保活机制。在双方TCP套接字建立连接后（即都进入ESTABLISHED状态）并且在两个小时左右上层没有任何数据传输的情况下，这套机制才会被激活。

        try {
            // Bind and start to accept incoming connections.
            ChannelFuture f = serverBootstrap.bind(host, port).sync();
            //sync()会同步等待连接操作结果，用户线程将在此wait()，直到连接操作完成之后，线程被notify(),用户代码继续执行
            //closeFuture()当Channel关闭时返回一个ChannelFuture,用于链路检测
            logger.info("SERVER started, host is {}, port is {}.", host, port);
            //方法仅仅是为了使当前main线程阻塞而不立即执行之后的各种shutdown()方法，其语义是等到服务端接受客户端连接的Channel被关闭时，才执行后面代码的操作。在实际应用中，这样的代码并不实用，我们可能需要接受诸如kill命令后，优雅关闭线程组
            f.channel().closeFuture().sync();
            logger.info("SERVER closed, host is {} , 8087 is {}.", host, port);
        } catch (InterruptedException e) {
            logger.error("SERVER start failed", e);
        } finally {
            if (workerGroup != null) {
                workerGroup.shutdownGracefully();
            }
            if (bossGroup != null) {
                bossGroup.shutdownGracefully();
            }
            if (threadPool != null) {
                threadPool.shutdownGracefully();
            }
        }
    }
}
