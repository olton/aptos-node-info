const METRIC_DEFAULT = {
    "connections_inbound": "0",
    "connections_outbound": "0",
    "sent_requests_total": "0",
    "sent_requests_summary_server": "0",
    "jellyfish_internal_encoded_bytes": "0",
    "jellyfish_leaf_encoded_bytes": "0",
    "jellyfish_storage_reads": "0",
    "metrics_families_over_1000": "0",
    "metrics_total": "0",
    "metrics_total_bytes": "0",
    "network_direct_send_bytes_received": "0",
    "network_direct_send_bytes_sent": "0",
    "network_direct_send_messages_received": "0",
    "network_direct_send_messages_sent": "0",
    "network_pending_health_check_events_dequeued": "0",
    "network_pending_health_check_events_enqueued": "0",
    "network_rpc_bytes_received_request": "0",
    "network_rpc_bytes_received_response": "0",
    "network_rpc_bytes_sent_request": "0",
    "network_rpc_bytes_sent_response": "0",
    "network_rpc_messages_received_request": "0",
    "network_rpc_messages_received_response": "0",
    "network_rpc_messages_sent_request": "0",
    "network_rpc_messages_sent_response": "0",
    "secure_net_events_connect": "0",
    "secure_net_events_read": "0",
    "simple_onchain_discovery_counts": "0",
    "state_sync_pending_network_events_dequeued": "0",
    "state_sync_pending_network_events_enqueued": "0",
    "state_sync_reconfig_count": "0",
    "state_sync_timeout_total": "0",
    "sync_committed": "0",
    "sync_highest": "0",
    "sync_synced": "0",
    "sync_target": "0",
    "storage_committed_txns": "0",
    "storage_latest_account_count": "0",
    "storage_latest_transaction_version": "0",
    "storage_ledger_events_created": "0",
    "storage_ledger_new_state_leaves": "0",
    "storage_ledger_new_state_nodes": "0",
    "storage_ledger_stale_state_leaves": "0",
    "storage_ledger_stale_state_nodes": "0",
    "storage_ledger_version": "0",
    "storage_next_block_epoch": "0",
    "storage_service_server_pending_network_events_dequeued": "0",
    "storage_service_server_pending_network_events_enqueued": "0",
    "storage_service_server_requests_received": "0",
    "storage_service_server_responses_sent": "0",
    "struct_log_count": "0",
    "struct_log_processed_count": "0",
    "vm_num_txns_per_block_sum": "0",
    "vm_num_txns_per_block_count": "0",
    "vm_system_transactions_executed": "0",
    "vm_txn_gas_usage_sum": "0",
    "vm_txn_gas_usage_count": "0",
    "vm_user_transactions_executed": "0",
    "core_mempool_gc_event_count_client_expiration": "0",
    "core_mempool_gc_event_count_system_ttl": "0",
    "shared_mempool_events_new_peer": "0",
    "system_physical_core_count": "0",
    "system_total_memory": "0",
    "system_used_memory": "0",
    "sync_timestamp_committed": "0",
    "sync_timestamp_synced": "0",
    "sync_timestamp_real": "0",
    "data_client_success_responses": "0",
    "data_client_success_responses_summary_server": "0",
    "mempool_active_upstream_peers_count": "0",
}

globalThis.updateLedgerData = (data) => {
    const ledger = data.ledger
    const target = data.target
    const error = typeof ledger.error !== "undefined"
    const apiStatus = $("#api_status")
    const chainStatus = $("#chain_status")
    const errorLog = $("#error-log-api").clear()
    const chainOk = $("#chain-ok")

    if (!error) {
        globalThis.ledgerVersion = ledger.ledger_version
        $("#chain_id").text(ledger.chain_id)
        $("#epoch").text(ledger.epoch)
        $("#ledger_version").text(ledger.ledger_version)
        $("#ledger_timestamp").text(datetime(ledger.ledger_timestamp / 1000).format(globalThis.dateFormat.full))
    } else {
        globalThis.ledgerVersion = -1
        errorLog.clear().append(
            $("<div>").addClass("remark alert").text(`API: ${ledger.error}`)
        )
        $("#chain_id").text(0)
        $("#epoch").text(0)
        $("#ledger_version").text(0)
        $("#ledger_timestamp").text(globalThis.dateFormat.full)
    }

    apiStatus.parent().removeClassBy("bg-").addClass("fg-white")
    if (!error && ledger && ledger.chain_id) {
        apiStatus.parent().addClass("bg-green")
        apiStatus.text("CONNECTED")
    } else {
        apiStatus.parent().addClass("bg-red")
        apiStatus.text("PORT CLOSED")
    }


    chainStatus.parent().removeClassBy("bg-").addClass("fg-white")
    chainOk.removeClassBy("fg-")

    if (!error && ledger && +ledger.chain_id) {
        if (+ledger.chain_id === +aptos.chain) {
            chainStatus.parent().addClass("bg-green")
            chainStatus.text("IN CHAIN")
            chainOk.html($("<span>").addClass("mif-checkmark")).addClass("fg-green");
        } else {
            chainStatus.parent().addClass("bg-red")
            chainStatus.text("UPDATE NODE")
            chainOk.html($("<span>").addClass("mif-cross")).addClass("fg-red");
        }
    } else {
        chainStatus.parent().addClass("bg-red")
        chainStatus.text("NO CHAIN DATA")
    }

    if (target && target.host) {
        $("#node_host").text(target.host)
    }
}

globalThis.updateHealthData = (data) => {
    const error = data.health.includes(":error:")
    const n = $("#node_health").removeClassBy("fg-")

    if (error) {
        n.addClass("fg-red").text("aptos-node:error")
    } else {
        const h = data.health
        const c = h && !h.includes("error") ? "fg-green" : "fg-red"

        n.removeClassBy("fg-").addClass(c).text(h ? h : "aptos-node:error")
    }
}

globalThis.updateMetricData = (d) => {
    let metric
    const status = typeof d.system_physical_core_count !== "undefined"
    const errorLog = $("#error-log-metric").clear()

    if (!status) {
        if (typeof d === "string")
        errorLog.html(
            `<div class="remark alert">Metric: ${d.split(":error:")[1]}</div>`
        )
        metric = METRIC_DEFAULT
    } else {
        metric = (d)
    }

    for (let o in metric) {
        if (["sync_timestamp_committed", "sync_timestamp_real", "sync_timestamp_synced"].includes(o)) {
            $(`#${o}`).text(datetime(+metric[o]).format(globalThis.dateFormat.full))
        } else {
            $(`#${o}`).text(n2f(metric[o]))
        }
    }

    const syncStatus = $("#sync_status")
    const nodeType = $("#node-type")
    const nodeTypeIcon = $("#node-type-icon").removeClassBy("fg-")
    const networkIcon = $("#network-icon").removeClassBy("fg-")

    syncStatus.parent().removeClassBy("bg-").addClass("fg-white")

    if (status) {
        nodeTypeIcon.addClass("fg-green")
        networkIcon.addClass("fg-green")
    }

    if (metric.is_validator) {
        nodeType.text(`Validator Node`)
        nodeTypeIcon.html($("<span>").addClass("mif-user-secret"));

        if (+metric.sync_synced > 0 && Math.abs(metric.sync_synced - metric.sync_executed_transactions) <= 2 ) {

            if (+ledgerVersion > 0 && +metric.sync_synced > (+ledgerVersion + 10)) {
                syncStatus.parent().addClass("bg-cyan")
                syncStatus.text("CATCHUP")
            } else {
                syncStatus.parent().addClass("bg-green")
                syncStatus.text("SYNCED")
            }
        } else {
            syncStatus.parent().addClass("bg-red")
            syncStatus.text(!status ? "NO DATA" : "NOT SYNCED")
        }
    } else {
        nodeType.text(`Full Node`)
        nodeTypeIcon.html($("<span>").addClass("mif-organization"));

        if (+metric.sync_synced > 0 && Math.abs(metric.sync_synced - metric.sync_applied_transaction_outputs) <= 2 ) {
            syncStatus.parent().addClass("bg-green")
            syncStatus.text("SYNCED/SYNCING")
        } else {
            syncStatus.parent().addClass("bg-red")
            syncStatus.text(!status ? "NO DATA" : "NOT SYNCED")
        }
    }


    const peerStatus = $("#peer_status")

    peerStatus.parent().removeClassBy("bg-").addClass("fg-white")
    if (+metric.connections_outbound > 0 ) {
        peerStatus.parent().addClass("bg-green")
        peerStatus.text("OK")
    } else {
        peerStatus.parent().addClass(metric.is_validator ? "bg-violet" : "bg-red")
        peerStatus.text("NO PEERS")
    }

    const metricStatus = $("#metric_status")

    metricStatus.parent().removeClassBy("bg-").addClass("fg-white")
    if (status) {
        metricStatus.parent().addClass("bg-green")
        metricStatus.text("CONNECTED")
    } else {
        metricStatus.parent().addClass("bg-red")
        metricStatus.text("PORT CLOSED")
    }
}


globalThis.updateApiData = (data) => {
    updateLedgerData(data)
    updateHealthData(data)
}


globalThis.updatePortTest = data => {
    const ports = data.test
    const targets = data.target.ports

    if (!ports) return

    for(let port in targets){
        const el = $("#port-"+port)
        const pr = el.parent()
        pr.removeClassBy("bg-").addClass(ports[port] ? "bg-green" : "bg-red").addClass("fg-white")
        el.html(`${targets[port]}`)
    }
}