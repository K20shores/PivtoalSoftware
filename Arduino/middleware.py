## TODO:
#       Interface with existing database to serialize data
#       Interface with parser to receive node and sync packets and parse
#       Account for all data locally but be able to form into string to send via radio
#

import serial
import time
import os

#   Poll ports until one is ready
serialPorts = ['/dev/ttyACM0', '/dev/ttyACM1', '/dev/ttyACM2']
portIndex = 0
while(1):
    print('Trying %s' % serialPorts[portIndex % len(serialPorts)])
    if os.path.exists(serialPorts[portIndex % len(serialPorts)]):
        print('\t... Success')
        break
    portIndex += 1
    time.sleep(0.5);

#   Create serial port with open port
ser = serial.Serial(serialPorts[portIndex % len(serialPorts)], timeout=0);


lastTime = time.time()
#   Enter send/receive loop, from here we will receive all data dumped
#   to serial and share what we know to be broadcast out
while(1):
    #   Here is where we would receive serial input and process
    line = ser.readline()
    if line:
        print(line)

    currentTime = time.time()
    if (currentTime - lastTime) > 8:
        print('sending')
        ##
        #   This is where we would write the contents of the nodes
        #   we are aware of, sharing what we know. When the gateway
        #   receives this, it'll broadcast it out.
        ##
        values = bytearray([37, 13, 33, 33, 34, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF,
        37, 13, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF,
        37, 13, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF,
        37, 13, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF,
        37, 13, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF,
        37, 13, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF,
        37, 13, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF,
        37, 13, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF,
        37, 13, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF,
        37, 13, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 0xFF, 0xFF, 00, 00, 00, 00, 0xFF, 0xFF, 0xFF, 0xFF])
        ser.write(values)
        lastTime = currentTime
