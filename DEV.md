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
npm i --save express
```

5. Create a `.yml` file and setup docker for mongodb with local volumes to persist data.
```bash
docker-compose up -d

docker-compose down
```

6. Setup and install typescript.
```bash
npm i -D typescript @types/express ts-node ts-node-dev tsconfig-paths
```

7. Setup utility libraries.
```bash
npm i --save cors joi bcrypt big.js jsonwebtoken lodash moment otplib mongoose
```

8. Setup utility libraries' typescript version
```bash
npm i -D @types/cors @types/bcrypt @types/big.js @types/jsonwebtoken @types/lodash
```

9. Other utility tools for dev.
```bash
npm i -D dotenv rimraf
```