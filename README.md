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
 
 ```
  app.use(
    KafkaMorgan(
      {
        kafkaHost: configService.get('KAFKA_BROKERS').toLocaleString(),
      },
      { topic: 'accesslogs', partition: 0 },
    ),
  );
 ```

If you are using `nestjs` it is better to use it like this:
```
  const kafkaController = app.select(KafkaModule).get(KafkaController);
  const format = morganJson(
    ':date :method :url :status :req[content-length] :res[content-length] :response-time :remote-addr :user-agent',
  );
  app.use(morgan(format, { stream: kafkaController.stream() }));
```
