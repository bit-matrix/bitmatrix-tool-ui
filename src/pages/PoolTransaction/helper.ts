import { commitmentTxOutputsFragmentation } from "../CommitmentOutputToPoolTool/helper";
import Decimal from "decimal.js";
import { convertion } from "@script-wiz/lib-core";
import WizData from "@script-wiz/wiz-data";
import { CTXPTXResult } from "./CTXPTXResult";

// export const poolData = {
//   id: "0b427dc1862dc6d658ccd109b8d54cf0dcd8848626c2bdb5e0ddce0f17383ff7",
//   quote: {
//     ticker: "tL-BTC",
//     name: "Liquid Bitcoin",
//     asset: "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49",
//     value: "210537",
//   },
//   token: {
//     ticker: "tL-USDt",
//     name: "Liquid Tether",
//     asset: "f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958",
//     value: "96050000000",
//   },
//   lp: {
//     ticker: "fc65",
//     name: "unknown",
//     asset: "fc65994dc9467dc99f35cbe7382d0adad3519aaade30e023d79d70c41f63a232",
//     value: "1999999196",
//   },
//   initialTx: {
//     txid: "e3094b74a3db4f83b472531d6564a3e94b956c661fe94296d4da22c7a8624415",
//     block_height: 447661,
//     block_hash: "7fa6f90f1b8bfe5c9e5aeecda0441cc2814a9374c73ee9e22f8ed1ec6af4bc35",
//   },
//   unspentTx: {
//     txid: "d9873d3118d5dd08644027b7e2a6abfd035c0470b8c80d99b2fcb042d98b5d0c",
//     block_height: 450143,
//     block_hash: "d9873d3118d5dd08644027b7e2a6abfd035c0470b8c80d99b2fcb042d98b5d0c",
//   },
//   leafCount: 1,
//   pair1_coefficient: 50,
// };

export const poolTransaction = async (transactionId: string) => {
  const cof = await commitmentTxOutputsFragmentation(transactionId);

  const poolData = await (await fetch("https://raw.githubusercontent.com/bit-matrix/bitmatrix-app-config/master/testpool.json")).json();
  const method = cof.methodCall;

  let errorMessages = [];

  let output = {
    assetId: "",
    value: 0,
  };

  let case3outputs = {
    output1: { ...output },
    output2: { ...output },
  };

  let case4outputs = {
    output1: { ...output },
    output2: { ...output },
  };

  const result: CTXPTXResult = {
    new_pool_pair_1_liquidity: 0,
    new_pool_pair_2_liquidity: 0,
    user_supply_total: 0,
    user_supply_lp_fees: 0,
    user_supply_available: 0,
    constant_coefficient: 0,
    constant_coefficient_downgraded: 0,
    new_pair_1_pool_liquidity_apx_1: 0,
    new_pair_1_pool_liquidity_apx_2: 0,
    payout_additional_fees: 0,
    user_received_pair_1_apx: 0,
    user_received_pair_1: 0,
    new_pair_2_pool_liquidity_apx_1: 0,
    new_pair_2_pool_liquidity_apx_2: 0,
    user_received_pair_2_apx: 0,
    user_received_pair_2: 0,
    new_pool_lp_supply: 0,
    pool_lp_supply: Number(poolData.lp.value),
    new_pool_lp_liquidity: Number(poolData.lp.value),
    lp_circulation: 0,
    user_lp_supply_total: 0,
    user_lp_received: 0,
    user_lp_apx_1: 0,
    user_lp_apx_2: 0,
    user_pair_1_supply_total: 0,
    user_pair_2_supply_total: 0,
    user_pair_1_supply_total_downgraded: 0,
    user_pair_2_supply_total_downgraded: 0,
    mul_1: 0,
    mul_2: 0,
    div_1: 0,
    div_2: 0,
    pair_1_user_redeem: 0,
    pair_2_user_redeem: 0,
    pair_1_min_redeem: 0,
    pair_2_min_redeem: 0,
  };

  //const poolId = cof.poolId;

  //get pool
  //const poolReq = await axios.get(`https://rocksdb.basebitmatrix.com/pools/${poolId}`);
  //const poolData = poolReq.data;

  // 1-Havuzun g??ncel pair_1 liquidity miktar??na pool_pair_1_liquidity ismini ver.
  const pool_pair_1_liquidity = Number(poolData.quote.value);

  // 2-Havuzun g??ncel pair_2 liquidity miktar??na pool_pair_2_liquidity ismini ver.
  const pool_pair_2_liquidity = Number(poolData.token.value);

  // transaction outputs
  const commitmentOutputs = cof.outputs;

  //commitment output 2
  const commitmentOutput2 = commitmentOutputs[2];

  // commitment Output2 Asset Id
  const commitmentOutput2AssetId = commitmentOutput2.asset;

  //pool detail rocks db den geldi??i i??in asset, yeni pool modelde asset olacak
  const pair_1_asset_id = poolData.quote.asset;
  const pair_2_asset_id = poolData.token.asset;
  const lp_asset_id = poolData.lp.asset;

  const pair_1_pool_supply = Number(poolData.quote.value);

  const pair_2_pool_supply = Number(poolData.token.value);

  const pair_1_coefficient = poolData.pair1_coefficient;

  const pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pair_1_coefficient;

  //   9-pool_pair_1_liquidity de??erini pair_1_coefficient???a b??l ve sonuca pool_pair_1_liquidity_downgraded ismini ver
  const pool_pair_1_liquidity_downgraded = Math.floor(pool_pair_1_liquidity / pair_1_coefficient);

  // 10-pool_pair_2_liquidity de??erini pair_2_coefficient???a b??l ve sonuca pool_pair_2_liquidity_downgraded ismini ver
  const pool_pair_2_liquidity_downgraded = Math.floor(pool_pair_2_liquidity / pair_2_coefficient);

  // 11-pool_pair_1_liquidity_downgraded ile pool_pair_2_liquidity_downgraded ???I ??arp ve sonuca pool_constant ismini ver.
  const pool_constant = Math.floor(pool_pair_1_liquidity_downgraded * pool_pair_2_liquidity_downgraded);

  if (method === "01") {
    //3-Commitment output 2 asset ID???sinin pair_1_asset_id oldu??unu kontrol et.
    if (commitmentOutput2AssetId !== pair_1_asset_id) errorMessages.push("Commitment Output 2 AssetId must be equal to pair_1_asset_id");

    //   4-Commitment output 2 miktar??na user_supply_total ismini ver.
    result.user_supply_total = new Decimal(commitmentOutput2.value).mul(100000000).toNumber();

    if (result.user_supply_total > pool_pair_1_liquidity) {
      errorMessages.push("Supply overflow");

      output.assetId = pair_1_asset_id;
      output.value = result.user_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    //5- user_supply_total ????? 500???e b??l ve b??l??m sonucu bir tam say?? olarak ele al??p user_supply_lp_fees ismini ver.
    result.user_supply_lp_fees = Math.floor(result.user_supply_total / 500);

    //   6-user_supply_total??? dan user_supply_lp_fees????? ????kar ve sonuca user_supply_available ismini ver.
    result.user_supply_available = Math.floor(result.user_supply_total - result.user_supply_lp_fees);

    //   7-pool_pair_1_liquidity ile user_supply_available???i topla ve sonuca constant_coefficient ismini ver.
    result.constant_coefficient = Math.floor(pool_pair_1_liquidity + result.user_supply_available);

    //   8-constant_coefficient????? pair_1_coefficient ???a b??l ve b??l??m sonucunu bir tam say?? olarak ele al??p constant_coefficient_downgraded ismini ver.

    result.constant_coefficient_downgraded = Math.floor(result.constant_coefficient / pair_1_coefficient);

    // 12-pool_constant de??erini constant_coefficient_downgraded ???e b??l ve sonuca new_pair_2_pool_liquidity_apx_1 ismini ver.
    result.new_pair_2_pool_liquidity_apx_1 = Math.floor(pool_constant / result.constant_coefficient_downgraded);

    // 13-new_pair_2_pool_liquidity_apx_1 de??erini pair_2_coefficient ile ??arp ve sonuca new_pair_2_pool_liquidity_apx_2 ismini ver.
    result.new_pair_2_pool_liquidity_apx_2 = Math.floor(result.new_pair_2_pool_liquidity_apx_1 * pair_2_coefficient);

    // 14-pool_pair_2_liquidity de??erinden new_pair_2_pool_liquidity_apx_2 de??erini ????kar ve sonuca user_received_pair_2_apx ismini ver.
    result.user_received_pair_2_apx = Math.floor(pool_pair_2_liquidity - result.new_pair_2_pool_liquidity_apx_2);

    // 15-pair_2_coefficient de??erini 2 ile ??arp ve sonuca payout_additional_fees ismini ver.
    result.payout_additional_fees = Math.floor(pair_2_coefficient * 2);

    // 16-user_received_pair_2_apx de??erinden payout_additional_fees de??erini ????kar ve sonuca user_received_pair_2 ismini ver.
    result.user_received_pair_2 = Math.floor(result.user_received_pair_2_apx - result.payout_additional_fees);

    if (result.user_received_pair_2 < Math.floor(10 * pair_2_coefficient)) {
      errorMessages.push("Dust payout");

      output.assetId = pair_1_asset_id;
      output.value = result.user_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    if (result.user_received_pair_2 < (convertion.LE64ToNum(WizData.fromHex(cof.slippageTolerance))?.number || 0)) {
      errorMessages.push("Out of slippage");

      output.assetId = pair_1_asset_id;
      output.value = result.user_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    if (errorMessages.length === 0) {
      //SUCCESS
      // ??lgili slot i??in 1 tane settlement output olu??tur. Bu outputun asset ID ???sini pair_2_asset id si olarak ayarla, miktar??n?? da user_received_pair_2 olarak ayarla.
      output = {
        assetId: pair_2_asset_id,
        value: result.user_received_pair_2,
      };

      // pool_pair_1_liquidity de??erine user_supply_total de??erine ekle ve sonuca new_pool_pair_1_liquidity ismini ver. Bu de??eri havuzun g??ncel pair 1 liquidity miktar?? olarak ata.
      result.new_pool_pair_1_liquidity = Math.floor(pool_pair_1_liquidity + result.user_supply_total);

      // pool_pair_2_liquidity de??erinden user_received_pair_2 de??erini ????kar ve sonuca new_pool_pair_2_liquidity ismini ver. Bu de??eri havuzun g??ncel pair 2 liquidity miktar?? olarak ata.
      result.new_pool_pair_2_liquidity = Math.floor(pool_pair_2_liquidity - result.user_received_pair_2);
    }
  } else if (method === "02") {
    // 3- Commitment output 2 asset ID???sinin pair_2_asset_id oldu??unu kontrol et.
    if (commitmentOutput2AssetId !== pair_2_asset_id) errorMessages.push("Commitment Output 2 AssetId must be equal to pair_1_asset_id");

    // 4- Commitment output 2 miktar??na user_supply_total ismini ver.
    result.user_supply_total = new Decimal(commitmentOutput2.value).mul(100000000).toNumber();

    // 5- user_supply_total ????? 500???e b??l ve b??l??m sonucu bir tam say?? olarak ele al??p user_supply_lp_fees ismini ver.
    result.user_supply_lp_fees = Math.floor(result.user_supply_total / 500);

    if (result.user_supply_total > pool_pair_2_liquidity) {
      errorMessages.push("Supply overflow");

      output.assetId = pair_2_asset_id;
      output.value = result.user_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    // 6- user_supply_total ???dan user_supply_lp_fees ????? ????kar ve sonuca user_supply_available ismini ver.
    result.user_supply_available = Math.floor(result.user_supply_total - result.user_supply_lp_fees);

    // 7-pool_pair_2_liquidity ile user_supply_available ???i topla ve sonuca constant_coefficient ismini ver.
    result.constant_coefficient = Math.floor(pool_pair_2_liquidity + result.user_supply_available);

    // 8- constant_coefficient ????? pair_2_coefficient ???a b??l ve b??l??m sonucunu bir tam say?? olarak ele al??p constant_coefficient_downgraded ismini ver.
    result.constant_coefficient_downgraded = Math.floor(result.constant_coefficient / pair_2_coefficient);

    // 12- pool_constant de??erini constant_coefficient_downgraded ???e b??l ve sonuca new_pair_1_pool_liquidity_apx_1 ismini ver

    result.new_pair_1_pool_liquidity_apx_1 = Math.floor(pool_constant / result.constant_coefficient_downgraded);

    // 13- new_pair_1_pool_liquidity_apx_1 de??erini pair_1_coefficient ile ??arp ve sonuca new_pair_1_pool_liquidity_apx_2 ismini ver.
    result.new_pair_1_pool_liquidity_apx_2 = Math.floor(result.new_pair_1_pool_liquidity_apx_1 * pair_1_coefficient);

    // 14- pool_pair_1_liquidity de??erinden new_pair_1_pool_liquidity_apx_2 de??erini ????kar ve sonuca user_received_pair_1_apx ismini ver.
    result.user_received_pair_1_apx = Math.floor(pool_pair_1_liquidity - result.new_pair_1_pool_liquidity_apx_2);

    // 15- pair_1_coefficient de??erini 2 ile ??arp ve sonuca payout_additional_fees ismini ver.
    result.payout_additional_fees = Math.floor(pair_1_coefficient * 2);

    // 16- user_received_pair_1_apx de??erinden payout_additional_fees de??erini ????kar ve sonuca user_received_pair_1 ismini ver.
    result.user_received_pair_1 = Math.floor(result.user_received_pair_1_apx - result.payout_additional_fees);

    if (result.user_received_pair_1 < Math.floor(10 * pair_1_coefficient)) {
      errorMessages.push("Dust payout");

      output.assetId = pair_2_asset_id;
      output.value = result.user_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    if (result.user_received_pair_1 < (convertion.LE64ToNum(WizData.fromHex(cof.slippageTolerance))?.number || 0)) {
      errorMessages.push("Out of slippage");

      output.assetId = pair_2_asset_id;
      output.value = result.user_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    if (errorMessages.length === 0) {
      //SUCCESS
      // ??lgili slot i??in 1 tane settlement output olu??tur. Bu outputun asset ID ???sini pair_1_asset id si olarak ayarla, miktar??n?? da user_received_pair_1 olarak ayarla.
      output = {
        assetId: pair_1_asset_id,
        value: result.user_received_pair_1,
      };

      // pool_pair_2_liquidity de??erine user_supply_total de??erine ekle ve sonuca new_pool_pair_2_liquidity ismini ver. Bu de??eri havuzun g??ncel pair 2 liquidity miktar?? olarak ata.
      result.new_pool_pair_2_liquidity = Math.floor(pool_pair_2_liquidity + result.user_supply_total);

      // pool_pair_1_liquidity de??erinden user_received_pair_1 de??erini ????kar ve sonuca new_pool_pair_1_liquidity ismini ver. Bu de??eri havuzun g??ncel pair 1 liquidity miktar?? olarak ata.
      result.new_pool_pair_1_liquidity = Math.floor(pool_pair_1_liquidity - result.user_received_pair_1);
    }
  } else if (method === "03") {
    //commitment output 3
    const commitmentOutput3 = commitmentOutputs[3];

    // commitment Output2 Asset Id
    const commitmentOutput3AssetId = commitmentOutput3.asset;

    // 4- 2000000000 de??erinden pool_lp_supply de??erini ????kar ve sonuca lp_circulation ismini ver.
    result.lp_circulation = Math.floor(2000000000 - result.pool_lp_supply);

    // 5- Commitment output 2 asset ID???sinin pair_1_asset_id oldu??unu kontrol et.
    if (commitmentOutput2AssetId !== pair_1_asset_id) errorMessages.push("Commitment Output 2 AssetId must be equal to pair_1_asset_id");

    // 6- Commitment output 3 asset ID???sinin pair_2_asset_id oldu??unu kontrol et.
    if (commitmentOutput3AssetId !== pair_2_asset_id) errorMessages.push("Commitment Output 3 AssetId must be equal to pair_2_asset_id");

    // 7-Commitment output 2 miktar??na user_pair_1_supply_total ismini ver.
    result.user_pair_1_supply_total = new Decimal(commitmentOutput2.value).mul(100000000).toNumber();

    // 8- Commitment output 3 miktar??na user_pair_2_supply_total ismini ver.
    result.user_pair_2_supply_total = new Decimal(commitmentOutput3.value).mul(100000000).toNumber();

    // 9-user_pair_1_supply_total de??erini pair_1_coefficient ???a b??l ve sonuca user_pair_1_supply_total_downgraded ismini ver

    result.user_pair_1_supply_total_downgraded = Math.floor(result.user_pair_1_supply_total / pair_1_coefficient);

    // 10-user_pair_1_supply_total_downgraded ile pool_lp_supply de??erini ??arp ve sonuca mul_1 ismini ver.
    //fix:user_pair_1_supply_total_downgraded ile lp_circulation de??erini ??arp ve sonuca mul_1 ismini ver.
    result.mul_1 = Math.floor(result.user_pair_1_supply_total_downgraded * result.lp_circulation);

    // 12-mul_1 de??erini pool_pair_1_liquidity_downgraded de??erine b??l ve sonuca user_lp_apx_1 ismini ver
    result.user_lp_apx_1 = Math.floor(result.mul_1 / pool_pair_1_liquidity_downgraded);

    // 13-user_pair_2_supply_total de??erini pair_2_coefficient ???a b??l ve sonuca user_pair_2_supply_total_downgraded ismini ver.
    result.user_pair_2_supply_total_downgraded = Math.floor(result.user_pair_2_supply_total / pair_2_coefficient);

    // 14-user_pair_2_supply_total_downgraded ile lp_circulation de??erini ??arp ve sonuca mul_2 ismini ver.

    result.mul_2 = Math.floor(result.user_pair_2_supply_total_downgraded * result.lp_circulation);

    // 16-mul_2 de??erini pool_pair_2_liquidity_downgraded de??erine b??l ve sonuca user_lp_apx_2 ismini ver.
    result.user_lp_apx_2 = Math.floor(result.mul_2 / pool_pair_2_liquidity_downgraded);

    // 17-user_lp_apx_1 de??eri ile user_lp_apx_2 de??erini k??yasla, ikisinden hangisi daha k??????k ise bu de??ere user_lp_received ismini ver.
    result.user_lp_received = result.user_lp_apx_1 < result.user_lp_apx_2 ? result.user_lp_apx_1 : result.user_lp_apx_2;

    if (result.user_lp_received < 1) {
      errorMessages.push("Dust LP payout");
      case3outputs.output1.assetId = pair_1_asset_id;
      case3outputs.output1.value = result.user_pair_1_supply_total;
      case3outputs.output2.assetId = pair_2_asset_id;
      case3outputs.output2.value = result.user_pair_2_supply_total;

      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
      result.new_pool_lp_supply = result.pool_lp_supply;
    }

    if (result.user_lp_received < (convertion.LE64ToNum(WizData.fromHex(cof.slippageTolerance))?.number || 0)) {
      errorMessages.push("Out of slippage");
      // ??lgili slot i??in 2 tane settlement output olu??tur. Birinci outputun asset ID ???sini pair_1_asset id olarak, ikinci outputun asset ID???sini ise ise pair_1_asset ID olarak ayarla.
      // Birinci outpunun miktar??n?? user_pair_1_supply_total olarak ayarla.
      // ??kinci outputun miktar??n?? user_pair_2_supply_total olarak ayarla
      // new_pool_pair_1_liquidity = pool_pair_1_liquidity.
      // new_pool_pair_2_liquidity = pool_pair_2_liquidity.

      case3outputs.output1.assetId = pair_1_asset_id;
      case3outputs.output1.value = result.user_pair_1_supply_total;
      case3outputs.output2.assetId = pair_2_asset_id;
      case3outputs.output2.value = result.user_pair_2_supply_total;

      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
      result.new_pool_lp_supply = result.pool_lp_supply;
    }

    if (errorMessages.length === 0) {
      // Success logic???inde:
      // ??lgili slot i??in 1 tane settlement output olu??tur. Bu outputun asset ID ???sini LP asset id si olarak ayarla, miktar??n?? da user_lp_received olarak ayarla.
      // pool_pair_1_liquidity de??erine user_pair_1_supply_total de??erine ekle ve sonuca new_pool_pair_1_liquidity ismini ver. Bu de??eri havuzun g??ncel pair 1 liquidity miktar?? olarak ata.
      // pool_pair_2_liquidity de??erine user_pair_2_supply_total de??erini ekle ve sonuca new_pool_pair_2_liquidity ismini ver. Bu de??eri havuzun g??ncel pair 2 liquidity miktar?? olarak ata.
      // pool_lp_supply de??erinden user_lp_received de??erini ????kar ve sonuca new_pool_lp_supply ismini ver. Bu de??eri havuzun g??ncel lp supply miktar?? olarak ata.

      output.assetId = poolData.lp.asset;
      output.value = result.user_lp_received;
      result.new_pool_pair_1_liquidity = Math.floor(pool_pair_1_liquidity + result.user_pair_1_supply_total);
      result.new_pool_pair_2_liquidity = Math.floor(pool_pair_2_liquidity + result.user_pair_2_supply_total);
      // result.new_pool_lp_liquidity = Math.floor(result.pool_lp_supply - result.user_lp_received);
      result.new_pool_lp_supply = Math.floor(result.pool_lp_supply - result.user_lp_received);
    }
  } else if (method === "04") {
    // 2000000000 de??erinden pool_lp_supply de??erini ????kar ve sonuca lp_circulation ismini ver.
    result.lp_circulation = Math.floor(2000000000 - result.pool_lp_supply);

    // Commitment output 2 asset ID???sinin lp_asset_id oldu??unu kontrol et.
    if (commitmentOutput2AssetId !== lp_asset_id) errorMessages.push("Commitment Output 2 AssetId must be equal to Lp Asset Id");

    // Commitment output 2 miktar??na user_lp_supply_total ismini ver.
    result.user_lp_supply_total = new Decimal(commitmentOutput2.value).mul(100000000).toNumber();

    // user_lp_supply_total ile pool_pair_1_liquidity_downgraded de??erini ??arp ve bu de??eri mul_1 ismini ver.
    result.mul_1 = Math.floor(result.user_lp_supply_total * pool_pair_1_liquidity_downgraded);

    // mul_1 de??erini lp_circulation de??erine b??l ve sonuca div_1 ismini ver.
    result.div_1 = Math.floor(result.mul_1 / result.lp_circulation);

    // div_1 de??eri ile pair_1_coefficient de??erini ??arp ve sonuca pair_1_user_redeem ismini ver.
    result.pair_1_user_redeem = Math.floor(result.div_1 * pair_1_coefficient);

    // user_lp_supply_total ile pool_pair_2_liquidity_downgraded de??erini ??arp ve bu de??eri mul_2 ismini ver.
    result.mul_2 = Math.floor(result.user_lp_supply_total * pool_pair_2_liquidity_downgraded);

    // mul_2 de??erini lp_circulation de??erine b??l ve sonuca div_2 ismini ver.
    result.div_2 = Math.floor(result.mul_2 / result.lp_circulation);

    // div_2 de??eri ile pair_2_coefficient de??erini ??arp ve sonuca pair_2_user_redeem ismini ver.
    result.pair_2_user_redeem = Math.floor(result.div_2 * pair_2_coefficient);

    // 22 ile pair_1_coefficient de??erini ??arp ve bu de??ere pair_1_min_redeem ismini ver.

    result.pair_1_min_redeem = Math.floor(pair_1_coefficient * 10);
    // 22 ile pair_2_coefficient de??erini ??arp ve bu de??ere pair_2_min_redeem ismini ver.
    result.pair_2_min_redeem = Math.floor(pair_2_coefficient * 10);

    // a. pair_1_user_redeem de??eri pair_1_min_redeem de??erinden k??????k ise veya pair_2_user_redeem de??eri pair_2_min_redeem de??erinden k??????k ise ???revert??? logic???ini ??al????t??r. Bu erroru ???Dust LP payout??? olarak etiketle.
    if (result.pair_1_user_redeem < result.pair_1_min_redeem || result.pair_2_user_redeem < result.pair_2_min_redeem) {
      errorMessages.push("Dust LP payout");

      // ??lgili slot i??in 1 tane settlement output olu??tur. Bu outputun asset ID ???sini lp_asset id olarak ayarla ve miktar??n?? da user_lp_supply_total olarak ayarla.
      // new_pool_pair_1_liquidity = pool_pair_1_liquidity (de??i??medi).
      // new_pool_pair_2_liquidity = pool_pair_2_liquidity (de??i??medi).
      // new_pool_lp_supply = pool_lp_supply (de??i??medi).

      output.assetId = lp_asset_id;
      output.value = result.user_lp_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
      result.new_pool_lp_liquidity = result.pool_lp_supply;
      // -------------------TODO-------------------
      // buras?? mastera ge??ince new_pool_lp_supply olarak ge??i??tirilecek result.new_pool_lp_liquidity = result.pool_lp_supply;
    }

    if (errorMessages.length === 0) {
      //       Success logic???inde;
      // ??lgili slot i??in 2 tane settlement output olu??tur.
      // Birinci outputun asset ID sini pair_1_asset_id olarak ayarla, miktar??n?? da pair_1_user_redeem olarak ayarla.
      // ??kinci outputun asset ID sini pair_2_asset_id olarak ayarla, miktar??n?? da pair_2_user_redeem olarak ayarla.
      // pool_pair_1_liquidity de??erinden pair_1_user_redeem de??erini ????kar ve sonuca new_pool_pair_1_liquidity ismini ver. Bu de??eri havuzun g??ncel pair 1 liquidity miktar?? olarak ata.
      // pool_pair_2_liquidity de??erinden pair_2_user_redeem de??erini ????kar ve sonuca new_pool_pair_2_liquidity ismini ver. Bu de??eri havuzun g??ncel pair 2 liquidity miktar?? olarak ata.
      // pool_lp_supply de??erine user_lp_supply_total de??erini ekle ve sonuca new_pool_lp_supply ismini ver. Bu de??eri havuzun g??ncel pair lp supply de??eri olarak ata.
      case4outputs.output1.assetId = pair_1_asset_id;
      case4outputs.output1.value = result.pair_1_user_redeem;
      case4outputs.output2.assetId = pair_2_asset_id;
      case4outputs.output2.value = result.pair_2_user_redeem;

      result.new_pool_pair_1_liquidity = Math.floor(pool_pair_1_liquidity - result.pair_1_user_redeem);
      result.new_pool_pair_2_liquidity = Math.floor(pool_pair_2_liquidity - result.pair_2_user_redeem);
      result.new_pool_lp_liquidity = Math.floor(result.pool_lp_supply + result.user_lp_supply_total);
    }
  }

  return {
    errorMessages,
    method,
    pool_pair_1_liquidity,
    pool_pair_2_liquidity,
    commitmentOutput2AssetId,
    pair_1_asset_id,
    pair_2_asset_id,
    pair_1_pool_supply,
    pair_2_pool_supply,
    pair_1_coefficient,
    pair_2_coefficient,
    pool_pair_1_liquidity_downgraded,
    pool_pair_2_liquidity_downgraded,
    pool_constant,
    result,
    ...cof,
    lp_asset_id,
    leafCount: poolData.leafCount,
    poolData,
    output,
    case3outputs,
    case4outputs,
  };
};
