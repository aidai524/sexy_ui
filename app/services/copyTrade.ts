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
  async stopCopyTrade(tradeId: string) {
    try {
      const response = await fetch(`${this.baseURL}/api/copy-trades/${tradeId}/stop`, {
        method: 'POST',
        headers: this.headers
      });
      return this.handleResponse(response);
    } catch (error) {
    //   throw new Error('');
    }
  }

  // 
  async getCopyTradeDetails(tradeId: string) {
    try {
      const response = await fetch(`${this.baseURL}/api/copy-trades/${tradeId}`, {
        method: 'GET',
        headers: this.headers
      });
      return this.handleResponse(response);
    } catch (error) {
    //   throw new Error('');
    }
  }

  // 
  async updateCopyTradeConfig(tradeId: string, newConfig: any) {
    try {
      const response = await fetch(`${this.baseURL}/api/copy-trades/${tradeId}/config`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(newConfig)
      });
      return this.handleResponse(response);
    } catch (error) {
    //   throw new Error('');
    }
  }
}

export default CopyTrade;
