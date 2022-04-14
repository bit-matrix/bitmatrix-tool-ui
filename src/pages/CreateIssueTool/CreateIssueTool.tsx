import React, { useState } from "react";
import { Button, Input, Tooltip, Whisper, InputGroup } from "rsuite";
import CopyIcon from "../../components/Svg/Icons/Copy";
import { asset } from "@bitmatrix/lib";

export const CreateIssueTool = () => {
  const [vout, setVout] = useState<number>();
  const [txHash, setTxHash] = useState<string>("");
  const [contractHash, setContractHash] = useState<string>("");
  const [assetId, setAssetId] = useState<string>();

  const calculateEntropyAndIssueId = () => {
    const assetOutput = asset.calculateAssetId(txHash, contractHash, vout || 0);

    setAssetId(assetOutput);
  };

  return (
    <div className="pool-generator-tool-container">
      <h6>tx Hash</h6>
      <Input type="string" value={txHash} onChange={(value: string) => setTxHash(value.replace(/\s/g, ""))} />

      <h6>Contract Hash</h6>
      <Input type="string" value={contractHash} onChange={(value: string) => setContractHash(value.replace(/\s/g, ""))} />

      <h6>Vout</h6>
      <Input type="number" value={vout} onChange={(value: string) => setVout(Number(value.replace(/\s/g, "")))} />

      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={calculateEntropyAndIssueId}>
        Calculate Asset Id
      </Button>

      {assetId && (
        <>
          <h6>Asset Id</h6>
          <InputGroup>
            <Input value={assetId} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Asset ID has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(assetId)}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </>
      )}
    </div>
  );
};
