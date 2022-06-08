/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { init } from "@bitmatrix/esplora-api-client";
import { api } from "@bitmatrix/lib";
import { convertion } from "@script-wiz/lib-core";
import { TxDetailRPC } from "./models/TxDetailRPC";
import { TxVInRPC } from "./models/TxVınRPC";
import { TxVOutRPC } from "./models/TxVOutRPC";
import WizData, { hexLE } from "@script-wiz/wiz-data";
import axios from "axios";
import { Pool } from "@bitmatrix/models";

//const testTxId = "d30692c53d6fd85ae594721b5488a8d383e5aae0649194218ce509c0fca9c0eb";
const lbtcAssest = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";

type TxOutsValues = {
  asset: string;
  nonce: string;
};

const commitmentTxFragmentation = async (testTxId: string) => {
  // fetch tx details with esplora
  // const txDetails: TxDetail = await esploraClient.tx(testTxId);
  // fetch tx details with rpc
  const rawTransactionHex = await api.getRawTransaction(testTxId);
  const decodedTransaction: TxDetailRPC = await api.decodeRawTransaction(rawTransactionHex);

  //tx outputs
  const outputs: TxVOutRPC[] = decodedTransaction.vout;

  //tx inputs
  const inputs: TxVInRPC[] = decodedTransaction.vin;

  if (inputs.length > 12) Promise.reject("Input length must be smaller than 12");

  const inputCount = WizData.fromNumber(inputs.length).hex;

  if (outputs.length > 8) Promise.reject("Outputh length must be smaller than 8");
  const outputCount = WizData.fromNumber(outputs.length).hex;

  //asset and nonce values pushed an array
  const txOutValues = outputs.map((out: any) => {
    if (out.asset && out.commitmentnonce === "") {
      return { asset: out.asset, nonce: "" };
    }
    if (out.assetcommitment && out.commitmentnonce) {
      return { asset: out.assetcommitment, nonce: out.commitmentnonce };
    }
  });

  const cmtTxInOutpoints = inputs.map((inp) => {
    const vout32Byte = convertion.numToLE32(WizData.fromNumber(inp.vout));
    return inp.txid + vout32Byte.hex;
  });

  const nSequences = inputs.map((inp) => {
    return inp.sequence;
  });

  //Every nsequence must equal
  if (nSequences.every((ns) => ns !== nSequences[0])) Promise.reject("Every nSequence must equal");
  //First output must be OP_RETURN output
  const opReturnOutput = outputs[0].scriptPubKey.asm.split(" ");

  if (opReturnOutput[0] !== "OP_RETURN") Promise.reject("First output must be OP_RETURN output");

  //poolIdLE + methodCall + publicKey + receivedAmount + config.defaultOrderingFee.hex;

  const opReturnOutputScriptHex = opReturnOutput[1];

  //poolIdLE (64)
  const poolId = hexLE(opReturnOutputScriptHex.substring(0, 64));

  // methodCall (2)
  const methodCall = opReturnOutputScriptHex.substring(64, 66);

  // public key (66)
  // invalid dedi
  const publicKey = opReturnOutputScriptHex.substring(66, 132);

  // slippageTolerance / amount (16)
  const slippageTolerance = opReturnOutputScriptHex.substring(132, 148);

  //orderingFees (8)
  const orderingFee = opReturnOutputScriptHex.substring(148, 156);

  if (outputs[1].asset !== lbtcAssest) Promise.reject("Asset must be L-BTC");

  const commitmentOutput2AssetId = outputs[2].asset;

  const poolReq = await axios.get(`https://rocksdb.basebitmatrix.com/pools/${poolId}`);
  const poolDetail: Pool = poolReq.data;

  const pair1Asset = poolDetail.quote.asset;

  const pair2Asset = poolDetail.token.asset;

  let pairValue = "";

  if (commitmentOutput2AssetId === pair2Asset) pairValue = "01";
  if (commitmentOutput2AssetId === pair1Asset) pairValue = "03";

  // const slippageToleranceNumber = convertion.LE64ToNum(WizData.fromHex(slippageTolerance)).number;

  // const commitmentOutput1Value = new Decimal(outputs[1].value).mul(100000000).toNumber();

  // console.log(outputs[2].asset);
  // console.log(opReturnOutputScriptHex);
  // console.log(poolId);
  // console.log(methodCall);
  // console.log(publicKey);
  // console.log(slippageTolerance);
  // console.log(orderingFees);
  // console.log(commitmentOutput1Value === slippageToleranceNumber);
  //if (commitmentOutput1Value !== slippageToleranceNumber) throw "Commitment Output Value must equal to Slippage Tolerance Number.";

  return {
    outputs,
    inputs,
    txOutValues,
    cmtTxInOutpoints,
    nSequences,
    opReturnOutputScriptHex,
    poolId,
    methodCall,
    publicKey,
    slippageTolerance,
    orderingFee,
    pair1Asset,
    pair2Asset,
    pairValue,
  };
};

export const commitmentStart = (testTxId: string) => {
  init("https://electrs.basebitmatrix.com/");
  commitmentTxFragmentation(testTxId);
};
