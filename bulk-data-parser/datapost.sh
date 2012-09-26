#!/bin/bash
#
# Takes pubid-JSON data line pairs (from parser.py stdout) as input on stdin.
# Makes POST requests to specified StreamFS server to bulk insert data.
#
# On command line, needs:
#   server
#   path
set -e

if [ $# != 2 ]; then
    echo "You need exactly two arguments: the StreamFS server and the path on the server to the stream you want to post to."
fi

TMPFILE=".__tmp_datapost_out__"
SERVER=$1
RPATH=$2

IFS="
"
for line in `cat`; do
    PUBID="`echo $line | cut -d, -f1`"
    DATA="`echo $line | cut --complement -d, -f1`"

    echo "{\"path\":\"$RPATH\", \"pubid\":\"$PUBID\", \"data\":$DATA}" > $TMPFILE

    curl -i -X POST "$SERVER" -d@$TMPFILE
done

rm -f $TMPFILE
