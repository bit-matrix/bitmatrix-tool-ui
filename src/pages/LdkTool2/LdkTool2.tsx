import { ChangeAddressFromAssetGetter, craftMultipleRecipientsPset, AssetHash, confidential, networks, Psbt, script, greedyCoinSelector, UnblindedOutput } from "ldk";
import { detectProvider, MarinaProvider } from "marina-provider";
import { useEffect, useState } from "react";
import { Button, Input, Loader } from "rsuite";
import * as ecc from "tiny-secp256k1";
import { inputBlindingDataMap, outPubKeysMap } from "./utils";

declare global {
  interface Window {
    marina?: MarinaProvider;
  }
}

export const LdkTool2 = () => {
  const [address, setAddress] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [marina, setMarinaa] = useState<MarinaProvider>();

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

  const makeAssetChangeGetter =
    (marina: MarinaProvider) =>
    async (assets: Array<string>): Promise<ChangeAddressFromAssetGetter> => {
      const addresses = await Promise.all(assets.map((_) => marina.getNextChangeAddress()));
      return (asset: string) => {
        const index = assets.findIndex((a) => a === asset);
        return addresses[index].confidentialAddress;
      };
    };

  const signTransaction = async () => {
    if (marina) {
      const coins = await marina.getCoins();

      // 1. create an empty psbt object
      const pset = new Psbt({ network: networks.testnet });

      // 2. add a custom OP_RETURN output to psbt
      pset.addOutput({
        script: script.compile([script.OPS.OP_RETURN, Buffer.from(data, "hex")]),
        value: confidential.satoshiToConfidentialValue(0),
        asset: AssetHash.fromHex(networks.testnet.assetHash, false).bytes,
        nonce: Buffer.alloc(0),
      });

      // 3. add P2TR address(es) as recipient(s) to psbt
      const recipients = [
        {
          asset: networks.testnet.assetHash,
          value: 5000,
          //P2TR address
          address,
        },
      ];

      // 4. Serialize as base64 the psbt to be passed to LDK
      const tx = pset.toBase64();

      const makeGetter = makeAssetChangeGetter(marina);
      const changeAddressGetter = await makeGetter([networks.testnet.assetHash]);

      // 5. Craft the transaction with multiple outputs and add fee & change output to the psbt
      const unsignedTx = craftMultipleRecipientsPset({
        psetBase64: tx,
        unspents: coins as UnblindedOutput[],
        recipients,
        coinSelector: greedyCoinSelector(),
        changeAddressByAsset: changeAddressGetter,
        addFee: true,
      });

      // deserialize and inspect the transaction
      const ptx = Psbt.fromBase64(unsignedTx);

      const inputBlindingMap = inputBlindingDataMap(unsignedTx, coins);
      const outputBlindingMap = outPubKeysMap(unsignedTx, [changeAddressGetter(networks.testnet.assetHash), address]);

      await ptx.blindOutputsByIndex(Psbt.ECCKeysGenerator(ecc), inputBlindingMap, outputBlindingMap);

      // 7. Sign the transaction's inputs with Marina
      const signedTx = await marina.signTransaction(ptx.toBase64());

      // 7. Broadcast the transaction to the network (need to ba added to Marina)
      const finalTx = Psbt.fromBase64(signedTx);

      finalTx.finalizeAllInputs();

      const txFinal = await marina.broadcastTransaction(finalTx.extractTransaction().toHex());

      window.open("https://liquid.network/tr/testnet/tx/" + txFinal.txid, "_blank");
    }
  };

  // const disconnectWallet = () => {
  //   if (marinaa) {
  //     marinaa.disable();
  //   }
  // };

  return (
    <div className="pool-generator-tool-container">
      {loading && <Loader backdrop content="loading..." vertical style={{ zIndex: 999 }} />}
      <h6>Address</h6>
      <Input type="text" value={address} onChange={(value: string) => setAddress(value.replace(/\s/g, ""))} />

      <h6>OP_RETURN Script Data (HEX)</h6>
      <Input type="text" value={data} onChange={(value: string) => setData(value.replace(/\s/g, ""))} />

      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={signTransaction}>
        Sign Transaction
      </Button>

      {/* <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={disconnectWallet}>
        Disconnect wallet
      </Button> */}
    </div>
  );
};
