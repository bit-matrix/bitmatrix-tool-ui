import axios from "axios";
import { commitmentTxOutputsFragmentation } from "../CommitmentOutputToPoolTool/helper";

const transactionId = "7bce9fc29bcec7eb43716e18c1385da6bdc200d31b7a1c1b263d54bfb0fe1315";
const poolData = {
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

export const poolTransaction = async () => {
  const cof = await commitmentTxOutputsFragmentation(transactionId);
  const method = cof.methodCall;
  //const poolId = cof.poolId;

  //get pool
  //const poolReq = await axios.get(`https://rocksdb.basebitmatrix.com/pools/${poolId}`);
  //const poolData = poolReq.data;
  switch (method) {
    case "01":
      //   1-Havuzun güncel pair_1 liquidity miktarına pool_pair_1_liquidity ismini ver.
      const pool_pair_1_liquidity = Number(poolData.quote.value);

      //   2-Havuzun güncel pair_2 liquidity miktarına pool_pair_2_liquidity ismini ver.

      const pool_pair_2_liquidity = Number(poolData.token.value);

      // transaction outputs
      const commitmentOutputs = cof.outputs;

      //   3-Commitment output 2 asset ID’sinin pair_1_asset_id olduğunu kontrol et.
      const commitmentOutput2 = commitmentOutputs[2];
      const commitmentOutput2AssetId = commitmentOutput2.asset;

      //pool detail rocks db den geldiği için asset, yeni pool modelde assetHash olacak
      const pair_1_asset_id = poolData.quote.asset;
      const pair_2_asset_id = poolData.token.asset;

      if (commitmentOutput2AssetId !== pair_1_asset_id) console.log("commitmentOutput2AssetId must be equal to pair_1_asset_id");

      //   4-Commitment output 2 miktarına user_supply_total ismini ver.
      const user_supply_total = commitmentOutput2.value;

      if (user_supply_total > pool_pair_1_liquidity) {
        Promise.reject("Supply overflow");
        return {
          assetId: pair_1_asset_id,
          value: user_supply_total,
          new_pair_1_pool_liquidity: pool_pair_1_liquidity,
          new_pair_2_pool_liquidity: pool_pair_2_liquidity,
        };
      }

      //5- user_supply_total ‘ı 500’e böl ve bölüm sonucu bir tam sayı olarak ele alıp user_supply_lp_fees ismini ver.
      const user_supply_lp_fees = Math.floor(user_supply_total / 500);

      //   6-user_supply_total’ dan user_supply_lp_fees’ı çıkar ve sonuca user_supply_available ismini ver.
      const user_supply_available = Math.floor(user_supply_total - user_supply_lp_fees);

      //   7-pool_pair_1_liquidity ile user_supply_available’i topla ve sonuca constant_coefficient ismini ver.
      const constant_coefficient = Math.floor(pool_pair_1_liquidity + user_supply_available);

      //   8-constant_coefficient’ı pair_1_coefficient ’a böl ve bölüm sonucunu bir tam sayı olarak ele alıp constant_coefficient_downgraded ismini ver.
      const pair_1_coefficient = 20;

      const pair_2_coefficient = 1000000;

      const constant_coefficient_downgraded = Math.floor(constant_coefficient / pair_1_coefficient);

      //   9-pool_pair_1_liquidity değerini pair_1_coefficient’a böl ve sonuca pool_pair_1_liquidity_downgraded ismini ver
      const pool_pair_1_liquidity_downgraded = Math.floor(pool_pair_1_liquidity / pair_1_coefficient);

      // 10-pool_pair_2_liquidity değerini pair_2_coefficient’a böl ve sonuca pool_pair_2_liquidity_downgraded ismini ver

      const pool_pair_2_liquidity_downgraded = Math.floor(pool_pair_2_liquidity / pair_2_coefficient);

      // 11-pool_pair_1_liquidity_downgraded ile pool_pair_2_liquidity_downgraded ‘I çarp ve sonuca pool_constant ismini ver.
      const pool_constant = Math.floor(pool_pair_1_liquidity_downgraded * pool_pair_2_liquidity_downgraded);

      // 12-pool_constant değerini constant_coefficient_downgraded ‘e böl ve sonuca new_pair_2_pool_liquidity_apx_1 ismini ver.
      const new_pair_2_pool_liquidity_apx_1 = Math.floor(pool_constant / constant_coefficient_downgraded);

      // 13-new_pair_2_pool_liquidity_apx_1 değerini pair_2_coefficient ile çarp ve sonuca new_pair_2_pool_liquidity_apx_2 ismini ver.
      const new_pair_2_pool_liquidity_apx_2 = Math.floor(new_pair_2_pool_liquidity_apx_1 * pair_2_coefficient);

      // 14-pool_pair_2_liquidity değerinden new_pair_2_pool_liquidity_apx_2 değerini çıkar ve sonuca user_received_pair_2_apx ismini ver.
      const user_received_pair_2_apx = Math.floor(pool_pair_2_liquidity - new_pair_2_pool_liquidity_apx_2);

      // 15-pair_2_coefficient değerini 2 ile çarp ve sonuca payout_additional_fees ismini ver.
      const payout_additional_fees = Math.floor(pair_2_coefficient * 2);

      // 16-user_received_pair_2_apx değerinden payout_additional_fees değerini çıkar ve sonuca user_received_pair_2 ismini ver.
      const user_received_pair_2 = Math.floor(user_received_pair_2_apx - payout_additional_fees);

      if (user_received_pair_2 < Math.floor(22 * pair_2_coefficient)) {
        Promise.reject("Dust payout");
        return {
          assetId: pair_1_asset_id,
          value: user_supply_total,
          new_pair_1_pool_liquidity: pool_pair_1_liquidity,
          new_pair_2_pool_liquidity: pool_pair_2_liquidity,
        };
      }

      if (user_received_pair_2 < Number(cof.slippageTolerance)) {
        Promise.reject("Out of slippage");
        return {
          assetId: pair_1_asset_id,
          value: user_supply_total,
          new_pair_1_pool_liquidity: pool_pair_1_liquidity,
          new_pair_2_pool_liquidity: pool_pair_2_liquidity,
        };
      }

      return {
        method,
        pool_pair_1_liquidity,
        pool_pair_2_liquidity,
        commitmentOutput2AssetId,
        pair_1_asset_id,
        user_supply_total,
        user_supply_lp_fees,
        user_supply_available,
        constant_coefficient,
        pair_1_coefficient,
        pair_2_coefficient,
        constant_coefficient_downgraded,
        pool_pair_1_liquidity_downgraded,
        pool_pair_2_liquidity_downgraded,
        pool_constant,
        new_pair_2_pool_liquidity_apx_1,
        new_pair_2_pool_liquidity_apx_2,
        user_received_pair_2_apx,
        payout_additional_fees,
        user_received_pair_2,
      };
    default:
      return {};
  }
};
