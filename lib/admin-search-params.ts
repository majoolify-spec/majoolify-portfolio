export type AdminSearchParams = Record<string, string | string[] | undefined>;

export function parseStatusAndDetail(params: AdminSearchParams) {
  return {
    status: typeof params.status === "string" ? params.status : undefined,
    detail: typeof params.detail === "string" ? params.detail : undefined,
  };
}
