-- ============================================================================
-- LOCALI MIGRATION: Add missing frontend-managed Restaurant & Cafe entities
-- Date: 2026-05-31
-- Purpose:
--   1) Add missing tables for public/local discovery modules
--   2) Keep schema compatible with current dynamic admin/frontend APIs
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

-- ----------------------------------------------------------------------------
-- Table: restaurant
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `area` VARCHAR(191) NULL,
  `cuisine` VARCHAR(191) NULL,
  `description` TEXT NULL,
  `address` TEXT NULL,
  `phone` VARCHAR(80) NULL,
  `website` TEXT NULL,
  `maps_query` VARCHAR(255) NULL,
  `viator_search` VARCHAR(255) NULL,
  `photos` TEXT NULL,
  `main_image` TEXT NULL,
  `rating` DECIMAL(3,2) NULL,
  `review_count` INT NULL DEFAULT 0,
  `price_range` VARCHAR(50) NULL,
  `status` VARCHAR(50) NULL DEFAULT 'pending',
  `is_verified` TINYINT(1) NULL DEFAULT 0,
  `is_featured` TINYINT(1) NULL DEFAULT 0,
  `source` VARCHAR(100) NULL,
  `created_date` DATETIME NULL,
  `updated_date` DATETIME NULL,
  `created_by_id` BIGINT UNSIGNED NULL,
  `created_by` VARCHAR(255) NULL,
  `is_sample` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_restaurant_city` (`city`),
  KEY `idx_restaurant_status` (`status`),
  KEY `idx_restaurant_featured` (`is_featured`),
  KEY `idx_restaurant_created_by_id` (`created_by_id`),
  CONSTRAINT `fk_restaurant_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: cafe
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cafe` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `area` VARCHAR(191) NULL,
  `description` TEXT NULL,
  `address` TEXT NULL,
  `phone` VARCHAR(80) NULL,
  `website` TEXT NULL,
  `maps_query` VARCHAR(255) NULL,
  `photos` TEXT NULL,
  `main_image` TEXT NULL,
  `rating` DECIMAL(3,2) NULL,
  `review_count` INT NULL DEFAULT 0,
  `price_range` VARCHAR(50) NULL,
  `wifi_speed_mbps` DECIMAL(8,2) NULL,
  `has_power_outlets` TINYINT(1) NULL DEFAULT 0,
  `is_work_friendly` TINYINT(1) NULL DEFAULT 0,
  `status` VARCHAR(50) NULL DEFAULT 'pending',
  `is_verified` TINYINT(1) NULL DEFAULT 0,
  `is_featured` TINYINT(1) NULL DEFAULT 0,
  `source` VARCHAR(100) NULL,
  `created_date` DATETIME NULL,
  `updated_date` DATETIME NULL,
  `created_by_id` BIGINT UNSIGNED NULL,
  `created_by` VARCHAR(255) NULL,
  `is_sample` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_cafe_city` (`city`),
  KEY `idx_cafe_work_friendly` (`is_work_friendly`),
  KEY `idx_cafe_status` (`status`),
  KEY `idx_cafe_created_by_id` (`created_by_id`),
  CONSTRAINT `fk_cafe_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET foreign_key_checks = 1;
