export type PolicyStatus = 'DRAFT' | 'SIGNED' | 'ACTIVE' | 'REVOKED' | 'EXPIRED';
export type ExecutionStatus = 
  | 'PENDING' 
  | 'PASSED' 
  | 'REJECTED_OFFCHAIN' 
  | 'REVERTED_ONCHAIN' 
  | 'SUCCESS_ONCHAIN';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface DbIntent {
  id: string;
  user_address: string;
  raw_prompt: string;
  draft_policy: Record<string, JsonValue>;
  created_at?: string;
}

export interface DbPolicy {
  id: string;
  intent_id?: string;
  policy_hash: string;
  user_address: string;
  agent_address: string;
  action: string;
  token_in: string;
  token_out: string;
  max_amount_in: string;
  allowed_target: string;
  max_slippage_bps: number;
  expires_at: number;
  nonce: number;
  status: PolicyStatus;
  signature: string;
  created_at?: string;
}

export interface DbExecution {
  id: string;
  policy_id: string;
  agent_address: string;
  target_contract: string;
  amount_in: string;
  expected_amount_out?: string;
  calldata: string;
  status: ExecutionStatus;
  offchain_validation_passed: boolean;
  offchain_rejection_reason?: string;
  tx_hash?: string;
  block_number?: number;
  onchain_reverted: boolean;
  onchain_error_reason?: string;
  created_at?: string;
}
