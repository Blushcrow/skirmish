import { useState } from "react";
import "./App.scss";
import type { Transport } from "./components/peerTransport/transport";
import Lobby from "./components/lobby/lobby";
import type { Role } from "./components/game/game";
import Game from "./components/game/game";

function App() {
  const [session, setSession] = useState<{ transport: Transport; role: Role } | null>(null);

  if (!session) return <Lobby onReady={(transport, role) => setSession({ transport, role })} />;
  return (
    <>
      <Game transport={session.transport} role={session.role} />
    </>
  );
}

export default App;
