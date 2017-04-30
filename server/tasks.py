import requests
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler
from manager import CurrencyManager

XAPO = 'xapo'
BLOCKCHAIN = 'blockchain'
CURRENCY_URLS = {
    BLOCKCHAIN: 'https://blockchain.info/es/ticker',
    XAPO: 'https://xapi.xapo.com/last'
}


def add_xapo_currency_rate(data):
    now = datetime.now(timezone.utc)
    CurrencyManager.add(
        sell=data.get('sell'),
        buy=data.get('buy'),
        timestamp=now.timestamp(),
        type=XAPO)


def add_blockchain_currency_rate(data):
    now = datetime.now(timezone.utc)
    rate = data.get('USD')
    CurrencyManager.add(
        sell=rate.get('sell'),
        buy=rate.get('buy'),
        timestamp=now.timestamp(),
        type=BLOCKCHAIN)


def add_currency_rate(provider, data):
    locals().get('add_{}_currency_rate'.format(provider), lambda x: pass)(data)


def fetch_currency_rate(provider):
    provider_url = CURRENCY_URLS.get(provider)
    if not provider_url:
        return

    response = requests.get(provider_url)

    if response.status_code != 200:
        return

    add_currency_rate(provider=provider, data=response.json())


def start_tasks():
    sched = BackgroundScheduler()
    sched.start()

    for provider in CURRENCY_URLS.keys():
        sched.add_job(fetch_currency_rate, 'interval', hours=1, args=[provider])
