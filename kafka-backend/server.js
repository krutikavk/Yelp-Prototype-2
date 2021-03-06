var connection =  new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
var Customers = require('./services/customers');
var Restaurants = require('./services/restaurants');
var Dishes = require('./services/dishes');
var Conversations = require('./services/conversations');
var Events = require('./services/events');
var Orders = require('./services/orders');

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log('Message in server: ', message);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handleRequest(data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
// first argument is topic name
// second argument is a function that will handle this topic request
handleTopicRequest('customersTopic', Customers);
handleTopicRequest('restaurantsTopic', Restaurants);
handleTopicRequest('dishesTopic', Dishes);
handleTopicRequest('conversationsTopic', Conversations);
handleTopicRequest('eventsTopic', Events);
handleTopicRequest('ordersTopic', Orders);
