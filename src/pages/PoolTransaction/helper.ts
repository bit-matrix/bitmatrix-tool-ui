import { commitmentTxOutputsFragmentation } from "../CommitmentOutputToPoolTool/helper";
import Decimal from "decimal.js";
import { convertion } from "@script-wiz/lib-core";
import WizData from "@script-wiz/wiz-data";
import { CTXPTXResult } from "./CTXPTXResult";

export const poolData = {
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
  leafCount: 1,
};

export const poolTransaction = async (transactionId: string) => {
  const cof = await commitmentTxOutputsFragmentation(transactionId);
  const method = cof.methodCall;

  let errorMessages = [];

  let output = {
    assetId: "",
    value: 0,
  };

  let case3outputs = {
    output1: output,
    output2: output,
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
    pool_lp_supply: Number(poolData.lp.value),
    new_pool_lp_liquidity: Number(poolData.lp.value),
    lp_circulation: 0,
    user_lp_received: 0,
    user_lp_apx_1: 0,
    user_lp_apx_2: 0,
    user_pair_1_supply_total: 0,
    user_pair_2_supply_total: 0,
    user_pair_1_supply_total_downgraded: 0,
    user_pair_2_supply_total_downgraded: 0,
    mul_1: 0,
    mul_2: 0,
  };

  //const poolId = cof.poolId;

  //get pool
  //const poolReq = await axios.get(`https://rocksdb.basebitmatrix.com/pools/${poolId}`);
  //const poolData = poolReq.data;

  // 1-Havuzun güncel pair_1 liquidity miktarına pool_pair_1_liquidity ismini ver.
  const pool_pair_1_liquidity = Number(poolData.quote.value);

  // 2-Havuzun güncel pair_2 liquidity miktarına pool_pair_2_liquidity ismini ver.
  const pool_pair_2_liquidity = Number(poolData.token.value);

  // transaction outputs
  const commitmentOutputs = cof.outputs;

  //commitment output 2
  const commitmentOutput2 = commitmentOutputs[2];

  // commitment Output2 Asset Id
  const commitmentOutput2AssetId = commitmentOutput2.asset;

  //pool detail rocks db den geldiği için asset, yeni pool modelde assetHash olacak
  const pair_1_asset_id = poolData.quote.asset;
  const pair_2_asset_id = poolData.token.asset;
  const lp_asset_id = poolData.lp.asset;

  const pair_1_pool_supply = Number(poolData.quote.value);

  const pair_2_pool_supply = Number(poolData.token.value);

  const pair_1_coefficient = 20;

  const pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pair_1_coefficient;

  //   9-pool_pair_1_liquidity değerini pair_1_coefficient’a böl ve sonuca pool_pair_1_liquidity_downgraded ismini ver
  const pool_pair_1_liquidity_downgraded = Math.floor(pool_pair_1_liquidity / pair_1_coefficient);

  // 10-pool_pair_2_liquidity değerini pair_2_coefficient’a böl ve sonuca pool_pair_2_liquidity_downgraded ismini ver
  const pool_pair_2_liquidity_downgraded = Math.floor(pool_pair_2_liquidity / pair_2_coefficient);

  // 11-pool_pair_1_liquidity_downgraded ile pool_pair_2_liquidity_downgraded ‘I çarp ve sonuca pool_constant ismini ver.
  const pool_constant = Math.floor(pool_pair_1_liquidity_downgraded * pool_pair_2_liquidity_downgraded);

  if (method === "01") {
    //3-Commitment output 2 asset ID’sinin pair_1_asset_id olduğunu kontrol et.
    if (commitmentOutput2AssetId !== pair_1_asset_id) errorMessages.push("Commitment Output 2 AssetId must be equal to pair_1_asset_id");

    //   4-Commitment output 2 miktarına user_supply_total ismini ver.
    result.user_supply_total = new Decimal(commitmentOutput2.value).mul(100000000).toNumber();

    if (result.user_supply_total > pool_pair_1_liquidity) {
      errorMessages.push("Supply overflow");

      output.assetId = pair_1_asset_id;
      output.value = result.user_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    //5- user_supply_total ‘ı 500’e böl ve bölüm sonucu bir tam sayı olarak ele alıp user_supply_lp_fees ismini ver.
    result.user_supply_lp_fees = Math.floor(result.user_supply_total / 500);

    //   6-user_supply_total’ dan user_supply_lp_fees’ı çıkar ve sonuca user_supply_available ismini ver.
    result.user_supply_available = Math.floor(result.user_supply_total - result.user_supply_lp_fees);

    //   7-pool_pair_1_liquidity ile user_supply_available’i topla ve sonuca constant_coefficient ismini ver.
    result.constant_coefficient = Math.floor(pool_pair_1_liquidity + result.user_supply_available);

    //   8-constant_coefficient’ı pair_1_coefficient ’a böl ve bölüm sonucunu bir tam sayı olarak ele alıp constant_coefficient_downgraded ismini ver.

    result.constant_coefficient_downgraded = Math.floor(result.constant_coefficient / pair_1_coefficient);

    // 12-pool_constant değerini constant_coefficient_downgraded ‘e böl ve sonuca new_pair_2_pool_liquidity_apx_1 ismini ver.
    result.new_pair_2_pool_liquidity_apx_1 = Math.floor(pool_constant / result.constant_coefficient_downgraded);

    // 13-new_pair_2_pool_liquidity_apx_1 değerini pair_2_coefficient ile çarp ve sonuca new_pair_2_pool_liquidity_apx_2 ismini ver.
    result.new_pair_2_pool_liquidity_apx_2 = Math.floor(result.new_pair_2_pool_liquidity_apx_1 * pair_2_coefficient);

    // 14-pool_pair_2_liquidity değerinden new_pair_2_pool_liquidity_apx_2 değerini çıkar ve sonuca user_received_pair_2_apx ismini ver.
    result.user_received_pair_2_apx = Math.floor(pool_pair_2_liquidity - result.new_pair_2_pool_liquidity_apx_2);

    // 15-pair_2_coefficient değerini 2 ile çarp ve sonuca payout_additional_fees ismini ver.
    result.payout_additional_fees = Math.floor(pair_2_coefficient * 2);

    // 16-user_received_pair_2_apx değerinden payout_additional_fees değerini çıkar ve sonuca user_received_pair_2 ismini ver.
    result.user_received_pair_2 = Math.floor(result.user_received_pair_2_apx - result.payout_additional_fees);

    if (result.user_received_pair_2 < Math.floor(22 * pair_2_coefficient)) {
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
      // İlgili slot için 1 tane settlement output oluştur. Bu outputun asset ID ‘sini pair_2_asset id si olarak ayarla, miktarını da user_received_pair_2 olarak ayarla.
      output = {
        assetId: pair_2_asset_id,
        value: result.user_received_pair_2,
      };

      // pool_pair_1_liquidity değerine user_supply_total değerine ekle ve sonuca new_pool_pair_1_liquidity ismini ver. Bu değeri havuzun güncel pair 1 liquidity miktarı olarak ata.
      result.new_pool_pair_1_liquidity = Math.floor(pool_pair_1_liquidity + result.user_supply_total);

      // pool_pair_2_liquidity değerinden user_received_pair_2 değerini çıkar ve sonuca new_pool_pair_2_liquidity ismini ver. Bu değeri havuzun güncel pair 2 liquidity miktarı olarak ata.
      result.new_pool_pair_2_liquidity = Math.floor(pool_pair_2_liquidity - result.user_received_pair_2);
    }
  } else if (method === "02") {
    // 3- Commitment output 2 asset ID’sinin pair_2_asset_id olduğunu kontrol et.
    if (commitmentOutput2AssetId !== pair_2_asset_id) errorMessages.push("Commitment Output 2 AssetId must be equal to pair_1_asset_id");

    // 4- Commitment output 2 miktarına user_supply_total ismini ver.
    result.user_supply_total = new Decimal(commitmentOutput2.value).mul(100000000).toNumber();

    // 5- user_supply_total ‘ı 500’e böl ve bölüm sonucu bir tam sayı olarak ele alıp user_supply_lp_fees ismini ver.
    result.user_supply_lp_fees = Math.floor(result.user_supply_total / 500);

    if (result.user_supply_total > pool_pair_2_liquidity) {
      errorMessages.push("Supply overflow");

      output.assetId = pair_2_asset_id;
      output.value = result.user_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    // 6- user_supply_total ’dan user_supply_lp_fees ’ı çıkar ve sonuca user_supply_available ismini ver.
    result.user_supply_available = Math.floor(result.user_supply_total - result.user_supply_lp_fees);

    // 7-pool_pair_2_liquidity ile user_supply_available ’i topla ve sonuca constant_coefficient ismini ver.
    result.constant_coefficient = Math.floor(pool_pair_2_liquidity + result.user_supply_available);

    // 8- constant_coefficient ’ı pair_2_coefficient ’a böl ve bölüm sonucunu bir tam sayı olarak ele alıp constant_coefficient_downgraded ismini ver.
    result.constant_coefficient_downgraded = Math.floor(result.constant_coefficient / pair_2_coefficient);

    // 12- pool_constant değerini constant_coefficient_downgraded ‘e böl ve sonuca new_pair_1_pool_liquidity_apx_1 ismini ver

    result.new_pair_1_pool_liquidity_apx_1 = Math.floor(pool_constant / result.constant_coefficient_downgraded);

    // 13- new_pair_1_pool_liquidity_apx_1 değerini pair_1_coefficient ile çarp ve sonuca new_pair_1_pool_liquidity_apx_2 ismini ver.
    result.new_pair_1_pool_liquidity_apx_2 = Math.floor(result.new_pair_1_pool_liquidity_apx_1 * pair_1_coefficient);

    // 14- pool_pair_1_liquidity değerinden new_pair_1_pool_liquidity_apx_2 değerini çıkar ve sonuca user_received_pair_1_apx ismini ver.
    result.user_received_pair_1_apx = Math.floor(pool_pair_1_liquidity - result.new_pair_1_pool_liquidity_apx_2);

    // 15- pair_1_coefficient değerini 2 ile çarp ve sonuca payout_additional_fees ismini ver.
    result.payout_additional_fees = Math.floor(pair_1_coefficient * 2);

    // 16- user_received_pair_1_apx değerinden payout_additional_fees değerini çıkar ve sonuca user_received_pair_1 ismini ver.
    result.user_received_pair_1 = Math.floor(result.user_received_pair_1_apx - result.payout_additional_fees);

    if (result.user_received_pair_1 < Math.floor(22 * pair_1_coefficient)) {
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
      // İlgili slot için 1 tane settlement output oluştur. Bu outputun asset ID ‘sini pair_1_asset id si olarak ayarla, miktarını da user_received_pair_1 olarak ayarla.
      output = {
        assetId: pair_1_asset_id,
        value: result.user_received_pair_1,
      };

      // pool_pair_2_liquidity değerine user_supply_total değerine ekle ve sonuca new_pool_pair_2_liquidity ismini ver. Bu değeri havuzun güncel pair 2 liquidity miktarı olarak ata.
      result.new_pool_pair_2_liquidity = Math.floor(pool_pair_2_liquidity + result.user_supply_total);

      // pool_pair_1_liquidity değerinden user_received_pair_1 değerini çıkar ve sonuca new_pool_pair_1_liquidity ismini ver. Bu değeri havuzun güncel pair 1 liquidity miktarı olarak ata.
      result.new_pool_pair_1_liquidity = Math.floor(pool_pair_1_liquidity - result.user_received_pair_1);
    }
  } else if (method === "03") {
    //commitment output 3
    const commitmentOutput3 = commitmentOutputs[3];

    // commitment Output2 Asset Id
    const commitmentOutput3AssetId = commitmentOutput3.asset;

    // 4- 2000000000 değerinden pool_lp_supply değerini çıkar ve sonuca lp_circulation ismini ver.
    result.lp_circulation = Math.floor(2000000000 - result.pool_lp_supply);

    // 5- Commitment output 2 asset ID’sinin pair_1_asset_id olduğunu kontrol et.
    if (commitmentOutput2AssetId !== pair_1_asset_id) errorMessages.push("Commitment Output 2 AssetId must be equal to pair_1_asset_id");

    // 6- Commitment output 3 asset ID’sinin pair_2_asset_id olduğunu kontrol et.
    if (commitmentOutput3AssetId !== pair_2_asset_id) errorMessages.push("Commitment Output 3 AssetId must be equal to pair_2_asset_id");

    // 7-Commitment output 2 miktarına user_pair_1_supply_total ismini ver.
    result.user_pair_1_supply_total = new Decimal(commitmentOutput2.value).mul(100000000).toNumber();

    // 8- Commitment output 3 miktarına user_pair_2_supply_total ismini ver.
    result.user_pair_2_supply_total = new Decimal(commitmentOutput3.value).mul(100000000).toNumber();

    // 9-user_pair_1_supply_total değerini pair_1_coefficient ’a böl ve sonuca user_pair_1_supply_total_downgraded ismini ver

    result.user_pair_1_supply_total_downgraded = Math.floor(result.user_pair_1_supply_total / pair_1_coefficient);

    // 10-user_pair_1_supply_total_downgraded ile pool_lp_supply değerini çarp ve sonuca mul_1 ismini ver.
    //fix:user_pair_1_supply_total_downgraded ile lp_circulation değerini çarp ve sonuca mul_1 ismini ver.
    result.mul_1 = Math.floor(result.user_pair_1_supply_total_downgraded * result.lp_circulation);

    // 12-mul_1 değerini pool_pair_1_liquidity_downgraded değerine böl ve sonuca user_lp_apx_1 ismini ver
    result.user_lp_apx_1 = Math.floor(result.mul_1 / pool_pair_1_liquidity_downgraded);

    // 13-user_pair_2_supply_total değerini pair_2_coefficient ’a böl ve sonuca user_pair_2_supply_total_downgraded ismini ver.
    result.user_pair_2_supply_total_downgraded = Math.floor(result.user_pair_2_supply_total / pair_2_coefficient);

    // 14-user_pair_2_supply_total_downgraded ile lp_circulation değerini çarp ve sonuca mul_2 ismini ver.

    result.mul_2 = Math.floor(result.user_pair_2_supply_total_downgraded * result.lp_circulation);

    // 16-mul_2 değerini pool_pair_2_liquidity_downgraded değerine böl ve sonuca user_lp_apx_2 ismini ver.
    result.user_lp_apx_2 = Math.floor(result.mul_2 / pool_pair_2_liquidity_downgraded);

    // 17-user_lp_apx_1 değeri ile user_lp_apx_2 değerini kıyasla, ikisinden hangisi daha küçük ise bu değere user_lp_received ismini ver.
    result.user_lp_received = result.user_lp_apx_1 < result.user_lp_apx_2 ? result.user_lp_apx_1 : result.user_lp_apx_2;

    if (result.user_lp_received < 1) {
      errorMessages.push("Dust LP payout");
      case3outputs.output1.assetId = pair_1_asset_id;
      case3outputs.output1.value = result.user_pair_1_supply_total;
      case3outputs.output2.assetId = pair_2_asset_id;
      case3outputs.output2.value = result.user_pair_2_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    if (result.user_lp_received < (convertion.LE64ToNum(WizData.fromHex(cof.slippageTolerance))?.number || 0)) {
      errorMessages.push("Out of slippage");
      // İlgili slot için 2 tane settlement output oluştur. Birinci outputun asset ID ‘sini pair_1_asset id olarak, ikinci outputun asset ID’sini ise ise pair_1_asset ID olarak ayarla.
      // Birinci outpunun miktarını user_pair_1_supply_total olarak ayarla.
      // İkinci outputun miktarını user_pair_2_supply_total olarak ayarla
      // new_pool_pair_1_liquidity = pool_pair_1_liquidity.
      // new_pool_pair_2_liquidity = pool_pair_2_liquidity.

      case3outputs.output1.assetId = pair_1_asset_id;
      case3outputs.output1.value = result.user_pair_1_supply_total;
      case3outputs.output2.assetId = pair_2_asset_id;
      case3outputs.output2.value = result.user_pair_2_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
    }

    if (errorMessages.length === 0) {
      // Success logic’inde:
      // İlgili slot için 1 tane settlement output oluştur. Bu outputun asset ID ‘sini LP asset id si olarak ayarla, miktarını da user_lp_received olarak ayarla.
      // pool_pair_1_liquidity değerine user_pair_1_supply_total değerine ekle ve sonuca new_pool_pair_1_liquidity ismini ver. Bu değeri havuzun güncel pair 1 liquidity miktarı olarak ata.
      // pool_pair_2_liquidity değerine user_pair_2_supply_total değerini ekle ve sonuca new_pool_pair_2_liquidity ismini ver. Bu değeri havuzun güncel pair 2 liquidity miktarı olarak ata.

      output.assetId = poolData.lp.asset;
      output.value = result.user_lp_received;
      result.new_pool_pair_1_liquidity = Math.floor(pool_pair_1_liquidity + result.user_pair_1_supply_total);
      result.new_pool_pair_2_liquidity = Math.floor(pool_pair_2_liquidity + result.user_pair_2_supply_total);
      result.new_pool_lp_liquidity = Math.floor(result.pool_lp_supply - result.user_lp_received);
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
  };
};
