import { detectProvider, MarinaProvider } from "marina-provider";
import { useEffect, useState } from "react";
import { Button, Input, Loader } from "rsuite";
import { convertion, commitmentSign, Wallet } from "@bitmatrix/lib";
import { CALL_METHOD, Pool, BmConfig } from "@bitmatrix/models";

declare global {
  interface Window {
    marina?: MarinaProvider;
  }
}

const pool: Pool = {
  id: "d55c1cffed395dac02042c4e4c8a0bc8aff9bb7a9a75fefec4bfa49aae0c83fb",
  quote: { ticker: "L-BTC", name: "Liquid bitcoin", asset: "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49", value: "1000000000" },
  token: { ticker: "USDT", name: "USDT", asset: "f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958", value: "100000000" },
  lp: { ticker: "L-BTC", name: "Liquid bitcoin", asset: "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49", value: "1000000000" },
  initialTx: { txid: "", block_hash: "", block_height: 0 },
  lastSyncedBlock: { block_hash: "", block_height: 0 },
  synced: true,
  bestBlockHeight: 1,
  active: true,
  lastSentPtx: "",
};

const poolConfig: BmConfig = {
  id: "43a2f4ef8ce286e57ab3e39e6da3741382ba542854a1b28231a7a5b8ba337fcd",
  minRemainingSupply: 1000,
  minTokenValue: 50000000,
  baseFee: { number: 650, hex: "" },
  serviceFee: { number: 1200, hex: "" },
  commitmentTxFee: { number: 100, hex: "0000000000000064" },
  defaultOrderingFee: { number: 1, hex: "01000000" },
  fundingOutputAddress: "tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg",
  innerPublicKey: "1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624",
  holderCovenant: {
    scriptpubkey: {
      main: "",
      token: "",
      lp: "",
    },
    controlBlockPrefix: {
      main: "",
      token: "",
      lp: "",
    },
  },
  mainCovenantScript: [],
  maxLeaf: 1,
  recipientValueMinus: 100,
};

export const TestPage = () => {
  const [inputAmount, setInputAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [marinaa, setMarinaa] = useState<MarinaProvider>();

  const checkMarinaInstalled = async (): Promise<boolean> => {
    return detectProvider("marina")
      .then(async (marinaInstance) => {
        const isMarinaActive = await marinaInstance.isEnabled();
        if (!isMarinaActive) {
          setMarinaa(marinaInstance);
          marinaInstance.enable();
        }

        return true;
      })
      .catch(() => {
        window.alert("install marina wallet");
        setLoading(false);
        return false;
      })
      .finally(() => {
        setMarinaa(window.marina);
        setLoading(false);
      });
  };

  useEffect(() => {
    checkMarinaInstalled();
  }, []);

  const signTransaction = async () => {
    if (marinaa) {
      const addressInfo = await marinaa.getNextChangeAddress();
      if (addressInfo.publicKey) {
        const output = convertion.convertForCtx(Number(inputAmount), 0.3, pool, poolConfig, CALL_METHOD.SWAP_QUOTE_FOR_TOKEN);
        console.log("slippage", output.amountWithSlipapge);

        const commitmentTxId = commitmentSign.case1(marinaa as unknown as Wallet, Number(inputAmount), output.amountWithSlipapge, pool, poolConfig, addressInfo.publicKey);
        console.log("commitmentTxId", commitmentTxId);
      }
    }
  };

  return (
    <div className="pool-generator-tool-container">
      {loading && <Loader backdrop content="loading..." vertical style={{ zIndex: 999 }} />}

      <h6>Input Amount</h6>
      <Input type="text" value={inputAmount} onChange={(value: string) => setInputAmount(value.replace(/\s/g, ""))} />

      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={signTransaction}>
        Sign
      </Button>
    </div>
  );
};
