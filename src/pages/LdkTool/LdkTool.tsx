import { fetchAndUnblindUtxos, UnblindedOutput } from "ldk";
import { AddressInterface, detectProvider, MarinaProvider } from "marina-provider";
import { useEffect, useState } from "react";
import { Button, Loader, Table } from "rsuite";
import { Cell, Column, HeaderCell } from "rsuite-table";
import * as ecc from "tiny-secp256k1";

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

  const checkMarinaInstalled = async (): Promise<boolean> => {
    return detectProvider("marina")
      .then(async (marinaInstance) => {
        const isMarinaActive = await marinaInstance.isEnabled();
        if (!isMarinaActive) {
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
        setLoading(false);
      });
  };

  useEffect(() => {
    checkMarinaInstalled();
  }, []);

  const fetchUtxosArray = async () => {
    setLoading(true);
    if (window.marina) {
      const address: AddressInterface[] = await window.marina.getAddresses();

      const utxos = await fetchAndUnblindUtxos(ecc, address, ESPLORA_API_URL);

      setUnblindUtxos(utxos);
      setLoading(false);
    }
  };

  return (
    <div className="pool-generator-tool-container">
      {loading && <Loader backdrop content="loading..." vertical style={{ zIndex: 999 }} />}
      {/* <h6>Address</h6> */}
      {/* <Input type="text" value={address} onChange={(value: string) => setAddress(value.replace(/\s/g, ""))} /> */}
      <Button className="pool-generator-tool-calculate-button" appearance="primary" size="md" onClick={fetchUtxosArray}>
        Fetch UTXO'S
      </Button>

      {unblindUtxos && unblindUtxos.length > 0 && (
        <Table
          height={900}
          data={unblindUtxos}
          onRowClick={(data) => {
            console.log(data);
          }}
        >
          <Column width={400} align="center" fixed>
            <HeaderCell>TxId</HeaderCell>
            <Cell dataKey="txid" />
          </Column>

          <Column width={100} align="center">
            <HeaderCell>Block Height</HeaderCell>
            <Cell dataKey="status.block_height" />
          </Column>

          <Column width={100} align="center">
            <HeaderCell>Value (sats)</HeaderCell>
            <Cell dataKey="unblindData.value" rowData={"ahmet"} />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>AssetId</HeaderCell>
            <Cell>
              {(rowData) => {
                return <span>{rowData.unblindData.asset.toString("hex")}</span>;
              }}
            </Cell>
          </Column>
        </Table>
      )}
    </div>
  );
};
