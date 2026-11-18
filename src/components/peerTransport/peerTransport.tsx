import { Peer, type DataConnection } from "peerjs";
import type { Transport, Msg } from "./transport";

function wrap(conn: DataConnection): Transport {
  return {
    send: (msg) => conn.send(msg),
    onMessage: (cb) => {
      const h = (d: unknown) => cb(d as Msg);
      conn.on("data", h);
      return () => conn.off("data", h as any);
    },
    close: () => conn.close(),
  };
}

// Host: returns the ID to share, and resolves a transport once the friend joins
export function hostGame(onId: (id: string) => void): Promise<Transport> {
  const peer = new Peer();
  peer.on("open", onId);
  return new Promise((resolve) =>
    peer.on("connection", (conn) => conn.on("open", () => resolve(wrap(conn)))),
  );
}

// Guest: connect to the host's ID
export function joinGame(hostId: string): Promise<Transport> {
  const peer = new Peer();
  return new Promise((resolve) =>
    peer.on("open", () => {
      const conn = peer.connect(hostId);
      conn.on("open", () => resolve(wrap(conn)));
    }),
  );
}
