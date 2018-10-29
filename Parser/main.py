from collections import deque
import threading
import datetime
from django_server.DataManager import DataManager
import serial

q = deque()
errors = []
jsonList = []

#TODO: change code to reflect pivot.

def addData():
    while True:
        serialInput = ser.readline()

        dataList = serialInput.decode("utf-8").split(",")


        dataList.pop()

        # TODO: Need one more case for data types
        if len(dataList) != 8:
            addError(dataList[0])
        elif "" in dataList:
            addError(dataList[0])
        else:
            dataList[5] = str(datetime.datetime.now())
            addQueue(dataList)

# TODO: delete output
def addError(id):
    if str(id) not in errors and str(id) != "":
        print("adding: " + id + " to errors")
        errors.append(id)
    else:
        print("ID exists in errors OR ID not present.")

def sendData(data):
    entry = {
        "nodeID" : data[0],
        "x_coord" : data[1],
        "y_coord" : data[2],
        "z_coord" : data[3],
        "biometric_data" : data[4],
        "time" : data[5],
        "battery" : data[6],
        "priority" : data[7]
    }

    DataManager.writeData(entry)

def addQueue(data):
    if data[0] in errors:
        #print("adding right")
        errors.remove(data[0])
        q.append(data)
    else:
        #print("adding left")
        q.appendleft(data)

def getQueue():
    while True:
        if len(q) != 0:
            data = q.pop()
            sendData(data)

ser = serial.Serial(port='/dev/cu.usbmodem14101', baudrate=9600)

# Start Threads
t1 = threading.Thread(target=addData)
t2 = threading.Thread(target=getQueue)

t1.start()
t2.start()

t1.join()
t2.join()
