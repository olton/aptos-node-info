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
    let httpWebserver

    httpWebserver = http.createServer({}, app)

    route()

    const runInfo = `Aptos Informer Server running on http://${config.server.host}:${config.server.port}`

    httpWebserver.listen(config.server.port, () => {
        info(runInfo)
    })

    websocket(httpWebserver)
}
