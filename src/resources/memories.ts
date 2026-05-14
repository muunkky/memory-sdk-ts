// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as MemoriesAPI from './memories';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Memories extends APIResource {
  /**
   * Submit one or more messages; the server extracts facts, artifacts, and episodes.
   * **Async by default** (returns `202` with a `job_id`). Set `?wait=true` to opt
   * into sync mode — the server holds the connection up to 30 seconds and returns
   * the full result inline if extraction finishes in time, otherwise falls back to
   * async.
   *
   * @example
   * ```ts
   * const memory = await client.memories.create({
   *   messages: [
   *     {
   *       role: 'user',
   *       content:
   *         'I keep a daily log of every dog I see on my walks.',
   *     },
   *   ],
   *   user_id: 'alice',
   * });
   * ```
   */
  create(params: MemoryCreateParams, options?: RequestOptions): APIPromise<MemoryCreateResponse> {
    const { wait, ...body } = params;
    return this._client.post('/v1/memories', { query: { wait }, body, ...options });
  }

  /**
   * Get one memory by ID. Works for all types. Returns the **full** representation,
   * including `details.full_content` for artifacts.
   *
   * @example
   * ```ts
   * const memory = await client.memories.retrieve(
   *   'fact_01HXYZ123ABCDEFGHJKMNPQRSTV',
   * );
   * ```
   */
  retrieve(
    id: string,
    query: MemoryRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MemoryRetrieveResponse> {
    return this._client.get(path`/v1/memories/${id}`, { query, ...options });
  }

  /**
   * Cannot change `type`, `user_id`, `agent_id`, `conv_id`, `created_at`. Metadata
   * is merged, not replaced.
   *
   * @example
   * ```ts
   * const memory = await client.memories.update(
   *   'fact_01HXYZ123ABCDEFGHJKMNPQRSTV',
   * );
   * ```
   */
  update(id: string, body: MemoryUpdateParams, options?: RequestOptions): APIPromise<Memory> {
    return this._client.patch(path`/v1/memories/${id}`, { body, ...options });
  }

  /**
   * List memories scoped by flat equality filters. For richer filtering (operators,
   * AND/OR/NOT), use `POST /v1/memories/search`.
   *
   * @example
   * ```ts
   * const memoryList = await client.memories.list();
   * ```
   */
  list(query: MemoryListParams | null | undefined = {}, options?: RequestOptions): APIPromise<MemoryList> {
    return this._client.get('/v1/memories', { query, ...options });
  }

  /**
   * Soft-deletes the memory: it's marked `details.status = "deleted"` and excluded
   * from default list/search results. Permanent purge happens out-of-band per
   * retention policy.
   *
   * @example
   * ```ts
   * await client.memories.delete(
   *   'fact_01HXYZ123ABCDEFGHJKMNPQRSTV',
   * );
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/v1/memories/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Closes any open episode for the given scope and assembles a final episode
   * memory. At least one scope field (`user_id`, `agent_id`, `conv_id`) is required.
   *
   * @example
   * ```ts
   * const response = await client.memories.flush();
   * ```
   */
  flush(body: MemoryFlushParams, options?: RequestOptions): APIPromise<MemoryFlushResponse> {
    return this._client.post('/v1/memories/flush', { body, ...options });
  }

  /**
   * Poll the status of an ingest job. Once `status` is `succeeded` or `failed`, the
   * job is terminal and won't change. Completed jobs are retained for 7 days.
   *
   * Recommended polling cadence: exponential backoff starting at 500ms, capped at
   * 5s. Most jobs complete in 3–10s.
   *
   * @example
   * ```ts
   * const response = await client.memories.getJobStatus(
   *   'job_01HXYZ123ABCDEFGHJKMNPQRSTV',
   * );
   * ```
   */
  getJobStatus(jobID: string, options?: RequestOptions): APIPromise<MemoryGetJobStatusResponse> {
    return this._client.get(path`/v1/memories/jobs/${jobID}`, options);
  }

  /**
   * Returns the fields that can be filtered on for this org, including any per-org
   * indexed metadata keys. Use this to discover what's filterable instead of
   * guessing.
   *
   * @example
   * ```ts
   * const response = await client.memories.listFacets();
   * ```
   */
  listFacets(options?: RequestOptions): APIPromise<MemoryListFacetsResponse> {
    return this._client.get('/v1/memories/facets', options);
  }

  /**
   * Returns the lineage of this memory over time: the supersede chain for facts, the
   * version chain for artifacts. Episodes (which don't currently have revisions)
   * return a single-item list containing themselves.
   *
   * @example
   * ```ts
   * const memoryList = await client.memories.listRevisions(
   *   'fact_01HXYZ123ABCDEFGHJKMNPQRSTV',
   * );
   * ```
   */
  listRevisions(id: string, options?: RequestOptions): APIPromise<MemoryList> {
    return this._client.get(path`/v1/memories/${id}/revisions`, options);
  }

  /**
   * Vector + filter search over the unified memory pool. Returns a flat ranked list
   * by default; opt into composed output via the `include` array.
   *
   * Supported `include` values:
   *
   * - `"context_prompt"` — an assembled markdown context string ready to drop into
   *   an LLM prompt. Higher latency; metered separately.
   * - `"full_content"` — include `details.full_content` on artifact results (no-op
   *   for facts/episodes).
   *
   * @example
   * ```ts
   * const response = await client.memories.search({
   *   filters: { user_id: 'alice' },
   *   limit: 20,
   *   query: 'what does the user do with dogs?',
   * });
   * ```
   */
  search(body: MemorySearchParams, options?: RequestOptions): APIPromise<MemorySearchResponse> {
    return this._client.post('/v1/memories/search', { body, ...options });
  }
}

export interface BaseMemory {
  /**
   * Type-prefixed ULID.
   */
  id: string;

  created_at: string;

  object: 'memory';

  /**
   * Short readable preview. Single source per type (no concatenation). Fact: the
   * fact statement. Artifact: the summary. Episode: the summary.
   */
  text: string;

  type: 'fact' | 'artifact' | 'episode';

  updated_at: string;

  agent_id?: string | null;

  conv_id?: string | null;

  /**
   * User-supplied + system-derived.
   */
  metadata?: { [key: string]: unknown };

  user_id?: string | null;
}

/**
 * Polymorphic memory object. Use `type` to discriminate.
 */
export type Memory = Memory.FactMemory | Memory.ArtifactMemory | Memory.EpisodeMemory;

export namespace Memory {
  export interface FactMemory extends Omit<MemoriesAPI.BaseMemory, 'type'> {
    /**
     * Type-prefixed ULID.
     */
    id: string;

    details: FactMemory.Details;

    type: 'fact';
  }

  export namespace FactMemory {
    export interface Details {
      /**
       * Artifacts that cite this fact (inverse, computed).
       */
      artifact_ids?: Array<string>;

      episode_id?: string;

      /**
       * e.g. `context`, `preference`, `event`.
       */
      fact_type?: string | null;

      /**
       * Populated on search responses; null otherwise.
       */
      score?: number | null;

      /**
       * Artifact this fact was extracted from, if any.
       */
      source_artifact_id?: string;

      /**
       * Raw events this fact was extracted from.
       */
      source_event_ids?: Array<string>;

      source_role?: 'user' | 'assistant' | 'system' | null;

      status?: 'active' | 'superseded' | 'deleted';

      /**
       * ID of the previous revision of this fact, or null.
       */
      supersedes?: string;
    }
  }

  export interface ArtifactMemory extends Omit<MemoriesAPI.BaseMemory, 'type'> {
    /**
     * Type-prefixed ULID.
     */
    id: string;

    details: ArtifactMemory.Details;

    type: 'artifact';
  }

  export namespace ArtifactMemory {
    export interface Details {
      episode_ids?: Array<string>;

      /**
       * Heavy field — the full artifact content (HTML, markdown, etc.). **Omitted in
       * list/search responses by default.** Present on `GET /v1/memories/{id}`, or when
       * `include` contains `"full_content"`.
       */
      full_content?: string | null;

      /**
       * Why this artifact exists.
       */
      rationale?: string | null;

      /**
       * ID of v1 of this artifact.
       */
      root_id?: string;

      score?: number | null;

      /**
       * Facts that contributed to this artifact. (Storage layer field name:
       * `descriptor_fact_ids`.)
       */
      source_fact_ids?: Array<string>;

      /**
       * Short human-readable label.
       */
      title?: string | null;

      version?: number;
    }
  }

  export interface EpisodeMemory extends Omit<MemoriesAPI.BaseMemory, 'type'> {
    /**
     * Type-prefixed ULID.
     */
    id: string;

    details: EpisodeMemory.Details;

    type: 'episode';
  }

  export namespace EpisodeMemory {
    export interface Details {
      artifact_ids?: Array<string>;

      ended_at?: string;

      fact_ids?: Array<string>;

      score?: number | null;

      started_at?: string;

      /**
       * Short human-readable label.
       */
      title?: string | null;
    }
  }
}

export interface MemoryList {
  data: Array<Memory>;

  has_more: boolean;

  object: 'list';

  /**
   * Pass as `cursor` on the next call. `null` when `has_more` is false.
   */
  next_cursor?: string | null;
}

/**
 * Sync mode result — returned when `?wait=true` and extraction completed within
 * the 30s wait budget.
 */
export interface MemoryCreateResponse {
  /**
   * Included for traceability — the underlying job ID even in sync mode.
   */
  job_id: string;

  memories_created: Array<Memory>;

  object: 'ingest_result';

  memories_superseded_by?: { [key: string]: string };

  stage_timings?: { [key: string]: number };
}

/**
 * A `Memory` augmented with an optional `expanded` block. Returned from
 * `GET /v1/memories/{id}` when the caller used `?expand=…`. The expanded objects
 * themselves are plain `Memory` values (no further nesting allowed by the API),
 * keeping the type bounded.
 */
export type MemoryRetrieveResponse =
  | MemoryRetrieveResponse.UnionMember0
  | MemoryRetrieveResponse.UnionMember1
  | MemoryRetrieveResponse.UnionMember2;

export namespace MemoryRetrieveResponse {
  export interface UnionMember0 extends Omit<MemoriesAPI.BaseMemory, 'type'> {
    /**
     * Type-prefixed ULID.
     */
    id: string;

    details: UnionMember0.Details;

    type: 'fact';

    /**
     * Present only when the request used `?expand=…`. Keys are expansion targets (e.g.
     * `source_facts`, `episodes`); values are arrays of the related `Memory` objects.
     */
    expanded?: { [key: string]: Array<MemoriesAPI.Memory> };
  }

  export namespace UnionMember0 {
    export interface Details {
      /**
       * Artifacts that cite this fact (inverse, computed).
       */
      artifact_ids?: Array<string>;

      episode_id?: string;

      /**
       * e.g. `context`, `preference`, `event`.
       */
      fact_type?: string | null;

      /**
       * Populated on search responses; null otherwise.
       */
      score?: number | null;

      /**
       * Artifact this fact was extracted from, if any.
       */
      source_artifact_id?: string;

      /**
       * Raw events this fact was extracted from.
       */
      source_event_ids?: Array<string>;

      source_role?: 'user' | 'assistant' | 'system' | null;

      status?: 'active' | 'superseded' | 'deleted';

      /**
       * ID of the previous revision of this fact, or null.
       */
      supersedes?: string;
    }
  }

  export interface UnionMember1 extends Omit<MemoriesAPI.BaseMemory, 'type'> {
    /**
     * Type-prefixed ULID.
     */
    id: string;

    details: UnionMember1.Details;

    type: 'artifact';

    /**
     * Present only when the request used `?expand=…`. Keys are expansion targets (e.g.
     * `source_facts`, `episodes`); values are arrays of the related `Memory` objects.
     */
    expanded?: { [key: string]: Array<MemoriesAPI.Memory> };
  }

  export namespace UnionMember1 {
    export interface Details {
      episode_ids?: Array<string>;

      /**
       * Heavy field — the full artifact content (HTML, markdown, etc.). **Omitted in
       * list/search responses by default.** Present on `GET /v1/memories/{id}`, or when
       * `include` contains `"full_content"`.
       */
      full_content?: string | null;

      /**
       * Why this artifact exists.
       */
      rationale?: string | null;

      /**
       * ID of v1 of this artifact.
       */
      root_id?: string;

      score?: number | null;

      /**
       * Facts that contributed to this artifact. (Storage layer field name:
       * `descriptor_fact_ids`.)
       */
      source_fact_ids?: Array<string>;

      /**
       * Short human-readable label.
       */
      title?: string | null;

      version?: number;
    }
  }

  export interface UnionMember2 extends Omit<MemoriesAPI.BaseMemory, 'type'> {
    /**
     * Type-prefixed ULID.
     */
    id: string;

    details: UnionMember2.Details;

    type: 'episode';

    /**
     * Present only when the request used `?expand=…`. Keys are expansion targets (e.g.
     * `source_facts`, `episodes`); values are arrays of the related `Memory` objects.
     */
    expanded?: { [key: string]: Array<MemoriesAPI.Memory> };
  }

  export namespace UnionMember2 {
    export interface Details {
      artifact_ids?: Array<string>;

      ended_at?: string;

      fact_ids?: Array<string>;

      score?: number | null;

      started_at?: string;

      /**
       * Short human-readable label.
       */
      title?: string | null;
    }
  }
}

export interface MemoryFlushResponse {
  /**
   * All freshly-minted episodes (type=`episode`).
   */
  episodes_created: Array<Memory>;

  object: 'flush_result';
}

export interface MemoryGetJobStatusResponse {
  created_at: string;

  job_id: string;

  object: 'ingest_job';

  /**
   * `pending` and `processing` are non-terminal. `succeeded` and `failed` are
   * terminal.
   */
  status: 'pending' | 'processing' | 'succeeded' | 'failed';

  /**
   * Set when `status` becomes terminal (`succeeded` or `failed`).
   */
  completed_at?: string;

  /**
   * Populated only when `status == "failed"`.
   */
  error?: MemoryGetJobStatusResponse.Error | null;

  /**
   * Populated only when `status == "succeeded"`.
   */
  result?: MemoryGetJobStatusResponse.Result;

  /**
   * Convenience: polling URL for this job.
   */
  url?: string;
}

export namespace MemoryGetJobStatusResponse {
  /**
   * Populated only when `status == "failed"`.
   */
  export interface Error {
    code: string;

    message: string;
  }

  /**
   * Populated only when `status == "succeeded"`.
   */
  export interface Result {
    memories_created?: Array<MemoriesAPI.Memory>;

    /**
     * Map of old_id → new_id when supersedes happen during ingest.
     */
    memories_superseded_by?: { [key: string]: string };

    /**
     * Seconds per pipeline stage.
     */
    stage_timings?: { [key: string]: number };
  }
}

export interface MemoryListFacetsResponse {
  fields: Array<MemoryListFacetsResponse.Field>;

  object: 'facets';
}

export namespace MemoryListFacetsResponse {
  export interface Field {
    /**
     * True for built-in fields. False for org-specific promoted metadata keys.
     */
    core: boolean;

    /**
     * True when filtering on this field uses an index (fast). False = post-filter
     * scan.
     */
    indexed: boolean;

    /**
     * Field path. Top-level for built-ins, `metadata.<key>` for promoted custom keys.
     */
    name: string;

    type: 'string' | 'enum' | 'datetime' | 'number' | 'boolean';

    /**
     * Present for `enum` fields.
     */
    values?: Array<string>;
  }
}

export interface MemorySearchResponse {
  data: Array<Memory>;

  has_more: boolean;

  object: 'list';

  /**
   * Present only when the request set `include`. Each key corresponds to an opt-in
   * feature.
   */
  extras?: MemorySearchResponse.Extras;

  next_cursor?: string | null;
}

export namespace MemorySearchResponse {
  /**
   * Present only when the request set `include`. Each key corresponds to an opt-in
   * feature.
   */
  export interface Extras {
    /**
     * Assembled markdown context, ready to drop into an LLM prompt. Present when
     * `include` contained `"context_prompt"`.
     */
    context_prompt?: string;

    [k: string]: unknown;
  }
}

export interface MemoryCreateParams {
  /**
   * Body param: One or more messages. Any role mix. No pairing requirement.
   */
  messages: Array<MemoryCreateParams.Message>;

  /**
   * Query param: If true, hold the connection up to 30s and return the full result
   * inline when extraction completes. Falls back to `202 + job_id` if the budget
   * elapses.
   */
  wait?: boolean;

  /**
   * Body param: Free-form agent identifier. Optional.
   */
  agent_id?: string;

  /**
   * Body param: Free-form conversation identifier. Optional.
   */
  conv_id?: string;

  /**
   * Body param: Caller-supplied metadata stored verbatim on derived memories.
   */
  metadata?: { [key: string]: unknown };

  /**
   * Body param: Free-form user identifier. Optional.
   */
  user_id?: string;
}

export namespace MemoryCreateParams {
  export interface Message {
    content: string;

    role: 'user' | 'assistant' | 'system';

    /**
     * Optional event timestamp.
     */
    date?: string;

    /**
     * Optional client-supplied event ID for traceability.
     */
    dia_id?: string;
  }
}

export interface MemoryRetrieveParams {
  /**
   * Comma-separated relation keys to expand inline (e.g. `source_facts,episodes`).
   * `*` expands every applicable relation for the entity's type. See API doc →
   * Relations and expansion.
   */
  expand?: string;
}

export interface MemoryUpdateParams {
  /**
   * Merged into existing metadata (not replaced).
   */
  metadata?: { [key: string]: unknown };

  /**
   * New preview text. Cannot change `type` or identity fields.
   */
  text?: string;
}

export interface MemoryListParams {
  agent_id?: string;

  conv_id?: string;

  /**
   * Opaque cursor from a previous response's `next_cursor`.
   */
  cursor?: string;

  /**
   * Comma-separated list of opt-in extras. `full_content` adds
   * `details.full_content` to artifact results (omitted by default to keep list
   * payloads small).
   */
  include?: string;

  limit?: number;

  order?: 'created_at_desc' | 'created_at_asc';

  type?: 'fact' | 'artifact' | 'episode';

  user_id?: string;
}

export interface MemoryFlushParams {
  agent_id?: string;

  conv_id?: string;

  user_id?: string;
}

export interface MemorySearchParams {
  cursor?: string | null;

  /**
   * Filter DSL. Supports flat equality (`{"user_id": "alice"}`), operators
   * (`{"score": {"$gte": 0.8}}`), and logical composition (`{"AND": [...]}`,
   * `{"OR": [...]}`, `{"NOT": {...}}`).
   *
   * Supported operators: `$eq`, `$ne`, `$in`, `$nin`, `$gt`, `$gte`, `$lt`, `$lte`,
   * `$contains`, `$icontains`, `$exists`.
   *
   * The schema is intentionally permissive (`additionalProperties: true`) because
   * the value shape varies per operator. See the API doc → Filter DSL for the full
   * grammar.
   */
  filters?: { [key: string]: unknown };

  /**
   * Opt-in output features. `context_prompt` adds an `extras.context_prompt`
   * markdown block. `full_content` includes `details.full_content` on artifact
   * results.
   */
  include?: Array<'context_prompt' | 'full_content'>;

  limit?: number;

  /**
   * Natural language query, vector-embedded server-side. May be omitted for
   * pure-filter searches.
   */
  query?: string | null;
}

export declare namespace Memories {
  export {
    type BaseMemory as BaseMemory,
    type Memory as Memory,
    type MemoryList as MemoryList,
    type MemoryCreateResponse as MemoryCreateResponse,
    type MemoryRetrieveResponse as MemoryRetrieveResponse,
    type MemoryFlushResponse as MemoryFlushResponse,
    type MemoryGetJobStatusResponse as MemoryGetJobStatusResponse,
    type MemoryListFacetsResponse as MemoryListFacetsResponse,
    type MemorySearchResponse as MemorySearchResponse,
    type MemoryCreateParams as MemoryCreateParams,
    type MemoryRetrieveParams as MemoryRetrieveParams,
    type MemoryUpdateParams as MemoryUpdateParams,
    type MemoryListParams as MemoryListParams,
    type MemoryFlushParams as MemoryFlushParams,
    type MemorySearchParams as MemorySearchParams,
  };
}
