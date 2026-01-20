
// Copyright (c) 2024 IOI Network. All rights reserved.

use crate::guardian::{GuardianClient, GuardianSignature};
use crate::types::{Block, BlockHeight, ValidatorId};

/// The A-DMFT Consensus Engine.
pub struct AdmftConsensus {
    validator_id: ValidatorId,
    guardian: GuardianClient,
    state: ConsensusState,
}

impl AdmftConsensus {
    /// Proposes a new block anchored by the local Guardian.
    pub fn propose_block(&mut self, parent: &Block, txs: Vec<Transaction>) -> Result<Block, Error> {
        let height = parent.height + 1;
        
        // 1. Execute block to get new Trace Hash
        let (execution_root, trace_hash) = self.execute_and_trace(&txs);
        
        // 2. Request Monotonic Signature from Guardian
        // The Guardian enforces that `height` > `last_signed_height`
        let signature = self.guardian.sign_proposal(
            height,
            execution_root,
            trace_hash
        )?;

        Ok(Block {
            height,
            parent_hash: parent.hash(),
            transactions: txs,
            guardian_signature: signature,
            trace_hash,
        })
    }

    /// Verifies a block proposed by a peer.
    pub fn verify_block(&self, block: &Block) -> bool {
        // Verify the signature against the validator's known Guardian PubKey
        // The signature must include the monotonic counter to be valid.
        block.guardian_signature.verify(
            block.hash(),
            self.get_validator_key(block.proposer)
        )
    }

    fn execute_and_trace(&self, txs: &[Transaction]) -> (Hash, Hash) {
        // ...
        (Hash::default(), Hash::default())
    }
}
