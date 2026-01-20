
// Copyright (c) 2024 IOI Network. All rights reserved.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SignatureSuite {
    Ed25519,
    MlDsa44, // Post-Quantum (Dilithium)
    Hybrid,  // Ed25519 + ML-DSA-44
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdentityRecord {
    pub agent_id: AgentId,
    pub current_key: PublicKey,
    pub suite: SignatureSuite,
    pub rotation_state: RotationState,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RotationState {
    Stable,
    InGracePeriod {
        new_key: PublicKey,
        rem_blocks: u32,
    },
}

pub struct IdentityHub {
    store: IdentityStore,
}

impl IdentityHub {
    pub fn initiate_rotation(&mut self, agent: AgentId, new_key: PublicKey, sig_old: Signature, sig_new: Signature) -> Result<(), Error> {
        let mut record = self.store.get(agent)?;
        
        // Validate proofs of ownership for both keys
        self.verify(record.current_key, &sig_old)?;
        self.verify(new_key, &sig_new)?;
        
        // Enter Grace Period
        record.rotation_state = RotationState::InGracePeriod {
            new_key,
            rem_blocks: 1000, // ~1 hour
        };
        
        self.store.update(agent, record);
        Ok(())
    }

    pub fn on_end_block(&mut self) {
        // Process active rotations
        for mut record in self.store.iter_mut() {
            if let RotationState::InGracePeriod { new_key, rem_blocks } = record.rotation_state {
                if rem_blocks == 0 {
                    // Finalize Rotation
                    record.current_key = new_key;
                    record.rotation_state = RotationState::Stable;
                } else {
                    record.rotation_state = RotationState::InGracePeriod { new_key, rem_blocks: rem_blocks - 1 };
                }
            }
        }
    }
}
