module ucalgary.ca/cpsc441/eventmanagment

go 1.17

require (
	github.com/lib/pq v1.10.4
	ucalgary.ca/cpsc441/eventmanagment/database v0.0.0-00010101000000-000000000000
)

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/gofiber/fiber/v2 v2.22.0
	github.com/joho/godotenv v1.4.0
	golang.org/x/crypto v0.0.0-20211115234514-b4de73f9ece8
	ucalgary.ca/cpsc441/eventmanagment/models v0.0.0-00010101000000-000000000000
	ucalgary.ca/cpsc441/eventmanagment/routes v0.0.0-00010101000000-000000000000
)

require (
	github.com/andybalholm/brotli v1.0.2 // indirect
	github.com/klauspost/compress v1.13.4 // indirect
	github.com/valyala/bytebufferpool v1.0.0 // indirect
	github.com/valyala/fasthttp v1.31.0 // indirect
	github.com/valyala/tcplisten v1.0.0 // indirect
	golang.org/x/sys v0.0.0-20210615035016-665e8c7367d1 // indirect
)

replace ucalgary.ca/cpsc441/eventmanagment/models => ./models

replace ucalgary.ca/cpsc441/eventmanagment/database => ./database

replace ucalgary.ca/cpsc441/eventmanagment/routes => ./routes
