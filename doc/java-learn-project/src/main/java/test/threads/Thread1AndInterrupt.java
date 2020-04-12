package test.threads;

import java.time.LocalDateTime;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.CyclicBarrier;

//等待所有线程执行完毕再继续示例
public class Thread1AndInterrupt {
  private static final int THREAD_NUMBER = 5;

  public static void main(String[] args) throws InterruptedException {
    testRunnableAndInterrupt();
  }

  //thread WaitAndNoti
  private static void testRunnableAndInterrupt() throws InterruptedException {
    Runnable runnable = new Runnable() {
      @Override
      public void run() {
        //while循环在try里。
        try {
          while (!Thread.currentThread().isInterrupted()) {
              System.out.println(LocalDateTime.now());
          }
        } finally {
          System.out.println("thread done");
        }
      }
    };

    Thread thread = new Thread(runnable, "R");
    thread.start();
    Thread.sleep(1000);
    thread.interrupt();//设置线程中断状态
//    thread.isInterrupted();//获取线程中断状态
//    Thread.interrupted();//获取当前线程中断状态，并重置中断状态为未中断。
    System.out.println("All FINISHED!!!");
  }

}
