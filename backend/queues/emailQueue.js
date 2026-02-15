// backend/queues/emailQueue.js
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_HOST);

export const emailQueue = new Queue("emailQueue", { connection });
