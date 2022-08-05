import {WebSocketServer, WebSocket} from "ws";
import {getHostMetrics, getHostApiData, testPorts, HEALTH_ENDPOINT, LEDGER_ENDPOINT} from "./node.js";
import {parseMetrics} from "./parser.js";

export const websocket = (server) => {
    globalThis.wss = new WebSocketServer({ server })

    wss.on('connection', (ws, req) => {

        const ip = req.socket.remoteAddress

        ws.send(JSON.stringify({
            channel: "welcome",
            data: `Welcome to Server v${version}`
        }))

        ws.on('message', async (msg) => {
            const {channel, data} = JSON.parse(msg)
            switch (channel) {
                case "metrics": {
                    const res = await getHostMetrics(data)
                    response(ws, channel, res.includes(`:error:`) ? res : parseMetrics(res))
                    break
                }
                case "api": {
                    const ledger = await getHostApiData({path: LEDGER_ENDPOINT, json: true, ...data})
                    response(ws, channel, {
                        api: data.ver,
                        ledger,
                        target: data
                    })
                    break
                }
                case "ports": {
                    response(ws, channel, {
                        test: await testPorts(data.host, data.ports),
                        target: data
                    })
                    break
                }
                case "aptos": {
                    response(ws, channel, globalThis.aptosState)
                    break
                }
            }
        })
    })
}

export const response = (ws, channel, data) => {
    ws.send(JSON.stringify({
        channel,
        data
    }))
}

export const broadcast = (data) => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data))
        }
    })
}
