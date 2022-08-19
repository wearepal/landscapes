import { Pool, spawn, Worker } from "threads";

// @ts-ignore
export const workerPool = new Pool(() => spawn(new Worker('/modelling_worker.ts')))
