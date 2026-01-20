
// Copyright (c) 2024 IOI Network. All rights reserved.

use crate::mv_memory::{MvMemory, Version};
use crate::scheduler::{Scheduler, Task};
use crate::types::{Transaction, ExecutionResult};

/// The Block-STM Parallel Execution Engine.
pub struct BlockStmEngine {
    memory: MvMemory,
    scheduler: Scheduler,
    concurrency_level: usize,
}

impl BlockStmEngine {
    pub fn new(txs: Vec<Transaction>, concurrency_level: usize) -> Self {
        Self {
            memory: MvMemory::new(),
            scheduler: Scheduler::new(txs),
            concurrency_level,
        }
    }

    /// Executes a block of transactions in parallel using optimistic concurrency.
    pub fn execute_block(&mut self) -> Vec<ExecutionResult> {
        let pool = rayon::ThreadPoolBuilder::new()
            .num_threads(self.concurrency_level)
            .build()
            .unwrap();

        pool.scope(|s| {
            for _ in 0..self.concurrency_level {
                s.spawn(|_| self.worker_loop());
            }
        });

        self.memory.finalize_block()
    }

    fn worker_loop(&self) {
        while let Some(task) = self.scheduler.next_task() {
            match task {
                Task::Execute(tx_idx) => {
                    let tx = self.scheduler.get_tx(tx_idx);
                    // Optimistic execution against multi-version memory
                    let result = self.execute_transaction(tx, &self.memory);
                    
                    if self.memory.record_execution(tx_idx, result) {
                        // If validation passes, we might need to re-validate higher txs
                        self.scheduler.check_dependencies(tx_idx);
                    } else {
                        // Validation failed immediately
                        self.scheduler.mark_for_retry(tx_idx);
                    }
                }
                Task::Validate(tx_idx) => {
                    if !self.memory.validate_read_set(tx_idx) {
                        self.scheduler.mark_for_retry(tx_idx);
                    }
                }
            }
        }
    }

    fn execute_transaction(&self, tx: &Transaction, memory: &MvMemory) -> ExecutionResult {
        // VM Logic placeholder
        // ...
        ExecutionResult::default()
    }
}
