-- AlterTable
ALTER TABLE `users` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `auth_identities` (
    `provider` ENUM('GOOGLE', 'LOCAL') NOT NULL DEFAULT 'GOOGLE',
    `providerAccountId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `auth_identities_userId_idx`(`userId`),
    UNIQUE INDEX `auth_identities_provider_providerAccountId_key`(`provider`, `providerAccountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_email_fkey` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth_identities` ADD CONSTRAINT `auth_identities_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
