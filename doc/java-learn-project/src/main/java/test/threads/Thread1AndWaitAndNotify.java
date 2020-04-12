package test.threads;

import java.time.LocalDateTime;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.CyclicBarrier;

//等待所有线程执行完毕再继续示例
public class Thread1AndWaitAndNotify {
  private static final int THREAD_NUMBER = 5;

  public static void main(String[] args) throws InterruptedException {
    testRunnableAndWaitAndNoti();
  }

  private static void testRunnableAndWaitAndNoti() throws InterruptedException {
    Object o = new Object();
    Runnable runnable = new Runnable() {
      @Override
      public void run() {
        try {
          synchronized (o) {
            o.wait();//wait调用必须在同步代码块中，此处用synchronize包装，否则IllegalMonitorStateException异常
          }
          System.out.println("thread done");
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
      }
    };

    Thread thread = new Thread(runnable, "R");
    thread.start();
    Thread.sleep(2000);
    System.out.println("before notify");
    synchronized (o) {
      o.notify();//notify调用必须在同步代码块中，此处用synchronize包装，否则IllegalMonitorStateException异常
    }
  }
}
