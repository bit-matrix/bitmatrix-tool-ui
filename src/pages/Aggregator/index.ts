import { commitmentTxOutputsFragmentation } from "../CommitmentOutputToPoolTool/helper";
import WizData from "@script-wiz/wiz-data";
import { convert32 } from "@script-wiz/lib-core/convertion";

export const createPoolTx = async (txId = "c347a1fbe18c58cbcf8be6b56696e67d3186e4eca9ec53fb3552c5ee0b06d153") => {
  const { cmtOutput1, cmtOutput2, cmtOutput3, methodCall } = await commitmentTxOutputsFragmentation(txId);

  // ------------- INPUTS START -------------
  const version = "02000000";
  const const1 = "01";

  const numberOfInput = methodCall === "03" ? WizData.fromNumber(3) : WizData.fromNumber(2);

  //Input1
  // e87b0c10a3c6b92def81d2cf7b8e7faaaa9a69668ca8c14546b39114fa62d121 //Prev txid
  // 00000000 //vout index
  // 00 //scriptsig (her zaman 0x00)
  // 01000000  //nSequence (her zaman 0x00)

  const input1 = txId + convert32(WizData.fromNumber(cmtOutput1.n)).hex + "00" + "01000000";
  const input2 = txId + convert32(WizData.fromNumber(cmtOutput2.n)).hex + "00" + "01000000";

  let inputs = input1 + input2;

  if (cmtOutput3) {
    const input3 = txId + convert32(WizData.fromNumber(cmtOutput3.n)).hex + "00" + "01000000";
    inputs = inputs + input3;
  }

  const inputTemplate = version + const1 + numberOfInput.hex + inputs;

  console.log(inputTemplate);

  // ------------- INPUTS END -------------
};
