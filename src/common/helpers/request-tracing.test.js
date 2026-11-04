import {
  REFERENCE_NUMBER_HEADER,
  SESSION_ID_HEADER,
  createLogContext,
  getCorrelationId,
  getReferenceNumber,
  getSessionId,
  runWithLogContext
} from '@defra/forms-common'
import Hapi from '@hapi/hapi'

import {
  applyLogContextHeaders,
  applyTraceHeaders,
  requestTracing
} from './request-tracing.js'

describe('request-tracing', () => {
  const tracingHeader = 'x-cdp-request-id'
  const correlationId = '1066e8cc-8e1e-4671-8ad7-b4cd9c95bb94'
  const sessionId = 'c3a2e5f4-2b8e-4e1f-9a8d-3f6b7c1d2e9a'
  const referenceNumber = 'ABC-123-DEF'
  const context = createLogContext({
    correlationId,
    sessionId,
    referenceNumber
  })

  describe('plugin', () => {
    /** @type {import('@hapi/hapi').Server} */
    let server

    beforeEach(async () => {
      server = Hapi.server()

      await server.register(requestTracing)

      server.route({
        method: 'GET',
        path: '/context',
        handler: () => ({
          correlationId: getCorrelationId(),
          sessionId: getSessionId(),
          referenceNumber: getReferenceNumber()
        })
      })
    })

    afterEach(async () => {
      await server.stop()
    })

    it('should use the log context sent by the calling service', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/context',
        headers: {
          [tracingHeader]: correlationId,
          [SESSION_ID_HEADER]: sessionId,
          [REFERENCE_NUMBER_HEADER]: referenceNumber
        }
      })

      expect(result).toEqual({ correlationId, sessionId, referenceNumber })
    })
  })

  describe('applyTraceHeaders', () => {
    it('should add the correlation ID to the configured tracing header', () => {
      runWithLogContext(context, () => {
        expect(applyTraceHeaders({ accept: 'application/json' })).toEqual({
          accept: 'application/json',
          [tracingHeader]: correlationId
        })
      })
    })
  })

  describe('applyLogContextHeaders', () => {
    it('should add the log context headers for Forms Manager', () => {
      runWithLogContext(context, () => {
        expect(
          applyLogContextHeaders(new URL('http://manager/forms'), undefined)
        ).toEqual({
          [SESSION_ID_HEADER]: sessionId,
          [REFERENCE_NUMBER_HEADER]: referenceNumber
        })
      })
    })

    it('should not add the log context headers for other services', () => {
      const headers = { accept: 'application/json' }

      runWithLogContext(context, () => {
        expect(
          applyLogContextHeaders(
            new URL('https://api.notifications.service.gov.uk'),
            headers
          )
        ).toBe(headers)
      })
    })
  })
})
