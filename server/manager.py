import pymongo
from datetime import datetime, timezone
from models import CurrencyRecord

class CurrencyManager(object):

    @classmethod
    def add(cls, sell, buy, timestamp):
        currency = CurrencyRecord(sell, buy, timestamp)
        currency.save()

    @classmethod
    def get_latest_rate(cls):
        return CurrencyRecord.find_one(sort=[('timestamp', pymongo.DESCENDING)])

    @classmethod
    def get_hour_rate(cls, year, month, day, hour):
        min_datetime = datetime(year, month, day, hour, tzinfo=timezone.utc)
        max_datetime = datetime(year, month, day, hour + 1, tzinfo=timezone.utc)
        return CurrencyRecord.find_one({
            'timestamp': {
                '$gte': min_datetime.timestamp(),
                '$lt': max_datetime.timestamp()
            }
        }, sort=[('timestamp', pymongo.DESCENDING)])

    @classmethod
    def get_day_rate(cls, year, month, day):
        min_datetime = datetime(year, month, day, tzinfo=timezone.utc)
        max_datetime = datetime(year, month, day + 1, tzinfo=timezone.utc)
        return CurrencyRecord.find({
            'timestamp': {
                '$gte': min_datetime.timestamp(),
                '$lt': max_datetime.timestamp()
            }
        })

    @classmethod
    def get_month_rate(cls, year, month):
        min_datetime = datetime(year, month, 1, tzinfo=timezone.utc)
        max_datetime = datetime(year, month + 1, 1, tzinfo=timezone.utc)
        return CurrencyRecord.find({
            'timestamp': {
                '$gte': min_datetime.timestamp(),
                '$lt': max_datetime.timestamp()
            }
        })
