import React, { useState } from "react";
import { Button, Divider, Input, InputGroup, List, Tooltip, Whisper } from "rsuite";
import { pool } from "@bitmatrix/lib";
import { taproot, TAPROOT_VERSION } from "@script-wiz/lib-core";
import WizData, { hexLE } from "@script-wiz/wiz-data";
import CopyIcon from "../../components/Svg/Icons/Copy";
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
            <InputGroup className="">
              <Input value={result.controlBlock} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Control Block has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <Divider />

            <h5>Flag Covenant Output </h5>

            <h6>Flag covenant script</h6>
            <InputGroup className="">
              <Input value={"cd008800c7010088040000000088767651c70100880401000000888852c70100880402000000888853c701008804030000008887"} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Flag covenant script has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Flag covenant control block:</h6>
            <InputGroup className="">
              <Input value={"c41dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624"} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Flag covenant control block has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Flag covenant scriptPubkey</h6>
            <InputGroup className="">
              <Input value={"512070d3017ab2a8ae4cccdb0537a45fb4a3192bff79c49cf54bd9edd508dcc93f55"} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Flag covenant scriptPubkey has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Flag covenant testnet address</h6>
            <InputGroup className="">
              <Input value={"tex1pwrfsz74j4zhyenxmq5m6gha55vvjhlmecjw02j7eah2s3hxf8a2sf9fp5h"} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Flag covenant testnet address has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Flag covenant mainnet address</h6>
            <InputGroup className="">
              <Input value={"ex1pwrfsz74j4zhyenxmq5m6gha55vvjhlmecjw02j7eah2s3hxf8a2sgumx9c"} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Flag covenant mainnet address has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <Divider />

            <h5>Token Covenant Output </h5>

            <h6>Token covenant script</h6>
            <InputGroup className="">
              <Input value={"20" + hexLE(flagAssetId || "") + "00c86987"} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Token covenant script has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Token covenant control block:</h6>
            <InputGroup className="">
              <Input value={singleLeafControlBlock} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Token covenant control block has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Token covenant scriptPubkey</h6>
            <InputGroup className="">
              <Input value={singleLeafResult.scriptPubkey.hex} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Token covenant scriptPubkey block has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Token covenant testnet address</h6>
            <InputGroup className="">
              <Input value={singleLeafResult.address.testnet} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Token covenant testnet address has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Token covenant mainnet address</h6>
            <InputGroup className="">
              <Input value={singleLeafResult.address.mainnet} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Token covenant mainnet address has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <Divider />

            <h5>Lp Holder Covenant Output </h5>

            <h6>Lp Holder covenant script</h6>
            <InputGroup className="">
              <Input value={"20" + hexLE(flagAssetId || "") + "00c86987"} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Lp Holder covenant script has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Lp Holder covenant control block:</h6>
            <InputGroup className="">
              <Input value={singleLeafControlBlock} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Lp Holder covenant control block has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Lp Holder covenant scriptPubkey</h6>
            <InputGroup className="">
              <Input value={singleLeafResult.scriptPubkey.hex} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Lp Holder covenant scriptPubkey has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Lp Holder covenant testnet address</h6>
            <InputGroup className="">
              <Input value={singleLeafResult.address.testnet} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Lp Holder covenant testnet address has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Lp Holder covenant mainnet address</h6>
            <InputGroup className="">
              <Input value={singleLeafResult.address.mainnet} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Lp Holder covenant mainnet address has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <Divider />

            <h5>Main Covenant Output </h5>

            <h6>Testnet address</h6>
            <InputGroup className="">
              <Input value={result.taprootResult.address.testnet} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Testnet address has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Mainnet address</h6>
            <InputGroup className="">
              <Input value={result.taprootResult.address.mainnet} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Mainnet address has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

            <h6>Script Pubkey</h6>
            <InputGroup className="">
              <Input value={result.taprootResult.scriptPubkey.hex} disabled />
              <Whisper placement="top" trigger="click" speaker={<Tooltip>Script Pubkey has been copied to clipboard!</Tooltip>}>
                <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                  <CopyIcon width="1rem" height="1rem" />
                </InputGroup.Button>
              </Whisper>
            </InputGroup>

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
