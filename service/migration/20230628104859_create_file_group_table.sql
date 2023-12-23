-- migrate:up
CREATE TABLE `file_groups` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `created_at` BIGINT NOT NULL,
  `updated_at` BIGINT NULL,
  `deleted_at` BIGINT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- migrate:down
DROP TABLE `file_groups`;
