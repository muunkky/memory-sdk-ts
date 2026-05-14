# Memories

Types:

- <code><a href="./src/resources/memories.ts">BaseMemory</a></code>
- <code><a href="./src/resources/memories.ts">Memory</a></code>
- <code><a href="./src/resources/memories.ts">MemoryList</a></code>
- <code><a href="./src/resources/memories.ts">MemoryCreateResponse</a></code>
- <code><a href="./src/resources/memories.ts">MemoryRetrieveResponse</a></code>
- <code><a href="./src/resources/memories.ts">MemoryFlushResponse</a></code>
- <code><a href="./src/resources/memories.ts">MemoryGetJobStatusResponse</a></code>
- <code><a href="./src/resources/memories.ts">MemoryListFacetsResponse</a></code>
- <code><a href="./src/resources/memories.ts">MemorySearchResponse</a></code>

Methods:

- <code title="post /v1/memories">client.memories.<a href="./src/resources/memories.ts">create</a>({ ...params }) -> MemoryCreateResponse</code>
- <code title="get /v1/memories/{id}">client.memories.<a href="./src/resources/memories.ts">retrieve</a>(id, { ...params }) -> MemoryRetrieveResponse</code>
- <code title="patch /v1/memories/{id}">client.memories.<a href="./src/resources/memories.ts">update</a>(id, { ...params }) -> Memory</code>
- <code title="get /v1/memories">client.memories.<a href="./src/resources/memories.ts">list</a>({ ...params }) -> MemoryList</code>
- <code title="delete /v1/memories/{id}">client.memories.<a href="./src/resources/memories.ts">delete</a>(id) -> void</code>
- <code title="post /v1/memories/flush">client.memories.<a href="./src/resources/memories.ts">flush</a>({ ...params }) -> MemoryFlushResponse</code>
- <code title="get /v1/memories/jobs/{job_id}">client.memories.<a href="./src/resources/memories.ts">getJobStatus</a>(jobID) -> MemoryGetJobStatusResponse</code>
- <code title="get /v1/memories/facets">client.memories.<a href="./src/resources/memories.ts">listFacets</a>() -> MemoryListFacetsResponse</code>
- <code title="get /v1/memories/{id}/revisions">client.memories.<a href="./src/resources/memories.ts">listRevisions</a>(id) -> MemoryList</code>
- <code title="post /v1/memories/search">client.memories.<a href="./src/resources/memories.ts">search</a>({ ...params }) -> MemorySearchResponse</code>

# Usage

Types:

- <code><a href="./src/resources/usage.ts">UsageRetrieveResponse</a></code>

Methods:

- <code title="get /v1/usage">client.usage.<a href="./src/resources/usage.ts">retrieve</a>() -> UsageRetrieveResponse</code>
