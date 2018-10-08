from collections import deque
import threading
import json

q = deque()
errors = []

def addData():
    while True:
        # TODO: serial port access
        # get data from serial port
        serialInput = input("> ")

        # check format add to errors if incorrect, else just add to queue
        serialInput = serialInput[1:-1]
        dataList = serialInput.split(",")

        # TODO: Need one more case for data types
        if len(dataList) != 8:
            addError(dataList[0])
        elif "" in dataList:
            addError(dataList[0])
        elif dataList[7] != "low" or dataList[7] != "medium" or dataList[7] != "high":
            addError(dataList[0])
        else:
            addQueue(dataList)

def addError(id):
    if id not in errors and id != "":
        print "adding: " + id + " to errors"
        errors.append(id)
    else:
        print "ID exists in errors OR ID not present."

def sendData(data):
    jsonDict = {
        "nodeID" : data[0],
        "x_coord" : data[1],
        "y_coord" : data[2],
        "z_coord" : data[3],
        "biometric_data" : data[4],
        "time" : data[5],
        "battery" : data[6],
        "priority" : data[7]
    }

    jsonString = json.dumps(jsonDict, sort_keys=True)

    # TODO: send string to database
    print jsonString

def addQueue(data):
    if data[0] in errors:
        print "adding right"
        q.append(data)
    else:
        print "adding left"
        q.appendleft(data)

def getQueue():
    while True:
        if len(q) != 0:
            data = q.pop()
            sendData(data)

t1 = threading.Thread(target=addData)
t2 = threading.Thread(target=getQueue)
t1.start()
t2.start()
t1.join()
t2.join()