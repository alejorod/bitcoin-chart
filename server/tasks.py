import requests
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler
from manager import CurrencyManager

CURRENCY_URL = 'https://blockchain.info/es/ticker'

def fetch_currency_value():
    now = datetime.now(timezone.utc)
    response = requests.get(CURRENCY_URL)

    if response.status_code != 200:
        return

    currencies = response.json().get('USD')

    CurrencyManager.add(
        sell=currencies.get('sell'),
        buy=currencies.get('buy'),
        timestamp=now.timestamp()
    )

def start_tasks():
    sched = BackgroundScheduler()
    sched.start()
    sched.add_job(fetch_currency_value, 'interval',  hours=1)
