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
};
