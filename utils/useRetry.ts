export interface RetryOptions {
  retryDelay?: number // initial delay
  maxRetries?: number // how many times to retry
  backoffFactor?: number // multiplier for delay (e.g., 2x)
  timeoutMs?: number // total timeout for all retries
}

export async function retryUntilSuccess<T>(
  fn: () => Promise<T>,
  {
    retryDelay = 1000,
    maxRetries = Infinity,
    backoffFactor = 1.5,
    timeoutMs
  }: RetryOptions = {}
): Promise<T> {
  let attempts = 0
  let delay = retryDelay
  const startTime = Date.now()

  while (attempts < maxRetries) {
    try {
      return await fn()
    } catch (err) {
      attempts++
      const elapsed = Date.now() - startTime

      if (timeoutMs && elapsed >= timeoutMs) {
        console.warn(`❌ Retry aborted: exceeded timeout of ${timeoutMs}ms.`)
        throw new Error('Retry timeout exceeded')
      }

      console.warn(
        `⚠️ Attempt ${attempts} failed. Retrying in ${delay}ms...`,
        err
      )

      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= backoffFactor
    }
  }

  throw new Error(`❌ Retry failed after ${attempts} attempts`)
}
