import { useEffect, useRef, useState } from "react";
import "./App.css";
import type { Transport } from "./components/peerTransport/transport";
import Lobby from "./components/Lobby/Lobby";

function App() {
  const [session, setSession] = useState<{ transport: Transport } | null>(null);
  const [history, setHistory] = useState<string>("");
  const fieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const off = session?.transport.onMessage((msg) => {
      setHistory(history + "/n" + msg.body);
    });
    return off;
  }, [session?.transport]);

  if (!session) return <Lobby onReady={(transport) => setSession({ transport })} />;
  return (
    <>
      <input ref={fieldRef} type="text"></input>
      <button
        onClick={() => {
          if (!fieldRef.current) return;
          setHistory(history + "/n" + fieldRef.current.value);
          session.transport.send({ body: fieldRef.current.value });
          fieldRef.current.value = "";
        }}
      >
        spam
      </button>
      <div>{history}</div>
    </>
  );
}

export default App;
