import pymongo

DB_URL = 'mongodb://localhost:27017'
DB_NAME = 'PIVOTAL_DB'
DB_COLLECTION = 'NodeData'

def writeData(nodeID, x_coord, y_coord, z_coord, pulse, time, priority):
    client = pymongo.MongoClient(DB_URL)
    db = client[DB_NAME]
    col = db[DB_COLLECTION]
    entry = {
        "nodeID": nodeID, 
        "x_coord": x_coord, 
        "y_coord": y_coord,
        "z_coord": z_coord, 
        "biometric_data": pulse, 
        "time": time, 
        "battery": 99, 
        "priority": priority
    }
 
    x = col.insert_one(entry)

def findData():
    client = pymongo.MongoClient(DB_URL)
    db = client[DB_NAME]
    col = db[DB_COLLECTION]
    return col.find()