#!/usr/bin/python
"""sfs incoming data input"""

import sys
import socket
import os
import json

"""[metric] [ts] [value] label=[label]"""

def main():
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    serversocket.bind(('localhost', 1337))
    while 1:
        datajson = json.loads(serversocket.recv(1024));
        print datajson['metric'] + " " + str(datajson['ts']) + " " + str(datajson['value']) + " label=" + datajson['label']

if __name__=="__main__":
    main()
