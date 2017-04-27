import pymongo
from datetime import datetime, timezone
from database import db

def record_to_dict(record):
    return {k: record[k] for k in ['sell', 'buy', 'timestamp']}

class CurrencyManager(object):

    @classmethod
    def add(cls, sell, buy, timestamp):
        db.records.insert_one({
            'sell': sell,
            'buy': buy,
            'timestamp': timestamp
        })

    @classmethod
    def get_latest_rate(cls):
        return record_to_dict(
            db.records.find_one(sort=[('timestamp', pymongo.DESCENDING)])
        )

    @classmethod
    def get_hour_rate(cls, year, month, day, hour):
        min_datetime = datetime(year, month, day, hour, tzinfo=timezone.utc)
        max_datetime = datetime(year, month, day, hour + 1, tzinfo=timezone.utc)
        record = db.records.find_one({
            'timestamp': {
                '$gte': min_datetime.timestamp(),
                '$lt': max_datetime.timestamp()
            }
        }, sort=[('timestamp', pymongo.DESCENDING)])

        return record_to_dict(record)

    @classmethod
    def get_day_rate(cls, year, month, day):
        min_datetime = datetime(year, month, day, tzinfo=timezone.utc)
        max_datetime = datetime(year, month, day + 1, tzinfo=timezone.utc)
        records = db.records.find({
            'timestamp': {
                '$gte': min_datetime.timestamp(),
                '$lt': max_datetime.timestamp()
            }
        })

        return list(map(record_to_dict, records))

    @classmethod
    def get_month_rate(cls, year, month):
        min_datetime = datetime(year, month, 1, tzinfo=timezone.utc)
        max_datetime = datetime(year, month + 1, 1, tzinfo=timezone.utc)
        records = db.records.find({
            'timestamp': {
                '$gte': min_datetime.timestamp(),
                '$lt': max_datetime.timestamp()
            }
        })

        return list(map(record_to_dict, records))
