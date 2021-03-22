import React from "react";
import { Drizzle } from "@drizzle/store";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import LoadingComponent from "./loadingComponent";
import TokenMetadata from "./TokenMetadata";
import TokenWallet from "./TokenWallet";

import drizzleOptions from "./drizzleOptions.js";

// Instantiate Drizzle
const drizzle = new Drizzle(drizzleOptions);
const { DrizzleProvider } = drizzleReactHooks;

function App() {
  return (
    <div className="container">
      <h1>ERC20 Token</h1>
      {/* Cannot use drizzle hooks without provider */}
      <DrizzleProvider drizzle={drizzle}>
        <LoadingComponent>
          <TokenMetadata />
          <TokenWallet />
        </LoadingComponent>
      </DrizzleProvider>
    </div>
  );
}

export default App;
