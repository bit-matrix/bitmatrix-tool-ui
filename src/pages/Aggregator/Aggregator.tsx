import React from "react";
import { Button, Divider, Input, InputGroup, Tooltip, Whisper } from "rsuite";
import { createPoolTx } from ".";
import CopyIcon from "../../components/Svg/Icons/Copy";

export const Aggreagator = () => {
  const [txId, setTxId] = React.useState<string>("");
  const [result, setResult] = React.useState<any>();

  const run = async () => {
    const res = await createPoolTx(txId);
    setResult(res);
  };

  return (
    <div className="pool-generator-tool-container">
      <h6>Transaction Id </h6>
      <Input type="text" value={txId} onChange={(value: string) => setTxId(value.replace(/\s/g, ""))} />
      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={run}>
        Create
      </Button>

      {result && (
        <div className="pool-generator-tool-result-container">
          <h6>Inputs</h6>
          <InputGroup>
            <Input value={result.inputTemplate} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Inputs has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.inputTemplate || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <Divider className="pool-generator-tool-divider" />

          <h6>Outputs</h6>
          <InputGroup>
            <Input value={result.outputTemplate} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Output template has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.outputTemplate || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <Divider className="pool-generator-tool-divider" />

          <h6>Witness Template</h6>
          <InputGroup>
            <Input value={result.witnessTemplate} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Witness has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.witnessTemplate || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <Divider className="pool-generator-tool-divider" />

          <h6>RAW HEX</h6>
          <InputGroup>
            <Input value={result.rawHex} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Raw hex has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.rawHex || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </div>
      )}
    </div>
  );
};
