package com.missthee.niotest;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

public class ApplicationStart {
    public static void main(String[] args) throws IOException {
        startServer(8188);
    }
    private static void startServer(int port) throws IOException {
        // 打开服务端ServerSocketChannel。open()为提供的静态工厂方法
        ServerSocketChannel serverChannel = ServerSocketChannel.open();
        // 设置为非阻塞模式。与selector配合使用需开启非阻塞模式
        serverChannel.configureBlocking(false);
        // 绑定一个本地端口，这样客户端便可以通过这个端口连接到服务器
        serverChannel.bind(new InetSocketAddress(port));

        // 打开selector
        Selector selector = Selector.open();
        // 注意关心的事件是OP_ACCEPT，表示只关心接受事件即接受客户端到服务器的连接
        serverChannel.register(selector, SelectionKey.OP_ACCEPT);

        while (true) {
            // select()阻塞直到注册的某个事件就绪并会更新SelectionKey的状态
            int readyChannels = selector.select();
            if (readyChannels <= 0) {
                continue;
            }

            // 得到就绪的selectedKey集合，selectedKey中保存有就绪的事件以及对应的Channel通道
            Set<SelectionKey> SelectorKeySet = selector.selectedKeys();
            Iterator<SelectionKey> iterator = SelectorKeySet.iterator();
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            // 遍历选择键
            while (iterator.hasNext()) {
                SelectionKey key = iterator.next();
                if (key.isAcceptable()) {
                    // 处理accept事件（为连接后的channel中注册的selector增加关心事件OP_READ，以激活read逻辑）
                    SocketChannel socketChannel = serverChannel.accept();
                    socketChannel.configureBlocking(false);
                    // 注意此处新增关心事件OP_READ
                    socketChannel.register(selector, SelectionKey.OP_READ);
                } else if (key.isReadable()) {
                    // 处理read事件
                    SocketChannel socketChannel = (SocketChannel) key.channel();
                    buffer.clear();
                    socketChannel.read(buffer);
                    buffer.flip();
                    socketChannel.write(buffer);
                }
                iterator.remove();
            }
        }
    }
}
