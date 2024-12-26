import { httpGet } from "@/app/utils";

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
  ]
]
**/

export async function fetchData(
  address: string,
  granularity: string,
  page: number
) {
  const response = await httpGet(
    `/kline/list?address=${address}&granularity=${
      Number(granularity) * 60
    }&limit=1000&offset=${(page - 1) * 1000}`
  );
  // return { data: mockData.data, hasNextPage: false };
  return { data: response.data.list, hasNextPage: response.data.has_next_page };
}

export async function fetchLastData(address: string, granularity: string) {
  const response = await httpGet(
    `/kline/last?address=${address}&granularity=${Number(granularity) * 60}`
  );
  // return { data: mockData.data, hasNextPage: false };
  return response.data;
}
