import { Producer as _Producer, KafkaClient } from 'kafka-node';
import morgan, { compile, format as _format, token } from 'morgan';
import { PassThrough } from 'stream';
import { carry } from 'carrier';
const passStream = new PassThrough();

/**
 * KafkaMorgan object
 * @param  {object} KafkaClientOptions - represents kafka client options.
 * @param  {object} options - represents morgan options, check their github, default value is empty object {}.
 * @param  {string} format - represents morgan formatting, check their github, default value is 'tiny'.
 */
function KafkaMorgan(KafkaClientOptions, options, format) {
  // Filter the arguments
  // eslint-disable-next-line prefer-rest-params
  const args = Array.prototype.slice.call(arguments);
  if (args.length === 0 || !KafkaClientOptions.kafkaHost) {
    throw new Error(
      'KafkaClientOptions is null or empty. You can refer to Client Options (https://github.com/SOHU-Co/kafka-node#kafkaclient).',
    );
  }

  if (args.length > 1 && typeof options !== 'object') {
    throw new Error(
      'Options parameter needs to be an object. You can specify empty object like {}.',
    );
  }

  if (args.length > 2 && typeof format === 'object') {
    throw new Error(
      "Format parameter should be a string. Default parameter is 'tiny'.",
    );
  }

  const Producer = _Producer;
  const client = new KafkaClient(KafkaClientOptions);
  const producer = new Producer(client);
  producer.on('ready', function () {
    console.log('kafka-morgan ready');
  });

  options = options || {};
  format = format || 'tiny';

  // Create stream to read from
  const lineStream = carry(passStream);
  lineStream.on('line', onLine);

  // Morgan options stream
  options.stream = passStream;

  function onLine(line) {
    /*
      Creating a payload, which takes below information
      'topic'     this is the topic we have created in kafka.
      'messages'  data which needs to be sent to kafka.
      'partition' which partition should we send the request to.
                  If there are multiple partition, then we optimize the code here,
                  so that we send request to different partitions. 
    */
    const payloads = [{ topic: 'accesslogs', messages: line, partition: 0 }];
    producer.send(payloads);
  }

  const kafkaMorgan = morgan(format, options);
  return kafkaMorgan;
}

export default KafkaMorgan;
export const compile = compile;
export const format = _format;
export const token = token;
