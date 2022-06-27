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
      pool_pair_1_liquidity: cof.pool_pair_1_liquidity,
      pool_pair_2_liquidity: cof.pool_pair_2_liquidity,
      commitmentOutput2AssetId: cof.commitmentOutput2AssetId,
      pair_1_asset_id: cof.pair_1_asset_id,
      user_supply_total: cof.user_supply_total,
      user_supply_lp_fees: cof.user_supply_lp_fees,
      user_supply_available: cof.user_supply_available,
      constant_coefficient: cof.constant_coefficient,
      pair_1_coefficient: cof.pair_1_coefficient,
      pair_2_coefficient: cof.pair_2_coefficient,
      constant_coefficient_downgraded: cof.constant_coefficient_downgraded,
      pool_pair_1_liquidity_downgraded: cof.pool_pair_1_liquidity_downgraded,
      pool_pair_2_liquidity_downgraded: cof.pool_pair_2_liquidity_downgraded,
      pool_constant: cof.pool_constant,
      new_pair_2_pool_liquidity_apx_1: cof.new_pair_2_pool_liquidity_apx_1,
      new_pair_2_pool_liquidity_apx_2: cof.new_pair_2_pool_liquidity_apx_2,
      user_received_pair_2_apx: cof.user_received_pair_2_apx,
      payout_additional_fees: cof.payout_additional_fees,
      user_received_pair_2: cof.user_received_pair_2,
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
          {result.errorMessages !== [] &&
            result.errorMessages.map((message: string) => {
              return <h5 className="redText">{message}</h5>;
            })}
          <Divider />
          <h5>Pool Pair 1 Liquidity</h5>
          <InputGroup>
            <Input value={result.pool_pair_1_liquidity} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_pair_1_liquidity || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <Divider />
          <h6>Pool Pair 2 Liquidity</h6>
          <InputGroup>
            <Input value={result.pool_pair_2_liquidity} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_pair_2_liquidity || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Commitment Output2 AssetId</h6>
          <InputGroup>
            <Input value={result.commitmentOutput2AssetId} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.commitmentOutput2AssetId || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pair 1 Asset Id</h6>
          <InputGroup>
            <Input value={result.pair_1_asset_id} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pair_1_asset_id || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>User Supply Total</h6>
          <InputGroup>
            <Input value={result.user_supply_total} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_supply_total || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>User Supply Lp Fees</h6>
          <InputGroup>
            <Input value={result.user_supply_lp_fees} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_supply_lp_fees || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <Divider className="pool-generator-tool-divider" />
          <h6>User Supply Available</h6>
          <InputGroup>
            <Input value={result.user_supply_available} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_supply_available || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Constant Coefficient</h6>
          <InputGroup>
            <Input value={result.constant_coefficient} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.constant_coefficient || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pair 1 Coefficient</h6>
          <InputGroup>
            <Input value={result.pair_1_coefficient} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pair_1_coefficient || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pair 2 Coefficient</h6>
          <InputGroup>
            <Input value={result.pair_2_coefficient} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pair_2_coefficient || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Constant Coefficient Downgraded</h6>
          <InputGroup>
            <Input value={result.constant_coefficient_downgraded} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.constant_coefficient_downgraded || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>Pool Pair 1 liquidity Downgraded</h6>
          <InputGroup>
            <Input value={result.pool_pair_1_liquidity_downgraded} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_pair_1_liquidity_downgraded || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <Divider className="pool-generator-tool-divider" />
          <h6>Pool Pair 2 Liquidity Downgraded </h6>
          <InputGroup>
            <Input value={result.pool_pair_2_liquidity_downgraded} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_pair_2_liquidity_downgraded || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6> pool constant</h6>
          <InputGroup>
            <Input value={result.pool_constant} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.pool_constant || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>New pair 2 pool liquidity apx 1</h6>
          <InputGroup>
            <Input value={result.new_pair_2_pool_liquidity_apx_1} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.new_pair_2_pool_liquidity_apx_1 || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>new pair 2 pool liquidity apx 2 </h6>
          <InputGroup>
            <Input value={result.new_pair_2_pool_liquidity_apx_2} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.new_pair_2_pool_liquidity_apx_2 || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>user received pair 2 apx</h6>
          <InputGroup>
            <Input value={result.user_received_pair_2_apx} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_received_pair_2_apx || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>payout additional fees</h6>
          <InputGroup>
            <Input value={result.payout_additional_fees} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.payout_additional_fees || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
          <h6>user received pair 2</h6>
          <InputGroup>
            <Input value={result.user_received_pair_2} disabled />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Commitment output has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={() => navigator.clipboard.writeText(result.user_received_pair_2 || "")}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </>
      )}
    </div>
  );
};
