import React from "react";
import { Button } from "rsuite";
import { createPoolTx } from ".";

export const Aggreagator = () => {
  const run = () => {
    createPoolTx();
  };

  return (
    <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={run}>
      Create
    </Button>
  );
};
