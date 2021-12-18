package email

import (
	"fmt"
	"log"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func SendMessage(eventName, streamName, userEmail,
	eventID, streamNumber, userToken string) (int, error) {
	from := mail.NewEmail("Synergy", "synergy471.norelpy@gmail.com")
	subject := "Synergy Event Invitation"
	to := mail.NewEmail("User", userEmail)
	link := os.Getenv("BASE_WEBSITE_URL") + "/invite/" + userToken + "/" + eventID + "/" + streamNumber
	htmlContent := fmt.Sprintf(`Hello,<br><br>You have been invited to attend event <strong>
	%s</strong>, stream <strong>%s<strong>.<br><br>
	Please use the following link to accept the invitation:<br>
	%s<br><br>Best Regards,<br>Synergy Team`, eventName, streamName, link)
	message := mail.NewSingleEmail(from, subject, to, "", htmlContent)
	client := sendgrid.NewSendClient(os.Getenv("EMAIL_API_KEY"))
	response, err := client.Send(message)

	if err != nil {
		log.Println(err)
	}

	return response.StatusCode, err
}