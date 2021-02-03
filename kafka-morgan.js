import { Producer as _Producer, KafkaClient } from 'kafka-node';
import morgan, { compile, format as _format, token } from 'morgan';
import { PassThrough } from 'stream';
import { carry } from 'carrier';
const passStream = new PassThrough();

/**
 * KafkaMorgan object
 * @param  {object} kafkaClientOptions - represents kafka client options.
 * @param  {object} topicOptions - topic Options. default value is '{name: 'accesslogs', partition: 0}'.
 * @param  {object} options - represents morgan options, check their github, default value is empty object {}.
 * @param  {string} format - represents morgan formatting, check their github, default value is 'tiny'.
 */
function KafkaMorgan(kafkaClientOptions, topicOptions, options, format) {
  // Filter the arguments
  // eslint-disable-next-line prefer-rest-params
  const args = Array.prototype.slice.call(arguments);
  if (args.length === 0 || !kafkaClientOptions.kafkaHost) {
    throw new Error(
      'kafkaClientOptions is null or empty. You can refer to Client Options (https://github.com/SOHU-Co/kafka-node#kafkaclient).',
    );
  }

  if (args.length > 1 && typeof topicOptions !== 'object') {
    throw new Error(
      'Topic parameter should be a string. Default topicOptions is "{name: accesslogs, partition: 0}".',
    );
  }

  if (args.length > 2 && typeof options !== 'object') {
    throw new Error(
      'Options parameter needs to be an object. You can specify empty object like {}.',
    );
  }

  if (args.length > 3 && typeof format !== 'string') {
    throw new Error(
      'Format parameter should be a string. Default parameter is "tiny".',
    );
  }

  const Producer = _Producer;
  const client = new KafkaClient(kafkaClientOptions);
  const producer = new Producer(client);
  const topic = (topicOptions && topicOptions.name) || 'accesslogs';
  const partition = (topicOptions && topicOptions.partition) || 0;
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
    const payloads = [{ topic, messages: line, partition }];
    producer.send(payloads);
  }

  const kafkaMorgan = morgan(format, options);
  return kafkaMorgan;
}

export default KafkaMorgan;
export const compile = compile;
export const format = _format;
export const token = token;
