-- migrate:up
CREATE TABLE `files` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `file_group_id` CHAR(36) NULL,
  `name` VARCHAR(191) NOT NULL,
  `original_name` VARCHAR(191) NOT NULL,
  `mime_type` VARCHAR(32) NOT NULL,
  `created_at` BIGINT NOT NULL,
  `updated_at` BIGINT NULL,
  `deleted_at` BIGINT NULL,
  CONSTRAINT `Files_FK_FileGroupId` FOREIGN KEY (`file_group_id`) REFERENCES `file_groups`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- migrate:down
DROP TABLE `files`;
