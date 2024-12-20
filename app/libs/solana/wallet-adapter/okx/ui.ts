import type { EventEmitter, SendTransactionOptions, WalletName } from '@solana/wallet-adapter-base';
import {
  BaseMessageSignerWalletAdapter,
  isIosAndRedirectable,
  isVersionedTransaction,
  scopePollingDetectionStrategy,
  WalletAccountError,
  WalletConnectionError,
  WalletDisconnectedError,
  WalletDisconnectionError,
  WalletError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletPublicKeyError,
  WalletReadyState,
  WalletSendTransactionError,
  WalletSignMessageError,
  WalletSignTransactionError,
} from '@solana/wallet-adapter-base';
import type {
  Connection,
  SendOptions,
  Transaction,
  TransactionSignature,
  TransactionVersion,
  VersionedTransaction,
} from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { OKXUniversalConnectUI } from '@okxconnect/ui';
import { OKXSolanaProvider } from '@okxconnect/solana-provider';

interface OkxWalletEvents {
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  accountChanged(newPublicKey: PublicKey): unknown;
}

interface OkxWallet extends EventEmitter<OkxWalletEvents> {
  isOkx?: boolean;
  publicKey?: { toBytes(): Uint8Array };
  isConnected: boolean;
  signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[],
  ): Promise<T[]>;
  signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    options?: SendOptions,
  ): Promise<{ signature: TransactionSignature }>;
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

interface OkxWindow extends Window {
  okxwallet?: {
    solana?: OkxWallet;
  };
  solana?: OkxWallet;
}

declare const window: OkxWindow;

export interface OkxWalletAdapterConfig {}

export const OkxWalletName = 'OKX Wallet' as WalletName<'OKX Wallet'>;

export class OkxWalletUIAdapter extends BaseMessageSignerWalletAdapter {
  name = OkxWalletName;
  icon = 'https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png';
  url = 'https://www.okx.com/web3';

  supportedTransactionVersions: ReadonlySet<TransactionVersion> = new Set(['legacy', 0]);

  private _connecting: boolean;
  private _wallet: OkxWallet | null;
  private _publicKey: PublicKey | null;
  private _readyState: WalletReadyState =
    typeof window === 'undefined' || typeof document === 'undefined'
      ? WalletReadyState.Unsupported
      : WalletReadyState.NotDetected;

  private _universalUi: OKXUniversalConnectUI | null = null;
  private _provider: OKXSolanaProvider | null = null;

  constructor(config: OkxWalletAdapterConfig = {}) {
    super();
    this._connecting = false;
    this._wallet = null;
    this._publicKey = null;

    this._initializeUI();

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.checkConnected();
        }
      });
    }
  }

  private isTelegram() {
    if (typeof window === 'undefined') return false;
    return !!(
      // @ts-ignore
      window.Telegram?.WebApp?.initDataUnsafe ||
      window.location.hash?.startsWith('#tgWebAppData')
    );
  }

  private async _initializeUI() {
    try {
      this._universalUi = await OKXUniversalConnectUI.init({
        dappMetaData: {
          icon: (document.head.querySelector('link[rel="icon"]') as any)?.href,
          name: document.title,
        },
        actionsConfiguration: {
          returnStrategy: this.isTelegram() ? 'tg://resolve' : 'back',
          modals: 'all',
          tmaReturnUrl: 'back',
        },
        language: 'en_US',
        uiPreferences: {
          theme: 'SYSTEM',
        },
      });

      this._provider = new OKXSolanaProvider(this._universalUi);

      this.checkConnected();
    } catch (error) {
      console.error('Failed to initialize OKX UI:', error);
    }
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

  async autoConnect(): Promise<void> {
    // Skip autoconnect in the Loadable state
    // We can't redirect to a universal link without user input
    if (this.readyState === WalletReadyState.Installed) {
      await this.connect();
    }
  }

  getChain() {
    return 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
  }

  checkConnected() {
    const chain = this.getChain();
    const account = this._provider?.getAccount(chain);
    if (account?.address) {
      this._publicKey = new PublicKey(account.address);
      this._wallet = this._provider as any;
      setTimeout(() => {
        this.emit('connect', this._publicKey!);
      }, 100);
    }
  }

  async connect(): Promise<void> {
    try {
      const chain = this.getChain();
      if (this.connecting) return;
      if (this.connected) {
        this.checkConnected();
        return;
      }

      this._connecting = true;
      if (!this._universalUi || !this._provider) throw new WalletNotReadyError();

      const session = await this._universalUi?.openModal({
        namespaces: {
          solana: {
            chains: [chain],
          },
        },
      });
      console.log('session :>> ', session);
      if (!session) throw new WalletConnectionError('Failed to connect to OKX wallet');

      setTimeout(() => {
        this.checkConnected();
      }, 500);
    } catch (error: any) {
      console.error('error :>> ', error);
      this.emit('error', error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this._universalUi) {
      await this._universalUi.disconnect().catch(() => console.log('disconnect error'));
    }
    this._wallet = null;
    this._publicKey = null;
    this.emit('disconnect');
  }

  async sendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    connection: Connection,
    options: SendTransactionOptions = {},
  ): Promise<TransactionSignature> {
    try {
      const wallet = this._wallet as any;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        const { signers, ...sendOptions } = options;

        if (isVersionedTransaction(transaction)) {
          signers?.length && transaction.sign(signers);
        } else {
          transaction = (await this.prepareTransaction(transaction, connection, sendOptions)) as T;
          signers?.length && (transaction as Transaction).partialSign(...signers);
        }

        const signature = await wallet.signAndSendTransaction(transaction, this.getChain());

        return signature;
      } catch (error: any) {
        if (error instanceof WalletError) throw error;
        throw new WalletSendTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    try {
      const wallet = this._wallet as any;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        return (await wallet.signTransaction(transaction, this.getChain())) || transaction;
      } catch (error: any) {
        throw new WalletSignTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[],
  ): Promise<T[]> {
    try {
      const wallet = this._wallet as any;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        return (
          ((await wallet.signAllTransactions(transactions, this.getChain())) as T[]) || transactions
        );
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
      const wallet = this._wallet as any;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        const { signature } = await wallet.signMessage(message, this.getChain());
        return signature;
      } catch (error: any) {
        throw new WalletSignMessageError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }
}

