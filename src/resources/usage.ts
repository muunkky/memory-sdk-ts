// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Episode flush, usage counters, facets
 */
export class Usage extends APIResource {
  /**
   * Quota and counters for the calling org
   */
  retrieve(options?: RequestOptions): APIPromise<UsageRetrieveResponse> {
    return this._client.get('/v1/usage', options);
  }
}

export interface UsageRetrieveResponse {
  object: 'usage';

  /**
   * e.g. `2026-05`.
   */
  period: string;

  memories_ingested?: number;

  memories_searched?: number;

  quota?: UsageRetrieveResponse.Quota;
}

export namespace UsageRetrieveResponse {
  export interface Quota {
    memories_per_month?: number;

    searches_per_month?: number;
  }
}

export declare namespace Usage {
  export { type UsageRetrieveResponse as UsageRetrieveResponse };
}
