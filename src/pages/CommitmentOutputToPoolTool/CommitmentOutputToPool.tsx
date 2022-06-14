import { useState } from "react";
import { Button, Divider, Input, InputGroup, Loader, Tooltip, Whisper } from "rsuite";
import CopyIcon from "../../components/Svg/Icons/Copy";
import { commitmentTxOutputsFragmentation } from "./helper";

export const CommitmentOutputToPoolTool = () => {
  const [transactionId, setTransactionId] = useState<string>("");
  const [result, setResult] = useState<any>();
  const [load, setLoad] = useState<boolean>(false);

  const createCommitmentOutput = async () => {
    setLoad(true);

    const cof = await commitmentTxOutputsFragmentation(transactionId);
    setResult({
      cmtTxLocktimeByteLength: cof.cmtTxLocktimeByteLength,
      inputs: cof.inputs,
      inputCount: cof.inputCount.hex,
      outputCount: cof.outputCount.hex,
      cmtTxInOutpoints: cof.cmtTxInOutpoints,
      poolId: cof.poolId,
      methodCall: cof.methodCall,
      publicKey: cof.publicKey,
      slippageTolerance: cof.slippageTolerance,
      orderingFee: cof.orderingFee,
      tapTweakedResultPrefix: cof.tapTweakedResultPrefix,
      cmtOutput1Value: cof.cmtOutput1Value,
      output2PairValue: cof.output2PairValue,
      cmtOutput2Value: cof.cmtOutput2Value,
      cmtOutput3Value: cof.cmtOutput3Value,
      cmtOutputFeeHexValue: cof.cmtOutputFeeHexValue,
      cmtOutput3PairValue: cof.cmtOutput3PairValue,
      cmtOutput3Asset: cof.cmtOutput3Asset || "",
      changeOutputFinal: cof.changeOutputFinal,
      seperatedChangeOutputs: cof.seperatedChangeOutputs,
    });

    setLoad(false);
  };

  return (
    <div className="pool-generator-tool-container">
      <h6>Transaction Id</h6>
      <Input type="string" value={transactionId} onChange={(value: string) => setTransactionId(value)} />
      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={createCommitmentOutput}>
        Create Commitment Output To Pool
      </Button>
      {load && <Loader size="md" center />}
      {result && (
        <>
          <Divider className="pool-generator-tool-divider" />
          <div>
            <h5>Input Count</h5>
            <h6>{result.inputCount}</h6>

            <h5>Output Count</h5>
            <h6>{result.outputCount}</h6>

            <h5>Locktime</h5>
            <h6>{result.cmtTxLocktimeByteLength}</h6>

            <h5>Tweaked Key Prefix</h5>
            <h6>{result.tapTweakedResultPrefix}</h6>

            <h5>Commitment Output Fee Value</h5>
            <h6>{result.cmtOutputFeeHexValue}</h6>
          </div>

          <Divider />

          <h5>Commitment Tx Inputs Outpoints</h5>
          {result.cmtTxInOutpoints.map((cmtTxInOutpoint: any, key: number) => {
            return (
              <div key={key}>
                <InputGroup>
                  <Input value={cmtTxInOutpoint} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(cmtTxInOutpoint || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
                <br />
              </div>
            );
          })}

          <Divider />

          <h5>Call Data</h5>
          <h6>Pool Id</h6>
          <InputGroup>
            <Input value={result.poolId} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.poolId || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Method Call</h6>
          <InputGroup>
            <Input value={result.methodCall} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.methodCall || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Public Key</h6>
          <InputGroup>
            <Input value={result.publicKey} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.publicKey || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Slippage Tolerance</h6>
          <InputGroup>
            <Input value={result.slippageTolerance} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.slippageTolerance || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Ordering Fees</h6>
          <InputGroup>
            <Input value={result.orderingFee} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.orderingFee || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <Divider className="pool-generator-tool-divider" />

          <h6>Commitment Output-1 Value</h6>
          <InputGroup>
            <Input value={result.cmtOutput1Value} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.cmtOutput1Value || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Output-2 Pair Value</h6>
          <InputGroup>
            <Input value={result.output2PairValue} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.output2PairValue || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          <h6>Commitment Output-2 Value</h6>
          <InputGroup>
            <Input value={result.cmtOutput2Value} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.cmtOutput2Value || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>

          {result.methodCall === "03" && (
            <>
              <h6>Commitment Output-3 Value</h6>
              <InputGroup>
                <Input value={result.cmtOutput3Value} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.cmtOutput3Value || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>Commitment Output-3 PairValue</h6>
              <InputGroup>
                <Input value={result.cmtOutput3PairValue} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.cmtOutput3PairValue || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>

              <h6>Commitment Output-3 Asset</h6>
              <InputGroup>
                <Input value={result.cmtOutput3Asset} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.cmtOutput3Asset || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </>
          )}
          <br />
          <Divider className="pool-generator-tool-divider" />
          <h5>Change Outputs Concat</h5>
          <Divider className="pool-generator-tool-divider" />

          {result.changeOutputFinal.map((changeOutput: any, key: number) => {
            return (
              <div key={key}>
                <h6>Change Output {changeOutput.index}</h6>

                <h6> Change Output Asset + Value </h6>

                <InputGroup>
                  <Input value={changeOutput.assetValue} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(changeOutput.assetValue || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
                <h6> Change Output Nonce + Script Pub Key</h6>

                <InputGroup>
                  <Input value={changeOutput.noncScpkey} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(changeOutput.noncScpkey || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </div>
            );
          })}
          <br />
          <Divider className="pool-generator-tool-divider" />
          <h5>Final Change Outputs</h5>
          <Divider className="pool-generator-tool-divider" />

          {result.seperatedChangeOutputs.map((seperatedChangeOutput: any, key: number) => {
            return (
              <div key={key}>
                <h6>Final Change Output {seperatedChangeOutput.index}</h6>

                <h6>Change Asset </h6>
                <InputGroup>
                  <Input value={seperatedChangeOutput.asset} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(seperatedChangeOutput.asset || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>

                <h6>Change Amount </h6>
                <InputGroup>
                  <Input value={seperatedChangeOutput.amount} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(seperatedChangeOutput.amount || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>

                <h6>Change Nonce </h6>
                <InputGroup>
                  <Input value={seperatedChangeOutput.nonce} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(seperatedChangeOutput.nonce || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>

                <h6>Change Script Pub Key </h6>
                <InputGroup>
                  <Input value={seperatedChangeOutput.scriptpubkey} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(seperatedChangeOutput.scriptpubkey || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
                <Divider className="pool-generator-tool-divider" />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
