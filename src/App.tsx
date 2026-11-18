import { useEffect, useRef, useState } from "react";
import "./App.css";
import type { Transport } from "./components/peerTransport/transport";
import Lobby from "./components/Lobby/Lobby";

function App() {
  const [session, setSession] = useState<{ transport: Transport } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const fieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return session?.transport.onMessage((msg) => {
      setHistory((h) => [...h, msg.body]);
    });
  }, [session?.transport]);

  if (!session) return <Lobby onReady={(transport) => setSession({ transport })} />;
  return (
    <>
      <input ref={fieldRef} type="text"></input>
      <button
        onClick={() => {
          if (!fieldRef.current) return;
          const message = fieldRef.current.value;
          setHistory((h) => [...h, message]);
          session.transport.send({ body: fieldRef.current.value });
          fieldRef.current.value = "";
        }}
      >
        spam
      </button>
      <div>
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </>
  );
}

export default App;
