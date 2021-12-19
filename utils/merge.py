#!/usr/bin/env python3

import json
from lzstring import LZString
import sys

if( len(sys.argv) != 6 ):
	print("Usage: merge.py [save 1] [save 2] [output] [offx] [offy]")
	exit()

def load_lxs(path):
	with open(path, "r") as f:
		raw = f.read().split(';', 1)

	if len(raw) == 1 or raw[0] != "2":
		print("Only Logix Save Format v2 is supported! Aborted!")
#		print("Found header: " + raw[0]);
		exit()

	return json.loads(LZString.decompressFromUTF16(raw[1]))

in1 = load_lxs(sys.argv[1])
in2 = load_lxs(sys.argv[2])['j']

offx = int(sys.argv[4])
offy = int(sys.argv[5])

idm = 0

print("Calculating offset...");
for gate in in1['j']:
	if idm < gate['i']:
		idm = gate['i']

idm += 1

print("Fixing save data with offset " + str(idm) + "...");
for gate in in2:
	gate['i'] += idm
	gate['x'] += offx
	gate['y'] += offy
	
	for wak in range(len(gate['w'])):
		for wk in range(len(gate['w'][wak])):
		
			parts = gate['w'][wak][wk].split(":")
			gid = int(parts[1]) + idm;
			
			gate['w'][wak][wk] = parts[0] + ":" + str(gid)

print("Merging save data...");
in1['j'] = in1['j'] + in2;

print("Saving...");
with open(sys.argv[3], "w") as f:
	f.write( "2;" + LZString.compressToUTF16( json.dumps(in1) ) )

