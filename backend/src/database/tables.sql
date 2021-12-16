CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SEQUENCE IF NOT EXISTS ticket_id_seq;

CREATE TABLE IF NOT EXISTS PERSON
(
  Email VARCHAR(64) NOT NULL,
  F_name VARCHAR(15) NOT Null,
  M_name VARCHAR(15),
  L_name VARCHAR(15),
  Pronouns VARCHAR(30),
  Preferred_language VARCHAR(15),
  Dietary_restriction VARCHAR(30),
  PRIMARY KEY(Email)
);

CREATE TABLE IF NOT EXISTS ATTENDEE
(
  Attendee_id UUID NOT NULL DEFAULT uuid_generate_v1(),
  PRIMARY KEY(Attendee_id)
);

CREATE TABLE IF NOT EXISTS REGISTERED_USER
(
  Email VARCHAR(64) NOT NULL,
  Hashed_password CHAR(60) NOT NULL,
  Role VARCHAR(20),
  Attendee_id UUID,
  Job_title VARCHAR(32),
  PRIMARY KEY(Email),
  FOREIGN KEY (Email) REFERENCES PERSON(Email),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id)
);

CREATE TABLE IF NOT EXISTS UNREGISTERED_USER
(
  Email VARCHAR(64) NOT NULL,
  Token VARCHAR(60),
  Attendee_id UUID NOT NULL,
  PRIMARY KEY(Email),
  FOREIGN KEY (Email) REFERENCES PERSON(Email),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id)
);

CREATE TABLE IF NOT EXISTS EVENT
(
  ID UUID NOT NULL DEFAULT uuid_generate_v1(),
  Name VARCHAR(30) NOT NULL,
  PRIMARY KEY(ID)
);

CREATE TABLE IF NOT EXISTS ORGANIZER
(
  Email VARCHAR(64) NOT NULL,
  PRIMARY KEY(Email),
  FOREIGN KEY (Email) REFERENCES PERSON(Email)
);

CREATE TABLE IF NOT EXISTS TICKET
(
  Attendee_id UUID NOT NULL,
  Ticket_number INT NOT NULL DEFAULT nextval('ticket_id_seq'),
  Is_valid BIT DEFAULT '1',
  Event_id UUID NOT NULL,
  PRIMARY KEY(Attendee_id, Ticket_number),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id),
  FOREIGN KEY (Event_id) REFERENCES EVENT(ID)
);

CREATE TABLE IF NOT EXISTS FORM
(
  ID UUID NOT NULL DEFAULT uuid_generate_v1(),
  Form_name VARCHAR(64) NOT NULL,
  Data VARCHAR NOT NULL,
  Created_by VARCHAR(64) NOT NULL,
  Event_id UUID NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (Created_by) REFERENCES ORGANIZER(Email),
  FOREIGN KEY (Event_id) REFERENCES EVENT(ID)
);


CREATE TABLE IF NOT EXISTS IS_ORGANIZING
(
  Organizer_email VARCHAR(64) NOT NULL,
  Event_id UUID NOT NULL,
  PRIMARY KEY(Organizer_email, Event_id),
  FOREIGN KEY (Organizer_email) REFERENCES ORGANIZER(Email),
  FOREIGN KEY (Event_id) REFERENCES EVENT(ID)
);

CREATE TABLE IF NOT EXISTS SCHOOL
(
  ID UUID NOT NULL DEFAULT uuid_generate_v1(),
  Name VARCHAR(60) NOT NULL,
  Capacity INT,
  Country VARCHAR(30) NOT NULL,
  Province VARCHAR(30),
  Street_address VARCHAR(70) NOT NULL,
  Postal_code Varchar(15),
  PRIMARY KEY(ID)
);


CREATE TABLE IF NOT EXISTS IS_REPRESENTING
(
  Attendee_id UUID NOT NULL,
  School_id UUID NOT NULL,
  PRIMARY KEY (Attendee_id),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id),
  FOREIGN KEY (School_id) REFERENCES SCHOOL(ID)
);


CREATE TABLE IF NOT EXISTS STREAM
(
  Stream_number UUID NOT NULL DEFAULT uuid_generate_v1(),
  Title VARCHAR(30) NOT NULL,
  Event_id UUID NOT NULL,
  PRIMARY KEY (Stream_number),
  FOREIGN KEY (Event_id) REFERENCES EVENT(ID)
);

CREATE TABLE IF NOT EXISTS SESSION
(
  Session_number UUID NOT NULL DEFAULT uuid_generate_v1(),
  Location VARCHAR(30) NOT NULL,
  Start_time timestamp (0) NOT NULL,
  Duration_minutes INT NOT NULL,
  Title VARCHAR(60) NOT NULL,
  Description VARCHAR(250) NOT NULL,
  PRIMARY KEY (Session_number)
);

CREATE TABLE IF NOT EXISTS COMPOSED_OF
(
  Stream_number UUID NOT NULL,
  Session_number UUID NOT NULL,
  PRIMARY KEY(Stream_number, Session_number),
  FOREIGN KEY (Stream_number) REFERENCES STREAM(Stream_number),
  FOREIGN KEY (Session_number) REFERENCES SESSION(Session_number)
);

CREATE TABLE IF NOT EXISTS PARTICIPATING_IN
(
  Stream_number UUID NOT NULL,
  Attendee_id UUID NOT NULL,
  PRIMARY KEY(Stream_number, Attendee_id),
  FOREIGN KEY (Stream_number) REFERENCES STREAM(Stream_number),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id)
);

CREATE TABLE IF NOT EXISTS ACCOMODATION
(
  Room_number UUID NOT NULL DEFAULT uuid_generate_v1(),
  Capacity INT,
  Country VARCHAR(30) NOT NULL,
  Province VARCHAR(30),
  Street_address VARCHAR(70) NOT NULL,
  Postal_code Varchar(15),
  PRIMARY KEY(Room_number)
);


CREATE TABLE IF NOT EXISTS STAYING_AT
(
  Attendee_id UUID NOT NULL,
  Accomodation_id UUID NOT NULL,
  PRIMARY KEY(Attendee_id, Accomodation_id),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id),
  FOREIGN KEY (Accomodation_id) REFERENCES ACCOMODATION(Room_number)
);

CREATE TABLE IF NOT EXISTS COMPLETE_FORM
(
  Form_id UUID NOT NULL,
  Attendee_id UUID NOT NULL,
  Filled_data VARCHAR NOT NULL,
  PRIMARY KEY(Attendee_id, Form_id),
  FOREIGN KEY (Form_id) REFERENCES FORM(ID),
  FOREIGN KEY (Attendee_id) REFERENCES ATTENDEE(Attendee_id)
);