export interface SmartMoneyAddress {
    address: string;
    balance: string;
    buys7D: number;
    chain: string;
    copied: boolean;
    copiers: any[];
    lastTradeAt: number;
    pnl7D: string;
    sells7D: number;
    trades7D: number;
    winRate7D: string;
    pnl1D: string;
    pnl30D: string;
    winRate30D: string;
    winRate1D: string;
    newCopiers: any[];
    topCopiers: {
      address: string;
      pnl: string;
    }[];
  }

  export interface CopyTraderAddress {
      copied: number;
      copyTrades: number;
      claimed: string;
      carryFee: string;
      isTopTrader: boolean;
      tradeInfo: {
          buys: number;
          pnl7D: string ;
          sells: number;
          winRate7D: number;
          totalPNL: string;
          currentPNL: string;
          tokenPosition: string;
          roi: string;
          winRate: string;
          totalInvestment: string;
    }
}

export interface CopyTradeSettings {
  buyAmount: number;
  slippage: number;
  errorToleranceRatio: number;
  tps?: {
    reachRadio: number | string;
    sellRadio: number | string;
  }[];
  sls?: {
    reachRadio: number | string;
    sellRadio: number | string;
  }[];
}
 
class CopyTrade {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API || 'https://api.dumpdump.fun/api/v1';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse(response: Response) {
    return await response.json();
  }
  // copy traders userInfo
  async getCopyTradersUserInfo({address, chain}: {address: string, chain: string}): Promise<{data: CopyTraderAddress | null}> {
    try {
      const queryParams = new URLSearchParams({ address, chain }).toString();
      const response = await fetch(`${this.baseURL}/copy_trade/users?${queryParams}`, {
        method: 'GET',
        headers: this.headers,
      });
      return this.handleResponse(response);
    } catch (error) {
      return {data: null};
    }
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
    setting: CopyTradeSettings;
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
 async sendTransaction(params: {
  session: string;
  publicKey: string;
  signature: string;
  type: number;
 }) {
    try {
        const sendResponse = await fetch(`${this.baseURL}/copy_trade/send_transactions`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
              walletAddress: params.publicKey.toString(),
              chain: 'solana',
              messageData: params.signature,
              type: params.type,
              session: params.session,
            })
          });
        return this.handleResponse(sendResponse);
    } catch (error) {
        console.log(error, 'error')
        return error;
    }
 }  

 async getCopyTradeDetail(params: {
  id: string;
  chain: string;
  walletAddress: string;
}) {
  try {
    const queryParams = new URLSearchParams({
      id: params.id,
      chain: params.chain,
      walletAddress: params.walletAddress
    }).toString();
    const response = await fetch(`${this.baseURL}/copy_trade/id?${queryParams}`, {
      method: 'GET',  
      headers: this.headers
    });
    return this.handleResponse(response);
  } catch (error) {
    console.log(error);
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

  // 
  async closeCopyTrade(params: {
    walletAddress: string;
    chain: string;
    state: number;
    id: string;
  }) {
    try {
      const response = await fetch(`${this.baseURL}/copy_trade/state`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(params)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.log(error);
      return error;
    }
  } 

  // swap copy tokens
  async swapCopyTokens(params: {
    walletAddress: string;
    chain: string;
    type: number;
    sellAll: boolean;
    tokens: string[];
    id: string;
    sig: string;
    timestamp: number;
    closeCopyTrade: boolean;
  }) {
    try {
      const response = await fetch(`${this.baseURL}/copy_trade/swap_tokens`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(params)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // top traders
  async getSmartMonies(params: {
    chain: string;
    page: number;
    pageSize: number;
    orderBy: string;
    walletAddress: string;
  }) {
    try {
      const queryParams = new URLSearchParams({
        chain: params.chain,
        page: params.page.toString(),
        pageSize: params.pageSize.toString(),
        orderBy: params.orderBy,
        walletAddress: params.walletAddress
      }).toString();
      const response = await fetch(`${this.baseURL}/copy_trade/smart_monies?${queryParams}`, {
        method: 'GET',
        headers: this.headers
      });
      return this.handleResponse(response);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // withdraw
  async withdrawTokens(params: {
    walletAddress: string;
    chain: string;
    tokens: string[];
    id: string;
    sig: string;
    timestamp: number;
    withdrawAll: boolean;
    closeCopyTrade: boolean;
  }) {
    try {
      const response = await fetch(`${this.baseURL}/copy_trade/withdraw_tokens`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(params)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.log(error);
      return error;
    }
  }


  // claim
  async claimProfit(params: {
    // address: string;
    amount: string;
    chain: string;
    // id: string;
    receiver: string;
    sig: string;
    timestamp: number;
    type: number;
    walletAddress: string;
  }) {
    try {
      const response = await fetch(`${this.baseURL}/copy_trade/withdraw`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(params)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default CopyTrade;
