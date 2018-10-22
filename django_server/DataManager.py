import pymongo
from django.http import JsonResponse

DB_URL = 'mongodb://localhost:27017'
DB_NAME = 'PIVOTAL_DB'
DB_COLLECTION = 'NodeData'

def writeData(entry):
    try:
        client = pymongo.MongoClient(DB_URL)
        db = client[DB_NAME]
        col = db[DB_COLLECTION]
        
        x = col.insert_one(entry)
    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to server")

def findPatients(request):
    try:
        client = pymongo.MongoClient(DB_URL)
        db = client[DB_NAME]
        col = db[DB_COLLECTION]
        patients = []
        for x in col.find():
            cleanX = x
            cleanX["_id"] = str(x["_id"])
            patients.append(cleanX)
            print(x)
        res = JsonResponse(patients, safe=False)
        res["Access-Control-Allow-Origin"] = "*"
        res["Access-Control-Allow-Methods"] = "GET"
        return res
    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to server")
findPatients('l')

