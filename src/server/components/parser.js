export const parseMetrics = data => {
    const lines = data.split("\n")
    let counters = {}

    for(let l of lines) {
        if (l[0] === "#") continue

        let val = l.split(" ")[1]

        // +
        if (l.includes("aptos_state_sync_version")) {
            if (l.includes("committed")) counters.sync_committed = val
            if (l.includes("highest")) counters.sync_highest = val
            if (l.includes("synced")) counters.sync_synced = val
            if (l.includes("target")) counters.sync_target = val
        }

        // +
        if (l.includes("aptos_state_sync_timestamp")) {
            if (l.includes("committed")) counters.sync_timestamp_committed = val
            if (l.includes("real")) counters.sync_timestamp_real = val
            if (l.includes("synced")) counters.sync_timestamp_synced = val
        }

        // +
        if (l.includes("aptos_state_sync_reconfig_count")) {
            counters.state_sync_reconfig_count = val
        }

        // +
        if (l.includes("aptos_state_sync_timeout_total")) {
            counters.state_sync_timeout_total = val
        }

        // +
        if (l.includes("aptos_connections")) {
            if (l.includes("inbound")) counters.connections_inbound = val
            if (l.includes("outbound")) counters.connections_outbound = val
        }

        // +
        if (l.includes("aptos_data_client_sent_requests")) {
            let val = l.split(" ")[1]
            if (l.includes("TOTAL_COUNT")) {
                counters.sent_requests_total = val
            } else {
                counters.sent_requests_summary_server = val
            }
        }

        // +
        if (l.includes("aptos_data_client_success_responses")) {
            let val = l.split(" ")[1]
            if (l.includes("TOTAL_COUNT")) {
                counters.data_client_success_responses = val
            } else {
                counters.data_client_success_responses_summary_server = val
            }
        }

        // +
        if (l.includes("aptos_data_streaming_service_global_summary_error")) {
            counters.streaming_service_global_summary_error = val
        }

        // +
        if (l.includes("aptos_data_client_error_responses")) {
            let val = l.split(" ")[1]
            if (l.includes("TOTAL_COUNT")) {
                counters.error_responses_total = val
            } else {
                counters.error_responses_storage_server_summary = val
            }
        }

        // +
        if (l.includes("aptos_jellyfish_internal_encoded_bytes")) {
            counters.jellyfish_internal_encoded_bytes = val
        }

        // +
        if (l.includes("aptos_jellyfish_leaf_encoded_bytes")) {
            counters.jellyfish_leaf_encoded_bytes = val
        }

        // +
        if (l.includes("aptos_jellyfish_storage_reads")) {
            counters.jellyfish_storage_reads = val
        }

        // +
        if (l.includes("aptos_metrics")) {
            if (l.includes("families_over_1000")) counters.metrics_families_over_1000 = val
            if (l.includes("type=\"total\"")) counters.metrics_total = val
            if (l.includes("type=\"total_bytes\"")) counters.metrics_total_bytes = val
        }

        // + to Metrics
        if (l.includes("aptos_simple_onchain_discovery_counts")) {
            counters.simple_onchain_discovery_counts = val
        }

        // +
        if (l.includes("aptos_network_direct_send_messages")) {
            if (l.includes("received")) counters.network_direct_send_messages_received = val
            if (l.includes("sent")) counters.network_direct_send_messages_sent = val
        }

        // +
        if (l.includes("aptos_network_direct_send_bytes")) {
            if (l.includes("received")) counters.network_direct_send_bytes_received = val
            if (l.includes("sent")) counters.network_direct_send_bytes_sent = val
        }

        // +
        if (l.includes("aptos_network_rpc_bytes")) {
            if (l.includes("state=\"received\",type=\"request\"")) counters.network_rpc_bytes_received_request = val
            if (l.includes("state=\"received\",type=\"response\"")) counters.network_rpc_bytes_received_response = val
            if (l.includes("state=\"sent\",type=\"request\"")) counters.network_rpc_bytes_sent_request = val
            if (l.includes("state=\"sent\",type=\"response\"")) counters.network_rpc_bytes_sent_response = val
        }

        // +
        if (l.includes("aptos_network_rpc_messages")) {
            if (l.includes("state=\"failed\",type=\"request\"")) counters.network_rpc_messages_failed_request = val
            if (l.includes("state=\"received\",type=\"request\"")) counters.network_rpc_messages_received_request = val
            if (l.includes("state=\"received\",type=\"response\"")) counters.network_rpc_messages_received_response = val
            if (l.includes("state=\"sent\",type=\"request\"")) counters.network_rpc_messages_sent_request = val
            if (l.includes("state=\"sent\",type=\"response\"")) counters.network_rpc_messages_sent_response = val
        }

        // +
        if (l.includes("aptos_secure_net_events")) {
            if (l.includes("connect")) counters.secure_net_events_connect = val
            if (l.includes("read")) counters.secure_net_events_read = val
        }


        if (l.includes("aptos_network_pending_health_check_events")) {
            if (l.includes("dequeued")) counters.network_pending_health_check_events_dequeued = val
            if (l.includes("enqueued")) counters.network_pending_health_check_events_enqueued = val
        }

        if (l.includes("aptos_state_sync_pending_network_events")) {
            if (l.includes("dequeued")) counters.state_sync_pending_network_events_dequeued = val
            if (l.includes("enqueued")) counters.state_sync_pending_network_events_enqueued = val
        }

        if (l.includes("aptos_storage_service_server_pending_network_events")) {
            if (l.includes("dequeued")) counters.storage_service_server_pending_network_events_dequeued = val
            if (l.includes("enqueued")) counters.storage_service_server_pending_network_events_enqueued = val
        }

        if (l.includes("aptos_storage_latest_account_count")) {
            counters.storage_latest_account_count = val
        }

        if (l.includes("aptos_storage_latest_transaction_version")) {
            counters.storage_latest_transaction_version = val
        }

        if (l.includes("aptos_storage_ledger_version")) {
            counters.storage_ledger_version = val
        }

        if (l.includes("aptos_storage_next_block_epoch")) {
            counters.storage_next_block_epoch = val
        }

        // +
        if (l.includes("aptos_storage_ledger")) {
            if (l.includes("events_created")) counters.storage_ledger_events_created = val
            if (l.includes("new_state_leaves")) counters.storage_ledger_new_state_leaves = val
            if (l.includes("new_state_nodes")) counters.storage_ledger_new_state_nodes = val
            if (l.includes("stale_state_leaves")) counters.storage_ledger_stale_state_leaves = val
            if (l.includes("stale_state_nodes")) counters.storage_ledger_stale_state_nodes = val
        }

        if (l.includes("aptos_storage_service_server_requests_received")) {
            counters.storage_service_server_requests_received = val
        }

        if (l.includes("aptos_storage_service_server_responses_sent")) {
            counters.storage_service_server_responses_sent = val
        }

        if (l.includes("aptos_struct_log_count")) {
            counters.struct_log_count = val
        }

        if (l.includes("aptos_struct_log_processed_count")) {
            counters.struct_log_processed_count = val
        }

        // +
        if (l.includes("aptos_storage_committed_txns")) {
            counters.storage_committed_txns = val
        }

        // +
        if (l.includes("aptos_vm_system_transactions_executed")) {
            counters.vm_system_transactions_executed = val
        }

        // +
        if (l.includes("aptos_vm_user_transactions_executed")) {
            counters.vm_user_transactions_executed = val
        }

        // +
        if (l.includes("aptos_vm_num_txns_per_block_sum")) {
            counters.vm_num_txns_per_block_sum = val
        }

        // +
        if (l.includes("aptos_vm_num_txns_per_block_count")) {
            counters.vm_num_txns_per_block_count = val
        }

        // +
        if (l.includes("aptos_vm_txn_gas_usage_sum")) {
            counters.vm_txn_gas_usage_sum = val
        }

        // +
        if (l.includes("aptos_vm_txn_gas_usage_count")) {
            counters.vm_txn_gas_usage_count = val
        }

        if (l.includes("core_mempool_gc_event_count")) {
            if (l.includes("client_expiration")) counters.core_mempool_gc_event_count_client_expiration = val
            if (l.includes("system_ttl")) counters.core_mempool_gc_event_count_system_ttl = val
        }

        // + to Connections
        if (l.includes("shared_mempool_events")) {
            if (l.includes("lost_peer")) counters.shared_mempool_events_lost_peer = val
            if (l.includes("new_peer")) counters.shared_mempool_events_new_peer = val
        }

        // +
        if (l.includes("system_physical_core_count")) {
            counters.system_physical_core_count = val
        }

        // +
        if (l.includes("system_total_memory")) {
            counters.system_total_memory = val
        }

        // +
        if (l.includes("system_used_memory")) {
            counters.system_used_memory = val
        }

        // +
        if (l.includes("aptos_network_key_mismatch")) {
            counters.network_key_mismatch = val
        }

        // +
        if (l.includes("aptos_network_pending_connection_handler_notifications")) {
            counters.network_pending_connection_handler_notifications  = val
        }

        // +
        if (l.includes("aptos_network_pending_connection_upgrades")) {
            counters.network_pending_connection_upgrades  = val
        }

        // +
        if (l.includes("aptos_network_pending_connectivity_manager_requests")) {
            counters.network_pending_connectivity_manager_requests  = val
        }

        // +
        if (l.includes("aptos_network_pending_peer_manager_dial_requests")) {
            counters.network_pending_peer_manager_dial_requests  = val
        }

        // +
        if (l.includes("aptos_network_pending_wire_messages")) {
            counters.network_pending_wire_messages  = val
        }

        // +
        if (l.includes("mempool_active_upstream_peers_count")) {
            counters.mempool_active_upstream_peers_count  = val
        }

    }

    return counters
}