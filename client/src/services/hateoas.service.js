import { Api } from "../Api";

export async function followLink(link, data) {
  if (!link?.href || !link?.method) throw new Error("Invalid HATEOAS link");

  return Api.request({
    url: link.href,
    method: link.method,
    headers: link.headers || {},
    data,
  });
}