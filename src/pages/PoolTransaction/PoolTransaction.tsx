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
      calculations: cof.result,
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
            <Input value={result.calculations.pool_lp_supply} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>LP Liquidity has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.pool_lp_supply || "")}>
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
          {result.method !== "03" ||
            (result.method !== "04" && (
              <>
                <h6>User Supply Total</h6>
                <InputGroup>
                  <Input value={result.calculations.user_supply_total} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>User Supply Total has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_supply_total || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
                <h6>User Supply Lp Fees</h6>
                <InputGroup>
                  <Input value={result.calculations.user_supply_lp_fees} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>User Supply Lp Fees has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_supply_lp_fees || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
                <h6>User Supply Available</h6>
                <InputGroup>
                  <Input value={result.calculations.user_supply_available} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>User Supply Available has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_supply_available || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
                <h6>Constant Coefficient</h6>
                <InputGroup>
                  <Input value={result.calculations.constant_coefficient} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Constant Coefficient has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.constant_coefficient || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
                <Divider className="pool-generator-tool-divider" />
                <h6>Constant Coefficient Downgraded</h6>
                <InputGroup>
                  <Input value={result.calculations.constant_coefficient_downgraded} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Constant Coefficient Downgraded has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.constant_coefficient_downgraded || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
                <Divider className="pool-generator-tool-divider" />
                <h6>Payout additional fees</h6>
                <InputGroup>
                  <Input value={result.calculations.payout_additional_fees} disabled />
                  <Whisper placement="top" trigger="click" speaker={<Tooltip>Payout additional fees has been copied to clipboard!</Tooltip>}>
                    <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.payout_additional_fees || "")}>
                      <CopyIcon width="1rem" height="1rem" />
                    </InputGroup.Button>
                  </Whisper>
                </InputGroup>
              </>
            ))}

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
                <Input value={result.calculations.new_pair_2_pool_liquidity_apx_1} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>New pair 2 pool liquidity apx 1 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.new_pair_2_pool_liquidity_apx_1 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>New pair 2 pool liquidity apx 2 </h6>
              <InputGroup>
                <Input value={result.calculations.new_pair_2_pool_liquidity_apx_2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>New pair 2 pool liquidity apx 2 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.new_pair_2_pool_liquidity_apx_2 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User received pair 2 apx</h6>
              <InputGroup>
                <Input value={result.calculations.user_received_pair_2_apx} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User received pair 2 apx has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_received_pair_2_apx || "")}>
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
                <Input value={result.calculations.new_pair_1_pool_liquidity_apx_1} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>New pair 1 pool liquidity apx 1 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.new_pair_1_pool_liquidity_apx_1 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>New pair 1 pool liquidity apx 2 </h6>
              <InputGroup>
                <Input value={result.calculations.new_pair_1_pool_liquidity_apx_2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>New pair 1 pool liquidity apx 2 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.new_pair_1_pool_liquidity_apx_2 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User received pair 1 apx</h6>
              <InputGroup>
                <Input value={result.calculations.user_received_pair_1_apx} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User received pair 1 apx has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_received_pair_1_apx || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </>
          )}

          {result.method === "01" && (
            <>
              <h6>User received pair 2</h6>
              <InputGroup>
                <Input value={result.calculations.user_received_pair_2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User received pair 2 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_received_pair_2 || "")}>
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
                <Input value={result.calculations.user_received_pair_1} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User received pair 1 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_received_pair_1 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </>
          )}
          <h6>New Pool Pair 1 Liquidity</h6>
          <InputGroup>
            <Input value={result.calculations.new_pool_pair_1_liquidity} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>New Pool Pair 1 has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.new_pool_pair_1_liquidity || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>New Pool Pair 2 Liquidity</h6>
          <InputGroup>
            <Input value={result.calculations.new_pool_pair_2_liquidity} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>New Pool Pair 1 has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.new_pool_pair_2_liquidity || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          {/* <h6>New LP Liquidity</h6>
          <InputGroup>
            <Input value={result.calculations.new_pool_lp_liquidity} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>New LP Liquidity has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.new_pool_lp_liquidity || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup> */}

          {result.method === "03" && (
            <>
              <h6>Old Pool Lp Supply</h6>
              <InputGroup>
                <Input value={result.calculations.pool_lp_supply} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Pool Lp Supply has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.pool_lp_supply || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>New Pool Lp Supply</h6>
              <InputGroup>
                <Input value={result.calculations.new_pool_lp_supply} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>New Pool Lp Supply has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.new_pool_lp_supply || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>Lp Circulation</h6>
              <InputGroup>
                <Input value={result.calculations.lp_circulation} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Lp Circulation has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.lp_circulation || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User Pair 1 Supply Total</h6>
              <InputGroup>
                <Input value={result.calculations.user_pair_1_supply_total} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User Pair 1 Supply Total has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_pair_1_supply_total || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User Pair 2 Supply Total</h6>
              <InputGroup>
                <Input value={result.calculations.user_pair_2_supply_total} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User Pair 2 Supply Total has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_pair_2_supply_total || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User Pair 1 Supply Total Downgraded</h6>
              <InputGroup>
                <Input value={result.calculations.user_pair_1_supply_total_downgraded} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User Pair 1 Supply Total Downgraded has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_pair_1_supply_total_downgraded || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>Mul 1</h6>
              <InputGroup>
                <Input value={result.calculations.mul_1} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Mul 1 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.mul_1 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User Lp Apx 1</h6>
              <InputGroup>
                <Input value={result.calculations.user_lp_apx_1} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User Lp Apx 1 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_lp_apx_1 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User Pair 2 Supply Total Downgraded</h6>
              <InputGroup>
                <Input value={result.calculations.user_pair_2_supply_total_downgraded} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User Pair 2 Supply Total Downgraded has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_pair_2_supply_total_downgraded || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>Mul 2</h6>
              <InputGroup>
                <Input value={result.calculations.mul_2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Mul 2 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.mul_2 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User Lp Apx 2</h6>
              <InputGroup>
                <Input value={result.calculations.user_lp_apx_2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User Lp Apx 2 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_lp_apx_2 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>User Lp Received</h6>
              <InputGroup>
                <Input value={result.calculations.user_lp_received} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User Lp Received has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_lp_received || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </>
          )}
          {result.method === "04" && (
            <>
              <h6>User Lp Supply Total</h6>
              <InputGroup>
                <Input value={result.calculations.user_lp_supply_total} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>User Lp Supply Total has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.user_lp_supply_total || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <Divider />
              <h6>Div 1</h6>
              <InputGroup>
                <Input value={result.calculations.div_1} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Div 1 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.div_1 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>Div 2</h6>
              <InputGroup>
                <Input value={result.calculations.div_2} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Div 2 has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.div_2 || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <Divider />
              <h6>Pair 1 User Redeem</h6>
              <InputGroup>
                <Input value={result.calculations.pair_1_user_redeem} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 1 User Redeem has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.pair_1_user_redeem || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>Pair 2 User Redeem</h6>
              <InputGroup>
                <Input value={result.calculations.pair_2_user_redeem} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 2 User Redeem has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.pair_2_user_redeem || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <Divider />
              <h6>Pair 1 Min Redeem</h6>
              <InputGroup>
                <Input value={result.calculations.pair_1_min_redeem} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 1 Min Redeem has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.pair_1_min_redeem || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <h6>Pair 2 Min Redeem</h6>
              <InputGroup>
                <Input value={result.calculations.pair_2_min_redeem} disabled />
                <Whisper placement="top" trigger="click" speaker={<Tooltip>Pair 2 Min Redeem has been copied to clipboard!</Tooltip>}>
                  <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.calculations.pair_2_min_redeem || "")}>
                    <CopyIcon width="1rem" height="1rem" />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
              <Divider />
            </>
          )}
        </>
      )}
    </div>
  );
};
