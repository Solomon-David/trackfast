// backend/workers/email.worker.js
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { sendEmail } from "../utils/sendEmail.js";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, text, html } = job.data;
    await sendEmail({ to, subject, text, html });
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Email job ${job.id} failed:`, err);
});

export default worker;
