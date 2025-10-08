import { randomUUID } from 'node:crypto'
import {buildRoutePath} from "./utils/build-route-path.js";
import {Database} from "./database.js";
import {processCsv} from "./upload.js";

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                done: false
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description, done } = req.body

            database.update('tasks', id, {
                title,
                description,
                done
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks/upload'),
        handler: async (req, res) => {
            const records = await processCsv()

            for (const task of records) {
                const taskDatabase = {
                    id: randomUUID(),
                    title: task[0],
                    description: task[1],
                    done: task[2] === "true"
                }

                database.insert('tasks', taskDatabase)
            }

            return res.writeHead(204).end()
        }
    }
]