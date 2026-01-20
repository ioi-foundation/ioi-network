
// Copyright (c) 2024 IOI Network. All rights reserved.

use crate::index::MHnswIndex;
use crate::types::{Frame, FrameId, RetrievalProof, Query};
use rocksdb::DB;

/// The Sovereign Context Store.
/// Combines persistent Frame storage with a Verifiable Vector Index.
pub struct ScsStore {
    db: DB,
    vector_index: MHnswIndex,
}

impl ScsStore {
    pub fn open(path: &str) -> Self {
        // Initialize RocksDB and load the vector index
        Self {
            db: DB::open_default(path).unwrap(),
            vector_index: MHnswIndex::load(path),
        }
    }

    /// Appends a new immutable frame to the agent's context.
    pub fn append_frame(&mut self, frame: Frame) -> Result<FrameId, Error> {
        let frame_id = frame.calculate_id();
        
        // 1. Commit raw frame to disk
        self.db.put(frame_id.as_bytes(), bincode::serialize(&frame)?)?;
        
        // 2. Index frame embeddings in mHNSW
        for embedding in frame.embeddings() {
            self.vector_index.insert(embedding, frame_id)?;
        }
        
        Ok(frame_id)
    }

    /// Performs a verifiable vector search over the agent's memory.
    pub fn search(&self, query: Query) -> (Vec<Frame>, RetrievalProof) {
        // Perform Approximate Nearest Neighbor search
        let results = self.vector_index.search(query.vector, query.k);
        
        // Generate a Merkle proof attesting to the correctness of the search traversal
        let proof = self.vector_index.generate_proof(&results);
        
        let frames = results.iter()
            .map(|id| self.get_frame(id))
            .collect();

        (frames, proof)
    }

    fn get_frame(&self, id: &FrameId) -> Frame {
        // ...
        Frame::default()
    }
}
