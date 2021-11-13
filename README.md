# databases

Authors: Risat Haque, Robert Brown

## Environment Configuration

To configure the environment the program should be ran in create a `.env` file in the root directory using the following template:

```dotenv
# environment config
ENV=
PORT=
BACK_PORT=
FRONT_PORT=

# credentials
DB_USER=
DB_PASS=
DB_NAME=
DB_HOST=
```

## Backend

The backend is currently a Golang application.

To run the backend `cd` into the `backend/src/` folder and run `go run index.go`

## Frontend

The frontend is currently a typescript React app.