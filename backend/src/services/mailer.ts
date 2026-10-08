import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { createHash, randomBytes } from 'node:crypto'
import { env } from '../config/env.js'

/**
 * Dev: emails are logged to the server console (no SMTP needed).
 * Prod: set SMTP_* env vars — the same code switches automatically.
 */
const transporter: Transporter =
  env.NODE_ENV === 'production' && process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      })
    : ({
        // Console transport for development
        sendMail: async (options: { subject: string; text: string; to: string }) => {
          console.log('\n📧 ─────────────────────────────────')
          console.log(`   Para:    ${options.to}`)
          console.log(`   Asunto:  ${options.subject}`)
          console.log(options.text)
          console.log('   ──────────────────────────────────\n')
          return { messageId: 'dev-console' }
        },
      } as unknown as Transporter)

/** Opaque token for email links; only its SHA-256 is stored in the DB. */
export function generateToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('hex')
  return { token, tokenHash: hashToken(token) }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

const APP_URL = process.env.APP_URL ?? 'http://localhost:5173'

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${APP_URL}/verificar-email?token=${token}`
  await transporter.sendMail({
    to,
    subject: 'Verifica tu correo — One Baby Shop',
    text: `Bienvenido a One Baby Shop.\n\nVerifica tu correo con este enlace (expira en 24 horas):\n${url}\n\nSi no creaste esta cuenta, ignora este mensaje.`,
  })
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${APP_URL}/restablecer-password?token=${token}`
  await transporter.sendMail({
    to,
    subject: 'Restablece tu contraseña — One Baby Shop',
    text: `Recibimos una solicitud para restablecer tu contraseña.\n\nUsa este enlace (expira en 1 hora):\n${url}\n\nSi no fuiste tú, tu cuenta está segura — ignora este mensaje.`,
  })
}
