import { Args } from "./types";
import { uniqBy } from "lodash-es";

class MediaStore {
  private dbName = "";
  private storeName = "";
  private chunkSize = 1024 * 1024;
  private maxFile = 5;
  private queue: any[] = [];
  private fetching = false;
  private timer: any = null;

  constructor({ dbName, storeName, chunkSize }: Args) {
    this.dbName = dbName;
    this.storeName = storeName;
    if (chunkSize) this.chunkSize = chunkSize;
  }

  private async check() {
    if (!navigator.storage || !navigator.storage.estimate) {
      console.warn("Current Agent doesn't support Storage API");
      return;
    }
    await navigator.storage.estimate();
  }

  private initDB() {
    return new Promise<any>((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true
          });
        }
      };

      request.onsuccess = function (event: any) {
        resolve(event.target.result);
      };

      request.onerror = function (event: any) {
        reject("Init Error:" + event.target.error);
      };
    });
  }

  public async isFileCached(fileName: string) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(`${fileName}_meta`);

      request.onsuccess = () => {
        resolve(!!request.result);
      };

      request.onerror = (event: any) => {
        console.error(event.target.error);
        reject(false);
      };
    });
  }

  public async fetchFiles(files: any) {
    await this.check();
    this.queue = uniqBy([...this.queue, ...files], "name");
    if (this.fetching) {
      this.timer = setTimeout(() => {
        this.fetchFiles([]);
      }, 10000);
      return;
    }

    this.fetching = true;
    clearTimeout(this.timer);
    const loop = async () => {
      if (this.queue.length === 0) {
        this.fetching = false;
        return;
      }
      const file = this.queue.shift();
      await this.fetchAndStore(file.url, file.name);
      loop();
    };
    loop();
  }

  public async fetchAndStore(url: any, name: string) {
    const isCached = await this.isFileCached(name);
    if (isCached) return;

    await this.clearOldData();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Range: "bytes=0-1048575"
      }
    });
    if (!response.ok) {
      console.error("Download failed" + response.statusText);
      return;
    }

    const contentType = response.headers.get("content-type") || "video/mp4";
    const reader = response.body?.getReader();
    if (!reader) return;
    const db = await this.initDB();

    let chunks = [];
    let chunkIndex = 0;
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const transaction = await db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      chunks.push(value);
      receivedLength += value.length;

      if (receivedLength >= this.chunkSize) {
        await store.put({
          id: `${name}_chunk_${chunkIndex}`,
          type: contentType,
          data: new Blob(chunks)
        });
        chunks = [];
        receivedLength = 0;
        chunkIndex++;
      }
    }
    const transaction = await db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);
    if (chunks.length > 0) {
      await store.put({
        id: `${name}_chunk_${chunkIndex}`,
        type: contentType,
        data: new Blob(chunks)
      });
      chunkIndex++;
    }

    await store.put({
      id: `${name}_meta`,
      type: contentType,
      totalChunks: chunkIndex
    });

    console.log(`Store successfully ${name}`);
  }

  public async getFile(fileName: string) {
    const db = await this.initDB();
    return new Promise(async (resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const metaRequest = store.get(`${fileName}_meta`);

      metaRequest.onsuccess = async () => {
        const meta = metaRequest.result;
        if (!meta) {
          return reject("File unexist:" + fileName);
        }
        const totalChunks = meta.totalChunks;
        const chunks: any = [];

        for (let i = 0; i < totalChunks; i++) {
          const chunkRequest = store.get(`${fileName}_chunk_${i}`);
          chunkRequest.onsuccess = () => {
            chunks.push(chunkRequest.result.data);
            if (chunks.length === totalChunks) {
              const finalBlob = new Blob(chunks, { type: meta.type });
              resolve(finalBlob);
            }
          };
        }
      };

      metaRequest.onerror = (event: any) =>
        reject("Read failed" + event.target.error);
    });
  }

  public async deleteFile(fileName: string) {
    const db = await this.initDB();
    return new Promise(async (resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const metaRequest = store.get(`${fileName}_meta`);
      metaRequest.onsuccess = async () => {
        const meta = metaRequest.result;
        if (!meta) return reject("File unexist:" + fileName);

        for (let i = 0; i < meta.totalChunks; i++) {
          store.delete(`${fileName}_chunk_${i}`);
        }
        store.delete(`${fileName}_meta`);

        transaction.oncomplete = () =>
          resolve("Deleted successfully: " + fileName);
        transaction.onerror = (event: any) =>
          reject("Deleted Failed:" + event.target.error);
      };
    });
  }

  public async clearOldData() {
    const db = await this.initDB();
    return new Promise(async (resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const keysRequest = await store.getAllKeys();

      keysRequest.onsuccess = async () => {
        const fileMetaKeys = keysRequest.result.filter((key: any) =>
          key.endsWith("_meta")
        );

        if (fileMetaKeys.length > this.maxFile) {
          const oldestFile = fileMetaKeys[0].replace("_meta", "");
          await this.deleteFile(oldestFile);
        }

        transaction.oncomplete = () => resolve("Cleared successfully");
        transaction.onerror = (event: any) =>
          reject("Cleared failed" + event.target.error);
      };
    });
  }

  public async clearStore() {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(this.dbName);

      request.onerror = () => reject("Error opening database");

      request.onsuccess = (event: any) => {
        let db = event.target.result;
        let transaction = db.transaction(this.storeName, "readwrite");
        let store = transaction.objectStore(this.storeName);
        let clearRequest = store.clear();

        clearRequest.onsuccess = () =>
          resolve(`Cleared all data in ${this.storeName}`);
        clearRequest.onerror = () => reject("Error clearing object store");
      };
    });
  }
}

const mediaStore = new MediaStore({
  dbName: "media_db",
  storeName: "media_store"
});

export default mediaStore;
