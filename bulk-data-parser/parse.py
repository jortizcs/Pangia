#! /usr/bin/env python
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
						'pubid': i['pubid']})

	return newobj

def matchLine(regexmap, line):
	for p in regexmap:
		m = p['regex'].match(line)
		if m and len(m.groups()) == 2:
			return p, m.groups()[0], m.groups()[1]

	return None, None, None

def applyParsers(jsonmap):
	# Generate map of regexes
	# For each line of stdin:
	#	For each regex:
	#		If regex matches, publish key,value pair and break
	regexmap = getMapFromRawJSON(jsonmap)

	line = sys.stdin.readline()
	while line:
		p,k,v = matchLine(regexmap, line)
		if p:
			# TODO publish to pubid here
			print "key: " + k + ", value: " + v
		line = sys.stdin.readline()

def main():
	'''
	Main.
	'''

	testjson = '{"map":[{"regex":"(.*),(.*)", "pubid":1}, {"regex":"(.*):(.*)","pubid":2}]}'
	applyParsers(testjson)

	return 0

if __name__ == '__main__':
	sys.exit(main())

