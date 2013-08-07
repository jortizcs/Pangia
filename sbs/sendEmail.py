#!/usr/bin/python2
import smtplib
import sys

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
 
def sendReport(recipient, reportURL, template):
  
  SMTP_SERVER = 'smtp.gmail.com'
  SMTP_PORT = 587
  
  sender = 'info@greenpangia.com'
  secret = 'temp9999'

  # Get the subject and body of the message (a plain-text and an HTML version).
  subject = ""
  html = ""
  text = ""
  with open(template+".html") as htmlTemp:
    subject = htmlTemp.readline()
    html = htmlTemp.read().format(reportURL=reportURL)
 
  with open(template+".txt") as textTemp:
    subject = textTemp.readline()
    text = textTemp.read().format(reportURL=reportURL)

  # Create message container - the correct MIME type is multipart/alternative.
  msg = MIMEMultipart('alternative')
  msg['Subject'] = subject
  msg['From'] = sender
  msg['To'] = recipient

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
  
  if len(sys.argv) < 3:
    print("usage: {0} emailAddress reportURL template".format(sys.argv[0]));
    quit();
  
  
  sendReport(sys.argv[1], sys.argv[2], sys.argv[3])
