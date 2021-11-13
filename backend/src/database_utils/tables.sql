CREATE SEQUENCE IF NOT EXISTS event_id_seq;
CREATE SEQUENCE IF NOT EXISTS attendee_id_seq;
CREATE SEQUENCE IF NOT EXISTS ticket_id_seq;
CREATE SEQUENCE IF NOT EXISTS form_id_seq;
CREATE SEQUENCE IF NOT EXISTS school_id_seq;
CREATE SEQUENCE IF NOT EXISTS stream_id_seq;
CREATE SEQUENCE IF NOT EXISTS session_id_seq;
CREATE SEQUENCE IF NOT EXISTS accomodation_id_seq;

CREATE TABLE IF NOT EXISTS PERSON
(
  Email VARCHAR(64) NOT NULL,
  F_name VARCHAR(15) NOT Null,
  M_name VARCHAR(15),
  L_name VARCHAR(15),
  Pronouns VARCHAR(30),
  Dietary_restirction VARCHAR(30),
  PRIMARY KEY(Email)
);

CREATE TABLE IF NOT EXISTS ATTENDEE
(
  Attendee_id INT NOT NULL DEFAULT nextval('attendee_id_seq'),
  PRIMARY KEY(Attendee_id)
);


CREATE TABLE IF NOT EXISTS REGISTERED_USER
(
  Email VARCHAR(64) NOT NULL,
  Hashed_password CHAR(60) NOT NULL,
  Role VARCHAR(20),
  Attendee_id INT NOT NULL,
  PRIMARY KEY(Email),
  FOREIGN KEY (Email) REFERENCES PERSON(Email),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id)
);

CREATE TABLE IF NOT EXISTS UNREGISTERED_USER
(
  Email VARCHAR(64) NOT NULL,
  Token VARCHAR(60),
  Attendee_id INT NOT NULL,
  PRIMARY KEY(Email),
  FOREIGN KEY (Email) REFERENCES PERSON(Email),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id)
);

CREATE TABLE IF NOT EXISTS EVENT
(
  ID INT NOT NULL DEFAULT nextval('event_id_seq'),
  Name VARCHAR(30) NOT NULL,
  PRIMARY KEY(ID)
);

CREATE TABLE IF NOT EXISTS ORGANIZER
(
  Email VARCHAR(64) NOT NULL,
  Event_id INT NOT NULL,
  PRIMARY KEY(Email),
  FOREIGN KEY (Email) REFERENCES PERSON(Email),
  FOREIGN KEY (Event_id) REFERENCES EVENT(ID)
);

CREATE TABLE IF NOT EXISTS TICKET
(
  Attendee_id INT NOT NULL DEFAULT nextval('ticket_id_seq'),
  Ticket_number INT NOT NULL ,
  Is_valid BIT DEFAULT '1',
  Event_id INT NOT NULL,
  PRIMARY KEY(Attendee_id, Ticket_number),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id),
  FOREIGN KEY (Event_id) REFERENCES EVENT(ID)
);

CREATE TABLE IF NOT EXISTS FORM
(
  ID INT NOT NULL DEFAULT nextval('form_id_seq'),
  Data VARCHAR NOT NULL,
  Created_by VARCHAR(64) NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (Created_by) REFERENCES ORGANIZER(Email)
);


CREATE TABLE IF NOT EXISTS IS_ORGANIZING
(
  Organizer_email VARCHAR(64) NOT NULL,
  Event_id INT NOT NULL,
  PRIMARY KEY(Organizer_email, Event_id),
  FOREIGN KEY (Organizer_email) REFERENCES ORGANIZER(Email),
  FOREIGN KEY (Event_id) REFERENCES EVENT(ID)
);

CREATE TABLE IF NOT EXISTS SCHOOL
(
  ID INT NOT NULL DEFAULT nextval('school_id_seq'),
  Name VARCHAR(30) NOT NULL,
  Capacity INT,
  Country VARCHAR(30) NOT NULL,
  Province VARCHAR(30),
  Street_address VARCHAR(70) NOT NULL,
  Postal_code Varchar(15),
  PRIMARY KEY(ID)
);


CREATE TABLE IF NOT EXISTS IS_REPRESENTING
(
  Attendee_id INT NOT NULL,
  School_id INT NOT NULL,
  Head_delegate_email VARCHAR(64) NOT NULL,
  PRIMARY KEY (Attendee_id),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id),
  FOREIGN KEY (School_id) REFERENCES SCHOOL(ID),
  FOREIGN KEY (Head_delegate_email) REFERENCES REGISTERED_USER(Email)
);


CREATE TABLE IF NOT EXISTS STREAM
(
  Stream_number INT NOT NULL DEFAULT nextval('stream_id_seq'),
  Title VARCHAR(30) NOT NULL,
  Event_id INT NOT NULL,
  PRIMARY KEY (Stream_number),
  FOREIGN KEY (Event_id) REFERENCES EVENT(ID)
);

CREATE TABLE IF NOT EXISTS SESSION
(
  Session_number INT NOT NULL DEFAULT nextval('session_id_seq'),
  Location VARCHAR(30) NOT NULL,
  Start_time TIME (0) NOT NULL,
  Duration_minutes INT NOT NULL,
  PRIMARY KEY (Session_number)
);

CREATE TABLE IF NOT EXISTS COMPOSED_OF
(
  Stream_number INT NOT NULL,
  Session_number INT NOT NULL,
  PRIMARY KEY(Stream_number, Session_number),
  FOREIGN KEY (Stream_number) REFERENCES STREAM(Stream_number),
  FOREIGN KEY (Session_number) REFERENCES SESSION(Session_number)
);

CREATE TABLE IF NOT EXISTS PARTICIPATING_IN
(
  Stream_number INT NOT NULL,
  Attendee_id INT NOT NULL,
  PRIMARY KEY(Stream_number, Attendee_id),
  FOREIGN KEY (Stream_number) REFERENCES STREAM(Stream_number),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id)
);

CREATE TABLE IF NOT EXISTS ACCOMODATION
(
  Room_number INT NOT NULL DEFAULT nextval('accomodation_id_seq'),
  Capacity INT,
  Country VARCHAR(30) NOT NULL,
  Province VARCHAR(30),
  Street_address VARCHAR(70) NOT NULL,
  Postal_code Varchar(15),
  PRIMARY KEY(Room_number)
);


CREATE TABLE IF NOT EXISTS STAYING_AT
(
  Attendee_id INT NOT NULL,
  Accomodation_id INT NOT NULL,
  PRIMARY KEY(Attendee_id, Accomodation_id),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id),
  FOREIGN KEY (Accomodation_id) REFERENCES ACCOMODATION(Room_number)
);
