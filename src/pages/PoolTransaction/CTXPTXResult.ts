export type CTXPTXResult = {
  user_supply_total: number;
  user_supply_lp_fees: number;
  user_supply_available: number;
  constant_coefficient: number;
  constant_coefficient_downgraded: number;
  payout_additional_fees: number;
  new_pair_2_pool_liquidity_apx_1: number;
  new_pair_2_pool_liquidity_apx_2: number;
  new_pair_1_pool_liquidity_apx_1?: number; //method call 2
  new_pair_1_pool_liquidity_apx_2?: number; //method call 2
  user_received_pair_2_apx: number;
  user_received_pair_1_apx?: number; //method call 2
  user_received_pair_2: number;
  user_received_pair_1?: number; ///method call 2
  new_pool_pair_1_liquidity: number;
  new_pool_pair_2_liquidity: number;
  new_pool_lp_supply: number;
  pool_lp_supply: number;
  new_pool_lp_liquidity: number;
  lp_circulation: number;
  user_lp_supply_total: number;
  user_lp_received: number;
  user_lp_apx_1: number;
  user_lp_apx_2: number;
  user_pair_1_supply_total: number;
  user_pair_2_supply_total: number;
  user_pair_1_supply_total_downgraded: number;
  user_pair_2_supply_total_downgraded: number;
  mul_1: number;
  mul_2: number;
  div_1: number;
  div_2: number;
  pair_1_user_redeem: number;
  pair_2_user_redeem: number;
  pair_1_min_redeem: number;
  pair_2_min_redeem: number;
};
