-- Locali Egypt MySQL schema for phpMyAdmin import
-- Created from entity blueprints and backend local schema generator
CREATE DATABASE IF NOT EXISTS `locali_egypt` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `locali_egypt`;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `verified_drivers`;
DROP TABLE IF EXISTS `tourist_stories`;
DROP TABLE IF EXISTS `tourist_deals`;
DROP TABLE IF EXISTS `tour_operators`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `scam_reports`;
DROP TABLE IF EXISTS `saved_itineraries`;
DROP TABLE IF EXISTS `ride_shares`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `remote_work_spots`;
DROP TABLE IF EXISTS `price_insights`;
DROP TABLE IF EXISTS `price_entries`;
DROP TABLE IF EXISTS `places`;
DROP TABLE IF EXISTS `nightlife_venues`;
DROP TABLE IF EXISTS `long_stay_services`;
DROP TABLE IF EXISTS `local_questions`;
DROP TABLE IF EXISTS `local_contacts`;
DROP TABLE IF EXISTS `live_situations`;
DROP TABLE IF EXISTS `listings`;
DROP TABLE IF EXISTS `horse_ridings`;
DROP TABLE IF EXISTS `home_contents`;
DROP TABLE IF EXISTS `hidden_gem_places`;
DROP TABLE IF EXISTS `guides`;
DROP TABLE IF EXISTS `currency_rates`;
DROP TABLE IF EXISTS `boat_trips`;
DROP TABLE IF EXISTS `apartments`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(191) DEFAULT NULL,
  `role` ENUM('admin','driver','service_lister','traveler') NOT NULL DEFAULT 'traveler',
  `phone` VARCHAR(80) DEFAULT NULL,
  `city` VARCHAR(80) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `metadata` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `apartments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `host_name` VARCHAR(191) DEFAULT NULL,
  `host_phone` VARCHAR(255) DEFAULT NULL,
  `title` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `area` VARCHAR(191) DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `price_per_night_egp` DECIMAL(12,2) DEFAULT NULL,
  `capacity` INT DEFAULT NULL,
  `bedrooms` INT DEFAULT NULL,
  `bathrooms` INT DEFAULT NULL,
  `amenities` JSON DEFAULT NULL,
  `rules` TEXT DEFAULT NULL,
  `min_nights` INT DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `commission_rate` DECIMAL(8,4) DEFAULT NULL,
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT NULL,
  `discount_views` INT DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_apartments_city` (`city`),
  KEY `idx_apartments_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `boat_trips` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `boat_name` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `boat_type` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(12,2) DEFAULT NULL,
  `price_type` VARCHAR(255) DEFAULT NULL,
  `capacity` INT DEFAULT NULL,
  `duration_hours` DECIMAL(12,4) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `discount_code` VARCHAR(255) DEFAULT NULL,
  `includes` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT NULL,
  `discount_clicks` INT DEFAULT NULL,
  `whatsapp_clicks` INT DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_boat_trips_city` (`city`),
  KEY `idx_boat_trips_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `currency_rates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usd` DECIMAL(12,4) DEFAULT NULL,
  `eur` DECIMAL(12,4) DEFAULT NULL,
  `gbp` DECIMAL(12,4) DEFAULT NULL,
  `rub` DECIMAL(12,4) DEFAULT NULL,
  `pln` DECIMAL(12,4) DEFAULT NULL,
  `cad` DECIMAL(12,4) DEFAULT NULL,
  `aud` DECIMAL(12,4) DEFAULT NULL,
  `sar` DECIMAL(12,4) DEFAULT NULL,
  `rate_date` DATE DEFAULT NULL,
  `source` VARCHAR(191) DEFAULT NULL,
  `change_usd` DECIMAL(8,4) DEFAULT NULL,
  `change_eur` DECIMAL(8,4) DEFAULT NULL,
  `alert` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `guides` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(191) DEFAULT NULL,
  `photo_url` VARCHAR(511) DEFAULT NULL,
  `license_id` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `cities_covered` JSON DEFAULT NULL,
  `languages` JSON DEFAULT NULL,
  `tour_types` JSON DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `price_half_day` DECIMAL(12,4) DEFAULT NULL,
  `price_full_day` DECIMAL(12,4) DEFAULT NULL,
  `phone_whatsapp` VARCHAR(255) DEFAULT NULL,
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `years_experience` INT DEFAULT NULL,
  `specialties` JSON DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_guides_city` (`city`),
  KEY `idx_guides_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `hidden_gem_places` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `area` VARCHAR(191) DEFAULT NULL,
  `region` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `why_special` VARCHAR(255) DEFAULT NULL,
  `tag` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(511) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `gem_number` INT DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT NULL,
  `keywords` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_hidden_gem_places_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `home_contents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `section_key` VARCHAR(255) DEFAULT NULL,
  `section_type` VARCHAR(255) DEFAULT NULL,
  `title` VARCHAR(191) DEFAULT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `button_text` TEXT DEFAULT NULL,
  `button_link` VARCHAR(511) DEFAULT NULL,
  `image_url` VARCHAR(511) DEFAULT NULL,
  `icon` VARCHAR(191) DEFAULT NULL,
  `badge_text` TEXT DEFAULT NULL,
  `color_scheme` VARCHAR(191) DEFAULT NULL,
  `sort_order` INT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT NULL,
  `extra_json` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `horse_ridings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `experience_type` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(12,2) DEFAULT NULL,
  `price_type` VARCHAR(255) DEFAULT NULL,
  `duration` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `discount_code` VARCHAR(255) DEFAULT NULL,
  `skill_level` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT NULL,
  `discount_clicks` INT DEFAULT NULL,
  `whatsapp_clicks` INT DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_horse_ridings_city` (`city`),
  KEY `idx_horse_ridings_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `listings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `google_maps_link` VARCHAR(511) DEFAULT NULL,
  `website` VARCHAR(511) DEFAULT NULL,
  `image` VARCHAR(511) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `latitude` DECIMAL(12,4) DEFAULT NULL,
  `longitude` DECIMAL(12,4) DEFAULT NULL,
  `google_place_id` VARCHAR(191) DEFAULT NULL,
  `source` VARCHAR(191) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `last_synced` VARCHAR(255) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT NULL,
  `featured_until` VARCHAR(255) DEFAULT NULL,
  `price_range` VARCHAR(255) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_listings_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `live_situations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(191) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `weather` VARCHAR(255) DEFAULT NULL,
  `temperature_c` DECIMAL(12,4) DEFAULT NULL,
  `traffic` VARCHAR(255) DEFAULT NULL,
  `alerts` VARCHAR(255) DEFAULT NULL,
  `events` VARCHAR(255) DEFAULT NULL,
  `recommendation` VARCHAR(255) DEFAULT NULL,
  `prices_summary` TEXT DEFAULT NULL,
  `meal_range` VARCHAR(255) DEFAULT NULL,
  `coffee_range` VARCHAR(255) DEFAULT NULL,
  `taxi_range` VARCHAR(255) DEFAULT NULL,
  `usd_to_egp` DECIMAL(12,4) DEFAULT NULL,
  `eur_to_egp` DECIMAL(12,4) DEFAULT NULL,
  `rub_to_egp` DECIMAL(12,4) DEFAULT NULL,
  `gbp_to_egp` DECIMAL(12,4) DEFAULT NULL,
  `currency_note` TEXT DEFAULT NULL,
  `update_date` DATE DEFAULT NULL,
  `source` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_live_situations_city` (`city`),
  KEY `idx_live_situations_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `local_contacts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `service_type` VARCHAR(255) DEFAULT NULL,
  `languages` JSON DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `phone_whatsapp` VARCHAR(255) DEFAULT NULL,
  `photo_url` VARCHAR(511) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT NULL,
  `price_range` VARCHAR(255) DEFAULT NULL,
  `specialties` JSON DEFAULT NULL,
  `years_experience` INT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_local_contacts_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `local_questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question_text` TEXT DEFAULT NULL,
  `user_nationality` VARCHAR(255) DEFAULT NULL,
  `user_flag` VARCHAR(255) DEFAULT NULL,
  `assigned_persona_id` VARCHAR(191) DEFAULT NULL,
  `persona_name` VARCHAR(255) DEFAULT NULL,
  `persona_flag` VARCHAR(255) DEFAULT NULL,
  `persona_city` VARCHAR(255) DEFAULT NULL,
  `answer_text` TEXT DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_local_questions_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `long_stay_services` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `price_info` VARCHAR(255) DEFAULT NULL,
  `contact_phone` VARCHAR(80) DEFAULT NULL,
  `website` VARCHAR(511) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `languages` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_long_stay_services_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `nightlife_venues` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `type` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `price_range` VARCHAR(255) DEFAULT NULL,
  `safety_rating` VARCHAR(255) DEFAULT NULL,
  `entry_fee` DECIMAL(12,4) DEFAULT NULL,
  `dress_code` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_nightlife_venues_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `places` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL,
  `price` DECIMAL(12,2) DEFAULT NULL,
  `price_unit` VARCHAR(191) DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `google_maps_link` VARCHAR(511) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT NULL,
  `is_available` TINYINT(1) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `host_email` VARCHAR(191) DEFAULT NULL,
  `host_name` VARCHAR(191) DEFAULT NULL,
  `inquiry_count` INT DEFAULT NULL,
  `amenities` JSON DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_places_city` (`city`),
  KEY `idx_places_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `price_entries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `min_price` DECIMAL(12,2) DEFAULT NULL,
  `max_price` DECIMAL(12,2) DEFAULT NULL,
  `currency` VARCHAR(191) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `source_label` VARCHAR(255) DEFAULT NULL,
  `alert_type` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT NULL,
  `pending_suggestion` VARCHAR(255) DEFAULT NULL,
  `last_verified_date` DATE DEFAULT NULL,
  `item` VARCHAR(255) DEFAULT NULL,
  `local_price` DECIMAL(12,2) DEFAULT NULL,
  `fair_tourist_price` DECIMAL(12,2) DEFAULT NULL,
  `scam_price` DECIMAL(12,2) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_price_entries_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `price_insights` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_name` VARCHAR(191) DEFAULT NULL,
  `location_label` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL,
  `reported_tourist_price` DECIMAL(12,4) DEFAULT NULL,
  `local_price_min` DECIMAL(12,4) DEFAULT NULL,
  `local_price_max` DECIMAL(12,4) DEFAULT NULL,
  `report_count` INT DEFAULT NULL,
  `trust_label` VARCHAR(255) DEFAULT NULL,
  `context_note` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_price_insights_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `remote_work_spots` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `type` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `wifi_speed_mbps` DECIMAL(12,4) DEFAULT NULL,
  `wifi_reliability` VARCHAR(255) DEFAULT NULL,
  `price_per_hour` DECIMAL(12,4) DEFAULT NULL,
  `price_per_day` DECIMAL(12,4) DEFAULT NULL,
  `power_outlets` TINYINT(1) DEFAULT NULL,
  `ac` TINYINT(1) DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_remote_work_spots_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_id` VARCHAR(191) DEFAULT NULL,
  `rating` DECIMAL(8,4) DEFAULT NULL,
  `comment` TEXT DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `author_country` VARCHAR(191) DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_reviews_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ride_shares` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `from_city` VARCHAR(255) DEFAULT NULL,
  `to_city` VARCHAR(255) DEFAULT NULL,
  `departure_date` DATE DEFAULT NULL,
  `departure_time` VARCHAR(255) DEFAULT NULL,
  `seats_available` INT DEFAULT NULL,
  `price_per_seat` DECIMAL(12,4) DEFAULT NULL,
  `contact_name` VARCHAR(255) DEFAULT NULL,
  `contact_phone` VARCHAR(80) DEFAULT NULL,
  `national_id_last4` VARCHAR(80) DEFAULT NULL,
  `plate_number` VARCHAR(255) DEFAULT NULL,
  `car_type` VARCHAR(255) DEFAULT NULL,
  `gender_preference` VARCHAR(255) DEFAULT NULL,
  `driver_rating` DECIMAL(12,4) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_ride_shares_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `saved_itineraries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(191) DEFAULT NULL,
  `city_label` VARCHAR(255) DEFAULT NULL,
  `days` INT DEFAULT NULL,
  `budget` VARCHAR(255) DEFAULT NULL,
  `interests` VARCHAR(255) DEFAULT NULL,
  `travelers` INT DEFAULT NULL,
  `itinerary_text` TEXT DEFAULT NULL,
  `user_email` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_saved_itineraries_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `scam_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL,
  `severity` VARCHAR(255) DEFAULT NULL,
  `latitude` DECIMAL(12,4) DEFAULT NULL,
  `longitude` DECIMAL(12,4) DEFAULT NULL,
  `location_name` VARCHAR(191) DEFAULT NULL,
  `amount_lost` DECIMAL(12,2) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `upvotes` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_scam_reports_city` (`city`),
  KEY `idx_scam_reports_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `services` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `name_ru` VARCHAR(255) DEFAULT NULL,
  `name_de` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `description_ru` TEXT DEFAULT NULL,
  `description_de` TEXT DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `website` VARCHAR(511) DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `latitude` DECIMAL(12,4) DEFAULT NULL,
  `longitude` DECIMAL(12,4) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT NULL,
  `scam_score` DECIMAL(8,4) DEFAULT NULL,
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT NULL,
  `price_range` VARCHAR(255) DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `commission_rate` DECIMAL(8,4) DEFAULT NULL,
  `subscription_tier` VARCHAR(255) DEFAULT NULL,
  `discount_views` INT DEFAULT NULL,
  `discount_claims` INT DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_services_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tour_operators` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_name` VARCHAR(191) DEFAULT NULL,
  `logo_url` VARCHAR(511) DEFAULT NULL,
  `license_number` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `cities_covered` JSON DEFAULT NULL,
  `languages` JSON DEFAULT NULL,
  `tour_packages` JSON DEFAULT NULL,
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `complaint_count` INT DEFAULT NULL,
  `agreed_to_terms` TINYINT(1) DEFAULT NULL,
  `refund_policy` TEXT DEFAULT NULL,
  `phone_internal` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(191) DEFAULT NULL,
  `interests_tags` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_tour_operators_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tourist_deals` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `service_id` VARCHAR(191) DEFAULT NULL,
  `discount_percent` DECIMAL(12,4) DEFAULT NULL,
  `original_price` DECIMAL(12,4) DEFAULT NULL,
  `deal_price` DECIMAL(12,4) DEFAULT NULL,
  `valid_until` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_tourist_deals_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tourist_stories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `tourist_nationality` VARCHAR(255) DEFAULT NULL,
  `story_type` TEXT DEFAULT NULL,
  `what_happened` TEXT DEFAULT NULL,
  `how_handled` TEXT DEFAULT NULL,
  `lesson_learned` TEXT DEFAULT NULL,
  `is_positive` TINYINT(1) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `upvotes` INT DEFAULT NULL,
  `author_name` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_tourist_stories_city` (`city`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `verified_drivers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(191) DEFAULT NULL,
  `photo_url` VARCHAR(511) DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `cities_covered` JSON DEFAULT NULL,
  `languages` JSON DEFAULT NULL,
  `car_model` VARCHAR(255) DEFAULT NULL,
  `car_year` INT DEFAULT NULL,
  `car_color` VARCHAR(255) DEFAULT NULL,
  `plate_number` VARCHAR(255) DEFAULT NULL,
  `national_id_last4` VARCHAR(80) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `price_routes` JSON DEFAULT NULL,
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL,
  `commission_rate` DECIMAL(8,4) DEFAULT NULL,
  `total_rides` INT DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_verified_drivers_status` (`status`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
