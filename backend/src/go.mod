module ucalgary.ca/cpsc441/eventmanagment

go 1.17

require (
	github.com/gorilla/mux v1.8.0
	github.com/lib/pq v1.10.4
	ucalgary.ca/cpsc441/eventmanagment/database v0.0.0-00010101000000-000000000000
)

require github.com/joho/godotenv v1.4.0

replace ucalgary.ca/cpsc441/eventmanagment/models => ./models

replace ucalgary.ca/cpsc441/eventmanagment/database => ./database
