import { AddressInterface, craftMultipleRecipientsPset, greedyCoinSelector, UnblindedOutput } from "ldk";
import { AssetHash, confidential, networks, Psbt, script, address as liquidAddress } from "liquidjs-lib";
import { detectProvider, MarinaProvider } from "marina-provider";
import { useEffect, useState } from "react";
import { Button, Input, Loader } from "rsuite";
import * as ecc from "tiny-secp256k1";

declare global {
  interface Window {
    marina?: MarinaProvider;
  }
}

export const LdkTool2 = () => {
  const [address, setAddress] = useState<string>("");
  const [data, setData] = useState<string>("");
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

  const getBlindingKeyByScript = async (script: string): Promise<string> => {
    try {
      if (marinaa) {
        // get addresses from marina
        const addresses = await marinaa.getAddresses();
        // find the address of the requested script
        let found: AddressInterface | undefined;

        addresses.forEach((addr: AddressInterface) => {
          const currentScript = liquidAddress.toOutputScript(addr.confidentialAddress).toString("hex");
          if (currentScript === script) {
            found = addr;
          }
        });

        if (!found) throw new Error("no blinding key for script " + script);
        return found.blindingPrivateKey;
      }

      return "";
    } catch (e) {
      throw e;
    }
  };

  const signTransaction = async () => {
    if (marinaa) {
      const coins = await marinaa.getCoins();

      const changeAddress = await marinaa.getNextChangeAddress();

      // 1. create an empty psbt object
      const pset = new Psbt({ network: networks.testnet });
      // const x = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0]);

      // console.log(confidential.isUnconfidentialValue(Buffer.from(x)));

      // console.log(confidential.confidentialValueToSatoshi(Buffer.from(x)));

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
          value: 500000,
          //P2TR address
          address,
        },
        // {
        //   asset: networks.testnet.assetHash,
        //   value: 1970,
        //   //P2TR address
        //   address,
        // },
        // {
        //   asset: "f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958",
        //   value: 190500000,
        //   //P2TR address
        //   address,
        // },
      ];

      // We need to be sure if the PSBT has other inputs added by someone else before marina does the funding
      const marinaInputLastIndex = pset.data.inputs.length - 1;
      const marinaOutputLastIndex = pset.data.outputs.length - 1;

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

      // deserialize and inspect the transaction
      const ptx = Psbt.fromBase64(unsignedTx);

      // 6. Blind the marina change output (and unblind marina's input to do so)

      // create a map input index => blinding private key
      // we need this to unblind the utxo data
      const inputBlindingMap = new Map<number, Buffer>();

      const marinaInputs = marinaInputLastIndex === -1 ? ptx.data.inputs : ptx.data.inputs.slice(marinaInputLastIndex + 1);

      marinaInputs.forEach(async (input, index) => {
        const blindPrivateKey = await getBlindingKeyByScript(input!.witnessUtxo!.script.toString("hex"));
        inputBlindingMap.set(index, Buffer.from(blindPrivateKey, "hex"));
      });

      // create a map output index => blinding PUBLIC (!) key
      // this is needed to blind the marina change output
      const outputBlindingMap = new Map<number, Buffer>();

      // we know the last output is the fee output and we need to slice the outputs before that and after the marina last index as well
      const feeOutputIndex = ptx.data.outputs.length - 1;
      const marinaOutputs = marinaOutputLastIndex === -1 ? ptx.data.outputs : ptx.data.outputs.slice(marinaOutputLastIndex + 1, feeOutputIndex - 1);
      marinaOutputs.forEach((_, index) => {
        outputBlindingMap.set(
          index,
          // this is the blinding publick key of the change output for marina
          liquidAddress.fromConfidential(changeAddress.confidentialAddress).blindingKey
        );
      });

      await ptx.blindOutputsByIndex(Psbt.ECCKeysGenerator(ecc), inputBlindingMap, outputBlindingMap);

      console.log("1");
      // 7. Sign the transaction's inputs with Marina
      const signedTx = await marinaa.signTransaction(ptx.toBase64());

      // 7. Broadcast the transaction to the network (need to ba added to Marina)
      const finalTx = Psbt.fromBase64(signedTx);

      finalTx.finalizeAllInputs();

      const txFinal = await marinaa.broadcastTransaction(finalTx.extractTransaction().toHex());

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
