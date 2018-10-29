import pymongo
from django.http import JsonResponse

DB_URL = 'mongodb://localhost:27017'
DB_NAME = 'PIVOTAL_DB'
DB_COLLECTION = 'NodeData'

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
             col.delete_one({"nodeId": entry['nodeID']})
             x = col.insert_one(entry)
             print("updated entry")
        else:
             x = col.insert_one(entry)
             print("inserted entry")

        # if col.find( {'nodeId': entry['nodeID']}).count() > 0:
        #      print(col.find_one( {'nodeId': entry['nodeID']} ))
        #      col.delete_one({"nodeId": entry['nodeID']})
        #      x = col.insert_one(entry)
        #      print("updated entry")
        # else:
        #      x = col.insert_one(entry)
        #      print("inserted entry")

    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to server")


writeData({"nodeID": 8})
writeData({"nodeID": 50119})
writeData({"nodeID": 8})


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
