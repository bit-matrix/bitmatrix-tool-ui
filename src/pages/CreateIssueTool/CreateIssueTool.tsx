import { issuance } from "liquidjs-lib";
import { Outpoint } from "liquidjs-lib/src/issuance";
import React, { useState } from "react";
import { Button, Input, Tooltip, Whisper, InputGroup } from "rsuite";
import CopyIcon from "../../components/Svg/Icons/Copy";

export const CreateIssueTool = () => {
  const [vout, setVout] = useState<number>();
  const [txHash, setTxHash] = useState<string>("");
  const [contractHash, setContractHash] = useState<string>("");
  const [result, setResult] = useState<{ entropy: string; assetId: string }>();

  const calculateEntropyAndIssueId = () => {
    const outpoint: Outpoint = {
      txHash: Buffer.from(txHash, "hex").reverse(),
      vout: vout || 0,
    };

    const contractHashReverse = Buffer.from(contractHash, "hex").reverse();

    const entropy = issuance.generateEntropy(outpoint, contractHashReverse);

    const asset = issuance.calculateAsset(entropy);

    setResult({ entropy: entropy.reverse().toString("hex"), assetId: asset.reverse().toString("hex") });
  };

  return (
    <div className="pool-generator-tool-container">
      <h6>tx Hash</h6>
      <Input type="string" value={txHash} onChange={(value: string) => setTxHash(value.replace(/\s/g, ""))} />

      <h6>Contract Hash</h6>
      <Input type="number" value={contractHash} onChange={(value: string) => setContractHash(value.replace(/\s/g, ""))} />

      <h6>Vout</h6>
      <Input type="number" value={vout} onChange={(value: string) => setVout(Number(value.replace(/\s/g, "")))} />

      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={calculateEntropyAndIssueId}>
        Calculate Asset Id
      </Button>

      {result && (
        <>
          <h6>Entropy</h6>
          <InputGroup>
            <Input value={result.entropy} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Entropy has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.entropy)}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Asset Id</h6>
          <InputGroup>
            <Input value={result.assetId} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Asset ID has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.assetId)}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </>
      )}
    </div>
  );
};
