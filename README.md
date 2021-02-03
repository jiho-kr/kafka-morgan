# kafka-morgan
This is a morgan module saves logs to kafka

# How to use
```
import * as KafkaMorgan from './kafka-morgan';

...
  app.use(
    KafkaMorgan({
      kafkaHost: 'localhost:9092',
    }),
 ```
 You can refer to Client Options (https://github.com/SOHU-Co/kafka-node#kafkaclient)
 
 ...
  app.use(
    KafkaMorgan(
      {
        kafkaHost: configService.get('KAFKA_BROKERS').toLocaleString(),
      },
      { topic: 'accesslogs', partition: 0 },
    ),
  );
 ```
