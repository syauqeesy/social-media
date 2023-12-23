-- migrate:up
CREATE TABLE `accounts` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `username` VARCHAR(32) NOT NULL,
  `password` TEXT NOT NULL,
  `created_at` BIGINT NOT NULL,
  `updated_at` BIGINT NULL,
  `deleted_at` BIGINT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- migrate:down
DROP TABLE `accounts`;
