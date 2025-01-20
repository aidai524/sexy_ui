export interface SmartMoneyAddress {
    address: string;
    balance: string;
    buys7D: number;
    chain: string;
    copied: boolean;
    lastTradeAt: number;
    pnl7D: string;
    sells7D: number;
    trades7D: number;
    winRate7D: string;
  }

class CopyTrade {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.dumpdump.fun/api/v1';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse(response: Response) {
    return await response.json();
  }

  // 
  async getSmartMoniesAddress({address, chain}: {address: string, chain: string}): Promise<{data: SmartMoneyAddress | null}> {
    try {
      const queryParams = new URLSearchParams({ address, chain }).toString();
      const response = await fetch(`${this.baseURL}/copy_trade/smart_monies/address?${queryParams}`, {
        method: 'GET',
        headers: this.headers,
      });
      return this.handleResponse(response);
    } catch (error) {
      return {data: null};
    }
  }

  // 
  async createCopyTrade(params: {
    walletAddress: string;
    chain: string;
    from: string;
    investment: number;
    setting: {
      buyAmount: number;
      slippage: number;
      errorToleranceRatio: number;
    }
  }) {
    try {
      const response = await fetch(`${this.baseURL}/copy_trade/create`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(params)
      });
      return this.handleResponse(response);
    } catch (error) {
        return error;
    }
  }

  // 
  async getCopyTradeList(params: {
    address: string;
    chain: string;
    page: number;
    pageSize: number;
  }) {
    try {
      const queryParams = new URLSearchParams({
        address: params.address,
        chain: params.chain,
        page: params.page.toString(),
        pageSize: params.pageSize.toString()
      }).toString();
      const response = await fetch(`${this.baseURL}/copy_trade/list?${queryParams}`, {
        method: 'GET',
        headers: this.headers
      });
      return this.handleResponse(response);
    } catch (error) {
        console.log(error);
      return error;
    }
  }

}

export default CopyTrade;
