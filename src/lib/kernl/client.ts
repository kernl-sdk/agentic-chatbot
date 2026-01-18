import {
  KernlApiError,
  type ThreadResource,
  type ThreadHistoryResponse,
  type ListThreadsParams,
  type ListThreadsResponse,
  type AgentResource,
} from "./types";

export class KernlClient {
  private baseurl: string;

  constructor(baseUrl?: string) {
    this.baseurl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "";

    if (!this.baseurl) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    }
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseurl}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      throw new KernlApiError(res.status, res.statusText);
    }

    return res.json();
  }

  /**
   * Threads API :: /threads
   */
  threads = {
    /**
     * Get a single thread by ID
     *
     * @example
     * const thread = await kernl.threads.get("thread-123");
     */
    get: async (tid: string): Promise<ThreadResource> => {
      return this.fetch<ThreadResource>(`/threads/${tid}`);
    },

    /**
     * Get thread message history
     *
     * @example
     * const { history } = await kernl.threads.history("thread-123");
     */
    history: async (tid: string): Promise<ThreadHistoryResponse> => {
      return this.fetch<ThreadHistoryResponse>(`/threads/${tid}/history`);
    },

    /**
     * List threads with optional filtering and pagination
     *
     * @example
     * const threads = await kernl.threads.list({ agentId: "jarvis", limit: 20 });
     */
    list: async (params?: ListThreadsParams): Promise<ThreadResource[]> => {
      const searchParams = new URLSearchParams();

      if (params?.limit !== undefined) {
        searchParams.set("limit", params.limit.toString());
      }
      if (params?.offset !== undefined) {
        searchParams.set("offset", params.offset.toString());
      }
      if (params?.agentId) {
        searchParams.set("agentId", params.agentId);
      }

      const query = searchParams.toString();
      const endpoint = query ? `/threads?${query}` : "/threads";

      const response = await this.fetch<ListThreadsResponse>(endpoint);
      console.log("[KernlClient] /threads response:", response);
      return response.threads;
    },
  };

  /**
   * Agents API :: /agents
   */
  agents = {
    /**
     * List available agents
     *
     * @example
     * const { agents } = await kernl.agents.list();
     */
    list: async (): Promise<{ agents: AgentResource[] }> => {
      return this.fetch<{ agents: AgentResource[] }>("/agents");
    },

    /**
     * Get a single agent by ID
     *
     * @example
     * const agent = await kernl.agents.get("jarvis");
     */
    get: async (agentId: string): Promise<AgentResource> => {
      return this.fetch<AgentResource>(`/agents/${agentId}`);
    },
  };
}

// ============================================================================
// Default Singleton Instance
// ============================================================================

const kernl = new KernlClient();

export default kernl;
