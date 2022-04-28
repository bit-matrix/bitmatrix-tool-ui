import { useState } from "react";
import { Button, Checkbox, Divider, Input, InputGroup, Tooltip, Whisper } from "rsuite";
import { commitmentOutput } from "@bitmatrix/lib";
import CopyIcon from "../../components/Svg/Icons/Copy";

export const CommitmentOutputTool = () => {
  const [flagAssetId, setFlagAssetId] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [isAddLiquidity, setIsAddLiquidity] = useState<boolean>(false);
  const [result, setResult] = useState<any>();

  const createCommitmentOutput = () => {
    setResult(commitmentOutput.commitmentOutputTapscript(flagAssetId, publicKey, isAddLiquidity));
  };

  return (
    <div className="pool-generator-tool-container">
      <h6>Flag Asset Id</h6>
      <Input type="string" value={flagAssetId} onChange={(value: string) => setFlagAssetId(value.replace(/\s/g, ""))} />

      <h6>Public Key</h6>
      <Input type="string" value={publicKey} onChange={(value: string) => setPublicKey(value.replace(/\s/g, ""))} />
      <div style={{ marginTop: "1rem" }}>
        <Checkbox checked={isAddLiquidity} onChange={() => setIsAddLiquidity(!isAddLiquidity)}>
          Is Add Liquidity
        </Checkbox>
      </div>

      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={createCommitmentOutput}>
        Create Commitment Output
      </Button>

      {result && (
        <>
          <Divider className="pool-generator-tool-divider" />

          <h6>Commintment Output</h6>
          <InputGroup>
            <Input value={result.commitmentOutput} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.commitmentOutput || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Testnet address</h6>
          <InputGroup>
            <Input value={result.taprootResult.address.testnet} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Testnet address has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.taprootResult.address.testnet || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Mainnet address</h6>
          <InputGroup>
            <Input value={result.taprootResult.address.mainnet} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Mainnet address has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.taprootResult.address.mainnet || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Script Pubkey</h6>
          <InputGroup>
            <Input value={result.taprootResult.scriptPubkey.hex} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Script Pubkey has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.taprootResult.scriptPubkey.hex || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Control Block</h6>
          <InputGroup>
            <Input value={result.controlBlock} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Control block has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.controlBlock || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </>
      )}
    </div>
  );
};
