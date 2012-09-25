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
			return p, m.groups()[p['ts']], m.groups()[1 - p['ts']]

	return None, None, None

def applyParsers(jsonmap):
	# Generate map of regexes
	# For each line of stdin:
	#	For each regex:
	#		If regex matches, publish timestamp,value pair and break
	regexmap = getMapFromRawJSON(jsonmap)

	line = sys.stdin.readline()
	while line:
		p,ts,v = matchLine(regexmap, line)
		if ts:
			# TODO publish to pubid here
			print "timestamp: " + ts + ", value: " + v
		line = sys.stdin.readline()

def main():
	'''
	Main.
	'''

	#testjson = '{"map":[{"regex":"(.*),(.*)", "ts": 0, "pubid":1},{"regex":"(.*):(.*)","ts":1,"pubid":2}]}'
	# for test-datasource.txt provided by Jorge
	testjson = r'{"map":[{"regex":".* \\| ([0-9].*) \\| .* \\| (.*)","ts": 0, "pubid":1}]}'
	applyParsers(testjson)

	return 0

if __name__ == '__main__':
	sys.exit(main())

