import pymongo

def writeData(nodeID, x_coord, y_coord, z_coord, pulse, time, priority):
    client = pymongo.MongoClient('mongodb://localhost:27017')
    db = client['PIVOTAL_DB']
    col = db["NodeData"]
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