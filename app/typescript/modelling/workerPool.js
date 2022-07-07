import { Pool, spawn, Worker } from "threads";

export const workerPool = new Pool(() => spawn(new Worker('/modelling_worker.js')))
