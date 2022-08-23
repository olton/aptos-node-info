globalThis.aptosState = {
    chain_id: 0, ledger_version: 0, ledger_timestamp: 0, epoch: 0
}

globalThis.n2f = (n) => Number(n).format(0, null, " ", ".")

globalThis.enterAddress = (form) => {
    $("#error-log-api").clear()
    $("#error-log-metric").clear()

    const statuses = ["api_status", 'metric_status', 'chain_status', 'sync_status', 'peer_status']
    const ports = ["api", "metrics", "seed"]

    for(let s of statuses) {
        $("#"+s).parent().removeClassBy("bg-")
    }

    for(let p of ports) {
        $("#port-"+p).parent().removeClassBy("bg-")
    }

    $("#node-type-icon").removeClassBy("fg-").html($("<span>").addClass("mif-question"))
    $("#chain-ok").removeClassBy("fg-")
    $("#network-icon").removeClassBy("fg-")

    let address = form.elements["node_address"].value.trim()
    let api = (form.elements["api_port"].value.trim())
    let metric = (form.elements["metric_port"].value.trim())
    let seed = (form.elements["seed_port"].value.trim())

    if (api.length === 0) api = 8080
    if (metric.length === 0) metric = 9101
    if (seed.length === 0) seed = 6180

    if (!address) {
        nodeAddress = ""
        return
    }

    $("#activity").show()

    nodeAddress = address
    apiPort = (isNaN(api) ? 8080 : +api)
    metricPort = (isNaN(metric) ? 9101 : +metric)
    seedPort = (isNaN(seed) ? 6180 : +seed)

}

globalThis.currentTime = () => {
    $("#current-time").html(datetime().format(globalThis.dateFormat.full))
    setTimeout( currentTime, 1000)
}

const changeColors = () => {
    globalThis.chartLineColor = globalThis.darkMode ? '#3c424b' : "#e5e5e5"
    globalThis.chartLabelColor = globalThis.darkMode ? "#fff" : "#000"
    globalThis.chartBackground = globalThis.darkMode ? "#1b2125" : "#ffffff"
}

;$(() => {

    globalThis.darkMode = $.dark
    globalThis.ledgerVersion = -1

    const storedDarkMode = Metro.storage.getItem("darkMode")
    if (typeof storedDarkMode !== "undefined") {
        globalThis.darkMode = storedDarkMode
    }

    if (darkMode) {
        $("html").addClass("dark-mode")
    }

    changeColors()

    $(".light-mode-switch, .dark-mode-switch").on("click", () => {
        globalThis.darkMode = !globalThis.darkMode
        Metro.storage.setItem("darkMode", darkMode)
        if (darkMode) {
            $("html").addClass("dark-mode")
        } else {
            $("html").removeClass("dark-mode")
        }
        changeColors()
    })

    globalThis.portsProt = {
        api: 'HTTP',
        metrics: 'HTTP',
        seed: 'HTTP'
    }

    globalThis.apiVersion = 'v1'

    $(".port-protocol-switcher").on("click", function() {
        const $el = $(this)
        const portType = $el.attr("data-port-type")
        let val = $el.text()

        val = (val === 'HTTP') ? 'HTTPS' : 'HTTP'

        $el.text(val)
        portsProt[portType] = val
    })

    $(".api-version-switcher").on("click", function() {
        const $el = $(this)
        let val = $el.text()

        val = (val === 'none') ? 'v1' : val === 'v1' ? "v0" : "none"

        $el.text(val)
        globalThis.apiVersion = val
    })

    const ports = {
        api: apiPort,
        metrics: metricPort,
        seed: seedPort
    }
    const portsWrapper = $(".ports-wrapper")
    for(let p in ports) {
        portsWrapper.append(
            $("<div>").addClass("cell-fs-one-third").attr("title", `${(""+p).toUpperCase()} Port`).append(
                $("<div>").addClass("border bd-default p-2").html(
                    `
                        <div class="small-box-title">${p} port</div>
                        <div class="small-box-value" id="port-${p}">---</div>
                    `
                )
            )
        )
    }

    const address = Metro.utils.getURIParameter(window.location.href, "address")
    const api = Metro.utils.getURIParameter(window.location.href, "api")
    const metric = Metro.utils.getURIParameter(window.location.href, "metrics")
    const seed = Metro.utils.getURIParameter(window.location.href, "seed")

    if (address) {
        $("#address-form")[0].elements['node_address'].value = address
        nodeAddress = address
    }

    if (api) {
        $("#address-form")[0].elements['api_port'].value = api
        apiPort = api
    }

    if (metric) {
        $("#address-form")[0].elements['metric_port'].value = metric
        metricPort = metric
    }

    if (seed) {
        $("#address-form")[0].elements['seed_port'].value = seed
        seedPort = seed
    }

    currentTime()

    $("#round_block").closest(".panel").hide()
    $("#commited_block").closest(".panel").hide()
    $("#buffer_block").closest(".panel").hide()
})