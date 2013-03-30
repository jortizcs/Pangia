#!/usr/bin/python2
import smtplib
import sys

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
 
def sendError(recipient, reportURL):
  
  SMTP_SERVER = 'smtp.gmail.com'
  SMTP_PORT = 587
  
  sender = 'info@greenpangia.com'
  secret = 'temp9999'
  subject = "An error happen in SBS/Pangia"

  
  "Sends an e-mail to the specified recipient."
  # Create message container - the correct MIME type is multipart/alternative.
  msg = MIMEMultipart('alternative')
  msg['Subject'] = subject
  msg['From'] = sender
  msg['To'] = recipient


  html = """\
  <html>
    <head></head>
    <body>
      {0}
      
    </body>
  </html>
  """.format(reportURL)

  part2 = MIMEText(html, 'html')

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
    print("usage: {0} emailAddress message".format(sys.argv[0]));
    quit();
  
  
  sendReport(sys.argv[1], sys.argv[2])