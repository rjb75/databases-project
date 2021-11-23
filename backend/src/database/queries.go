package database

func GetPassowrd(userEmail string) (string, error) {
	result := DATABASE.QueryRow(
	`SELECT Hashed_password 
	FROM REGISTERED_USER
	WHERE Email = $1;`, userEmail)

	var passwd string

	err := result.Scan(&passwd)

	if err != nil {
		return "", err
	}

	return passwd, nil

}

func RegisterUser(email, password, fName, mName, lName, pronouns, dietaryRestriction, preferredLanguage, role string) error {
	row := DATABASE.QueryRow(
		`INSERT INTO PERSON(Email, F_name, M_name, L_name, Pronouns, Dietary_restriction) VALUES ($1, $2, $3, $4, $5, $6);`,
			email, fName, mName, lName, pronouns, dietaryRestriction);

	if row.Err() != nil {
		return row.Err()
	}		
			
	row2 := DATABASE.QueryRow(`WITH attendee AS (
		INSERT INTO ATTENDEE(Attendee_id) VALUES (DEFAULT) RETURNING Attendee_id
	  )
	  INSERT INTO REGISTERED_USER(Email, Hashed_password, Role, Attendee_id) VALUES($1, $2, $3, (SELECT attendee_id FROM attendee));`, email, password, role);

	return row2.Err()
}
