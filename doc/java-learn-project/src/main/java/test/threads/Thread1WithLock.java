package test.threads;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

//等待所有线程执行完毕再继续示例
public class Thread1WithLock {
  private static Lock lock = new ReentrantLock(false);//参数不传或者false都是为非公平锁,为true时表示公平锁。
  //private static ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();//读写锁特点：多个读可以同时进行读，写与其他读写互斥，写优先于读；rwl.readLock().lock(); rwl.readLock().unlock(); rwl.writeLock().lock(); rwl.writeLock().unlock();
  private static Condition condition = lock.newCondition();
  private static final Object o = new Object();

  public static void main(String[] args) throws InterruptedException {
    MyRunnableWithLock runnableLock = new MyRunnableWithLock();
    MyRunnableWithSynchronized runnableSynchronized = new MyRunnableWithSynchronized();
    new Thread(runnableLock, "Thread-Lock").start();
    new Thread(runnableSynchronized, "Thread-Sync").start();
    Thread.sleep(2000);
    //唤醒
    lock.lock();
    condition.signal();
    lock.unlock();
    //唤醒
    synchronized (o) {
      o.notify();
    }
  }

  public static class MyRunnableWithLock implements Runnable {
    @Override
    public void run() {
      System.out.println(Thread.currentThread().getName() + " 开始");
      try {
        lock.lock();
//            lock.tryLock(1000*5, TimeUnit.SECONDS);//未超时获取到锁返回true；获取不到则等待，直到超时返回false；未超时被中断了抛出InterruptedException异常。
//            lock.tryLock();//获取到锁立即返回true，否则立即返回false；
//            lock.lockInterruptibly();//lockInterruptibly 一直等待获取锁，等待时被执行interrupt()，立即中断，抛出InterruptedException。 lock方法则是一直等待获取锁，等待时被执行interrupt()，也在获取到锁后，再把当前线程置为interrupted状态,然后再中断线程。
        //调用Condition里的方法，需要先获取相应的Lock（即lock.Lock()），否则抛出IllegalMonitorStateException
        condition.await();//释放相应的锁且阻塞（此处即释放掉lock，阻塞时lock.lock()可于其他线程获取到锁）。等待signal()方法激活时，再尝试获取当前对象的同步锁（此处即lock），获取到后继续执行。
      } catch (InterruptedException e) {
        System.out.println("THREAD INTERRUPTED");
      } finally {
        try {lock.unlock();} catch (Exception ignored) {}
        System.out.println(Thread.currentThread().getName() + " 结束");
      }
    }
  }

  public static class MyRunnableWithSynchronized implements Runnable {
    //【统一对象在多个线程中，普通成员变量共享】
    @Override
    public void run() {
      System.out.println(Thread.currentThread().getName() + " 开始");
      try {
        synchronized (o) {
          //调用object里的线程方法，需要先获取相应的对象锁（即synchronized (o)），否则抛出IllegalMonitorStateException
          o.wait();//wait()会释放对象的同步锁
        }
      } catch (InterruptedException e) {
        System.out.println("THREAD INTERRUPTED");
      } finally {
        System.out.println(Thread.currentThread().getName() + " 结束");
      }
    }
  }
}
//Jdk1.6之前，ReentrantLock性能优于synchronized，
//不过1.6之后，synchronized做了大量的性能调优，而且synchronized相对程序员来说，简洁熟悉，
//如果不是synchronized无法实现的功能，如轮询锁、超时锁和中断锁等，推荐首先使用synchronized，
//而针对锁的高级功能，再使用ReentrantLock。
