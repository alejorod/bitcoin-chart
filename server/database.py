from pymongo import MongoClient

def get_database():
    client = MongoClient()
    return client.bitcoin

db = get_database()
