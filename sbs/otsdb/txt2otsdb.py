"""
Reads a text file containing data in the form, "timestamp value",
and copy the data to opentsdb using the given metric and tags.

usage example: python2 txt2otsdb.py pangia-todai 8080  sbs.test.0 "" EngBldg2/http__fiap-gw.gutp.ic.i.u-tokyo.ac.jp_EngBldg2_10F_EHP_*.dat
"""

import os
import sys
import socket


def sendData(server, port, metric, tags, input):
  # Setup the connection
  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect((server, port))

  # Read/Send the data
  sys.stderr.write("Sending {0}...\n".format(input))
  fp = open(input)
  for line in fp:
    dat = line.split()
    finalTags = tags+" label="+input.split("/")[-1]
    s.send("put {0} {1} {2} {3}\n".format(metric, dat[0], dat[1], finalTags))
    
  s.close()
  fp.close()


if __name__ == "__main__":
  if len(sys.argv) < 5:
    print('usage: {0} server port metric label2=label2 input*.txt').format(sys.argv[0])
    exit()

  # Parse the arguments
  server = sys.argv[1]
  port = int(sys.argv[2])
  metric = sys.argv[3]
  tags = sys.argv[4]
  files = sys.argv[5:]

  # Send the files one by one
  for f in files:
    sendData(server, port, metric, tags, f)