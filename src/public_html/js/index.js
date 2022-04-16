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

    const address = form.elements["node_address"].value
    const api = form.elements["api_port"].value || 8080
    const metric = form.elements["metric_port"].value || 9101
    const seed = form.elements["seed_port"].value || 6180
    const prot = form.elements["prot_address"].value || "http"

    if (!address) {
        nodeAddress = ""
        return
    }

    $("#activity").show()

    nodeAddress = address
    apiPort = +api
    metricPort = +metric
    seedPort = +seed
    protAddress = prot
}

globalThis.currentTime = () => {
    $("#current-time").html(datetime().format(globalThis.dateFormat.full))
    setTimeout( currentTime, 1000)
}

;$(() => {

    globalThis.darkMode = $.dark

    const storedDarkMode = Metro.storage.getItem("darkMode")
    if (typeof storedDarkMode !== "undefined") {
        globalThis.darkMode = storedDarkMode
    }

    if (darkMode) {
        $("html").addClass("dark-mode")
    }

    $(".light-mode-switch, .dark-mode-switch").on("click", () => {
        globalThis.darkMode = !globalThis.darkMode
        Metro.storage.setItem("darkMode", darkMode)
        if (darkMode) {
            $("html").addClass("dark-mode")
        } else {
            $("html").removeClass("dark-mode")
        }
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
                $("<div>").addClass("border bd-default p-2").append(
                    $("<span>").attr("id", `port-${p}`).text(`${p} port`)
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
})