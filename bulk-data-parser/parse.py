#! /usr/bin/env python
#
# JSON passed to parser should take form:
#			{
#				"map": [
#								{
#									"regex": <regex>,
#									"ts":		 <index>,
#									"pubid": <pubid>,
#								},
#								...
#							 ]
#			}
# where <regex> is a valid Python regular expression, <pubid> is a valid
# StreamFS pubid, and <index> is either 0 or 1, indicating which of the two
# required group matches in "regex" is the timestamp.
#
# Note that if you need to use backslash to escape within the regex, you will
# almost need to certainly do a double backslash as the JSON decoding has its
# own set of backslash escapes.
#
# Valid regex pairs should group match first a key then a value.

import sys
import json
import re

def getJSONFromArg():
	if len(sys.argv) != 2:
		print "You must provide exactly one argument, which is your parsing JSON object."
		return None

	return sys.argv[1]

def getMapFromRawJSON(rawjson):
	m = json.loads(rawjson)['map']
	newobj = []
	for i in m:
		newobj.append({ 'regex': re.compile(i['regex']),
						'ts': i['ts'],
						'pubid': i['pubid']})

	return newobj

def matchLine(regexmap, line):
	for p in regexmap:
		m = p['regex'].search(line)
		if m and len(m.groups()) == 2:
			# Return a tuple of the pair, the timestamp, and the value.
			# Note that the 'ts' property of the pair specifies which grouping in the
			# match is the timestamp.
			return p['pubid'], m.groups()[p['ts']], m.groups()[1 - p['ts']]

	return None, None, None

def dataToString(data):
	str = '"data":['

	for (ts, v) in data:
		str = str + '{"value":' + v + ',"ts":' + ts + '},'

	str = str.rstrip(',') + ']'

	return str

def applyParsers(jsonmap):
	# Generate map of regexes
	# For each line of stdin:
	#	For each regex:
	#		If regex matches, publish timestamp,value pair and break
	regexmap = getMapFromRawJSON(jsonmap)
	pubids = {}

	line = sys.stdin.readline()
	while line:
		pubid,ts,v = matchLine(regexmap, line)
		line = sys.stdin.readline()

		if not ts:
			continue

		if not (pubid in pubids):
			pubids[pubid] = []

		pubids[pubid].append((ts, v))

	for pubid in pubids:
		print pubid
		print dataToString(pubids[pubid])

def main():
	'''
	Main.
	'''

	jsonstr = getJSONFromArg()
	if not jsonstr:
		return 0

	#testjson = '{"map":[{"regex":"(.*),(.*)", "ts": 0, "pubid":1},{"regex":"(.*):(.*)","ts":1,"pubid":2}]}'
	# for test-datasource.txt provided by Jorge
	#testjson = r'{"map":[{"regex":".* \\| ([0-9].*) \\| .* \\| (.*)","ts": 0, "pubid":1}]}'

	applyParsers(jsonstr)

	return 0

if __name__ == '__main__':
	sys.exit(main())

