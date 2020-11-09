# 273-Lab2

Kafka Server Start+Setup: 
1. Start zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties
2. Start Kafka server
bin/kafka-server-start.sh config/server.properties
3. Create topics
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic customersTopic
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic restaurantsTopic
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dishesTopic
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic eventsTopic
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic ordersTopic
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic conversationsTopic
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic response_topic


Frontend (:3000) 
1. npm install
2. npm start

Backend (:3001)
1. npm install
2. nodemon start

Kafka-backend
1. npm install 
2. nodemon start

