import { bus } from './eventBus'
const axios = require('axios');
const EventEmitter = require("events");

const base_endpoint_url = 'https://api.binance.com/';
const ws_url = 'wss://stream.binance.com:9443/ws/';
let  _limit = 500;
let _symbol = null;
let _self = null;


class Binance extends EventEmitter {
  constructor(symbol, limit) {
    super();
    if (!symbol || typeof symbol !== 'string')
      throw new Error('parameter symbol not defined or not string');
    if (limit && typeof limit === 'number' && limit > 0)
      _limit = limit;
    _symbol = symbol;
    _self = this;
    let ws_params = `${_symbol.toLowerCase()}@depth@1000ms`;
    let ws = new WebSocket(ws_url + ws_params);
    //console.log(ws_url + ws_params);

    ws.addEventListener('message',/*(data)=>{console.log(data)}*/this.updateDepth);
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

    return {
      asks: result.data.asks,
      bids: result.data.bids,
    }
  }

  updateDepth(data) {

    let lastUpdateId;


    axios({
      method: 'get',
      url: 'https://www.binance.com/api/v1/depth?symbol='+_symbol+'&limit=1000',
      responseType: 'text'
    })
      .then(function (response) {
        response=> alert (response.data.lastUpdateId)
      });
/*
    axios.get('https://www.binance.com/api/v1/depth?symbol='+_symbol+'&limit=1000')
      .then(response => alert(response.data))*/

    if(Number(data.data.u)>(Number(lastUpdateId))){
      let arrayData= JSON.parse(data.data);
      let bids = arrayData.b;
      let asks = arrayData.a;
      bids = bids.filter(array=>(array[0]&&array[1] >0.0));
      asks = asks.filter(array=>(array[0]&&array[1] >0.0));
      let asksBids = [[asks],[bids]];
      console.log(asksBids);
      bus.$emit('depthUpdated', asksBids);
      _self.emit('depthUpdated', asksBids);}
   // alert('updchetadep');


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
