from database import db
from flask import jsonify

class CurrencyRecord(object):

    TABLE = db.records

    def __init__(self, sell, buy, timestamp, **kwargs):
        self.sell = sell
        self.buy = buy
        self.timestamp = timestamp

    def to_dict(self):
        return {
            'sell': self.sell,
            'buy': self.buy,
            'timestamp': self.timestamp
        }

    def to_json(self):
        return jsonify(self.to_dict())

    def save(self):
        self.TABLE.insert_one(self.to_dict())

    @classmethod
    def find(cls, *args, **kwargs):
        return [cls(**r) for r in  cls.TABLE.find(*args, **kwargs)]

    @classmethod
    def find_one(cls, *args, **kwargs):
        r = cls.TABLE.find_one(*args, **kwargs)
        return cls(**r) if r else None
