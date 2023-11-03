import { HandleRequest, HttpRequest, HttpResponse, Kv } from "@fermyon/spin-sdk"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

interface AddKey {
  key: string,
  value: string
}

interface DeleteRequest {
  key: string,
}

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {

  let store = Kv.openDefault()
  let status = 200
  let body

  switch (request.method) {
    case "POST":
      let data = request.json() as AddKey
      console.log(data)
      store.set(data.key, data.value || (new Uint8Array()).buffer)
      break;
    case "GET":
      try {
        let keys = store.getKeys()
        let res: Record<string, any> = {}
        keys.map(k => {
          if (k != "kv-credentials") {
            res[k] = decoder.decode(store.get(k) || new Uint8Array())
          }
        })
        body = JSON.stringify(res)
      } catch (error) {
        status = 404
      }
      break;
    case "DELETE":
      let req = request.json() as DeleteRequest
      store.delete(req.key)
      break;
    case "HEAD":
      if (!store.exists(request.uri)) {
        status = 404
      }
      break;
    default:
  }

  return {
    status: status,
    body: body
  }
}