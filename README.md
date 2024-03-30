# admin.abiza.com
Provides monitoring services of bookings, capital expenditures, operational cost and share of earnings from booking platforms, Agoda, Airbnb and Booking.com 

## Setting it up
### After cloning the project, please do the following
Install in your local machine the docker to manage docker images from docker hub or from customized docker image.

### You'll also need to clone this that listens lined up messages from the projects queue 
``https://github.com/onmondo/abiza-booking-reports-api``

### Install necessary dependencies
```bash
npm i
``` 

### Run the docker image for both mongoDB and RabbitMQ instance
```bash
docker-compose up -d
```
If however `docker-compose` is not available, you may install the cli on your local machine by issuing the command
```bash
npm i docker-compose -g
```

### Next is to include environment variables
You'll need to create an `.env` file on the root directory of the project for connectivity of both docker images
```
ENV=LOCAL
MONGO_LOCAL=mongodb://localhost:27017/abiza-mongodb

LOCAL_RATE_LIMIT_WINDOW=60000
LOCAL_REQUEST_LIMIT=60

LOCAL_RABBIT_MQ_URL=amqp://guest:password@localhost
LOCAL_RABBIT_MQ_EXCHG_NAME=sampleExchangeNameLog
```

### And finally, serve up the resources by issuing the command
```bash
npm run dev
```

#### (optional) You can also build the app for deployment purposes by issuing the command
```bash
npm run build
```