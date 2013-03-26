#!/usr/bin/python2
import smtplib
 
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
 
def sendReport(recipient, reportURL):
  
  SMTP_SERVER = 'smtp.gmail.com'
  SMTP_PORT = 587
  
  sender = 'info@greenpangia.com'
  secret = 'temp9999'
  subject = "Congratulations! Your Pangia Report is ready."

  
  "Sends an e-mail to the specified recipient."
  # Create message container - the correct MIME type is multipart/alternative.
  msg = MIMEMultipart('alternative')
  msg['Subject'] = subject
  msg['From'] = sender
  msg['To'] = recipient

  # Create the body of the message (a plain-text and an HTML version).
  text = "Hi!\nThe analysis of your data just finished.\nCheck out the detailed report here: {0}\nPangia - Big data management and analytics for streaming data - http://greenpangia.com".format(reportURL)
  html = """\
  <html>
    <head></head>
    <body>
      <p>Hi!<br>
        We thought that you would like to know that your wonderful Pangia anomaly report is ready. Simply click <a href="{0}">here</a> to see the full report.
      </p>
      <p>
      Thanks for your support,<br>
      Pangia Team
      </p>
    </body>
  </html>
  """.format(reportURL)

  # Record the MIME types of both parts - text/plain and text/html.
  part1 = MIMEText(text, 'plain')
  part2 = MIMEText(html, 'html')

  # Attach parts into message container.
  # According to RFC 2046, the last part of a multipart message, in this case
  # the HTML message, is best and preferred.
  msg.attach(part1)
  msg.attach(part2)
  
  session = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
  
  session.ehlo()
  session.starttls()
  session.ehlo
  session.login(sender, secret)
  
  session.sendmail(sender, recipient, msg.as_string())
  session.quit()
  
if __name__ == "__main__":
  ## Only for testing:
  sendReport("romain.fontugne@gmail.com", "http://greenpangia.com")