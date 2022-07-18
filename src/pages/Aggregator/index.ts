import WizData, { hexLE } from "@script-wiz/wiz-data";

import { poolTransaction } from "../PoolTransaction/helper";
import { convertion, taproot, TAPROOT_VERSION, utils } from "@script-wiz/lib-core";
import { pool } from "@bitmatrix/lib";

const lbtcAssetId = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";

export const createPoolTx = async (txId = "c347a1fbe18c58cbcf8be6b56696e67d3186e4eca9ec53fb3552c5ee0b06d153") => {
  const { cmtOutput1, cmtOutput2, cmtOutput3, inputCount, outputCount, publicKey, poolId, pair_1_coefficient, pair_1_asset_id, pair_2_asset_id, lp_asset_id, result } =
    await poolTransaction(txId);

  // ------------- INPUTS START -------------
  const version = "02000000";
  const const1 = "01";

  const input1 = txId + convertion.convert32(WizData.fromNumber(cmtOutput1.n)).hex + "00" + "01000000";
  const input2 = txId + convertion.convert32(WizData.fromNumber(cmtOutput2.n)).hex + "00" + "01000000";

  let inputs = input1 + input2;

  if (cmtOutput3) {
    const input3 = txId + convertion.convert32(WizData.fromNumber(cmtOutput3.n)).hex + "00" + "01000000";
    inputs = inputs + input3;
  }

  const inputTemplate = version + const1 + inputCount.hex + inputs;

  console.log(inputTemplate);

  // ------------- INPUTS END -------------

  // ------------- OUTPUTS START -------------

  const script = [WizData.fromHex("20" + hexLE(poolId) + "00c86987")];
  const pubkey = WizData.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");

  // leaf count and current index temp
  const poolMainCovenant = pool.createCovenants(0, 0, poolId, pair_1_coefficient);

  const flagCovenantScriptPubkey = "512070d3017ab2a8ae4cccdb0537a45fb4a3192bff79c49cf54bd9edd508dcc93f55";
  const tokenCovenantScriptPubkey = taproot.tapRoot(pubkey, script, TAPROOT_VERSION.LIQUID).scriptPubkey.hex;
  const lpHolderCovenantScriptPubkey = tokenCovenantScriptPubkey;
  const poolMainCovenantScriptPubkey = poolMainCovenant.taprootResult.scriptPubkey.hex;

  const output1 = "01" + hexLE(lbtcAssetId) + "01" + "0000000000000001" + "00" + utils.compactSizeVarInt(flagCovenantScriptPubkey) + flagCovenantScriptPubkey;
  const output2 =
    "01" +
    hexLE(pair_2_asset_id) +
    "01" +
    +convertion.numToLE64LE(WizData.fromNumber(result.new_pool_pair_2_liquidity)).hex +
    "00" +
    utils.compactSizeVarInt(tokenCovenantScriptPubkey) +
    tokenCovenantScriptPubkey;
  const output3 =
    "01" +
    hexLE(lp_asset_id) +
    "01" +
    convertion.numToLE64LE(WizData.fromNumber(result.new_pool_lp_liquidity)).hex +
    +"00" +
    utils.compactSizeVarInt(lpHolderCovenantScriptPubkey) +
    lpHolderCovenantScriptPubkey;
  const output4 =
    "01" +
    hexLE(pair_1_asset_id) +
    "01" +
    convertion.numToLE64LE(WizData.fromNumber(result.new_pool_pair_1_liquidity)).hex +
    +"00" +
    utils.compactSizeVarInt(poolMainCovenantScriptPubkey) +
    poolMainCovenantScriptPubkey;

  // temp
  const serviceFeeOutput = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401" + "00000000000001f4" + "00160014156e0dc932770529a4946433c500611b9ba77871";

  const txFeeOutput = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401" + "00000000000001f4" + "0000";

  const locktime = "00000000";

  const outputTemplate = "06" + output1 + output2 + output3 + output4 + serviceFeeOutput + txFeeOutput + locktime;

  // ------------- OUTPUTS END -------------
};
