from SerialEmulator import SerialEmulator
import os, pty, serial
from threading import Thread
import time
import random

def f():
    master, slave = pty.openpty()
    s_name = os.ttyname(slave)

    ser = serial.Serial(s_name)

    # To Write to the device
    ser.write(bytes('Your text', 'utf-8'))

    # To read from the device
    os.read(master,1000)

def continuous_write():
    emulator = SerialEmulator('./ttydevice','./ttyclient')
    while (True):
        lat = round(random.uniform(0,1) * (random.randint(0,2) * 10), 8)
        lon = round(random.uniform(0,1) * (random.randint(0,2) * 10), 8)
        z = round(random.uniform(0,1) * (random.randint(0,2) * 10), 8)
        heart = random.randint(40, 180)
        severity = random.randint(-1,2)
        dev_id = random.randint(1,10)
        emulator.write(
                str(dev_id) + ";" + 
                str(lat) + ";" + 
                str(lon) + ";" + 
                str(z) + ";" + 
                str(heart) + ";" + 
                str(severity)
                )
        time.sleep(.1)

def continuous_read():
    emulator = SerialEmulator(client_port = './ttyclient')
    while (True):
        data = emulator.read()
        if (len(data) > 0):
            print(data)

if __name__ == '__main__':
    th = Thread(target = continuous_write)
    th.start()

    th2 = Thread(target = continuous_read)
    th2.start()
