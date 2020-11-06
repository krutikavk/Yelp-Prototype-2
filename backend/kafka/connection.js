const kafka = require('kafka-node');
require('dotenv').config();

function ConnectionProvider() {
  this.getConsumer = (topicName) => {
    // this.client = new kafka.Client('localhost:2181');
    console.log('kafka connect: ', process.env.REACT_APP_KAFKA);
    this.client = new kafka.KafkaClient({ kafkaHost: process.env.REACT_APP_KAFKA });
    // eslint-disable-next-line max-len
    this.kafkaConsumerConnection = new kafka.Consumer(this.client, [{ topic: topicName, partition: 0 }]);
    this.client.on('ready', () => { console.log('client ready!'); });
    return this.kafkaConsumerConnection;
  };

  // Code will be executed when we start Producer
  this.getProducer = () => {
    console.log('kafka connect: ', process.env.REACT_APP_KAFKA);
    if (!this.kafkaProducerConnection) {
      var HighLevelProducer = kafka.HighLevelProducer;
      // this.client = new kafka.Client('localhost:2181');
      this.client = new kafka.KafkaClient({ kafkaHost: process.env.REACT_APP_KAFKA });
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      // this.kafkaConnection = new kafka.Producer(this.client);
      console.log('producer ready');
    }
    return this.kafkaProducerConnection;
  };
}
exports = module.exports = new ConnectionProvider;
