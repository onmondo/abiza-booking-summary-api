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

### (optional) Seed the application by running the following command. Make sure that the reports service is running before running the seeder
```bash
npm run seed
```

### And finally, serve up the resources by issuing the command
```bash
npm run dev
```

#### (optional) You can also build the app for deployment purposes by issuing the command
```bash
npm run build
```

### (optional) You can also use the PM2 starter that spins up the server by issuing the command. This will not only build the project but also starts the server utilizing the PM2.
```bash
npm start
```

## tRPC APIs
Endpoints for signing up

### Register as a new user
```bash
curl --request POST \
  --url http://localhost:3000/trpc/register \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
	"username": "john.doe@company.com"
}'
```

### OTP Verification
```bash
curl --request POST \
  --url http://localhost:3000/trpc/verifyOtp \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
	"username": "john.doe@company.com",
	"otp": "684965"
}'
```

### OTP request
```bash
curl --request POST \
  --url http://localhost:3000/trpc/getOtp \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
	"username": "john.doe@company.com"
}'
```

### Profile entry
```bash
curl --request POST \
  --url http://localhost:3000/trpc/profile \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4ucmF5bW9uZC5ibGFuZG9AZ21haWwuY29tIiwiaWF0IjoxNzExOTU4OTAxLCJleHAiOjE3MTE5NTkyMDF9.KZg3xhZaRyE_h0HW6-U8IMA6f638r7GMdD0QXWCD_hg' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
	"username": "john.doe@company.com",
	"firstName": "John",
	"lastName": "Doe",
	"birthDate": "1999-01-01"
}'
```

### Setting up password
```bash
curl --request POST \
  --url http://localhost:3000/trpc/pass \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4ucmF5bW9uZC5ibGFuZG9AZ21haWwuY29tIiwiaWF0IjoxNzExOTU4OTAxLCJleHAiOjE3MTE5NTkyMDF9.KZg3xhZaRyE_h0HW6-U8IMA6f638r7GMdD0QXWCD_hg' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
	"username": "john.doe@company.com",
	"password": "password"
}'
```

### Signing in
```bash
curl --request POST \
  --url http://localhost:3000/trpc/login \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
	"username": "john.doe@company.com",
	"password": "password"
}'
```

## Fetch endpoints
Here are the available endpoints for consumption

### Checking the health of the server
```bash
curl --request GET \
  --url http://localhost:3000/ \
  --header 'User-Agent: insomnia/2023.5.8'
```

### Fetch the yearly bookings
```bash
curl --request GET \
  --url http://localhost:3000/api/v1/bookings \
  --header 'User-Agent: insomnia/2023.5.8'
```

### Fetch the monthly bookings with booking, cost ans share details
```bash
curl --request GET \
  --url http://localhost:3000/api/v1/bookings/2024 \
  --header 'User-Agent: insomnia/2023.5.8'
```

### Fetch booking on a specific month and year
```bash
curl --request GET \
  --url 'http://localhost:3000/api/v1/bookings/2024/February?sort=asc&page=1&limit=10' \
  --header 'User-Agent: insomnia/2023.5.8'
```

### Fetch booking by ID
```bash
curl --request GET \
  --url http://localhost:3000/api/v1/bookings/65f81687f8a44a9d7cd49c58 \
  --header 'User-Agent: insomnia/2023.5.8'
```

## Transactional endpoints
### Submit new booking
```bash
curl --request POST \
  --url http://localhost:3000/api/v1/bookings \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
    "guestName": "Wella Asis",
		"rooms": ["room2"],
    "checkIn": "2024-02-05",
    "checkOut": "2024-02-06",
    "noOfPax": 2,
    "noOfStay": 1,
    "nightlyPrice": 945.44,
		"totalPayout": 945.44,
		"from": "Booking.com",
		"modeOfPayment": "BPI",
    "datePaid": "2023-02-12",
    "remarks": "Confirmed"
}'
```

### Update existing booking
```bash
curl --request PUT \
  --url http://localhost:3000/api/v1/bookings/2024/January/65f81687f8a44a9d7cd49c58 \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
	"guestName": "Brian Bier",
	"from": "walk-in",
	"rooms": [
		"room1"
	],
	"checkIn": "2024-01-01T00:00:00.000Z",
	"checkOut": "2024-01-07T00:00:00.000Z",
	"noOfPax": 1,
	"noOfStay": 6,
	"nightlyPrice": 500,
	"totalPayout": 3000,
	"modeOfPayment": "BPI",
	"datePaid": "2023-12-28T00:00:00.000Z",
	"remarks": "Test Confirmed"
}'
```

### Patch existing booking
```bash
curl --request PATCH \
  --url http://localhost:3000/api/v1/bookings/2024/January/65f81687f8a44a9d7cd49c58 \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
	"rooms": ["room2"]
}'
```

### Delete existing booking
```bash
curl --request DELETE \
  --url http://localhost:3000/api/v1/bookings/2024/January/65ead1c7dcf6a86b0b27b065 \
  --header 'User-Agent: insomnia/2023.5.8'
```