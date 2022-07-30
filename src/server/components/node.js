import fetch, {AbortError} from "node-fetch";
import {testPort} from "../helpers/test-port.js";

export const HEALTH_ENDPOINT = '/-/healthy';
export const LEDGER_ENDPOINT = '/';

export const getHostMetrics = async ({host = "", port, prot = "http"}) => {
    const link = `${prot.toLowerCase()}://${host}${port  && ![443, 80].includes(port) ? ':'+port:''}/metrics`
    let result = ""

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 10000)

    try {
        const response = await fetch(link, {
            signal: controller.signal
        });
        result = response.ok ? (await response.text()) : ""
    } catch (e) {
        const msg = (e instanceof AbortError) ? "Get Metrics Data: Operation aborted by timeout" : e.message
        result = `:error:${msg}`
        console.error(msg)
    } finally {
        clearTimeout(timeout)
    }

    return result
}

export const getHostApiData = async ({path = LEDGER_ENDPOINT, json = true, host = "", port, prot = "http"}) => {
    const link = `${prot.toLowerCase()}://${host}${port && ![443, 80].includes(port) ? ':'+port:''}${path}`
    let result

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 10000)

    try {
        const response = await fetch(link, {
            signal: controller.signal
        });
        if (response.ok) {
            result = json ? {
                ...(await response.json()),
                aptos_chain_id: +globalThis.aptosState.chain_id,
                aptos_version: +globalThis.aptosState.ledger_version,
            } : await response.text()
        } else {
            result = json ? {error: "no response"} : ":error:no response"
        }
    } catch (e) {
        const msg = (e instanceof AbortError) ? "Get API Data: Operation aborted by timeout" : e.message
        result = json ? {error: msg} : `:error:${msg}`
    } finally {
        clearTimeout(timeout)
    }

    return result
}


export const testPorts = async (host, ports = {}) => {
    const result = {}
    for (const port in ports) {
        result[port] = await testPort(ports[port], {host})
    }
    return result
}