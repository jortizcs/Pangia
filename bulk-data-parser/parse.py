#! /usr/bin/env python

import sys
import json

def getMapFromRawJSON(rawjson):
	obj = json.load(rawjson)
	return obj['map']

def main():
	'''
	Main.
	'''

	return 0

if __name__ == '__main__':
	sys.exit(main())

