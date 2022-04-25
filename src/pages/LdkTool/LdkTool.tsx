import { decodePset, greedyCoinSelector, IdentityType, Mnemonic, networks, psetToUnsignedTx, RecipientInterface, UnblindedOutput, walletFromAddresses } from "ldk";
import { detectProvider, MarinaProvider } from "marina-provider";
import { useEffect, useState } from "react";
import { Button, Input, Loader } from "rsuite";
import * as liquidJs from "liquidjs-lib";
import * as ecc from "tiny-secp256k1";
import * as bip39 from "bip39";
import { api } from "@bitmatrix/lib";

declare global {
  interface Window {
    marina?: MarinaProvider;
  }
}

export const ESPLORA_API_URL = "https://electrs.bitmatrix-aggregate.com";

export const LdkTool = () => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [unblindUtxos, setUnblindUtxos] = useState<UnblindedOutput[]>();
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

  // const fetchUtxosArray = async () => {
  //   setLoading(true);
  //   if (window.marina) {
  //     const address: AddressInterface[] = await window.marina.getAddresses();

  //     const utxos = await fetchAndUnblindUtxos(ecc, address, ESPLORA_API_URL);

  //     setUnblindUtxos(utxos);
  //     setLoading(false);
  //   }
  // };

  // const sendTransaction = async () => {
  //   if (marinaa) {
  //     const addrI = await marinaa.getNextAddress();

  //     const changeAddress = (await marinaa.getNextChangeAddress()).confidentialAddress;

  //     // testnet
  //     const wallet = await walletFromAddresses(ecc, [addrI], ESPLORA_API_URL, "testnet");

  //     const recipient: RecipientInterface = {
  //       asset: "f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958",
  //       value: 50000,
  //       address: "tlq1qqgzqu4hlfe9xmqg3kf7kxt0r7rhjpjtt0x84ky4rd7q09uwe5kdd7e86q7yzl559gkw2ujce5gnwn2gxtxu8qecthg9sud7v9",
  //     };

  //     const pset = wallet.sendTx(recipient, greedyCoinSelector(), changeAddress, false);

  //     const recipientIndex = psetToUnsignedTx(pset).outs.findIndex((out) => out.script.equals(liquidJs.address.toOutputScript(recipient.address, networks.testnet)));

  //     const blinded = await sender.blindPset(pset, [recipientIndex], new Map().set(recipientIndex, address.fromConfidential(recipient.address).blindingKey));
  //     const signed = await sender.signPset(blinded);
  //     const txHex = decodePset(signed).finalizeAllInputs().extractTransaction().toHex();

  //     await broadcastTx(txHex);
  //   }
  // };

  const xxx = async () => {
    const sender = new Mnemonic({
      chain: "testnet",
      ecclib: ecc,
      type: IdentityType.Mnemonic,
      opts: {
        mnemonic: "slim armed glide message settle float barely iron omit inherit boring arrive",
      },
    });

    console.log("1");

    const addrI = await sender.getNextAddress();

    console.log("2", addrI);
    const changeAddress = (await sender.getNextChangeAddress()).confidentialAddress;

    console.log("3", changeAddress);

    const wallet = await walletFromAddresses(ecc, [addrI], ESPLORA_API_URL, "testnet");

    console.log(wallet);
    console.log("4");

    const recipient: RecipientInterface = {
      asset: "f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958",
      value: 5000,
      address: "tlq1qqgzqu4hlfe9xmqg3kf7kxt0r7rhjpjtt0x84ky4rd7q09uwe5kdd7e86q7yzl559gkw2ujce5gnwn2gxtxu8qecthg9sud7v9",
    };

    console.log("5");

    const pset = wallet.sendTx(recipient, greedyCoinSelector(), changeAddress, false);

    console.log("6");

    const recipientIndex = psetToUnsignedTx(pset).outs.findIndex((out) => out.script.equals(liquidJs.address.toOutputScript(recipient.address, networks.testnet)));

    console.log("7");
    const blinded = await sender.blindPset(pset, [recipientIndex], new Map().set(recipientIndex, liquidJs.address.fromConfidential(recipient.address).blindingKey));

    console.log("8");
    const signed = await sender.signPset(blinded);

    const txHex = decodePset(signed).finalizeAllInputs().extractTransaction().toHex();
    console.log(txHex);

    api
      .sendRawTransaction(txHex)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="pool-generator-tool-container">
      {loading && <Loader backdrop content="loading..." vertical style={{ zIndex: 999 }} />}
      <h6>Address</h6>
      <Input type="text" value={address} onChange={(value: string) => setAddress(value.replace(/\s/g, ""))} />

      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={xxx}>
        Fetch UTXO'S
      </Button>
      {/* <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={fetchUtxosArray}>
        Fetch UTXO'S
      </Button> */}

      {/* {unblindUtxos && unblindUtxos.length > 0 && (
        <>
          <h6>Unblind utxos : </h6>
          <Table
            height={900}
            data={unblindUtxos}
            onRowClick={(data) => {
              console.log(data);
            }}
          >
            <Column width={550} align="center" resizable>
              <HeaderCell>TxId</HeaderCell>
              <Cell dataKey="txid" />
            </Column>

            <Column width={100} align="center" resizable>
              <HeaderCell>Block Height</HeaderCell>
              <Cell dataKey="status.block_height" />
            </Column>

            <Column width={100} align="center" resizable>
              <HeaderCell>Value (sats)</HeaderCell>
              <Cell dataKey="unblindData.value" rowData={"ahmet"} />
            </Column>
            <Column width={550} align="center" resizable>
              <HeaderCell>AssetId</HeaderCell>
              <Cell>
                {(rowData) => {
                  return <span>{rowData.unblindData.asset.toString("hex")}</span>;
                }}
              </Cell>
            </Column>
          </Table>
        </>
      )} */}
    </div>
  );
};
