import { api, commitmentOutput } from "@bitmatrix/lib";
import { TxDetailRPC } from "./models/TxDetailRPC";
import { TxVOutRPC } from "./models/TxVOutRPC";
import WizData, { hexLE } from "@script-wiz/wiz-data";
import { TxVInRPC } from "./models/TxVınRPC";
import { convertion } from "@script-wiz/lib-core";
import Decimal from "decimal.js";

const lbtcAssest = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";
const poolDetail = {
  id: "d3ffddaf4e61517bd0a538507d4164a8881edfd38329e0112338fd1894c2c0d1",
  quote: {
    ticker: "tL-BTC",
    name: "Liquid Bitcoin",
    asset: "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49",
    value: "20000000",
  },
  token: {
    ticker: "tL-USDt",
    name: "Liquid Tether",
    asset: "f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958",
    value: "600000000000",
  },
  lp: {
    ticker: "5326",
    name: "unknown",
    asset: "53265881ac18ccc7b0c4e8c5b2238bf05163a7bb1a5a8d0152e32c83d9db035f",
    value: "1999800000",
  },
  initialTx: {
    txid: "e3b6041ef56f481520bb63c111e666640c3d5c2dd4ee735929fc8ae3dc4b26c0",
    block_height: 379558,
    block_hash: "8c11b11e9c59b3ea5819565630a9f19a350ea8eabea0bd975ae1d492ceb898b6",
  },
  lastSyncedBlock: {
    block_height: 381436,
    block_hash: "44340f3f93fd21859b1f4a379d172c95b4214dfd6e639d5b7a9fc6d2b669e5e0",
  },
  bestBlockHeight: 385093,
  synced: false,
  unspentTx: {
    txid: "e3b6041ef56f481520bb63c111e666640c3d5c2dd4ee735929fc8ae3dc4b26c0",
    block_height: 379558,
    block_hash: "8c11b11e9c59b3ea5819565630a9f19a350ea8eabea0bd975ae1d492ceb898b6",
  },
  lastSentPtx: "e3b6041ef56f481520bb63c111e666640c3d5c2dd4ee735929fc8ae3dc4b26c0",
  active: true,
};

export const commitmentTxOutputsFragmentation = async (txId: string) => {
  // fetch tx details with rpc
  const rawTransactionHex: string = await api.getRawTransaction(txId);
  const decodedTransaction: TxDetailRPC = await api.decodeRawTransaction(rawTransactionHex);

  //tx outputs
  const outputs: TxVOutRPC[] = decodedTransaction.vout;

  if (outputs.length > 8 && outputs.length < 4) Promise.reject("Outputh length must be smaller than 8 and bigger than 4");
  const outputCount: WizData = WizData.fromNumber(outputs.length);

  //tx inputs
  const inputs: TxVInRPC[] = decodedTransaction.vin;

  if (inputs.length > 12) Promise.reject("Input length must be smaller than 12");
  const inputCount: WizData = WizData.fromNumber(inputs.length);

  //cmt txin locktime’ı 4_bytes return
  const cmtTxLocktimeByteLength: string = convertion.numToLE32(WizData.fromNumber(decodedTransaction.locktime)).hex;

  const cmtTxInOutpoints = inputs.map((inp, index) => {
    const vout32Byte = convertion.numToLE32(WizData.fromNumber(inp.vout));
    return { index, data: hexLE(inp.txid) + vout32Byte.hex };
  });

  const nSequences = inputs.map((inp) => inp.sequence);

  //Every nsequence must equal
  if (nSequences.every((ns) => ns !== nSequences[0])) Promise.reject("Every nSequence must equal");

  const nsequenceValue: string = nSequences[0].toString(16);

  const opReturnOutput: Array<string> = outputs[0].scriptPubKey.asm.split(" ");

  if (opReturnOutput[0] !== "OP_RETURN") Promise.reject("First output must be OP_RETURN output");

  const opReturnOutputScriptHex: string = opReturnOutput[1];

  //poolIdLE (64)
  const poolId: string = hexLE(opReturnOutputScriptHex.substring(0, 64));

  //methodCall (2)
  const methodCall: string = opReturnOutputScriptHex.substring(64, 66);

  // public key (66)
  const publicKey: string = opReturnOutputScriptHex.substring(66, 132);

  // slippageTolerance / amount (16)
  const slippageTolerance: string = opReturnOutputScriptHex.substring(132, 148);

  //orderingFees (8)
  const orderingFee: string = opReturnOutputScriptHex.substring(148, 156);

  const cmtOutput1 = outputs[1];
  const cmtOutput2 = outputs[2];

  let changeOutputs: TxVOutRPC[] = [];

  let cmtOutput3;

  if (outputCount.number) {
    let i = 3;
    if (methodCall === "03") {
      i = 4;
      cmtOutput3 = outputs[3];
    }
    for (i; i < outputCount.number - 1; i++) {
      changeOutputs.push(outputs[i]);
    }
  }

  // 6. Commitment out 1 (Calldatadan hemen sonraki output)’in taşıdığı L-BTC değeri 8 byte LE olarak.
  if (cmtOutput1.asset !== lbtcAssest) Promise.reject("Asset must be L-BTC");

  const cmtOutput1Value = "01" + convertion.numToLE64LE(WizData.fromNumber(new Decimal(cmtOutput1.value).mul(100000000).toNumber())).hex;

  //   7. Commitment out 2 (Cmt out 1 hemen sonraki output)’nin taşıdığı asset idsi pair1_asset türünden ise 0x03, pair2_asset türünden ise 0x01.
  //const poolReq = await axios.get(`https://rocksdb.basebitmatrix.com/pools/${poolId}`);
  //const poolDetail: Pool = poolReq.data;

  const pair1Asset = poolDetail.quote.asset;

  const pair2Asset = poolDetail.token.asset;

  let output2PairValue = "00";

  if (cmtOutput2.asset === pair2Asset) output2PairValue = "01";
  if (cmtOutput2.asset === pair1Asset) output2PairValue = "03";

  //   8. Commitment out 2 ’in taşıdığı asset değeri 8 byte LE olarak.

  if (cmtOutput2.value === undefined) Promise.reject("Commitment Output Value musn't be confidential.");
  const cmtOutput2Value = "01" + convertion.numToLE64LE(WizData.fromNumber(new Decimal(cmtOutput2.value).mul(100000000).toNumber())).hex;

  //   9. Commitment out 3 ’ün taşıdığı asset id si pair1_asset türünden ise 0x03, pair2_asset türünden ise 0x01. (bu sadece case 3’ de var, eğer başka bir case ise empty 0x)
  //   10. Commitment out 3 ’in taşıdığı asset değeri

  let cmtOutput3PairValue = "00";
  let cmtOutput3Value;
  let cmtOutput3Asset;

  if (methodCall === "03" && cmtOutput3) {
    if (cmtOutput3.asset === pair2Asset) cmtOutput3PairValue = "01";
    if (cmtOutput3.asset === pair1Asset) cmtOutput3PairValue = "03";
    cmtOutput3Value = "01" + convertion.numToLE64LE(WizData.fromNumber(new Decimal(cmtOutput3.value).mul(100000000).toNumber())).hex;
    cmtOutput3Asset = cmtOutput3.asset;
  }

  //cmt tx’in fee miktarı 8_bytes olacak
  const outputsLength: number = outputCount.number!;
  const cmtOutputFeeValue: number = outputs[outputsLength - 1].value || 0;

  const cmtOutputFeeHexValue = "01" + convertion.numToLE64LE(WizData.fromNumber(new Decimal(cmtOutputFeeValue).mul(100000000).toNumber())).hex;

  const seperatedChangeOutputs = changeOutputs.map((co, index) => {
    if (co.asset) {
      return {
        index: index + 1,
        asset: "01" + hexLE(co.asset),
        value: "01" + hexLE(convertion.numToLE64(WizData.fromNumber(new Decimal(co.value).mul(100000000).toNumber())).hex),
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

  let isAddLiquidity: boolean = false;
  let commitmentOutputResult: any = undefined;

  commitmentOutputResult = commitmentOutput.commitmentOutputTapscript(poolId, publicKey, isAddLiquidity);
  const tapTweakedResult = commitmentOutputResult.taprootResult.tweak.hex;
  const tapTweakedResultPrefix = tapTweakedResult.substring(0, 2);

  return {
    tapTweakedResultPrefix,
    cmtTxLocktimeByteLength,
    outputCount,
    inputCount,
    inputs,
    outputs,
    nsequenceValue,
    cmtTxInOutpoints,
    cmtOutput1Value,
    output2PairValue,
    cmtOutput2Value,
    cmtOutput3Value,
    cmtOutputFeeHexValue,
    cmtOutput3PairValue,
    cmtOutput3Asset,
    changeOutputFinal,
    seperatedChangeOutputs,
    poolId,
    methodCall,
    publicKey,
    slippageTolerance,
    orderingFee,
    cmtOutput1,
    cmtOutput2,
    cmtOutput3,
  };
};
