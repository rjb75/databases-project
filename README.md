# databases

Authors: Risat Haque, Robert Brown, Ahmed Abdullah

## Environment Configuration

To configure the environment the program should be ran in create a `.env` file in the root directory using the following template:

```dotenv
# environment config
ENV=
PORT=
BASE_API_URL=

# credentials
DB_DRIVER=
DB_HOST=
DB_NAME=
DB_PASS=
DB_USER=
DB_PORT=


# secret signing keys
ACCESS_SIGNING_KEY=
REFRESH_SIGNING_KEY=
```

## Backend

The backend is currently a Golang application.

To run the backend `cd` into the `backend/src/` folder and run `go run index.go`

## Frontend

The frontend is currently a typescript React app. The bundle is currently packaged using webpack.

Yarn is recommended for package management. To install dependencies `cd` into the `frontend` folder and run `yarn install`

To run the backend, first make sure the `ENV` is set in the `.env` file. Set to `production` to enable single optimized builds or set to `development` to enable live development builds. Compile the frontend using `yarn start` and then run the backend to serve the application.
