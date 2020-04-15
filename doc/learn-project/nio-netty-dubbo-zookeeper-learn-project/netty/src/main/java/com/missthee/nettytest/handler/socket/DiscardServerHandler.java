package com.missthee.nettytest.handler.socket;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.ReferenceCountUtil;

//ChannelInboundHandlerAdapter实现自ChannelInboundHandler
//ChannelInboundHandler提供了不同的事件处理方法，可以重写，实现自定义的业务逻辑
public class DiscardServerHandler extends ChannelInboundHandlerAdapter {
    private boolean isEchoServer;

    public DiscardServerHandler(boolean isEchoServer) {
        this.isEchoServer = isEchoServer;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        //Discard the received data silently
        //ByteBuf是一个引用计数对象实现ReferenceCounted，他就是在有对象引用的时候计数+1，无的时候计数-1，当为0对象释放内存
        ByteBuf in = (ByteBuf) msg;
        if (isEchoServer) {
            ctx.writeAndFlush(msg);
        } else {
            try {
                while (in.isReadable()) {
                    char aByte = (char) in.readByte();
                    if (aByte == '0') {
                        ctx.writeAndFlush("end");
//                    ctx.channel().close();//退出当前channel，客户端失去连接
//                    ctx.channel().parent().close();//退出父级channel，会关闭所有channel，即使其他channel正在传输数据。会激活f.channel().closeFuture().sync();继续执行。
                    }
                    System.out.println(aByte);
                    System.out.flush();
                }
            } finally {
                ReferenceCountUtil.release(msg);
            }
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }


}
