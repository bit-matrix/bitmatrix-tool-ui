import { useState } from "react";
import { Button, Divider, Input, InputGroup, Tooltip, Whisper } from "rsuite";
import CopyIcon from "../../components/Svg/Icons/Copy";
import { commitmentStart } from "./helper";

export const CommitmentOutputToPoolTool = () => {
  const [transactionId, setTransactionId] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [isAddLiquidity, setIsAddLiquidity] = useState<boolean>(false);
  const [result, setResult] = useState<any>();

  const createCommitmentOutput = () => {
    const x = commitmentStart(transactionId);
    console.log(x);
    setResult({ poolId: "", methodCall: "", publicKey: "", slippageTolerance: "", orderingFees: "" });
  };

  return (
    <div className="pool-generator-tool-container">
      <h6>Transaction Id</h6>
      <Input type="string" value={transactionId} onChange={(value: string) => setTransactionId(value)} />
      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={createCommitmentOutput}>
        Create Commitment Output To Pool
      </Button>

      {result && (
        <>
          <Divider className="pool-generator-tool-divider" />

          <h6>Pool Id</h6>
          <InputGroup>
            <Input value={result.poolId} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.commitmentOutput || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Method Call</h6>
          <InputGroup>
            <Input value={result.methodCall} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.commitmentOutput || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Public Key</h6>
          <InputGroup>
            <Input value={result.publicKey} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.commitmentOutput || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Slippage Tolerance</h6>
          <InputGroup>
            <Input value={result.slippageTolerance} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.commitmentOutput || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Ordering Fees</h6>
          <InputGroup>
            <Input value={result.orderingFees} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.commitmentOutput || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </>
      )}
    </div>
  );
};
