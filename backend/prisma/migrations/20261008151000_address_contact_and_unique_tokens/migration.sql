-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "recipientName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerificationTokenHash_key" ON "User"("emailVerificationTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetTokenHash_key" ON "User"("passwordResetTokenHash");
