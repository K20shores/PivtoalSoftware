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

        #if you don't find matching entry, insert new
        #else delete found and insert new.
        if (col.find_one( {"nodeId": entry['nodeID']} ) is None):
             x = col.insert_one(entry)
        else:
             col.delete_one({"nodeId": entry['nodeID']})
             x = col.insert_one(entry)

    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to server")


writeData({"nodeID": 6})
writeData({"nodeID": 6018})

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
    '''This is for Steves parser'''
    client = pymongo.MongoClient(DB_URL)
    db = client[DB_NAME]
    col = db[DB_COLLECTION]
    resources = []
    for x in col.find():
        resources.append(x)
    return resources
