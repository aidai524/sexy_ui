import { type AppKit, createAppKit, CoreHelperUtil, ChainController } from '@reown/appkit';
import { type Provider, SolanaAdapter } from '@reown/appkit-adapter-solana';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import type { WalletName } from '@solana/wallet-adapter-base';
import {
  BaseSignerWalletAdapter,
  WalletAdapterNetwork,
  WalletConnectionError,
  WalletDisconnectedError,
  WalletDisconnectionError,
  WalletLoadError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletReadyState,
  WalletSignMessageError,
  WalletSignTransactionError,
  WalletWindowClosedError,
} from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  PublicKey,
  type Transaction,
  type TransactionVersion,
  type VersionedTransaction,
} from '@solana/web3.js';

export const WalletConnectWalletName = 'WalletConnect' as WalletName<'WalletConnect'>;

declare global {
  interface Window {
    appKit: AppKit;
  }
}

export type WalletConnectWalletAdapterConfig = {
  network: WalletAdapterNetwork;
} & { options: Omit<Parameters<typeof createAppKit>[0], 'networks'> };

const NETWORKS = {
  [WalletAdapterNetwork.Mainnet]: solana,
  [WalletAdapterNetwork.Testnet]: solanaTestnet,
  [WalletAdapterNetwork.Devnet]: solanaDevnet,
};

export class WalletConnectWalletAdapter extends BaseSignerWalletAdapter {
  name = WalletConnectWalletName;
  url = 'https://walletconnect.org';
  icon =
    'data:image/octet-stream;base64,UklGRggSAABXRUJQVlA4IPwRAAAQbwCdASqQAZABPkkkkEWioiGRuVRMKASEsrdwue8AetOj0wE+AY/V1f1/8cvDawd1b+7fr3+U3zwcA9hncjtr+Xnx08V+iPOo8K/Hf97/Yuo9+j/YA/gH8E/0v9Z6/38a9AX8//7/7Ue/r6C/+56gH8q9P71AP/x0uP/a9if9rf12//PyCfp7////P2AH//60f0P6INSml83nfCXhH/Ee49/Vfyj4kbzORVni/zOjPhKTE+az669gj/B+ad///bR+r////83wsftIJbvIdMEeQ7lY95DpgjyHcrHvIdMEeQ7lY95DpgjyHcrHvIdMEeQ7lY95DpgjyHcrHvIdMEeQ7lY95DpgjyHcrHvIdMEeQ7lY95ChTV8BdrLYmT0lGWkP6ITpmNIeUY4jyHcrHvIUGReH/xwuJLPYitE+rq3yjSjPwP9HpqKgezE+RDpgjyHW5Rvp7j+98d+N9O8hMuQ9XcjMPVXY93Kx7yHR+wQOkBTEs0pBxv1i3/hOHQnlCOhGLwOqUhrUPekpEOggV4+fm3uM4lGUGfnpgjyHb+ZHLqxJY9MHLwfkWmqg5aftDhmGx5kCA1oy3trY07T+A5urHvG+8bwqtqURd2n09/frOBU94YeLvJPSH4ks28wuv2xGz/QVUrTnBt1YlP2w7PhV4kBt/1p+/l+7whiHSTZBaH7yT37jVu8zCl0uXLMD9NEfdTrmrPYjxg4X61A170lQ84HU4Tu/x1MT3gs4Wz05bwRTKm3KACEAiWauz21uYwUh+A5na8w5+7eTxr1ibg99Bi3sssaBBrUTD5HFJ//LLGgKV/cRabTA/JDXdgjvUhpkyrGPKD2kb879TuB5WUss2tTRJNEYCFojjr6KBr/MvwO5vNJVE4qVKgNGFeMH6ROxU0nXmn07AAVvDvw8a0dUSJVhfZXBHHSPwCMTYbtNgdoQzRgGjCooM7QrippO8c2jY7pqQHAAR4i+TtnlhyXAY9P1mn4KITHroWh8uDoAABenIGr/8oTviHcbPnYsvxpJnXtmITzrwMFMrB+aecb4SIc5tLlX6rn61LMrJHOmZr4bdWPXEkJgCjsjfcghDbk/rvS7Ofa5Ca+G3Vj3kOmCPIdyse8h0wR5DuVj3kOmCPIdyse8h0wR5DuVj3kOmCPIdyse8h0wR5DuVj3kOmCPIdyse8h0wR5DuVj3kOmCO0AA/tbmjL5HE0UhwegD/LhkAINCgAAAAAAAAAALTuVpFKWXGmmaHXufI+6HeKotHQsTY3ZwCRVgR0qEchV+QcAF8X5OEXP+yo8KDJUd2e6Z3vMPhnmnqtFgXffqVs4Fs+44KgqwQkJFMn6jtJt5rSrAoMynfm3BqwgeSE3PfGediq2w/gD3UGOyGnu48n3QFo+RPDDPJpLa9gIc6AN+7qZkm+2JIkMeASjnoABcfP4pyqIB7D7NhnRfbnmYqHcOcvM3ov46KQv6IK/92l7cuP31CxZbsE/7UBpntEalJKjNIqNSP5VDissUSdhV0NCDgB3joo1CLtoAOsUXiE8CastHku/UVncthLBbsmzxzqf7P3ESjLMOJbmMNqXr3qoeYiwl6ot3iHGLm5W9l3fRxIn0gFaKH7UbHEXdxLAaDVg0ggTb3PjNLEl8fbqKcC4ign1/x+78VBpHFeUKvVNffk4eB7m5sNSizFhPh1c5mnfReilRYvuBoUCYPvLFq8X+EHjSX6MpkqStfWzzWsgMGGvzHGwLRtA2XxfbT9T6/DT7M2/egXa4CgvOgbAKDQTJJ9HbuLVxcvixsqAQpzB4Ibfg8YOOdCj2ppqhzhrOi8Z+ycezKCi0iK1x4Zwn5MuIoQGm2M69qF/MF6XoMBB7nDWCcXPL+FBAYhXveByxpfI+dlYJIp/Ij9G9sm8YR0CnFsO0xFOwLEidYxcEgMcAAB23iVnTTsBKDWCRCT/4KC78IhbeARJ/3EYvgLxw3gj+0d4RgyK62y3ept9meEGGS8LEgalCiCYI5wGeV64rswiyOPKMZYlLeBBm4l1NheY2/UMlsELtWmqk9+0H6dI7T8+q8+VLVideRTwo2SW14b13sWt9CaQYXlAwZ+ygtynaCicQ5jP7lKFYYo1n9E6TYOrP4YNm63huOPVUvqbbsAGNTo55rxCfbgBakzat/atqWHj1kBwW2XoPYYOrQ0VCavhMzkecV300nvWeRf+YVoUWPPY9k0/uQCDbgGHTnPe9K9x61x8em53DXVTh5ZWE9SLqgL/UZFPcQ/mmXlgyuRYXXlwT0Af/wGrwALbS7eHtKYA4VK87PlaUSVl6TQPSaYaDxShU0XiYFTWYdx/hOuAdzmZTBrLOewwpFdQvzgo+/qY3Tql9BIeu8rMmlYxUkfTiQvv39FFv6c/t8owP4r53AzWVoRfnEuJG0+HmVyZ4/WDfIGHbrFSqhxWiuKFj2i+fWq1n+M+pQt5Wj4r+Y40wiIcer44+HCxsQQC3g7a6mHjXbkNC5AhB81Ep5B/21p49myk6JyJcGGzGtoj9KWVPNzyCDJuVKDSHz8gC6iwDWi5fzTygRJgdZGC1p5bWtgCjqXcRCHfYBMSFD75YdgxPFGWi7lEEoaK0sMV5HFyjrsaArBFBodP3ED5kB3YT1aUulNfoLqrZ70M2TRB/tw8ZcesrMk4nVXZ7aKaqiX9jRpSZ2wukfouZYCCBHAc0QAFt0kOcU2mX+bWNDNv6lpqAFTJ7r+HyF7e6TuwrkKl70joBQ1lDfQpS/iVN3ovPtO4buAU/6yzXOO0XZc2rXwrcu17r5DPohQ0mmB4lOV7bct9e68j8yiuPCASP4w3uMDpP13zAT5Ejn9MDheCfrjv501eO7fwKKq10uIm+OeOASifO+OeGzB0SyvuCBdJsbSFyWe8P4pvo624I5SILFL3Lkwo2laT9g8ropr/8OFOXoBZUDj4KxSJW2Pt7SE8C7eFrzgQ0PT0gt+E5HQHpE5GQ89YqdwvI0QRDYLQSXxxcjpZ27IRTNGQBg6w5R48l52AptY1wq2WCem3Ulw2q+DfLbIsFoQJO5aj/XgRZ3ubIlwXHcuArlICP3giNG1YhpI/FJcFLzJHh3FD3auae8Q1eO2AuepKq2EV5TL4++52HSXwQCw/EL3yhU7/Zzh6OQZyMGEcTwd6pUWe8Prw+Ow3ccc5u7WhsUBZRjHt4sNJSb2BuxOPV2g3/LEQpFySecl4gboAAQ3EiF1ObWxBgxrbJv2UurxE6Uu9k5CG0ZNLVIJcd3onoa9xLgWPBFQSh1WATALO7WFaA1JkHRaC2+4qolUzXdI5Mgt51iFZeBbe4PCQLQrXCHIiJrh0EvBaeghytNU5SXsh7AqgvSKZWRwUZJvmHgDTwsH3aNSIWKFTXQQGP03FVKiOSjLxiY7HZUpVzQWj4Y4xY8sOmhnh4yLtIY5MziKTkXW50i9i83aH9KwmH3MFkWPrlrEPWoFJQdI05BPpDu3g9Ec0Z3WDyBww3IoLdwT31hjzAYfoADKAJmGb7AZ5vvxxf827uKPqUlpkGRd5dNBJM0PqPaECBEVfTBBkwHmXHM8iHAmg8YhxvU5cJYZV9Mq7YucHUDMYxtW8XxyzJ6jBYeIK2Hu6L6lAPWsKlk/Uyva9gquW03WWZ1HPb0L+qMvLUvGpoi8BnSA2uihPKZpIJ5Kk6CdqAIEFbs5PGzVBZEr7B8+ixkTdfqJGkkia4Hv7sGnOrf+LEHUmoSNMLtgI0viH+HJDZsN7dAvmBh18lh65XZpUPv90sIIE6md7mGLZz9GQI+6bNg3nbXvsTJICXmDO/UeNQ3nO+sblxm/GAuNxEL83geoD1PB0++9Nz4E50P0otyc9yg3k+pnV5snKSnytvUop461uOOsTxCqjoNs6S1XDbFTPt/jDZjwVQjaqqBR7oDdSb7aEI4dIeyfDQKuXwP+EC5wzTlNwa2wr7MMuTOQxHNyfybSSRtnQJ3l9k8+V6WqAoZgDx/yeooVSUS46ojE/DUwATZ0UkvdEV6K3b0miB2+4SQFSisit1obW/HCThO2ZfAZx2vYM4/KzPu0ftN8CvvLC27cFThM7r5c6F+8DTsQpFXWUcqWrFaxhUspjPJVcuCwBxoqBP0cBtei4srxuNP8QgB6zUVQl+hHH8ubcP6oV30/+rnqqQJIRogZ0VXtIIKMV1m45bvKNS1+xXVqYs9lg7WZGh+l4QZVWnjrryAaytXVqDGnEuKm0fJ3h6YaeCmPb0c8X/XvsGt50Ng7c/XUDZdey/8evdy6DDywJnzPcH41Xyh/bitv4TcROsYcRJMzyVBBnd4o1O0G3mEAyuJdTST7GqIVLPcD89S1aMezU9vwZSKYj/k+NNcfooqR8ijEK4YW+x4zXZWomPvvFXehMykUEmSE771wRhU2Om1mld8R9mtH+5LmXtjmABzgMAf2TrLs5NSi+Sg/YZ9YZh+w5cPvWiioosKhNQws5KN8laEAZ2S27iZpHqZ+BMXCxOp9QUGrxAZwYqhQIs8nUsYm+8hMn5NzRwh+0krLuwO75GaKRYP8twIBANevkHtSAnAuPCcGnu2BPxyCMfp+psLVgegU4uOADDBz/+JSTvj/1eQh6BIKn2icpMzFqSj96+J+JGKAvceccJ7PxOuDVeK+2vz8T4825xMP3Lm2EwdKb6gA6uu0/sKQ3cdPkHvvWbH5+xptBB8KFCt7H8ymzxe4O0tmBv0cKnIpOkXLOSKC/D5iIPYW/NHeDoK7srg0cg8OH/5MlQEYPjwv0yTZvYdAvZB1HAuQx345B6bmccScMXR2aBfTe+jE4RRcc2NidLGzMe8ziJWVa5uxUvoVOQrBzP8KgcnzQJW2/BpIxTXcRmKD+4YavBAZaSVrVsdeQbdBvT3OlQonGALTtDzSb+EBPL9gtSIH7Xg0zklQxmE6pTo3nGUGrxXnd6sadWdFXqAYS6RkWT0SMWxGd2/aABrpdfPAmp7hirWR7aVE/Jc0r9K/aAKIPK60AFxj1FK4jTB/9JtOSDGVPbzx6lYo4ggRgEIbXLzOaIEXZjgid8To4+l6rI/g+VaMiMlrzpxj0GGQaH2qBs5clCG/f+tmC+KA80QogwAyrUZklXzmkkJcmc9rS6/7XcgGHBEKUa1jdK3qAa7dK0Y2g0fA/vag0glDDuaMs0U8bgqClVzOrk68IKdhjrED9ATI0eTsAG7GzsWudyJZQWZM8Q+r2AB6tPVRtad5psvpzm18y9OpWW1snkAMrxG285sHOfKbfN5kj4Tdb1hAShePuufBBvecAHm4z8Bh+Om+bgCmBXF0jkSVFGOgbGs0GiC3N22TkXkXFolijVvfZE9qCt3AcPABuXH1K302PJoYYPJ6vOhRj+eUCMo3EwrVzwOAsvqS5Bl94DQ77lpWWeLJX1loQPvYesflNidM38AyXmRn7ZcqmAl8rfLCi4uPv4AgCVflQDcym61nyBh3FOm69LhDfHC3PI68ujNURDzjDC/MpzZVgEbOO/yTwgon78PEdpDGGmGe3R+XZGcZ6khPEB61UmKNF5ehdYPrn4tJST+1uOa3VF77c+Cne/SU1SPss94f1UPPrfsKXbSw8t1TouOPHyGQyhwhgEIv4MwtNyO+aJWau1TrQdOpx4E1MTepNpHRxjxJ0094nkHctYDPgMqc7IjtmzLJ8sgpcosqTeVK9XyEvMYbWlqw31AJ6YjUzPnquOhH3eIwEX52GUI+qDDGax+0kg/BBekBXjia5RbVIW1/WT8kfTb+qMGRI4roP7R4AUY+IKPbPMSIi6zBGCfEW5nanTRcpi8F1u5lLhDfHC3P8CJg/gz7Cj////LmnBIw4zLOvs9MhjWwJ3UB9DRVHeLMdLA4ivQQr/LgLoEukc4QMftHEk0T24A528zlnc6zOIoY4Bp5v+P+LuFsud4JSsxTqRTsYQ4Ws1bFAPPM34i0G7fHPnLc9g1I/Kc2RSKPbSB1twEQ/QAkoNaHub2WB23IdvOuE4RBUP2qcAd11avaAAAl6lyPCLIpHzLw6U3g4mC6/GbGyo3tZJ5poI9Jtb35VygHdROD1tPWcxN33HLFC0BEume5iSAd0OOJnw4sHSFtZ7pqXDJpnFqB8i4f21y/SaVsIPeCd5YtsSJKRIha6Jr58LGgAAAAAAAAAAAAAAAA==';

  readonly supportedTransactionVersions: ReadonlySet<TransactionVersion> = new Set(['legacy', 0]);

  private _publicKey: PublicKey | null;
  private _connecting: boolean;
  private _appKit: AppKit | null;
  private _config: WalletConnectWalletAdapterConfig;
  private _readyState: WalletReadyState =
    typeof window === 'undefined' ? WalletReadyState.Unsupported : WalletReadyState.Loadable;
  private isSubscribed: boolean;
  public walletInfo: {
    name?: string;
    icon?: string;
  };

  constructor(config: WalletConnectWalletAdapterConfig) {
    super();

    this._publicKey = null;
    this._connecting = false;
    this._config = config;
    this.isSubscribed = false;
    this.walletInfo = {};

    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()] as any,
    });

    this._appKit = createAppKit({
      ...this._config.options,
      adapters: [solanaWeb3JsAdapter],
      networks: [NETWORKS[this._config.network]],
    });

    window.appKit = this._appKit;

    this._appKit.subscribeAccount((account) => {
      this.isSubscribed = true;
      if (account.address && account.isConnected) {
        const publicKey = new PublicKey(account.address);
        if (this.publicKey && this.publicKey.equals(publicKey)) return;

        const walletInfo = this._appKit?.getWalletInfo();
        console.log('walletInfo :>> ', walletInfo);
        this.walletInfo = {
          name: walletInfo?.name,
          icon: walletInfo?.icon,
        };

        this._publicKey = publicKey;
        this.emit('connect', publicKey);
      }
    });
  }

  get publicKey() {
    return this._publicKey;
  }

  get connecting() {
    return this._connecting;
  }

  get readyState() {
    return this._readyState;
  }

  async connect(): Promise<void> {
    if (!this.isSubscribed) return;
    try {
      if (this.connected || this.connecting) return;
      if (this._readyState !== WalletReadyState.Loadable) throw new WalletNotReadyError();
      if (!this._appKit) throw new WalletNotConnectedError();

      this._connecting = true;

      await this._appKit.open({ view: 'AllWallets' as any });
    } catch (error: any) {
      if ((error as Error).constructor.name === 'QRCodeModalError')
        throw new WalletWindowClosedError();
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    const appKit = this._appKit;
    if (appKit) {
      appKit.close();

      this._publicKey = null;

      try {
        await appKit.disconnect();
      } catch (error: any) {
        if (error.message === 'Please call connect() before enable()') window.location.reload();
        this.emit('error', new WalletDisconnectionError(error?.message, error));
      }
    }

    this.emit('disconnect');
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    try {
      const appKit = this._appKit;
      if (!appKit) throw new WalletNotConnectedError();
      const walletProvider = appKit.getWalletProvider() as Provider;
      try {
        return (await walletProvider.signTransaction(transaction)) as T;
      } catch (error: any) {
        throw new WalletSignTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    try {
      const appKit = this._appKit;
      if (!appKit) throw new WalletNotConnectedError();
      const walletProvider = appKit.getWalletProvider() as Provider;

      try {
        return await walletProvider.signMessage(message);
      } catch (error: any) {
        throw new WalletSignMessageError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }
}
