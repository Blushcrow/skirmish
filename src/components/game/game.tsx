import { useEffect, useState } from "react";
import type { Msg, Transport } from "../peerTransport/transport";

export type Role = "host" | "guest";
interface Commands {
  [key: string]: () => void;
}

function Game({ transport, role }: { transport: Transport; role: Role }) {
  const [history, setHistory] = useState<Msg[]>([]);
  const [lock, setLock] = useState<{ me: string | undefined; opponent: string | undefined }>({
    me: undefined,
    opponent: undefined,
  });
  const commands: Commands = {
    unlock: () => setLock({ me: undefined, opponent: undefined }),
  };

  function post(message: Msg) {
    transport.send(message);
    setHistory((h) => [...h, message]);
  }

  useEffect(
    () =>
      transport.onMessage((msg) => {
        setHistory((h) => [...h, msg]);
        if (["host", "guest"].includes(msg.source))
          setLock((l) => ({ me: l.me, opponent: msg.body }));
        else if (msg.source === "engine") commands[msg.body]();
      }),
    [transport],
  );

  return (
    <>
      <div>You are the {role}.</div>
      <button
        onClick={(e) => {
          let message: string;
          if (e.shiftKey) message = "commit";
          else if (e.altKey) message = "evade";
          else message = "wait";
          setLock((l) => ({ me: message, opponent: l.opponent }));
          post({ body: message, source: role });
          if (lock.opponent) {
            post({
              body: `host chooses to ${role === "host" ? message : lock.opponent}, guest chooses to ${role === "guest" ? message : lock.opponent}`,
              source: "historian",
            });
            setLock({ me: undefined, opponent: undefined });
            post({
              body: "unlock",
              source: "engine",
            });
          }
        }}
        disabled={lock.me ? true : false}
      >
        Click to wait, shift+click to commit, alt+click to evade
      </button>
      <div id="history">
        {history
          .filter((entry) => entry.source === "historian")
          .map((line, i) => (
            <div key={i}>{line?.source + ": " + line.body}</div>
          ))}
      </div>
    </>
  );
}

export default Game;
