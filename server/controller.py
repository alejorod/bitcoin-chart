from flask import Blueprint, jsonify
from manager import CurrencyManager

api = Blueprint('api', __name__)

@api.route('/api/rate/latest', methods=['GET'])
def get_latest_rate():
    return jsonify(CurrencyManager.get_latest_rate().to_dict())

@api.route('/api/rate/<int:year>/<int:month>/<int:day>/<int:hour>',
           methods=['GET'])
def get_hour_rate(year, month, day, hour):
    return jsonify(CurrencyManager.get_hour_rate(year, month, day, hour).to_dict())

@api.route('/api/rate/<int:year>/<int:month>/<int:day>', methods=['GET'])
def get_day_rate(year, month, day):
    return jsonify(list(map(lambda r: r.to_dict(), CurrencyManager.get_day_rate(year, month, day))))

@api.route('/api/rate/<int:year>/<int:month>', methods=['GET'])
def get_mont_rate(year, month):
    return jsonify(list(map(lambda r: r.to_dict(), CurrencyManager.get_month_rate(year, month))))
