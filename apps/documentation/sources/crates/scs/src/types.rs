
// Copyright (c) 2024 IOI Network. All rights reserved.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Frame {
    pub id: FrameId,
    pub timestamp: u64,
    pub observations: Vec<Perception>,
    pub thoughts: Vec<ReasoningChain>,
    pub actions: Vec<ActionDigest>,
    pub parent_hash: Hash,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FrameId(String);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetrievalProof {
    pub root: Hash,
    pub proof: Vec<Hash>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Query {
    pub vector: Vec<f32>,
    pub k: usize,
}

// Type aliases for demo purposes
pub type Perception = String;
pub type ReasoningChain = String;
pub type ActionDigest = String;
pub type Hash = String;
