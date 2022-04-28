import { craftMultipleRecipientsPset, greedyCoinSelector, UnblindedOutput } from "ldk";
import { AssetHash, confidential, networks, Psbt, script } from "liquidjs-lib";
import { detectProvider, MarinaProvider } from "marina-provider";
import { useEffect, useState } from "react";
import { Button, Input, Loader } from "rsuite";

declare global {
  interface Window {
    marina?: MarinaProvider;
  }
}

export const LdkTool2 = () => {
  const [address, setAddress] = useState<string>("");
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

  const tiero = async () => {
    if (marinaa) {
      const coins = await marinaa.getCoins();

      const changeAddress = await marinaa.getNextChangeAddress();

      // 1. create an empty psbt object
      const pset = new Psbt({ network: networks.testnet });

      // 2. add a custom OP_RETURN output to psbt
      pset.addOutput({
        script: script.compile([script.OPS.OP_RETURN, Buffer.from("hello world", "utf-8")]),
        value: confidential.satoshiToConfidentialValue(0),
        asset: AssetHash.fromHex(networks.testnet.assetHash, false).bytes,
        nonce: Buffer.alloc(0),
      });

      // 3. add P2TR address(es) as recipient(s) to psbt
      const recipients = [
        {
          asset: networks.testnet.assetHash,
          value: 50000,
          //P2TR address
          address: "tex1p8la3943se4gc5kxn664ez6d7zq2q34f8mnsfmcylfjzapsyegvfq73avft",
        },
      ];

      // 4. Serialize as base64 the psbt to be passed to LDK
      const tx = pset.toBase64();

      // 5. Craft the transaction with multiple outputs and add fee & change output to the psbt
      const unsignedTx = craftMultipleRecipientsPset({
        psetBase64: tx,
        unspents: coins as UnblindedOutput[],
        recipients,
        coinSelector: greedyCoinSelector(),
        changeAddressByAsset: (_: string) => changeAddress.confidentialAddress,
        addFee: true,
      });

      // 6. Sign the transaction's inputs with Marina
      const signedTx = await marinaa.signTransaction(unsignedTx);
      // 7. Broadcast the transaction to the network (need to ba added to Marina)
      const finalTx = Psbt.fromBase64(signedTx);
      finalTx.finalizeAllInputs();

      console.log(finalTx.extractTransaction().toHex());
    }
  };

  return (
    <div className="pool-generator-tool-container">
      {loading && <Loader backdrop content="loading..." vertical style={{ zIndex: 999 }} />}
      <h6>Address</h6>
      <Input type="text" value={address} onChange={(value: string) => setAddress(value.replace(/\s/g, ""))} />

      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={tiero}>
        xxx
      </Button>
    </div>
  );
};
