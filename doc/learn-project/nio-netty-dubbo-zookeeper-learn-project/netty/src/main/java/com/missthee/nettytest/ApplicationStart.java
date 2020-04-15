package com.missthee.nettytest;

public class ApplicationStart {
    public static void main(String[] args) {
        NettyServer nettyServer = new NettyServer();
        nettyServer.run();
    }
}
