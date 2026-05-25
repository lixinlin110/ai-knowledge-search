export const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms)

    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer)
        reject(new DOMException('用户停止生成', 'AbortError'))
      },
      { once: true },
    )
  })

export const createTextReadableStream = (
  text: string,
  options: {
    signal?: AbortSignal
    chunkSize?: number
    interval?: number
  } = {},
) => {
  const encoder = new TextEncoder()
  const chunkSize = options.chunkSize ?? 3
  const interval = options.interval ?? 28
  let index = 0

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (options.signal?.aborted) {
        controller.error(new DOMException('用户停止生成', 'AbortError'))
        return
      }

      await sleep(interval, options.signal)

      if (index >= text.length) {
        controller.close()
        return
      }

      const chunk = text.slice(index, index + chunkSize)
      index += chunkSize
      controller.enqueue(encoder.encode(chunk))
    },
    cancel() {
      index = text.length
    },
  })
}

export const readTextStream = async (
  stream: ReadableStream<Uint8Array>,
  onChunk: (chunk: string) => void,
) => {
  const reader = stream.getReader()
  const decoder = new TextDecoder('utf-8')
  let result = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    result += chunk
    onChunk(chunk)
  }

  result += decoder.decode()
  return result
}
