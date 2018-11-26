import pymongo
from django.http import JsonResponse
from collections import deque
import threading
import serial
import struct
import binascii
import time
import os
from .detect_device import serial_ports

DB_URL = 'mongodb://localhost:27017'
DB_NAME = 'PIVOTAL_DB'
DB_COLLECTION = 'NodeData'

def deleteAll():
    print("Clearing old data")
    client = pymongo.MongoClient(DB_URL)
    db = client[DB_NAME]
    col = db[DB_COLLECTION]

    x = col.delete_many({})
def alreadyExists(nID):
    client = pymongo.MongoClient(DB_URL)
    db = client[DB_NAME]
    col = db[DB_COLLECTION]

    if col.find({'nodeID': nID}).count() > 0:
        return True
    else:
        return False

def writeData(entry):
    try:
        client = pymongo.MongoClient(DB_URL)
        db = client[DB_NAME]
        col = db[DB_COLLECTION]
        print("entry: ", entry)

        #if you don't find matching entry, insert new
        #else delete found and insert new.
        id = entry['nodeID']
        if alreadyExists(id):
             x = col.delete_many({"nodeID": id})
             y = col.insert_one(entry)
             #print("updated entry")
        else:
             z = col.insert_one(entry)
             #print("inserted entry")

    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to server")

def findResources(request):
    '''This for the reacts API'''
    try:
        client = pymongo.MongoClient(DB_URL)
        db = client[DB_NAME]
        col = db[DB_COLLECTION]
        resources = []
        for x in col.find():
            cleanX = x
            cleanX["_id"] = str(x["_id"])
            resources.append(cleanX)
            #print(x)
        res = JsonResponse(resources, safe=False)
        res["Access-Control-Allow-Origin"] = "*"
        res["Access-Control-Allow-Methods"] = "GET"
        return res
    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to server")

def getResources():
    client = pymongo.MongoClient(DB_URL)
    db = client[DB_NAME]
    col = db[DB_COLLECTION]
    resources = []
    for x in col.find():
        resources.append(x)
    return resources


q = deque()
errors = []
jsonList = []

def sendDatabase():

    databaseList = getResources()
    for i in databaseList:
        encoder(i)

def encoder(dataDict):
    #TODO: get below vars from dataDict
    #print(dataDict)
    ID = dataDict["nodeID"]
    x = dataDict["x_coord"]
    y = dataDict["y_coord"]
    z = dataDict["z_coord"]
    resource = dataDict["resource_type"]
    quantity = dataDict["resource_amount"]
    time = dataDict["time"].split(':')

    #print(dataDict["time"])

    #print(ID)
    ID = struct.pack('<h', ID)
    x = struct.pack('<f', x)
    y = struct.pack('<f', y)
    z = struct.pack('<I', z)
    resource = struct.pack('<b', resource)
    quantity = struct.pack('<b', quantity)
    CC = b'\xcc'
    hour = struct.pack('<b', int(time[0]))
    minute = struct.pack('<b', int(time[1]))
    second = struct.pack('<b', int(time[2]))
    FF = b'\xff'

    byte_str = b""
    byte_str += ID
    byte_str += x
    byte_str += y
    byte_str += z
    byte_str += resource
    byte_str += quantity
    byte_str += CC
    byte_str += hour
    byte_str += minute
    byte_str += second
    byte_str += FF
    byte_str += FF
    byte_str += FF
    byte_str += FF

    #print(binascii.hexlify(byte_str))

    '''
    byte_str = ID+x+y+z+resource+quantity+CC+second+minute+hour+FF+FF+FF+FF
    '''
    byte_arr = bytearray(byte_str)

    #TODO: switch to ser.write(byte_str)
    ser.write(byte_arr)

def decoder(hex_str):
    byte_str = bytearray.fromhex(hex_str)

    if hex_str[57:59] == "FF":
        sendDatabase()
        return

    dataList = []

    dataList.append(struct.unpack('<h', byte_str[0:2])[0])
    dataList.append(struct.unpack('<f', byte_str[2:6])[0])
    dataList.append(struct.unpack('<f', byte_str[6:10])[0])
    dataList.append(struct.unpack('<I', byte_str[10:14])[0])
    dataList.append(struct.unpack('<b', byte_str[14:15])[0])
    dataList.append(struct.unpack('<b', byte_str[15:16])[0])


    second = struct.unpack('<b', byte_str[17:18])[0]
    minute = struct.unpack('<b', byte_str[18:19])[0]
    #hour = struct.unpack('<b', byte_str[19:20])[0]



    hour = hex_str[57:59]
    '''
    minute = hex_str[54:56]
    second = hex_str[51:53]
    '''


    #print second + minute + hour

    time = str(hour) + ':' + str(minute) + ':' + str(second)
    #print(time)
    dataList.append(time)

    return dataList


def addData():
    while True:
        serialInput = ser.readline().decode("utf-8")
        if serialInput:
            dataList = decoder(serialInput)

            if dataList is not None:
                if len(dataList) != 7:
                    if len(dataList) >= 1:
                        addError(dataList[0])
                elif "" in dataList:
                    addError(dataList[0])
                else:
                    addQueue(dataList)

# TODO: delete output
def addError(id):
    if str(id) not in errors and str(id) != "":
        #print("adding: " + id + " to errors")
        errors.append(id)
    else:
        print("ID exists in errors OR ID not present.")

def sendData(data):
    entry = {
        "nodeID" : data[0],
        "x_coord" : data[1],
        "y_coord" : data[2],
        "z_coord" : data[3],
        "resource_type" : data[4],
        "resource_amount" : data[5],
        "time" : data[6]
    }

    #print("ent: ", entry)

    writeData(entry)

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

try:
     
    gates = [x for x in os.listdir("/dev") if x.startswith("cu.usbmodem") == True]
    path = "/dev/" + gates[0]
    print("path",path)
    if os.path.exists(path):
        ser = serial.Serial(port=path, baudrate=9600, timeout=0.05)
        # Start Threads
        t1 = threading.Thread(target=addData)
        t2 = threading.Thread(target=getQueue)

        time.sleep(2)
        deleteAll()

        t1.start()
        t2.start()
    else:
         raise ValueError("No device")
except Exception as e:
    raise e
