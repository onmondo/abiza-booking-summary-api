## Setup development env
### Development environment
1. Initialize application.
```bash
npm init
```

2. Initialize code repository.
```bash
git init
```

3. Create `.gitignore` script to exclude files and folders.
```
/node_modules
/data

.env
```

4. Install the latest version of express js for sending and receiving HTTP messages following RESTful architecture style.
```bash
npm i --save-exact express
```

5. Create a `.yml` file and setup docker for mongodb with local volumes to persist data.
```bash
docker-compose up -d

docker-compose down
```

6. Setup and install typescript.
```bash
npm i -D --save-exact typescript @types/express ts-node ts-node-dev tsconfig-paths
```

7. Setup utility libraries.
```bash
npm i --save-exact cors joi bcrypt big.js jsonwebtoken lodash moment otplib mongoose
```

8. Setup utility libraries' typescript version
```bash
npm i -D --save-exact @types/cors @types/bcrypt @types/big.js @types/jsonwebtoken @types/lodash
```

9. Setup for OAuth 2.0 libraries
```bash
npm i --save-exact express-session passport passport-google-oauth2
```

10. Setup OAuth 2.0 libraries typescript version
```bash
npm i -D --save-exact @types/express-session @types/passport @types/passport-google-oauth2
```

11. Other utility tools for dev.
```bash
npm i -D --save-exact dotenv rimraf
```

### CICD
1. Configure AWS from Jenkins EC2 instance
2. Create a security group of an EC2 instance for it to be accessible by anyone except ssh
3. Create key pair from Jenkins EC2 instance to access Abiza EC2 instance - apparently this is not possile - should update the policy for the EC2 to create a key pair
    - you may however create a key pair straight from AWS console, download the file and copy that to target EC2(from `/home/mon/aws-cformations/ec2-access-keys` to `/home/ec2-user/access_keys`)
4. Execute the cloudformation template `abiza-ec2-instance.yml` to create new instance for the API, keyname included