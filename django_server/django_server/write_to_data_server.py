import pymongo

client = pymongo.MongoClient('mongodb://localhost:27017')
db = client['PIVOTAL_DB']
col = db["NodeData"]

entry = {"nodeID": 1, "x_coord": 23.7, "y_coord": 33.7,
 "z_coord": 43.7, "biometric_data": 12, "time": 1600, 
 "battery": 99, "priority": 1}
 
x = col.insert_one(entry)