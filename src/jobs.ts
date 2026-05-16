import type { HttpClient } from "./http.js";
import type { IngestJob } from "./types.js";

export interface PollOptions {
  timeoutMs?: number;
  initialIntervalMs?: number;
  maxIntervalMs?: number;
  backoffFactor?: number;
  signal?: AbortSignal;
}

export class Jobs {
  constructor(private readonly http: HttpClient) {}

  async get(jobId: string, options: { signal?: AbortSignal } = {}): Promise<IngestJob> {
    const { body } = await this.http.request<IngestJob>("GET", `/v1/memories/jobs/${encodeURIComponent(jobId)}`, {
      signal: options.signal,
    });
    return body;
  }

  /**
   * Poll a job until it reaches a terminal state (`succeeded` or `failed`).
   * Uses exponential backoff starting at 500ms, capped at 5s, per the API
   * spec recommendation.
   */
  async pollUntilDone(jobId: string, options: PollOptions = {}): Promise<IngestJob> {
    const timeoutMs = options.timeoutMs ?? 60_000;
    const initial = options.initialIntervalMs ?? 500;
    const max = options.maxIntervalMs ?? 5_000;
    const factor = options.backoffFactor ?? 1.5;
    const start = Date.now();
    let interval = initial;

    while (true) {
      if (options.signal?.aborted) throw new DOMException("Aborted", "AbortError");
      const job = await this.get(jobId, { signal: options.signal });
      if (job.status === "succeeded" || job.status === "failed") return job;

      if (Date.now() - start >= timeoutMs) {
        throw new Error(`pollUntilDone: job ${jobId} did not finish within ${timeoutMs}ms (last status: ${job.status})`);
      }

      await sleep(interval, options.signal);
      interval = Math.min(interval * factor, max);
    }
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const t = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
