package test.socket.udp;

import java.net.DatagramSocket;
import java.net.InetAddress;

public class SocketUDPClient {
    public static void main(String[] args) throws Exception {
        DatagramSocket ds = new DatagramSocket(9897);
        for (int i = 0; i < 10; i++) {
          SocketUDPTool. send(ds, InetAddress.getByName("localhost"), 9898, "[test message]");
          SocketUDPTool. receive(ds);
        }
        ds.close();
    }
}
