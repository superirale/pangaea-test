# PANGAEA TAKE HOME TEST

## PROJECT OVERVIEW

For this challenge we'll be creating a HTTP notification system. A server (or set of servers) will keep track of topics -> subscribers where a topic is a string and a subscriber is an HTTP endpoint. When a message is published on a topic, it should be forwarded to all subscriber endpoints.

## SOLUTION
This Repository contains the code for both the `publisher` service and the `subscriber` Service.
The publisher service is responsible for creating topics, subscribing HTTP endpoints to topics and pushing messages to the HTTP endpoints, while the subscriber service is responsible for providing the HTTP endpoints that consumes messages pushed to the topics.



### REQUIREMENTS
* Docker
* NodeJS
* Mysql/MariaDB
* Redis



### SETUP
Both services are fully dockerized. To set up the services please follow the steps belows.

#### Publisher service

* Enter the `publisher` directory.
* Create `data/mysql/lib` directory.
* Create a `.env` file from the `.env.default` provided.
* Run the following command `docker-compose up` to build and start the service.

#### Subscriber service
* Enter the `subscriber` directory.
* Run the following command `docker-compose up`.


#### Available Endpoints

##### Publisher service
* POST /subscribe/:topic
* POST /publish/:topic

##### Subscriber service
* POST /listener1
* POST /listener2


<b> NOTE</b>: If you do not have docker installed, You will need to manually configure the app to point to your local instance of MySQL/MariaDB and Redis for the publisher service. Then run `npm install` and `npm start` for both services to install the necessary dependencies and launch them.






