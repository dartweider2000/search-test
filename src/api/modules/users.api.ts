import HttpFactory from "@/api/HttpFactory";
import type { IBackendUser } from "@/types";
import type { FetchResponse } from "ofetch";

export default class UsersApi extends HttpFactory {
  public async searchUsers(
    queryList: string[],
    page: number,
    limit: number,
    type: "id" | "username" = "id"
  ): Promise<FetchResponse<IBackendUser[]>> {
    let query = "";

    if (type === "id") {
      query = `?id=${queryList[0]}`;

      for (let i = 1; i < queryList.length; i++) {
        query += `&id=${queryList[i]}`;
      }
    } else {
      query = `?username=${queryList[0]}`;

      for (let i = 1; i < queryList.length; i++) {
        query += `&username=${queryList[i]}`;
      }
    }

    query += `&_page=${page}&_limit=${limit}`;

    return await this.request("GET", `/users${query}`);
  }
}
