package test.proxy.proxy3cglib;


import test.proxy.proxy2dynamic.ISinger;

public class Singer implements ISinger {
    public void sing() {
        System.out.println("唱一首歌");
    }
}
