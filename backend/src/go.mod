module ucalgary.ca/cpsc441/eventmanagment

go 1.17

require (
	github.com/gorilla/mux v1.8.0
	github.com/lib/pq v1.10.4
	ucalgary.ca/cpsc441/eventmanagment/database v0.0.0-00010101000000-000000000000
)

require github.com/joho/godotenv v1.4.0

require (
	github.com/andybalholm/brotli v1.0.0 // indirect
	github.com/dgrijalva/jwt-go v3.2.0+incompatible // indirect
	github.com/gofiber/fiber v1.14.6 // indirect
	github.com/gofiber/utils v0.0.10 // indirect
	github.com/gorilla/schema v1.1.0 // indirect
	github.com/klauspost/compress v1.10.7 // indirect
	github.com/mattn/go-colorable v0.1.7 // indirect
	github.com/mattn/go-isatty v0.0.12 // indirect
	github.com/nu7hatch/gouuid v0.0.0-20131221200532-179d4d0c4d8d // indirect
	github.com/valyala/bytebufferpool v1.0.0 // indirect
	github.com/valyala/fasthttp v1.16.0 // indirect
	github.com/valyala/tcplisten v0.0.0-20161114210144-ceec8f93295a // indirect
	golang.org/x/crypto v0.0.0-20211115234514-b4de73f9ece8 // indirect
	golang.org/x/sys v0.0.0-20210615035016-665e8c7367d1 // indirect
	ucalgary.ca/cpsc441/eventmanagment/models v0.0.0-00010101000000-000000000000 // indirect
)

replace ucalgary.ca/cpsc441/eventmanagment/models => ./models

replace ucalgary.ca/cpsc441/eventmanagment/database => ./database
