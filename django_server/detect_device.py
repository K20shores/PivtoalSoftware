import sys
import glob
import serial


def serial_ports():
    """ Lists serial port names

        :raises EnvironmentError:
            On unsupported or unknown platforms
        :returns:
            A list of the serial ports available on the system
    """
    if sys.platform.startswith('win'):
        ports = ['COM%s' % (i + 1) for i in range(256)]
    elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
        # this excludes your current terminal "/dev/tty"
        ports = glob.glob('/dev/tty[A-Za-z]*')
    elif sys.platform.startswith('darwin'):
        ports = glob.glob('/dev/tty.*')
    else:
        raise EnvironmentError('Unsupported platform')

    result = []
    for port in ports:
        try:
            s = serial.Serial(port, baudrate=9600, timeout=0.05)
            while True:
                print("Reading port",port)
                serialInput = s.readline().decode("utf-8")
                if serialInput:
                    byte_str = bytearray.fromhex(serialInput)
                    print("port",port,byte_str)
                else:
                    break
            print("Closing port",port)
            s.close()
            result.append(port)
        except (OSError, serial.SerialException) as e:
            print(e)
            pass
    return result
