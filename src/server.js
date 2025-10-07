import http from 'node:http'
import { routes } from "./routes.js";

const server = http.createServer(async (req, res) => {
    const { url, method } = req


    const route = routes.find(route => {
            console.log(method, url)

        return route.method === method && route.path.test(url)
    })

    if (route) {
        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3333)