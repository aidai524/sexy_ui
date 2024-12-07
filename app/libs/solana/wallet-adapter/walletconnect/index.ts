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

declare global {
  interface Window {
    appKit: AppKit;
  }
}

export const WalletConnectWalletName = 'WalletConnect' as WalletName<'WalletConnect'>;

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
    'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE4NSIgdmlld0JveD0iMCAwIDMwMCAxODUiIHdpZHRoPSIzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTYxLjQzODU0MjkgMzYuMjU2MjYxMmM0OC45MTEyMjQxLTQ3Ljg4ODE2NjMgMTI4LjIxMTk4NzEtNDcuODg4MTY2MyAxNzcuMTIzMjA5MSAwbDUuODg2NTQ1IDUuNzYzNDE3NGMyLjQ0NTU2MSAyLjM5NDQwODEgMi40NDU1NjEgNi4yNzY1MTEyIDAgOC42NzA5MjA0bC0yMC4xMzY2OTUgMTkuNzE1NTAzYy0xLjIyMjc4MSAxLjE5NzIwNTEtMy4yMDUzIDEuMTk3MjA1MS00LjQyODA4MSAwbC04LjEwMDU4NC03LjkzMTE0NzljLTM0LjEyMTY5Mi0zMy40MDc5ODE3LTg5LjQ0Mzg4Ni0zMy40MDc5ODE3LTEyMy41NjU1Nzg4IDBsLTguNjc1MDU2MiA4LjQ5MzYwNTFjLTEuMjIyNzgxNiAxLjE5NzIwNDEtMy4yMDUzMDEgMS4xOTcyMDQxLTQuNDI4MDgwNiAwbC0yMC4xMzY2OTQ5LTE5LjcxNTUwMzFjLTIuNDQ1NTYxMi0yLjM5NDQwOTItMi40NDU1NjEyLTYuMjc2NTEyMiAwLTguNjcwOTIwNHptMjE4Ljc2Nzc5NjEgNDAuNzczNzQ0OSAxNy45MjE2OTcgMTcuNTQ2ODk3YzIuNDQ1NTQ5IDIuMzk0Mzk2OSAyLjQ0NTU2MyA2LjI3NjQ3NjkuMDAwMDMxIDguNjcwODg5OWwtODAuODEwMTcxIDc5LjEyMTEzNGMtMi40NDU1NDQgMi4zOTQ0MjYtNi40MTA1ODIgMi4zOTQ0NTMtOC44NTYxNi4wMDAwNjItLjAwMDAxLS4wMDAwMS0uMDAwMDIyLS4wMDAwMjItLjAwMDAzMi0uMDAwMDMybC01Ny4zNTQxNDMtNTYuMTU0NTcyYy0uNjExMzktLjU5ODYwMi0xLjYwMjY1LS41OTg2MDItMi4yMTQwNCAwLS4wMDAwMDQuMDAwMDA0LS4wMDAwMDcuMDAwMDA4LS4wMDAwMTEuMDAwMDExbC01Ny4zNTI5MjEyIDU2LjE1NDUzMWMtMi40NDU1MzY4IDIuMzk0NDMyLTYuNDEwNTc1NSAyLjM5NDQ3Mi04Ljg1NjE2MTIuMDAwMDg3LS4wMDAwMTQzLS4wMDAwMTQtLjAwMDAyOTYtLjAwMDAyOC0uMDAwMDQ0OS0uMDAwMDQ0bC04MC44MTI0MTk0My03OS4xMjIxODVjLTIuNDQ1NTYwMjEtMi4zOTQ0MDgtMi40NDU1NjAyMS02LjI3NjUxMTUgMC04LjY3MDkxOTdsMTcuOTIxNzI5NjMtMTcuNTQ2ODY3M2MyLjQ0NTU2MDItMi4zOTQ0MDgyIDYuNDEwNTk4OS0yLjM5NDQwODIgOC44NTYxNjAyIDBsNTcuMzU0OTc3NSA1Ni4xNTUzNTdjLjYxMTM5MDguNTk4NjAyIDEuNjAyNjQ5LjU5ODYwMiAyLjIxNDAzOTggMCAuMDAwMDA5Mi0uMDAwMDA5LjAwMDAxNzQtLjAwMDAxNy4wMDAwMjY1LS4wMDAwMjRsNTcuMzUyMTAzMS01Ni4xNTUzMzNjMi40NDU1MDUtMi4zOTQ0NjMzIDYuNDEwNTQ0LTIuMzk0NTUzMSA4Ljg1NjE2MS0uMDAwMi4wMDAwMzQuMDAwMDMzNi4wMDAwNjguMDAwMDY3My4wMDAxMDEuMDAwMTAxbDU3LjM1NDkwMiA1Ni4xNTU0MzJjLjYxMTM5LjU5ODYwMSAxLjYwMjY1LjU5ODYwMSAyLjIxNDA0IDBsNTcuMzUzOTc1LTU2LjE1NDMyNDljMi40NDU1NjEtMi4zOTQ0MDkyIDYuNDEwNTk5LTIuMzk0NDA5MiA4Ljg1NjE2IDB6IiBmaWxsPSIjM2I5OWZjIi8+PC9zdmc+';

  readonly supportedTransactionVersions: ReadonlySet<TransactionVersion> = new Set(['legacy', 0]);

  private _publicKey: PublicKey | null;
  private _connecting: boolean;
  private _appKit: AppKit | null;
  private _config: WalletConnectWalletAdapterConfig;
  private _readyState: WalletReadyState =
    typeof window === 'undefined' ? WalletReadyState.Unsupported : WalletReadyState.Loadable;
  private isSubscribed: boolean;

  constructor(config: WalletConnectWalletAdapterConfig) {
   
    super();

    this._publicKey = null;
    this._connecting = false;
    this._config = config;
    this.isSubscribed = false;

    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()] as any,
    });

    this._appKit = createAppKit({
      ...this._config.options,
      adapters: [solanaWeb3JsAdapter],
      networks: [NETWORKS[this._config.network]],
    });

    if (typeof window !== 'undefined') window.appKit = this._appKit;

    this._appKit.subscribeAccount((account) => {
      this.isSubscribed = true;
      if (account.address && account.isConnected) {
        const publicKey = new PublicKey(account.address);
        if (this.publicKey && this.publicKey.equals(publicKey)) return;

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

      await window.appKit.open({ view: 'AllWallets' as any });
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
