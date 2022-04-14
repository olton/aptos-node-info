import {datetime} from "@olton/datetime";

export const log = (msg, marker = 'info', ...rest) => {
    const time = datetime().format("DD/MM/YYYY HH:mm:ss")
    console.log.apply(null, [`[${marker.toUpperCase()}] ${time} ${msg}`, ...rest])
}

const info = (msg, ...rest) => log(msg, 'info', ...rest)
const alert = (msg, ...rest) => log(msg, 'alert', ...rest)
const debug = (msg, ...rest) => log(msg, 'debug', ...rest)
const error = (msg, ...rest) => log(msg, 'error', ...rest)

export {
    info,
    alert,
    debug,
    error
}