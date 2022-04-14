globalThis.webSocket = null

const isOpen = (ws) => ws && ws.readyState === ws.OPEN

const connect = () => {
    const {host, port = 80, secure} = config.server
    const ws = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}:${port}`)

    globalThis.webSocket = ws

    ws.onmessage = event => {
        try {
            const content = JSON.parse(event.data)
            if (typeof wsMessageController === 'function') {
                wsMessageController.apply(null, [ws, content])
            }
        } catch (e) {
            console.log(e.message)
            console.log(event.data)
            console.log(e.stack)
        }
    }

    ws.onerror = error => {
        error('Socket encountered error: ', error.message, 'Closing socket');
        ws.close();
    }

    ws.onclose = event => {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', event.reason);
        setTimeout(connect, 1000)
    }

    ws.onopen = event => {
        console.log('Connected to Aptos Informer Server');
    }
}

const wsMessageController = (ws, response) => {
    const {channel, data} = response

    if (!channel) {
        return
    }

    const requestApiData = ws => {
        if (isOpen(ws) && nodeAddress) {
            ws.send(JSON.stringify({
                channel: 'api',
                data: {
                    host: nodeAddress,
                    port: apiPort,
                    prot: protAddress
                }
            }))
        } else {
            setTimeout(requestApiData, 5000, ws)
        }
    }

    const requestMetricsData = ws => {
        if (isOpen(ws) && nodeAddress) {
            $("#activity").show()
            ws.send(JSON.stringify({
                channel: 'metrics',
                data: {
                    host: nodeAddress,
                    port: metricPort,
                    prot: protAddress
                }
            }))
        } else {
            setTimeout(requestMetricsData, 5000, ws)
        }
    }

    const requestPortsTest = ws => {
        if (isOpen(ws) && nodeAddress) {
            ws.send(JSON.stringify({
                channel: 'ports',
                data: {
                    host: nodeAddress,
                    ports: {
                        api: apiPort,
                        metrics: metricPort,
                        seed: seedPort
                    }
                }
            }))
        } else {
            setTimeout(requestPortsTest, 5000, ws)
        }
    }

    switch(channel) {
        case 'welcome': {
            requestApiData(ws)
            requestMetricsData(ws)
            requestPortsTest(ws)
            break
        }
        case 'metrics': {
            updateMetricData(data)
            setTimeout(requestMetricsData, 5000, ws)
            $("#activity").hide()
            break
        }
        case 'api': {
            updateApiData(data)
            setTimeout(requestApiData, 5000, ws)
            $("#activity").hide()
            break
        }
        case 'ports': {
            updatePortTest(data)
            setTimeout(requestPortsTest, 5000, ws)
            break
        }
    }
}

connect()

