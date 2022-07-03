import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Input, InputGroup, Loader, Tooltip, Whisper } from "rsuite";
import CopyIcon from "../../components/Svg/Icons/Copy";
import { poolTransaction } from "./helper";
import "./poolTransaction.css";

export const PoolTransaction = () => {
  const [transactionId, setTransactionId] = useState<string>("");
  const [result, setResult] = useState<any>();
  const [load, setLoad] = useState<boolean>(false);

  const navigate = useNavigate();

  const createCommitmentOutput = async () => {
    setLoad(true);

    const cof = await poolTransaction(transactionId);

    setResult({
      errorMessages: cof.errorMessages,
      method: cof.method,
      pool_pair_1_liquidity: cof.pool_pair_1_liquidity,
      pool_pair_2_liquidity: cof.pool_pair_2_liquidity,
      commitmentOutput2AssetId: cof.commitmentOutput2AssetId,
      pair_1_asset_id: cof.pair_1_asset_id,
      pair_2_asset_id: cof.pair_2_asset_id,
      pool_constant: cof.pool_constant,
      pair_1_coefficient: cof.pair_1_coefficient,
      pair_2_coefficient: cof.pair_2_coefficient,
      pool_pair_1_liquidity_downgraded: cof.pool_pair_1_liquidity_downgraded,
      pool_pair_2_liquidity_downgraded: cof.pool_pair_2_liquidity_downgraded,
      pair_1_pool_supply: cof.pair_1_pool_supply,
      pair_2_pool_supply: cof.pair_2_pool_supply,
      user_supply_total: cof.result.user_supply_total,
      user_supply_lp_fees: cof.result.user_supply_lp_fees,
      user_supply_available: cof.result.user_supply_available,
      constant_coefficient: cof.result.constant_coefficient,
      constant_coefficient_downgraded: cof.result.constant_coefficient_downgraded,
      new_pair_2_pool_liquidity_apx_1: cof.result.new_pair_2_pool_liquidity_apx_1,
      new_pair_2_pool_liquidity_apx_2: cof.result.new_pair_2_pool_liquidity_apx_2,
      new_pair_1_pool_liquidity_apx_1: cof.result.new_pair_1_pool_liquidity_apx_1,
      new_pair_1_pool_liquidity_apx_2: cof.result.new_pair_1_pool_liquidity_apx_2,
      user_received_pair_2_apx: cof.result.user_received_pair_2_apx,
      user_received_pair_2: cof.result.user_received_pair_2,
      user_received_pair_1_apx: cof.result.user_received_pair_1_apx,
      user_received_pair_1: cof.result.user_received_pair_1,
      payout_additional_fees: cof.result.payout_additional_fees,
      new_pool_pair_1_liquidity: cof.result.new_pool_pair_1_liquidity,
      new_pool_pair_2_liquidity: cof.result.new_pool_pair_2_liquidity,
      lp_liquidty: cof.lp_liquidty,
      new_lp_liquidty: cof.new_lp_liquidty,
    });

    setLoad(false);
  };

  return (
    <div className="pool-generator-tool-container">
      <h6>Transaction Id</h6>
      <Input type="string" value={transactionId} onChange={(value: string) => setTransactionId(value)} />
      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={createCommitmentOutput}>
        Calculate Transaction
      </Button>

      {load && <Loader size="md" center />}
      {result && (
        <>
          <br />
          <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={() => navigate("/commitmentoutputtopool")}>
            Go To Commitment Output Page
          </Button>
          <Divider className="pool-generator-tool-divider" />
          <h6>Method</h6>
          <InputGroup>
            <Input value={result.method} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Method has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.method || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          {result.errorMessages !== [] &&
            result.errorMessages.map((message: string) => {
              return <h5 className="redText">{message}</h5>;
            })}
          <Divider />
          <h6>Pool Pair 1 Liquidity</h6>
          <InputGroup>
            <Input value={result.pool_pair_1_liquidity} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pool Pair 1 Liquidity has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_pair_1_liquidity || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pool Pair 2 Liquidity</h6>
          <InputGroup>
            <Input value={result.pool_pair_2_liquidity} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pool Pair 2 Liquidity has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_pair_2_liquidity || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>LP Liquidity</h6>
          <InputGroup>
            <Input value={result.lp_liquidty} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>LP Liquidity has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.lp_liquidty || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Commitment Output2 AssetId</h6>
          <InputGroup>
            <Input value={result.commitmentOutput2AssetId} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment Output2 AssetId has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.commitmentOutput2AssetId || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pair 1 Pool Supply</h6>
          <InputGroup>
            <Input value={result.pair_1_pool_supply} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 1 Asset Id has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pair_1_pool_supply || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pair 2 Pool Supply</h6>
          <InputGroup>
            <Input value={result.pair_2_pool_supply} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 1 Asset Id has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pair_2_pool_supply || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pair 1 Asset Id</h6>
          <InputGroup>
            <Input value={result.pair_1_asset_id} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 1 Asset Id has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pair_1_asset_id || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pair 2 Asset Id</h6>
          <InputGroup>
            <Input value={result.pair_2_asset_id} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 2 Asset Id has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pair_2_asset_id || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>User Supply Total</h6>
          <InputGroup>
            <Input value={result.user_supply_total} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>User Supply Total has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_supply_total || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>User Supply Lp Fees</h6>
          <InputGroup>
            <Input value={result.user_supply_lp_fees} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>User Supply Lp Fees has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_supply_lp_fees || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <Divider className="pool-generator-tool-divider" />
          <h6>User Supply Available</h6>
          <InputGroup>
            <Input value={result.user_supply_available} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>User Supply Available has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_supply_available || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Constant Coefficient</h6>
          <InputGroup>
            <Input value={result.constant_coefficient} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Constant Coefficient has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.constant_coefficient || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pair 1 Coefficient</h6>
          <InputGroup>
            <Input value={result.pair_1_coefficient} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 1 Coefficient has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pair_1_coefficient || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pair 2 Coefficient</h6>
          <InputGroup>
            <Input value={result.pair_2_coefficient} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 2 Coefficient has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pair_2_coefficient || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Constant Coefficient Downgraded</h6>
          <InputGroup>
            <Input value={result.constant_coefficient_downgraded} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Constant Coefficient Downgraded has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.constant_coefficient_downgraded || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pool Pair 1 liquidity Downgraded</h6>
          <InputGroup>
            <Input value={result.pool_pair_1_liquidity_downgraded} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pool Pair 1 liquidity Downgraded has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_pair_1_liquidity_downgraded || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <Divider className="pool-generator-tool-divider" />
          <h6>Pool Pair 2 Liquidity Downgraded </h6>
          <InputGroup>
            <Input value={result.pool_pair_2_liquidity_downgraded} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Pool Pair 2 Liquidity Downgraded has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_pair_2_liquidity_downgraded || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6> Pool constant</h6>
          <InputGroup>
            <Input value={result.pool_constant} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip> Pool constant has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_constant || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          {result.method === "01" && (
            <>
              <h6>New pair 2 pool liquidity apx 1</h6>
              <InputGroup>
                <Input value={result.new_pair_2_pool_liquidity_apx_1} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>New pair 2 pool liquidity apx 1 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.new_pair_2_pool_liquidity_apx_1 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>New pair 2 pool liquidity apx 2 </h6>
              <InputGroup>
                <Input value={result.new_pair_2_pool_liquidity_apx_2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>New pair 2 pool liquidity apx 2 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.new_pair_2_pool_liquidity_apx_2 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User received pair 2 apx</h6>
              <InputGroup>
                <Input value={result.user_received_pair_2_apx} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User received pair 2 apx has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_received_pair_2_apx || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </>
          )}
          {result.method === "02" && (
            <>
              <h6>New pair 1 pool liquidity apx 1</h6>
              <InputGroup>
                <Input value={result.new_pair_1_pool_liquidity_apx_1} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>New pair 1 pool liquidity apx 1 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.new_pair_1_pool_liquidity_apx_1 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>New pair 1 pool liquidity apx 2 </h6>
              <InputGroup>
                <Input value={result.new_pair_1_pool_liquidity_apx_2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>New pair 1 pool liquidity apx 2 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.new_pair_1_pool_liquidity_apx_2 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User received pair 1 apx</h6>
              <InputGroup>
                <Input value={result.user_received_pair_1_apx} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User received pair 1 apx has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_received_pair_1_apx || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </>
          )}
          <h6>Payout additional fees</h6>
          <InputGroup>
            <Input value={result.payout_additional_fees} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Payout additional fees has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.payout_additional_fees || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          {result.mathod === "01" && (
            <>
              <h6>User received pair 2</h6>
              <InputGroup>
                <Input value={result.user_received_pair_2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User received pair 2 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_received_pair_2 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </>
          )}
          {result.method === "02" && (
            <>
              <h6>User received pair 1</h6>
              <InputGroup>
                <Input value={result.user_received_pair_1} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User received pair 1 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_received_pair_1 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </>
          )}
          <h6>New Pool Pair 1 Liquidity</h6>
          <InputGroup>
            <Input value={result.new_pool_pair_1_liquidity} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>New Pool Pair 1 has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.new_pool_pair_1_liquidity || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>New Pool Pair 2 Liquidity</h6>
          <InputGroup>
            <Input value={result.new_pool_pair_2_liquidity} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>New Pool Pair 1 has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.new_pool_pair_2_liquidity || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>New LP Liquidity</h6>
          <InputGroup>
            <Input value={result.new_lp_liquidty} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>New LP Liquidity has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.new_lp_liquidty || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </>
      )}
    </div>
  );
};
