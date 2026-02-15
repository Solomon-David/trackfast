// backend/workers/email.worker.js
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { sendEmail } from "../utils/sendEmail.js";

const connection = new IORedis(process.env.REDIS_HOST, process.env.REDIS_PORT);

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
