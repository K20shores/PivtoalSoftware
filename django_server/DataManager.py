import pymongo
from django.http import JsonResponse
from collections import deque
import threading
import DataManager
import serial

DB_URL = 'mongodb://localhost:27017'
DB_NAME = 'PIVOTAL_DB'
DB_COLLECTION = 'NodeData'

def deleteAll():
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

        #if you don't find matching entry, insert new
        #else delete found and insert new.
        id = entry['nodeID']
        if alreadyExists(id):
             x = col.delete_many({"nodeID": id})
             y = col.insert_one(entry)
             print("updated entry")
        else:
             z = col.insert_one(entry)
             print("inserted entry")

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
            print(x)
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

#TODO: change code to reflect pivot.

def addData():
    while True:
        serialInput = ser.readline()

        dataList = serialInput.split(",")

        dataList.pop()

        # TODO: Need one more case for data types
        if len(dataList) != 7:
            addError(dataList[0])
        elif "" in dataList:
            addError(dataList[0])
        else:
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
        "resource_type" : data[4],
        "resource_amount" : data[5],
        "time" : data[6]
    }

    DataManager.writeData(entry)

def addQueue(data):
    if data[0] in errors:
        print("adding right")
        errors.remove(data[0])
        q.append(data)
    else:
        print("adding left")
        q.appendleft(data)

def getQueue():
    while True:
        if len(q) != 0:
            data = q.pop()
            sendData(data)

ser = serial.Serial(port='/dev/cu.usbmodem14511', baudrate=9600)

# Start Threads
t1 = threading.Thread(target=addData)
t2 = threading.Thread(target=getQueue)

t1.start()
t2.start()

t1.join()
t2.join()
