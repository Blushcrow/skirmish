import { useRef, useState } from "react";
import { hostGame, joinGame } from "../peerTransport/peerTransport";
import type { Transport } from "../peerTransport/transport";

function Lobby({ onReady }: { onReady: (t: Transport) => void }) {
  const [myID, setMyID] = useState("");
  const [joinID, setJoinID] = useState("");
  const fieldRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="host">
        <button onClick={async () => onReady(await hostGame(setMyID))} className="connection">
          Host game
        </button>
        <input className="field" readOnly value={myID}></input>
      </div>
      <div className="guest">
        <button className="connection" onClick={async () => onReady(await joinGame(joinID))}>
          Join game
        </button>
        <input
          className="field"
          ref={fieldRef}
          value={joinID}
          onInput={() => {
            if (!fieldRef.current) return;
            setJoinID(fieldRef.current.value);
          }}
        ></input>
      </div>
    </>
  );
}

export default Lobby;
