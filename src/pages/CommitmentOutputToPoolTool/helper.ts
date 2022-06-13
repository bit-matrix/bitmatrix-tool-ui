import { api } from "@bitmatrix/lib";
import { TxDetailRPC } from "./models/TxDetailRPC";
import { TxVOutRPC } from "./models/TxVOutRPC";
import WizData, { hexLE } from "@script-wiz/wiz-data";
import { TxVInRPC } from "./models/TxVınRPC";
import { convertion } from "@script-wiz/lib-core";
import axios from "axios";
import { Pool } from "@bitmatrix/models";
import Decimal from "decimal.js";

//const testTxId = "023154e49bd92249d02761e8dd192f32fc31d759e8d83e27b02f274854bf8b49";
const lbtcAssest = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";

export const commitmentTxOutputsFragmentation = async (testTxId: string) => {
  // fetch tx details with rpc
  const rawTransactionHex = await api.getRawTransaction(testTxId);
  const decodedTransaction: TxDetailRPC = await api.decodeRawTransaction(rawTransactionHex);

  //tx outputs
  const outputs: TxVOutRPC[] = decodedTransaction.vout;

  if (outputs.length > 8 && outputs.length < 4) Promise.reject("Outputh length must be smaller than 8 and bigger than 4");
  const outputCount: WizData | undefined = WizData.fromNumber(outputs.length);

  //tx inputs
  const inputs: TxVInRPC[] = decodedTransaction.vin;

  if (inputs.length > 12) Promise.reject("Input length must be smaller than 12");
  const inputCount = WizData.fromNumber(inputs.length);

  const cmtTxInOutpoints = inputs.map((inp) => {
    const vout32Byte = convertion.numToLE32(WizData.fromNumber(inp.vout));
    return inp.txid + vout32Byte.hex;
  });

  const nSequences = inputs.map((inp) => inp.sequence);

  //Every nsequence must equal
  if (nSequences.every((ns) => ns !== nSequences[0])) Promise.reject("Every nSequence must equal");

  const opReturnOutput = outputs[0].scriptPubKey.asm.split(" ");

  if (opReturnOutput[0] !== "OP_RETURN") Promise.reject("First output must be OP_RETURN output");

  const opReturnOutputScriptHex = opReturnOutput[1];

  //poolIdLE (64)
  const poolId = hexLE(opReturnOutputScriptHex.substring(0, 64));

  //methodCall (2)
  const methodCall = opReturnOutputScriptHex.substring(64, 66);

  // public key (66)
  // invalid dedi
  const publicKey = opReturnOutputScriptHex.substring(66, 132);

  // slippageTolerance / amount (16)
  const slippageTolerance = opReturnOutputScriptHex.substring(132, 148);

  //orderingFees (8)
  const orderingFee = opReturnOutputScriptHex.substring(148, 156);

  const cmtOutput1 = outputs[1];
  const cmtOutput2 = outputs[2];

  let changeOutputs: TxVOutRPC[] = [];

  if (methodCall === "01" || methodCall === "02" || methodCall === "04") {
    if (outputCount.number)
      for (let i = 3; i < outputCount.number - 1; i++) {
        changeOutputs.push(outputs[i]);
      }
  }

  let cmtOutput3;

  if (methodCall === "03") {
    cmtOutput3 = outputs[3];
    if (outputCount.number) {
      for (let i = 4; i < outputCount.number - 1; i++) {
        changeOutputs.push(outputs[i]);
      }
    }
  }

  // 6. Commitment out 1 (Calldatadan hemen sonraki output)’in taşıdığı L-BTC değeri 8 byte LE olarak.
  if (cmtOutput1.asset !== lbtcAssest) Promise.reject("Asset must be L-BTC");
  const cmtOutput1Value = convertion.numToLE64(WizData.fromNumber(new Decimal(cmtOutput1.value).mul(100000000).toNumber())).hex;

  //   7. Commitment out 2 (Cmt out 1 hemen sonraki output)’nin taşıdığı asset idsi pair1_asset türünden ise 0x03, pair2_asset türünden ise 0x01.
  const poolReq = await axios.get(`https://rocksdb.basebitmatrix.com/pools/d55c1cffed395dac02042c4e4c8a0bc8aff9bb7a9a75fefec4bfa49aae0c83fb`);
  const poolDetail: Pool = poolReq.data;

  const pair1Asset = poolDetail.quote.asset;

  const pair2Asset = poolDetail.token.asset;

  let output2PairValue = "00";

  if (cmtOutput2.asset === pair2Asset) output2PairValue = "01";
  if (cmtOutput2.asset === pair1Asset) output2PairValue = "03";

  //   8. Commitment out 2 ’in taşıdığı asset değeri 8 byte LE olarak.

  if (cmtOutput2.value === undefined) Promise.reject("Commitment Output Value musn't be confidential.");
  const cmtOutput2Value = convertion.numToLE64(WizData.fromNumber(new Decimal(cmtOutput2.value).mul(100000000).toNumber())).hex;

  //   9. Commitment out 3 ’ün taşıdığı asset id si pair1_asset türünden ise 0x03, pair2_asset türünden ise 0x01. (bu sadece case 3’ de var, eğer başka bir case ise empty 0x)
  //   10. Commitment out 3 ’in taşıdığı asset değeri

  let cmtOutput3PairValue = "00";
  let cmtOutput3Value;
  let cmtOutput3Asset;
  if (methodCall === "03" && cmtOutput3) {
    if (cmtOutput3.asset === pair2Asset) cmtOutput3PairValue = "01";
    if (cmtOutput3.asset === pair1Asset) cmtOutput3PairValue = "03";
    cmtOutput3Value = convertion.numToLE64(WizData.fromNumber(new Decimal(cmtOutput3.value).mul(100000000).toNumber())).hex;
    cmtOutput3Asset = cmtOutput3.asset;
  }

  const seperatedChangeOutputs = changeOutputs.map((co, index) => {
    if (co.asset) {
      return {
        index: index + 1,
        asset: "01" + hexLE(co.asset),
        value: convertion.numToLE64(WizData.fromNumber(new Decimal(co.value).mul(100000000).toNumber())).hex,
        amount: "01" + convertion.numToLE64(WizData.fromNumber(new Decimal(co.value).mul(100000000).toNumber())).hex,
        nonce: "00",
        scriptpubkey: WizData.fromNumber(co.scriptPubKey.hex.length / 2).hex + co.scriptPubKey.hex,
      };
    }

    return {
      index: index + 1,
      asset: co.assetcommitment,
      value: co.valuecommitment,
      amount: co.valuecommitment,
      nonce: co.commitmentnonce,
      scriptpubkey: WizData.fromNumber(co.scriptPubKey.hex.length / 2).hex + co.scriptPubKey.hex,
    };
  });

  const changeOutputFinal = seperatedChangeOutputs.map((cof) => {
    return {
      index: cof.index,
      assetValue: cof.asset + cof.value,
      noncScpkey: cof.nonce + cof.scriptpubkey,
    };
  });

  return {
    outputCount,
    inputCount,
    inputs,
    cmtTxInOutpoints,
    cmtOutput1Value,
    output2PairValue,
    cmtOutput2Value,
    cmtOutput3Value,
    cmtOutput3PairValue,
    cmtOutput3Asset,
    changeOutputFinal,
    seperatedChangeOutputs,
    poolId,
    methodCall,
    publicKey,
    slippageTolerance,
    orderingFee,
  };
};
