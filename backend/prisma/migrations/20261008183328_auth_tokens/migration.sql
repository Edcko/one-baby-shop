-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationTokenHash" TEXT,
ADD COLUMN     "passwordResetExpiresAt" TIMESTAMP(3),
ADD COLUMN     "passwordResetTokenHash" TEXT;
