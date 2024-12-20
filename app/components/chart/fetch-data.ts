import mockData from "./mock-data";

/**
[
  [
    1499040000000,      // 开盘时间
    "0.01634790",       // 开盘价
    "0.80000000",       // 最高价
    "0.01575800",       // 最低价
    "0.01577100",       // 收盘价(当前K线未结束的即为最新价)
    "148976.11427815",  // 成交量
    1499644799999,      // 收盘时间
    "2434.19055334",    // 成交额
    308,                // 成交笔数
    "1756.87402397",    // 主动买入成交量
    "28.46694368",      // 主动买入成交额
    "17928899.62484339" // 请忽略该参数
  ]
]
**/

export async function fetchData() {
  // const response = await fetch(
  //   `https://v1-mainnet-backend.degate.com/order-book-ws-api/klines?base_token_id=0&quote_token_id=2&start=1733604546000&end=1733901486316&granularity=900&limit=1000&totalLimit=329`
  // );
  // const result = await response.json();
  // console.log(result);

  return mockData.data;
}
