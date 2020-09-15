import { bus } from './eventBus'
const axios = require('axios');
const EventEmitter = require("events");

const base_endpoint_url = 'https://api.binance.com/';
const ws_url = 'wss://stream.binance.com:9443/ws/';
let  _limit = 500;
let _symbol = null;
let _self = null;
let thisLastUpdateId=null;
let firstProcessedEvent = null;
let previousEvent__u=null;

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
    let ws_params = `${_symbol.toLowerCase()}@depth@1000ms`;
    let ws = new WebSocket(ws_url + ws_params);
    //console.log(ws_url + ws_params);

    ws.addEventListener('message',this.manageOrderBook);
    ws.addEventListener('open', ()=>{console.log('HELLO WS')});
    ws.addEventListener('close', ()=>{console.log('BYE')});
    ws.addEventListener('error', (data)=>{console.log(data)});

  }

  //Получение биржевого стакана по определенному символу
  //https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#market-data-endpoints - docs
  async getDepth() {
    let result = await axios.get(
      base_endpoint_url + 'api/v3/depth',
      {
        params: {
          symbol: _symbol.toUpperCase(),
          limit: _limit
        }
      });
    //Сортировка не требуется, т.к. элементы массивов в ответах сохраняют свой порядок
    thisLastUpdateId=result.data.lastUpdateId;
    return {
      lastUpdateId:result.data.lastUpdateId
      /*asks: result.data.asks,
      bids: result.data.bids,*/
    }
  }
  manageOrderBook(data){
    _self.getDepth();
    console.log(thisLastUpdateId);
    let arrayData= JSON.parse(data.data);
    if(Number(arrayData.u)>(Number(thisLastUpdateId))) {
      if (firstProcessedEvent === 1) {
         if((Number(arrayData.U)) === (Number(previousEvent__u)+1)) {
            _self.updateDepth(arrayData);
          }
      } else {
        if (arrayData.u <= (Number(thisLastUpdateId) + 1) || arrayData.u >= (Number(thisLastUpdateId) + 1)) {
          firstProcessedEvent = 1;
          _self.updateDepth(arrayData);
        }
      }
    }


  }

  updateDepth(arrayData) {

   // console.log(data.data);
   // console.log(thisLastUpdateId);
    previousEvent__u= arrayData.u;
        let bids = arrayData.b;
        let asks = arrayData.a;
        bids = bids.filter(array=>(array[0]&&array[1] >0.0));
        asks = asks.filter(array=>(array[0]&&array[1] >0.0));
        let asksBids = [[asks],[bids]];
        //console.log(asksBids);
        bus.$emit('depthUpdated', asksBids);
        _self.emit('depthUpdated', asksBids);
      // alert('updchetadep');}

  }

/*  f() {
    console.log('TEST111');
  }

  onDepthUpdate(cb) {
    this.on('depthUpdated', cb);
  }*/

  getAvailableSymbols() {
    return [
      'BTCUSDT',
      'ETHUSDT',
      'XRPUSDT',
      'BCHUSDT',
      'LTCUSDT',
      'BNBBTC',
      'ETHBTC'
    ]
  }
}
export default Binance;
