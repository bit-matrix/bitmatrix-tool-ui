import React, { useState } from "react";
import { Button, Divider, Input, List } from "rsuite";
import { pool } from "@bitmatrix/lib";
import { taproot, TAPROOT_VERSION } from "@script-wiz/lib-core";
import WizData, { hexLE } from "@script-wiz/wiz-data";
import "./PoolGenerateTool.scss";

export const PoolGenerateTool = () => {
  const [leafCount, setLeafCount] = useState<number>();
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [flagAssetId, setFlagAssetId] = useState<string>();
  const [result, setResult] = useState<{
    mainCovenantScript: string[];
    controlBlock: string;
    taprootResult: any;
  }>();
  const [singleLeafResult, setSingleLeafResult] = useState<any>();
  const [singleLeafControlBlock, setSingleLeafControlBlock] = useState<string>("");

  const calculateResult = () => {
    const script = [WizData.fromHex("20" + hexLE(flagAssetId || "") + "00c86987")];
    const pubkey = WizData.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");

    setResult(pool.createCovenants(leafCount! - 1, currentIndex!, flagAssetId!));
    setSingleLeafResult(taproot.tapRoot(pubkey, script, TAPROOT_VERSION.LIQUID));
    setSingleLeafControlBlock(taproot.controlBlockCalculation(script, "c4", pubkey.hex, currentIndex || 0));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <div>
        <h6>Leaf Count</h6>
        <Input type="number" style={{ marginBottom: "1rem" }} value={leafCount} onChange={(value: string) => setLeafCount(Number(value.replace(/\s/g, "")))} />
        <h6>Current Leaf Index</h6>
        <Input type="number" style={{ marginBottom: "1rem" }} value={currentIndex} onChange={(value: string) => setCurrentIndex(Number(value.replace(/\s/g, "")))} />
        <h6>Flag Asset Id</h6>
        <Input type="text" style={{ marginBottom: "1rem" }} value={flagAssetId} onChange={(value: string) => setFlagAssetId(value.replace(/\s/g, ""))} />

        <Button style={{ marginTop: "1rem" }} appearance="primary" size="md" onClick={calculateResult}>
          Calculate
        </Button>

        {result && (
          <div>
            <h6>Control Block</h6>
            <Input style={{ marginBottom: "1rem" }} value={result.controlBlock} disabled />

            <Divider />
            <h5>Flag Covenant Output </h5>

            <h6>Flag covenant script</h6>
            <Input style={{ marginBottom: "1rem" }} value={"cd008800c7010088040000000088767651c70100880401000000888852c70100880402000000888853c701008804030000008887"} disabled />

            <h6>Flag covenant control block:</h6>
            <Input style={{ marginBottom: "1rem" }} value={"c41dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624"} disabled />

            <h6>Flag covenant scriptPubkey</h6>
            <Input style={{ marginBottom: "1rem" }} value={"512070d3017ab2a8ae4cccdb0537a45fb4a3192bff79c49cf54bd9edd508dcc93f55"} disabled />

            <h6>Flag covenant testnet address</h6>
            <Input style={{ marginBottom: "1rem" }} value={"tex1pwrfsz74j4zhyenxmq5m6gha55vvjhlmecjw02j7eah2s3hxf8a2sf9fp5h"} disabled />

            <h6>Flag covenant mainnet address</h6>
            <Input style={{ marginBottom: "1rem" }} value={"ex1pwrfsz74j4zhyenxmq5m6gha55vvjhlmecjw02j7eah2s3hxf8a2sgumx9c"} disabled />

            <Divider />
            <h5>Token Covenant Output </h5>

            <h6>Token covenant script</h6>
            <Input style={{ marginBottom: "1rem" }} value={"20" + hexLE(flagAssetId || "") + "00c86987"} disabled />

            <h6>Token covenant control block:</h6>
            <Input style={{ marginBottom: "1rem" }} value={singleLeafControlBlock} disabled />

            <h6>Token covenant scriptPubkey</h6>
            <Input style={{ marginBottom: "1rem" }} value={singleLeafResult.scriptPubkey.hex} disabled />

            <h6>Token covenant testnet address</h6>
            <Input style={{ marginBottom: "1rem" }} value={singleLeafResult.address.testnet} disabled />

            <h6>Token covenant mainnet address</h6>
            <Input style={{ marginBottom: "1rem" }} value={singleLeafResult.address.mainnet} disabled />

            <Divider />
            <h5>Lp Holder Covenant Output </h5>

            <h6>Lp Holder covenant script</h6>
            <Input style={{ marginBottom: "1rem" }} value={"20" + hexLE(flagAssetId || "") + "00c86987"} disabled />

            <h6>Lp Holder covenant control block:</h6>
            <Input style={{ marginBottom: "1rem" }} value={singleLeafControlBlock} disabled />

            <h6>Lp Holder covenant scriptPubkey</h6>
            <Input style={{ marginBottom: "1rem" }} value={singleLeafResult.scriptPubkey.hex} disabled />

            <h6>Lp Holder covenant testnet address</h6>
            <Input style={{ marginBottom: "1rem" }} value={singleLeafResult.address.testnet} disabled />

            <h6>Lp Holder covenant mainnet address</h6>
            <Input style={{ marginBottom: "1rem" }} value={singleLeafResult.address.mainnet} disabled />

            <Divider />

            <h5>Main Covenant Output </h5>

            <h6>Testnet address </h6>
            <Input style={{ marginBottom: "1rem" }} value={result.taprootResult.address.testnet} disabled />

            <h6>Mainnet address </h6>
            <Input style={{ marginBottom: "1rem" }} value={result.taprootResult.address.mainnet} disabled />

            <h6>Script Pubkey </h6>
            <Input style={{ marginBottom: "1rem" }} value={result.taprootResult.scriptPubkey.hex} disabled />

            <List>
              {result?.mainCovenantScript.map((item, index) => (
                <>
                  <h6>Leaf {index + 1} </h6>

                  <List.Item key={index} index={index}>
                    {item}
                  </List.Item>
                </>
              ))}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};
