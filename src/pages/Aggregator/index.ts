import WizData, { hexLE } from "@script-wiz/wiz-data";

import { poolTransaction } from "../PoolTransaction/helper";
import { convertion, taproot, TAPROOT_VERSION, utils } from "@script-wiz/lib-core";
import { commitmentOutput, pool } from "@bitmatrix/lib";

const lbtcAssetId = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";

export const createPoolTx = async (txId = "c347a1fbe18c58cbcf8be6b56696e67d3186e4eca9ec53fb3552c5ee0b06d153") => {
  const {
    cmtOutput1,
    cmtOutput2,
    cmtOutput3,
    inputCount,
    outputCount,
    publicKey,
    poolId,
    pair_1_coefficient,
    pair_1_asset_id,
    pair_2_asset_id,
    lp_asset_id,
    result,
    leafCount,
    tapTweakedResultPrefix,
    changeOutputFinal,
    cmtOutput1Value,
    cmtOutput2Value,
    cmtOutput3Value,
    orderingFee,
    slippageTolerance,
    methodCall,
    cmtTxInOutpoints,
  } = await poolTransaction(txId);

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
    convertion.numToLE64LE(WizData.fromNumber(result.new_pool_pair_2_liquidity)).hex +
    "00" +
    utils.compactSizeVarInt(tokenCovenantScriptPubkey) +
    tokenCovenantScriptPubkey;
  const output3 =
    "01" +
    hexLE(lp_asset_id) +
    "01" +
    convertion.numToLE64LE(WizData.fromNumber(result.new_pool_lp_liquidity)).hex +
    "00" +
    utils.compactSizeVarInt(lpHolderCovenantScriptPubkey) +
    lpHolderCovenantScriptPubkey;
  const output4 =
    "01" +
    hexLE(pair_1_asset_id) +
    "01" +
    convertion.numToLE64LE(WizData.fromNumber(result.new_pool_pair_1_liquidity)).hex +
    "00" +
    utils.compactSizeVarInt(poolMainCovenantScriptPubkey) +
    poolMainCovenantScriptPubkey;

  // temp
  const serviceFeeOutput = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401" + "00000000000001f4" + "00160014156e0dc932770529a4946433c500611b9ba77871";

  const txFeeOutput = "01499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c1401" + "00000000000001f4" + "0000";

  const locktime = "00000000";

  const outputTemplate = "06" + output1 + output2 + output3 + output4 + serviceFeeOutput + txFeeOutput + locktime;

  // ------------- OUTPUTS END -------------

  // ------------- WITNESS START -------------
  const flagCovenantWitness = "000002";
  const flagCovenantScriptLength = "34";
  const flagCovenantScript = "cd008800c7010088040000000088767651c70100880401000000888852c70100880402000000888853c701008804030000008887";

  const flagCovenantControlBlockLength = "21";
  const flagCovenantControlBlock = "c41dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624";

  const tokenCovenantWitness = "000002";

  const tokenCovenantScript = "20" + hexLE(poolId) + "00c86987";
  const tokenCovenantScriptLength = utils.compactSizeVarInt(tokenCovenantScript);

  // @todo index temp
  const tokenCovenantControlBlock = taproot.controlBlockCalculation(script, "c4", pubkey.hex, 0);
  const tokenCovenantControlBlockLength = utils.compactSizeVarInt(tokenCovenantScript);

  const lpCovenantWitness = "000002";
  const lpCovenantScript = tokenCovenantScript;
  const lpCovenantScriptLength = tokenCovenantScriptLength;
  const lpCovenantControlBlockLength = tokenCovenantControlBlockLength;
  const lpCovenantControlBlock = tokenCovenantControlBlock;

  const mainCovenantWitness = "000000";

  // @todo Number of total main covenant  witness elements (2 + 33*s)

  const numberOfWitnessElements = WizData.fromNumber(2 + 33 * leafCount).hex;

  // ---- SLOT N commitmentoutputtopool fields START ---- (33 witness elements per slot)
  let commitmentoutputtopoolData = "";

  for (let i = 0; i < leafCount; i++) {
    const tweakKeyPrefixLength = "01";
    const locktimeLength = "04";
    const txFeesLength = "09";
    // @todo calculate fees
    const txFees = "010000000000000335";
    const changeOutputSorted = changeOutputFinal.sort((a, b) => b.index - a.index);

    let changeOutputs = "";
    let commitmentOutputs = "";

    if (changeOutputFinal.length === 3) {
      changeOutputSorted.forEach((changeOutput) => {
        changeOutputs += utils.compactSizeVarInt(changeOutput.noncScpkey) + changeOutput.noncScpkey + utils.compactSizeVarInt(changeOutput.assetValue) + changeOutput.assetValue;
      });
    } else if (changeOutputFinal.length === 2) {
      changeOutputSorted.forEach((changeOutput) => {
        changeOutputs += utils.compactSizeVarInt(changeOutput.noncScpkey) + changeOutput.noncScpkey + utils.compactSizeVarInt(changeOutput.assetValue) + changeOutput.assetValue;
      });
    }

    if (cmtOutput3) {
      const cmtData = "09" + cmtOutput3Value + "01" + "01" + "09" + cmtOutput2Value + "01" + WizData.fromNumber(cmtOutput2.n).hex + "09" + cmtOutput1Value;
      commitmentOutputs += cmtData;
    } else {
      const cmtData = "00" + "00" + "09" + cmtOutput2Value + "01" + WizData.fromNumber(cmtOutput2.n).hex + "09" + cmtOutput1Value;
      commitmentOutputs += cmtData;
    }

    const orderingFeeDetails = utils.compactSizeVarInt(orderingFee) + orderingFee;
    const slippageToleranceDetails = utils.compactSizeVarInt(slippageTolerance) + slippageTolerance;
    const receipentPubkeyDetails = utils.compactSizeVarInt(publicKey) + publicKey;
    const methodCallDetails = utils.compactSizeVarInt(methodCall) + methodCall;
    const outputCountDetails = utils.compactSizeVarInt(outputCount.hex) + outputCount.hex;

    let outpoints = "";
    const sortedOutpoints = cmtTxInOutpoints.sort((a, b) => b.index - a.index);

    for (let z = 11; z >= 0; z--) {
      if (sortedOutpoints[z]) {
        outpoints += utils.compactSizeVarInt(sortedOutpoints[z].data) + sortedOutpoints[z].data;
      } else {
        outpoints += "00";
      }
    }

    const inputSequence = "ffffffff";
    const inputSequenceDetails = utils.compactSizeVarInt(inputSequence) + inputSequence;
    const inputCountDetails = utils.compactSizeVarInt(inputCount.hex) + inputCount.hex;

    commitmentoutputtopoolData +=
      tweakKeyPrefixLength +
      tapTweakedResultPrefix +
      locktimeLength +
      txFeesLength +
      txFees +
      commitmentOutputs +
      changeOutputs +
      orderingFeeDetails +
      slippageToleranceDetails +
      receipentPubkeyDetails +
      methodCallDetails +
      outputCountDetails +
      outpoints +
      inputSequenceDetails +
      inputCountDetails;
  }

  let commitmentWitnessFinal = "";
  for (let i = 0; i < leafCount; i++) {
    const mainCovenantScriptDetails = utils.compactSizeVarInt(poolMainCovenant.mainCovenantScript[0]) + poolMainCovenant.mainCovenantScript[0];
    const mainCovenantControlBlockDetails = utils.compactSizeVarInt(poolMainCovenant.controlBlock) + poolMainCovenant.controlBlock;

    const isAddLiquidity = methodCall === "03";
    const poolCommitment = commitmentOutput.commitmentOutputTapscript(poolId, publicKey, isAddLiquidity);

    const commitmentOutputWitness =
      "00000003" +
      "0101" +
      utils.compactSizeVarInt(poolCommitment.commitmentOutput) +
      poolCommitment.commitmentOutput +
      utils.compactSizeVarInt(poolCommitment.controlBlock) +
      poolCommitment.controlBlock;

    let commitmentWitness = "";
    if (isAddLiquidity) {
      commitmentWitness = commitmentOutputWitness.repeat(3);
    } else {
      commitmentWitness = commitmentOutputWitness.repeat(2);
    }

    commitmentWitnessFinal += mainCovenantScriptDetails + mainCovenantControlBlockDetails + commitmentWitness;
  }

  const witnessTemplate =
    flagCovenantWitness +
    flagCovenantScriptLength +
    flagCovenantScript +
    flagCovenantControlBlockLength +
    flagCovenantControlBlock +
    tokenCovenantWitness +
    tokenCovenantScriptLength +
    tokenCovenantScript +
    tokenCovenantControlBlockLength +
    tokenCovenantControlBlock +
    lpCovenantWitness +
    lpCovenantScriptLength +
    lpCovenantScript +
    lpCovenantControlBlockLength +
    lpCovenantControlBlock +
    mainCovenantWitness +
    numberOfWitnessElements +
    commitmentoutputtopoolData +
    commitmentWitnessFinal +
    "000000000000000000000000000000";

  console.log(inputTemplate + outputTemplate + witnessTemplate);
};
