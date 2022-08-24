const METRIC_DEFAULT = {
}

globalThis.memoryChart = null

globalThis.updateLedgerData = (data) => {
    const ledger = data.ledger
    const target = data.target
    const error = typeof ledger.error !== "undefined"
    const apiStatus = $("#api_status")
    const chainStatus = $("#chain_status")
    const errorLog = $("#error-log-api").clear()
    const chainOk = $("#chain-ok")
    const syncStatus = $("#sync_status")

    const in_chain = !error && +(data.ledger.chain_id) === +(data.ledger.aptos_chain_id)
    const synced = !error && Math.abs(+(data.ledger.ledger_version) - +(data.ledger.aptos_version)) <= (serverConfig.aptos.accuracy || 100)

    if (!error) {
        globalThis.ledgerVersion = ledger.ledger_version
        $("#chain_id").text(ledger.chain_id)
        $("#epoch").text(ledger.epoch)
        $("#ledger_version").text(n2f(ledger.ledger_version))
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
        apiStatus.text("NO API DATA")
    }


    chainStatus.parent().removeClassBy("bg-").addClass("fg-white")
    chainOk.removeClassBy("fg-")

    if (!error) {
        if (in_chain) {
            chainStatus.parent().addClass("bg-green")
            chainStatus.text("IN CHAIN")
            chainOk.addClass("fg-green");
        } else {
            chainStatus.parent().addClass("bg-red")
            chainStatus.text("UPDATE NODE")
            chainOk.addClass("fg-red");
        }
    } else {
        chainStatus.parent().addClass("bg-red")
        chainStatus.text("NO DATA")
    }

    syncStatus.parent().removeClassBy("bg-")
    if (!error) {
        if (synced) {
            syncStatus.parent().addClass("bg-green fg-white")
            syncStatus.text("SYNCED")
        } else {
            syncStatus.parent().addClass("bg-cyan fg-white")
            syncStatus.text("CATCHUP")
        }
    } else {
        syncStatus.parent().addClass("bg-red")
        syncStatus.text("NOT SYNCED")
    }

    if (target && target.host) {
        $("#node_host").text(target.host)
    }
}

globalThis.updateHealthData = (data) => {
    const error = !data.ledger
    const n = $("#node_health").removeClassBy("fg-")
    const v = $("#api_version")

    v.html(data.api)

    if (error) {
        n.addClass("fg-red").text("aptos-node:error")
    } else {
        const h = +data.ledger.ledger_version
        const c = h ? "fg-green" : "fg-red"

        n.removeClassBy("fg-").addClass(c).text(h ? "aptos-node:ok" : "aptos-node:error")
    }
}

globalThis.updateMetricData = (d) => {
    let metric
    const status = typeof d.storage_ledger_version !== "undefined"
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
            if (['system_total_memory'].includes(o)) {
                $(`#${o}`).text(n2f(metric[o]/1024**2))
            } else {
                $(`#${o}`).text(n2f(metric[o]))
            }
        }
    }

    const nodeType = $("#node-type")
    const nodeTypeIcon = $("#node-type-icon").removeClassBy("fg-")
    const networkIcon = $("#network-icon").removeClassBy("fg-")
    const versionIcon = $("#version-icon").removeClassBy("fg-")


    if (status) {
        nodeTypeIcon.addClass("fg-green")
        networkIcon.addClass("fg-green")
        versionIcon.addClass("fg-green")
    }

    if (metric.is_validator) {
        nodeType.text(`Validator`)
        nodeTypeIcon.html($("<span>").addClass("mif-user-secret"));
        $("#fullnode-state").hide()
        $("#validator-state").show()
    } else {
        nodeType.text(`FullNode`)
        nodeTypeIcon.html($("<span>").addClass("mif-organization"));
        $("#fullnode-state").show()
        $("#validator-state").hide()
    }

    if (metric.is_validator) {
        $("#round_block").closest(".panel").show()
        $("#connections_block").closest(".panel").hide()
    } else {
        $("#round_block").closest(".panel").hide()
        $("#connections_block").closest(".panel").show()
    }

    if (metric.is_validator) {
        $("#commited_block").closest(".panel").show()
        $("#requests_block").closest(".panel").hide()
    } else {
        $("#commited_block").closest(".panel").hide()
        $("#requests_block").closest(".panel").show()
    }

    if (metric.is_validator) {
        $("#buffer_block").closest(".panel").show()
        $("#traffic_block").closest(".panel").hide()
    } else {
        $("#buffer_block").closest(".panel").hide()
        $("#traffic_block").closest(".panel").show()
    }

    const peerStatus = $("#peer_status")

    peerStatus.parent().removeClassBy("bg-").addClass("fg-white")
    if (+metric.connections_outbound > 0 ) {
        peerStatus.parent().addClass("bg-green")
        peerStatus.text("OK")
    } else {
        peerStatus.parent().addClass(metric.is_validator ? "bg-violet" : "bg-red")
        peerStatus.text("NO PEERS DATA")
    }

    const metricStatus = $("#metric_status")

    metricStatus.parent().removeClassBy("bg-").addClass("fg-white")
    if (status) {
        metricStatus.parent().addClass("bg-green")
        metricStatus.text("CONNECTED")
    } else {
        metricStatus.parent().addClass("bg-red")
        metricStatus.text("NO DATA")
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
        const portNum = targets[port]
        pr.removeClassBy("bg-").addClass(!portNum ? 'bg-violet' : ports[port] ? "bg-green" : "bg-red").addClass("fg-white")
        el.html(`${!portNum ? 'NOT DEF' : portNum}`)
    }
}

globalThis.updateAptosState = data => {
    if (!data) return
    globalThis.aptosState = data
    const {chain_id, ledger_version, ledger_timestamp, epoch, network} = data
    const aptosVersion = $("#aptos-version")
    const aptosChain = $("#aptos-chain-id")
    const aptosEpoch = $("#aptos-epoch")
    const aptosTimestamp = $("#aptos-timestamp")
    const aptosNetwork = $("#network")

    aptosChain.text(n2f(chain_id))
    aptosVersion.text(n2f(ledger_version))
    aptosNetwork.html(network.toUpperCase())
}