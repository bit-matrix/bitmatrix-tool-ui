import Decimal from "decimal.js";
import { convertion } from "@script-wiz/lib-core";
import WizData from "@script-wiz/wiz-data";
import { CTXPTXResult } from "./CTXPTXResult";
import { api, commitmentFinder } from "@bitmatrix/lib";
import { TxDetail } from "@bitmatrix/esplora-api-client";

export const poolData = {
  id: "0b427dc1862dc6d658ccd109b8d54cf0dcd8848626c2bdb5e0ddce0f17383ff7",
  quote: {
    ticker: "tL-BTC",
    name: "Liquid Bitcoin",
    assetHash: "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49",
    value: "209442",
  },
  token: {
    ticker: "tL-USDt",
    name: "Liquid Tether",
    assetHash: "f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958",
    value: "95550000000",
  },
  lp: {
    ticker: "fc65",
    name: "unknown",
    assetHash: "fc65994dc9467dc99f35cbe7382d0adad3519aaade30e023d79d70c41f63a232",
    value: "1999999200",
  },
  initialTx: {
    txid: "e3094b74a3db4f83b472531d6564a3e94b956c661fe94296d4da22c7a8624415",
    block_height: 447661,
    block_hash: "7fa6f90f1b8bfe5c9e5aeecda0441cc2814a9374c73ee9e22f8ed1ec6af4bc35",
  },
  unspentTx: {
    txid: "01e66d46ad9b2d41d9634b8bcf9fe31eca3b3f2b2af7b368c56034f4e4d490ed",
    block_height: 448541,
    block_hash: "d4102f4f10c1c8673bc8b335e0924338d8b5c3c908a77f5fa341ee76387d3c71",
  },
  leafCount: 1,
  pair1_coefficient: { hex: "", number: 50 },
  lastSyncedBlock: {
    txid: "01e66d46ad9b2d41d9634b8bcf9fe31eca3b3f2b2af7b368c56034f4e4d490ed",
    block_height: 381436,
    block_hash: "44340f3f93fd21859b1f4a379d172c95b4214dfd6e639d5b7a9fc6d2b669e5e0",
  },
  lastSentPtx: "e3b6041ef56f481520bb63c111e666640c3d5c2dd4ee735929fc8ae3dc4b26c0",
  bestBlockHeight: 385093,
  synced: false,
  active: true,
  tokenPrice: 0,
  mainCovenantScript: [
    "54544c97537a63757700c869876777766bd4d58804050000007600cb8851cb8800d14f8800a88851d100888800c86900ce698851c86951ce698800c96900cf698851c96951cf698800c7010088040100000088766b51c7010088d288886353d48852c70100880403000000886c8852d100886c8852c86952ce698852c96952cf698851cb52cb886752d48868d2040200000088d304000000008768201dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f62411546170547765616b2f656c656d656e7473105461704c6561662f656c656d656e747352c96951c96953c96904ffffff7f006b6b6b6b6b6b6b6b6b6b6b766bd201007e7c7e7c6b7c7e01006c7e766e6e6e6e6e6b6b6b6b6b6b6b6b6b6b6b7e7c7e6c7e7c7e6c7e7c7e6c7e7c7e6c7e7c7e6c7e7c7e6c7e7c7e6c7e7c7e6c7e7c7e6c7e7c7e6c7e7c7e6c7e6ce00129e0d96956e0d769e1807c7e5154c8697e7e51d3767e7e7e0500516a4c4e7e00c8697e6c766b7c527a766b7e527a766b7e527a766b7e527a766b7e5154c8697e7e527a7e0400225120527aca697e766b7e517e7cc8697e7c7e6c766b7e7c7663c869517c7e7e7c7e6c7e67757c756c75687c820146a1697e7c820146a1697e7c820146a1697e7c820146a1697e7c820146a1697e7c820146a1697e5154c8697e7e7c7e0200007e7c7eaa6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c5f7a76765d7976cb00cb88c701008800cb88885c798b76cb00cb88c7010088d288885c795387635b79529376cb00cb88c7010088040300000088886775685b7953876301516701006801207e00c8697e01147e5d79a97e59797e5679a8767e02c4ce7e7c7ea85779a8767e5979527a7e7ea85b79ca69765d798bca698801117a7c7e7c5979e45e7ae2e17651a26976537a6e9f636d679d5a7976c7757558807c5294c775755880dd696876527a7c935a7976c869d58cce6988c969527902bc0293e0885c7aa95a79d10088880114e054795479da69777600e087637553795579da697751797cda6977675179d969687600e0dd637551e0685d7a76518763755c798b76c86953c86988c969766b7651e0df697602f401e0da6977d8695579d7695279da697755795379da697757795379da6977d9697cda69775179d96956797cd869517952e0d969d8695e7a5179dd517953790116e0d969dc637500686c766b5779de63750068635c7976ce6951c86988cf69766b886d6c6c527a6b527a6b527ad7696bd8696b675c7976ce6953c86988cf696c88756d6b6b6b6b686b6b6b6b6b8b6b52936b6776528763755c798b76c86951c86988c969766b7651e0df697602f401e0da6977d8695679d7695179da697755795379da697757795379da6977d9697cda69775279d96955797cd869527952e0d969d8695e7a5179dd517954790116e0d969dc637500686c766b5879de63750068635c7976ce6953c86988cf69766b886d6c6c527a6b527a6b527a527ad8696bd7696b675c7976ce6951c86988cf696c88756d6b6b6b6b686b6b6b6b6b8b6b52936b6776538763755c798b76c86953c86988c9697651e0df69765379da69770400943577e05979d869766bd96956795479da6977da69775e79529376c86951c86988c9697651e0df69765479da69776cd96959795579da6977da6977527a6edf6377677568607a6edf527951e0dc637500686375765f7976ce6952ce6988cf6988557a6b557a6b557a537ad7696b547a527ad7696b537a7cd8696b6d6b6b6b6b8b676d7c5d79768bd100885179d100888876ce6953c869888bce6951c869885d7976cf69527a888bcf69886d6b6b6b6b6b6b6b6b6b5293686b53936b675487635c798b76c86952c86988c9697651e0df69766b55795379da6977d9690400943577e05879d869766bda69775279d9696c6c766b58795479da6977d9697cda69775279d9697653790116e0d969df527955790116e0d969dc63750068635d7976768bd100887cd10088887676ce6953c86988cf695379888b76ce6951c86988cf695179886c557a6b557a6b557a537ad8696b547a527ad8696b537ad7696b6d6b6b6b6b5293676d6d597976ce6952c86988cf696c886b6b6b6b6b6b6b6b6b8b686b52936b75676a686868686cd4886c5293d5886c6c6d6c6c6d6c52cf69886c51cf69886c53cf69880401000000766e00cb8851cb8852cb8853cb8820f29b92bd09f9533ba8d22372deb807fae3634aaea80bd9a9753a5f463022d7df7600c8698800ce698800ca6900d1698851ca6951d1698852ca6952d1698853ca6953d1698851c86951ce698852c86952ce698853c86953ce69880402000000d2880400000000d388d58c7676d14f8800a888cf696c756ce0029100e0d769888c7676ce697c8bce6988d1008814156e0dc932770529a4946433c500611b9ba7787188cd5387",
  ],
  maxLeaf: 1,
  holderCovenant: {
    scriptpubkey: {
      main: "51207ddc3e61435bef7cea7a50020bbed334ec2be58949e6ba0c818e44f37574c113",
      token: "5120fbcdf8a4fdb27e6d58a83520f738451bdd41b717714f890562420be440ddd491",
      lp: "5120fbcdf8a4fdb27e6d58a83520f738451bdd41b717714f890562420be440ddd491",
    },
    controlBlockPrefix: {
      main: "c4",
      token: "c4",
      lp: "c4",
    },
  },
};

export const poolTransaction = async (transactionId: string) => {
  const rawTransactionHex: string = await api.getRawTransaction(transactionId);
  const decodedTransaction: TxDetail = await api.decodeRawTransaction(rawTransactionHex);

  const cof: any = await commitmentFinder(decodedTransaction, [poolData]);
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
  const pair_1_asset_id = poolData.quote.assetHash;
  const pair_2_asset_id = poolData.token.assetHash;
  const lp_asset_id = poolData.lp.assetHash;

  const pair_1_pool_supply = Number(poolData.quote.value);

  const pair_2_pool_supply = Number(poolData.token.value);

  const pair_1_coefficient = poolData.pair1_coefficient.number;

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
      result.new_pool_lp_supply = result.pool_lp_supply;
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
      result.new_pool_lp_supply = result.pool_lp_supply;
    }

    if (errorMessages.length === 0) {
      // Success logic’inde:
      // İlgili slot için 1 tane settlement output oluştur. Bu outputun asset ID ‘sini LP asset id si olarak ayarla, miktarını da user_lp_received olarak ayarla.
      // pool_pair_1_liquidity değerine user_pair_1_supply_total değerine ekle ve sonuca new_pool_pair_1_liquidity ismini ver. Bu değeri havuzun güncel pair 1 liquidity miktarı olarak ata.
      // pool_pair_2_liquidity değerine user_pair_2_supply_total değerini ekle ve sonuca new_pool_pair_2_liquidity ismini ver. Bu değeri havuzun güncel pair 2 liquidity miktarı olarak ata.
      // pool_lp_supply değerinden user_lp_received değerini çıkar ve sonuca new_pool_lp_supply ismini ver. Bu değeri havuzun güncel lp supply miktarı olarak ata.

      output.assetId = poolData.lp.assetHash;
      output.value = result.user_lp_received;
      result.new_pool_pair_1_liquidity = Math.floor(pool_pair_1_liquidity + result.user_pair_1_supply_total);
      result.new_pool_pair_2_liquidity = Math.floor(pool_pair_2_liquidity + result.user_pair_2_supply_total);
      // result.new_pool_lp_liquidity = Math.floor(result.pool_lp_supply - result.user_lp_received);
      result.new_pool_lp_supply = Math.floor(result.pool_lp_supply - result.user_lp_received);
    }
  } else if (method === "04") {
    // 2000000000 değerinden pool_lp_supply değerini çıkar ve sonuca lp_circulation ismini ver.
    result.lp_circulation = Math.floor(2000000000 - result.pool_lp_supply);

    // Commitment output 2 asset ID’sinin lp_asset_id olduğunu kontrol et.
    if (commitmentOutput2AssetId !== lp_asset_id) errorMessages.push("Commitment Output 2 AssetId must be equal to Lp Asset Id");

    // Commitment output 2 miktarına user_lp_supply_total ismini ver.
    result.user_lp_supply_total = new Decimal(commitmentOutput2.value).mul(100000000).toNumber();

    // user_lp_supply_total ile pool_pair_1_liquidity_downgraded değerini çarp ve bu değeri mul_1 ismini ver.
    result.mul_1 = Math.floor(result.user_lp_supply_total * pool_pair_1_liquidity_downgraded);

    // mul_1 değerini lp_circulation değerine böl ve sonuca div_1 ismini ver.
    result.div_1 = Math.floor(result.mul_1 / result.lp_circulation);

    // div_1 değeri ile pair_1_coefficient değerini çarp ve sonuca pair_1_user_redeem ismini ver.
    result.pair_1_user_redeem = Math.floor(result.div_1 * pair_1_coefficient);

    // user_lp_supply_total ile pool_pair_2_liquidity_downgraded değerini çarp ve bu değeri mul_2 ismini ver.
    result.mul_2 = Math.floor(result.user_lp_supply_total * pool_pair_2_liquidity_downgraded);

    // mul_2 değerini lp_circulation değerine böl ve sonuca div_2 ismini ver.
    result.div_2 = Math.floor(result.mul_2 / result.lp_circulation);

    // div_2 değeri ile pair_2_coefficient değerini çarp ve sonuca pair_2_user_redeem ismini ver.
    result.pair_2_user_redeem = Math.floor(result.div_2 * pair_2_coefficient);

    // 22 ile pair_1_coefficient değerini çarp ve bu değere pair_1_min_redeem ismini ver.

    result.pair_1_min_redeem = Math.floor(pair_1_coefficient * 10);
    // 22 ile pair_2_coefficient değerini çarp ve bu değere pair_2_min_redeem ismini ver.
    result.pair_2_min_redeem = Math.floor(pair_2_coefficient * 10);

    // a. pair_1_user_redeem değeri pair_1_min_redeem değerinden küçük ise veya pair_2_user_redeem değeri pair_2_min_redeem değerinden küçük ise “revert” logic’ini çalıştır. Bu erroru “Dust LP payout” olarak etiketle.
    if (result.pair_1_user_redeem < result.pair_1_min_redeem || result.pair_2_user_redeem < result.pair_2_min_redeem) {
      errorMessages.push("Dust LP payout");

      // İlgili slot için 1 tane settlement output oluştur. Bu outputun asset ID ‘sini lp_asset id olarak ayarla ve miktarını da user_lp_supply_total olarak ayarla.
      // new_pool_pair_1_liquidity = pool_pair_1_liquidity (değişmedi).
      // new_pool_pair_2_liquidity = pool_pair_2_liquidity (değişmedi).
      // new_pool_lp_supply = pool_lp_supply (değişmedi).

      output.assetId = lp_asset_id;
      output.value = result.user_lp_supply_total;
      result.new_pool_pair_1_liquidity = pool_pair_1_liquidity;
      result.new_pool_pair_2_liquidity = pool_pair_2_liquidity;
      result.new_pool_lp_liquidity = result.pool_lp_supply;
      // -------------------TODO-------------------
      // burası mastera geçince new_pool_lp_supply olarak geğiştirilecek result.new_pool_lp_liquidity = result.pool_lp_supply;
    }

    if (errorMessages.length === 0) {
      //       Success logic’inde;
      // İlgili slot için 2 tane settlement output oluştur.
      // Birinci outputun asset ID sini pair_1_asset_id olarak ayarla, miktarını da pair_1_user_redeem olarak ayarla.
      // İkinci outputun asset ID sini pair_2_asset_id olarak ayarla, miktarını da pair_2_user_redeem olarak ayarla.
      // pool_pair_1_liquidity değerinden pair_1_user_redeem değerini çıkar ve sonuca new_pool_pair_1_liquidity ismini ver. Bu değeri havuzun güncel pair 1 liquidity miktarı olarak ata.
      // pool_pair_2_liquidity değerinden pair_2_user_redeem değerini çıkar ve sonuca new_pool_pair_2_liquidity ismini ver. Bu değeri havuzun güncel pair 2 liquidity miktarı olarak ata.
      // pool_lp_supply değerine user_lp_supply_total değerini ekle ve sonuca new_pool_lp_supply ismini ver. Bu değeri havuzun güncel pair lp supply değeri olarak ata.
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
