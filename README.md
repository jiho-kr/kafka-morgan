# kafka-morgan
This is a morgan module saves logs to kafka

# How to use
```
  app.use(
    KafkaMorgan({
      kafkaHost: 'localhost:9092',
    }),
 ```
 You can refer to Client Options (https://github.com/SOHU-Co/kafka-node#kafkaclient)
