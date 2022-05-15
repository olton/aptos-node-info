import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import express from "express";
import session from "express-session"
import {websocket} from "./websocket.js"
import {info} from "../helpers/logging.js";
import favicon from "serve-favicon"

const app = express()

const route = () => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: 'Russian warship - Fuck You!',
        cookie: {
            maxAge: 24 * 3600000,
            secure: 'auto'
        }
    }))
    app.use(express.static(path.join(srcPath, 'public_html')))
    app.use(favicon(path.join(srcPath, 'public_html', 'favicon.ico')))
    app.locals.pretty = true
    app.set('views', path.resolve(srcPath, 'public_html'))
    app.set('view engine', 'pug')

    const clientConfig = JSON.stringify(config.client)
    const aptosConfig = JSON.stringify(config.aptos)
    const dateFormat = JSON.stringify(config['date-format'])

    app.get('/', async (req, res) => {
        res.render('index', {
            title: `Aptos Node Informer v${version}`,
            version,
            clientConfig,
            aptosConfig,
            dateFormat,
        })
    })
}

export const runWebServer = () => {
    let httpWebserver, httpsWebserver, httpsWebserver2

    if (ssl) {
        const {cert, key} = config.server.ssl
        httpWebserver = http.createServer((req, res)=>{
            res.writeHead(301,{Location: `https://${req.headers.host}:${config.server.ssl.port || config.server.port}${req.url}`});
            res.end();
        })

        httpsWebserver = https.createServer({
            key: fs.readFileSync(key[0] === "." ? path.resolve(serverPath, key) : key),
            cert: fs.readFileSync(cert[0] === "." ? path.resolve(serverPath, cert) : cert)
        }, app)
        // httpsWebserver2 = https.createServer({
        //     key: fs.readFileSync(key[0] === "." ? path.resolve(serverPath, key) : key),
        //     cert: fs.readFileSync(cert[0] === "." ? path.resolve(serverPath, cert) : cert)
        // }, app)
    } else {
        httpWebserver = http.createServer({}, app)
    }

    route()

    const runInfo = `Aptos Informer Server running on ${ssl ? "HTTPS" : "HTTP"} on port ${ssl ? config.server.ssl.port : config.server.port}`

    httpWebserver.listen(config.server.port, () => {
        info(runInfo)
    })

    if (ssl) {
        httpsWebserver.listen(config.server.ssl.port || config.server.port, () => {
            info(runInfo)
        })
        // httpsWebserver2.listen(8043, () => {
        //     info(runInfo)
        // })
    }

    websocket(ssl ? httpsWebserver : httpWebserver)
    // if (ssl) websocket(httpsWebserver2)
}
