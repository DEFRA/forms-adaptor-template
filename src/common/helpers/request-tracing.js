import {
  applyLogContextHeaders as applyLogContextHeader,
  applyTraceHeaders as applyTraceHeader,
  requestTracing as requestTracingPlugin
} from '@defra/forms-common'
import { tracing } from '@defra/hapi-tracing'
import { config } from '../../config.js'

const tracingHeader = config.get('tracing.header')

/**
 * Adds the correlation ID of the current log context to the headers of an
 * outbound HTTP request
 * @template {Record<string, unknown>} Headers
 * @param {Headers | undefined} headers - the existing headers
 * @returns {Headers | undefined}
 */
export function applyTraceHeaders(headers) {
  return applyTraceHeader(headers, tracingHeader)
}

const managerUrl = config.get('managerUrl')

/**
 * The origin of Forms Manager. The session ID and form reference number are
 * only sent to this service.
 * @type {string | undefined}
 */
const managerOrigin =
  managerUrl && URL.canParse(managerUrl)
    ? new URL(managerUrl).origin
    : undefined

/**
 * Adds the session ID and the form reference number of the current log
 * context to the headers of an outbound HTTP request, but only when the
 * request is to Forms Manager. They are never sent to services outside forms.
 * @template {Record<string, unknown>} Headers
 * @param {URL} url - the URL of the request
 * @param {Headers | undefined} headers - the existing headers
 * @returns {Headers | undefined}
 */
export function applyLogContextHeaders(url, headers) {
  if (url.origin !== managerOrigin) {
    return headers
  }

  return applyLogContextHeader(headers)
}

/**
 * Starts a log context for every request, holding the correlation ID from the
 * tracing header (or a new ID when the caller sent none), and the session ID
 * and form reference number sent by the calling forms service. The logger
 * writes them on every log line.
 */
export const requestTracing = {
  plugin: requestTracingPlugin,
  options: {
    tracingHeader,
    tracingPlugin: tracing.plugin,
    readLogContextHeaders: true
  }
}
