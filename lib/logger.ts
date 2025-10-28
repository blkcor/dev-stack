import pino from 'pino'

const isEdge = process.env.NEXT_RUNTIME === 'edge'
const isProduction = process.env.NODE_ENV === 'production'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    !isEdge && !isProduction
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'hostname,pid',
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          },
        }
      : undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
})
