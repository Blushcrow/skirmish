export type Msg = { body: string; [key: string]: unknown };

export interface Transport {
  send(msg: Msg): void;
  onMessage(cb: (msg: Msg) => void): () => void; // returns an unsubscribe function
  close(): void;
}
