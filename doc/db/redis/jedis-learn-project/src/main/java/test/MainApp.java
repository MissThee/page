package test;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.params.SetParams;

import java.util.Collections;

public class MainApp {

  public static void main(String[] args) {
    Jedis jedis = new Jedis("localhost");
    System.out.println("是否存在1：" + jedis.exists("aKey"));
    System.out.println("没有就存：" + jedis.set("aKey", "哈哈哈", SetParams.setParams().nx()));
    System.out.println("是否存在2：" + jedis.exists("aKey"));
    System.out.println("subject1加锁：" + tryGetDistributedLock(jedis, "ImALock", "subject1", 100000L));
    System.out.println("subject2解锁：" + releaseDistributedLock(jedis, "ImALock", "subject2"));
    System.out.println("subject1解锁：" + releaseDistributedLock(jedis, "ImALock", "subject1"));
  }

  public static boolean tryGetDistributedLock(Jedis jedis, String lockKey, String requestId, long expireTime) {
    //"NX"不存在则创建，存在则不作操作
    //"PX"设置过期时间expireTime毫秒
    return "OK".equals(jedis.set(lockKey, requestId, SetParams.setParams().nx().px(expireTime)));
  }

  public static boolean releaseDistributedLock(Jedis jedis, String lockKey, String requestId) {
    //key不存在时，无锁，认为解锁成功
    //key存在时，获取value。存储value与当前传入值一致时尝试删除此key，返回解锁结果；不一致时，返回解锁失败
    //使用脚本的目的是将多个操作合并为一组，不会在java代码中让多个操作变成可分割的操作
    return ((Long) 1L).equals(jedis.eval(
      " if redis.call('exists', KEYS[1]) == 0 " +
        " then return 1 " +
        " else " +
        " if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end " +
        " end", Collections.singletonList(lockKey), Collections.singletonList(requestId)));
  }

}
