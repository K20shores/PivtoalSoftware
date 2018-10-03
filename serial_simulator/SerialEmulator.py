import os, subprocess, serial, time

# this script lets you emulate a serial device
# the client program should use the serial port file specifed by client_port

# if the port is a location that the user can't access (ex: /dev/ttyUSB0 often),
# sudo is required

class SerialEmulator(object):
    def __init__(self, device_port='./ttydevice', client_port='./ttyclient'):
        self.device_port = device_port
        self.client_port = client_port
        cmd=['/usr/local/bin/socat','-d','-d','PTY,link=%s,raw,echo=0' %
                self.device_port, 'PTY,link=%s,raw,echo=0' % self.client_port]
        self.proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(1)
        self.serial = serial.Serial(self.device_port, 9600, rtscts=True, dsrdtr=True)
        self.client = serial.Serial(self.client_port, 9600, rtscts=True, dsrdtr=True, timeout=1)
        self.err = ''
        self.out = ''

    def write(self, out):
        self.serial.write(bytes(out, 'utf-8'))

    def read(self):
        line = ''
        while self.client.inWaiting() > 0:
            line += self.client.read(1).decode('utf-8')

        return line

    def __del__(self):
        self.stop()

    def stop(self):
        self.proc.kill()
        self.out, self.err = self.proc.communicate()
