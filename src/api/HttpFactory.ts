import type { $Fetch, FetchResponse } from "ofetch";

export default class HttpFactory {
  private $fetcher: $Fetch;

  constructor(fetcher: $Fetch) {
    this.$fetcher = fetcher;
  }

  protected async request<T>(
    method: "GET" | "POST",
    url: string,
    body?: object,
    extra = {}
  ): Promise<FetchResponse<T>> {
    return await this.$fetcher.raw(url, { method, body, ...extra });
  }
}
