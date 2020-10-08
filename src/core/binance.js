import {bus} from './eventBus'

const axios = require('axios');
const EventEmitter = require("events");
const base_endpoint_url = 'https://api.binance.com/';
const ws_url = 'wss://stream.binance.com:9443/ws/';
let _limit = 500;
let _symbol = null;
let _self = null;
let firstProcessedEvent = null;
let previousEvent__u = null;

function depthComparator(left, right) {
  if (left[0] < right[0]) {
    return -1;
  }
  if (right[0] < left[0]) {
    return 1;
  }
  return 0;
}

function depthComparatorInverse(left, right) {
  if (left[0] > right[0]) {
    return -1;
  }
  if (right[0] > left[0]) {
    return 1;
  }
  return 0;
}

class Binance extends EventEmitter {
  constructor(symbol, limit) {
    super();
    if (!symbol || typeof symbol !== 'string')
      throw new Error('parameter symbol not defined or not string');
    if (limit && typeof limit === 'number' && limit > 0)
      _limit = limit;
    _symbol = symbol;
    _self = this;
    firstProcessedEvent = null;
    let thisLastUpdateId = null;
    let asks = [];
    let bids = [];
    let ws_params = `${_symbol.toLowerCase()}@depth@1000ms`;
    let ws = new WebSocket(ws_url + ws_params);
    this.getDepth();

    ws.addEventListener('message', this.manageOrderBook);
    ws.addEventListener('open', () => {
      console.log('HELLO WS')
    });
    ws.addEventListener('close', () => {
      console.log('BYE')
    });
    ws.addEventListener('error', (data) => {
      console.log(data)
    });

  }

  async getDepth() {
    let result = await axios.get(
      base_endpoint_url + 'api/v3/depth',
      {
        params: {
          symbol: _symbol.toUpperCase(),
          limit: _limit
        }
      });

    _self.thisLastUpdateId = result.data.lastUpdateId;
    _self.asks = result.data.asks;
    _self.bids = result.data.bids;

  }

  manageOrderBook(data) {
    let arrayData = JSON.parse(data.data);
    if (Number(arrayData.u) > (Number(_self.thisLastUpdateId))) {
      if (firstProcessedEvent === 1) {
        if ((Number(arrayData.U)) === (Number(previousEvent__u) + 1)) {
          _self.updateDepth(arrayData);
        }
      } else {
        if (arrayData.U <= (Number(_self.thisLastUpdateId) + 1) || arrayData.u >= (Number(_self.thisLastUpdateId) + 1)) {
          firstProcessedEvent = 1;
          _self.updateDepth(arrayData);
        }
      }
    }
  }

  updateDepth(arrayData) {
    console.log(_self.bids);
    console.log(arrayData.b);

    previousEvent__u = arrayData.u;
    let changeBids = arrayData.b;
    let changeAsks = arrayData.a;
    let thisNotMatchElementAsks = [].concat(changeAsks);
    let thisNotMatchElementBids = [].concat(changeBids);

    function conversionAsksBids(value, change, thisNotMatchElement) {

      value = value.map(function callback(currentValue) {
        let thisMatchElement = change.filter((element, index) => {
          if (element[0] === currentValue[0]) {
            delete thisNotMatchElement[index];
            return true;
          }
          return false;
        });

        if (thisMatchElement.length > 0) {
          return (thisMatchElement[0]);
        } else {
          return currentValue;
        }
      });
      thisNotMatchElement = thisNotMatchElement.filter(value => ((!!value) && (value[0] && value[1] > 0.0)));
      value = value.filter(array => (array[0] && array[1] > 0.0));
      value = value.concat(thisNotMatchElement).slice(0, _limit);
      console.log(value);
      console.log(thisNotMatchElement);
      return value;
    }

    _self.asks = conversionAsksBids(_self.asks, changeAsks, thisNotMatchElementAsks).sort(depthComparator);
    _self.bids = conversionAsksBids(_self.bids, changeBids, thisNotMatchElementBids).sort(depthComparatorInverse);

    let asksBids = [[_self.bids], [_self.asks]];
    bus.$emit('depthUpdated', asksBids);

  }

  static getAvailableSymbols() {
    let arraySymbols = [
      'BTCUSDT',
      'ETHUSDT',
      'XRPUSDT',
      'BCHUSDT',
      'LTCUSDT',
      'BNBBTC',
      'ETHBTC'
    ];
    return arraySymbols;
  }

}

export default Binance;
