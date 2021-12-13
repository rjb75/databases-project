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

func RegisterUser(email, password, fName, mName, lName, pronouns, dietaryRestriction, preferredLanguage, role,
	 schoolId, jobTitle string) error {
	row := DATABASE.QueryRow(
		`INSERT INTO PERSON(Email, F_name, M_name, L_name, Pronouns, Dietary_restriction) VALUES ($1, $2, $3, $4, $5, $6);`,
		email, fName, mName, lName, pronouns, dietaryRestriction)

	if row.Err() != nil {
		return row.Err()
	}

	var attendee_id = ""

	row2 := DATABASE.QueryRow(`WITH attendee AS (
		INSERT INTO ATTENDEE(Attendee_id) VALUES (DEFAULT) RETURNING Attendee_id
	  )
	  INSERT INTO REGISTERED_USER(Email, Hashed_password, Role, Attendee_id, Job_title) 
	  VALUES($1, $2, $3, (SELECT attendee_id FROM attendee), $4);`, email, password, role, jobTitle)

	if row2.Err() != nil {
		return row2.Err()
	}  

	row3 :=   DATABASE.QueryRow(`SELECT Attendee_id FROM REGISTERED_USER WHERE Email = $1`, email)

	err := row3.Scan(&attendee_id)

	if err != nil {
		return err
	}

	row4 := DATABASE.QueryRow(`INSERT INTO IS_REPRESENTING(Attendee_id, School_id) VALUES($1, $2)`, attendee_id, schoolId)


	return row4.Err()
}


func RegisterOrg(email, password, fName, mName, lName, pronouns, dietaryRestriction, preferredLanguage, role string) error {
	row := DATABASE.QueryRow(
		`INSERT INTO PERSON(Email, F_name, M_name, L_name, Pronouns, Dietary_restriction) VALUES ($1, $2, $3, $4, $5, $6);`,
		email, fName, mName, lName, pronouns, dietaryRestriction)

	if row.Err() != nil {
		return row.Err()
	}

	row2 := DATABASE.QueryRow(`INSERT INTO REGISTERED_USER(Email, Hashed_password, Role, Attendee_id, Job_title) 
	  VALUES($1, $2, $3, NULL, NULL);`, email, password, role)

	if row2.Err() != nil {
		return row2.Err()
	} 

	row3 := DATABASE.QueryRow(`INSERT INTO ORGANIZER(Email) VALUES($1)`, email)

	return row3.Err()
}
