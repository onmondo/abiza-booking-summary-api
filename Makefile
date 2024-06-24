start:
	docker-compose up -d
	npm start
	cd /home/mon/aws-rpc-api/abiza-booking-reports-api && npm start

stop:
	docker-compose down
	pm2 stop 0
	pm2 stop 1
	pm2 delete all
