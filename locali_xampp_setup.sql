-- ============================================================================
-- LOCALI EGYPT - Complete 29-Table MySQL Schema for Local XAMPP Development
-- Database: locali_egypt
-- Created: May 2026
-- ============================================================================

-- Create database with proper collation for Arabic/UTF-8 support
CREATE DATABASE IF NOT EXISTS `locali_egypt` 
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `locali_egypt`;

-- ============================================================================
-- DROP EXISTING TABLES (if upgrading)
-- ============================================================================
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
DROP TABLE IF EXISTS `cafe`;
DROP TABLE IF EXISTS `restaurant`;
DROP TABLE IF EXISTS `users`;

-- ============================================================================
-- TABLE 1: USERS - Authentication & user profiles
-- ============================================================================
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(191) DEFAULT NULL COMMENT 'bcryptjs hash, min 10 rounds',
  `role` ENUM('admin','driver','service_lister','traveler') NOT NULL DEFAULT 'traveler',
  `phone` VARCHAR(80) DEFAULT NULL,
  `city` VARCHAR(80) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `metadata` JSON DEFAULT NULL COMMENT 'Extra user data - profile photo URL, preferences, etc',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 2: APARTMENTS - Accommodation listings
-- ============================================================================
CREATE TABLE `apartments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `host_name` VARCHAR(191) DEFAULT NULL,
  `host_phone` VARCHAR(255) DEFAULT NULL,
  `title` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `area` VARCHAR(191) DEFAULT NULL,
  `photos` JSON DEFAULT NULL COMMENT 'Array of photo URLs',
  `price_per_night_egp` DECIMAL(12,2) DEFAULT NULL,
  `capacity` INT DEFAULT NULL,
  `bedrooms` INT DEFAULT NULL,
  `bathrooms` INT DEFAULT NULL,
  `amenities` JSON DEFAULT NULL COMMENT 'Array of amenity strings: WiFi, AC, etc',
  `rules` TEXT DEFAULT NULL,
  `min_nights` INT DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT 'active',
  `commission_rate` DECIMAL(8,4) DEFAULT NULL,
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
  `discount_views` INT DEFAULT 0,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_apartments_city` (`city`),
  KEY `idx_apartments_status` (`status`),
  KEY `idx_apartments_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 3: BOAT_TRIPS - Boat excursions & water tours
-- ============================================================================
CREATE TABLE `boat_trips` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `boat_name` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `boat_type` VARCHAR(255) DEFAULT NULL COMMENT 'speedboat, catamaran, felucca, etc',
  `price` DECIMAL(12,2) DEFAULT NULL,
  `price_type` VARCHAR(255) DEFAULT NULL COMMENT 'per_person, per_boat, per_hour',
  `capacity` INT DEFAULT NULL,
  `duration_hours` DECIMAL(12,4) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `discount_code` VARCHAR(255) DEFAULT NULL,
  `includes` VARCHAR(255) DEFAULT NULL COMMENT 'lunch, equipment, guide, etc',
  `status` VARCHAR(191) DEFAULT 'active',
  `is_featured` TINYINT(1) DEFAULT NULL,
  `discount_clicks` INT DEFAULT 0,
  `whatsapp_clicks` INT DEFAULT 0,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boat_trips_city` (`city`),
  KEY `idx_boat_trips_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 4: CURRENCY_RATES - Real-time exchange rates (EGP conversion)
-- ============================================================================
CREATE TABLE `currency_rates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usd` DECIMAL(12,4) DEFAULT NULL COMMENT 'USD to EGP',
  `eur` DECIMAL(12,4) DEFAULT NULL COMMENT 'EUR to EGP',
  `gbp` DECIMAL(12,4) DEFAULT NULL COMMENT 'GBP to EGP',
  `rub` DECIMAL(12,4) DEFAULT NULL COMMENT 'RUB to EGP',
  `pln` DECIMAL(12,4) DEFAULT NULL COMMENT 'PLN to EGP',
  `cad` DECIMAL(12,4) DEFAULT NULL COMMENT 'CAD to EGP',
  `aud` DECIMAL(12,4) DEFAULT NULL COMMENT 'AUD to EGP',
  `sar` DECIMAL(12,4) DEFAULT NULL COMMENT 'SAR to EGP',
  `rate_date` DATE DEFAULT NULL,
  `source` VARCHAR(191) DEFAULT NULL COMMENT 'google, openexchangerates, etc',
  `change_usd` DECIMAL(8,4) DEFAULT NULL COMMENT 'Percentage change from previous day',
  `change_eur` DECIMAL(8,4) DEFAULT NULL,
  `alert` VARCHAR(255) DEFAULT NULL COMMENT 'High volatility warning if applicable',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_currency_rates_date` (`rate_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 5: GUIDES - Licensed tour guides
-- ============================================================================
CREATE TABLE `guides` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(191) DEFAULT NULL,
  `photo_url` VARCHAR(511) DEFAULT NULL,
  `license_id` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `cities_covered` JSON DEFAULT NULL COMMENT 'Array of cities: Luxor, Aswan, etc',
  `languages` JSON DEFAULT NULL COMMENT 'Array of language codes: en, ru, de, etc',
  `tour_types` JSON DEFAULT NULL COMMENT 'Array: ancient, adventure, diving, etc',
  `description` TEXT DEFAULT NULL,
  `price_half_day` DECIMAL(12,4) DEFAULT NULL,
  `price_full_day` DECIMAL(12,4) DEFAULT NULL,
  `phone_whatsapp` VARCHAR(255) DEFAULT NULL,
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
  `status` VARCHAR(191) DEFAULT 'active',
  `is_verified` TINYINT(1) DEFAULT NULL,
  `years_experience` INT DEFAULT NULL,
  `specialties` JSON DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guides_city` (`city`),
  KEY `idx_guides_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 6: HIDDEN_GEM_PLACES - Secret, lesser-known attractions (30 gems per city)
-- ============================================================================
CREATE TABLE `hidden_gem_places` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `area` VARCHAR(191) DEFAULT NULL,
  `region` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `why_special` VARCHAR(255) DEFAULT NULL,
  `tag` VARCHAR(255) DEFAULT NULL COMMENT 'photography, hiking, food, culture, etc',
  `image_url` VARCHAR(511) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `photos` JSON DEFAULT NULL COMMENT 'Array of additional photo URLs',
  `gem_number` INT DEFAULT NULL COMMENT 'Rank 1-30 per city',
  `is_published` TINYINT(1) DEFAULT 1,
  `keywords` VARCHAR(255) DEFAULT NULL COMMENT 'For search: avoid crowds, secret, local',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hidden_gem_places_city` (`city`),
  KEY `idx_hidden_gem_places_tag` (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 7: HOME_CONTENT - Dynamic homepage sections (CMS)
-- ============================================================================
CREATE TABLE `home_contents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `section_key` VARCHAR(255) DEFAULT NULL COMMENT 'hero, features, testimonials, etc',
  `section_type` VARCHAR(255) DEFAULT NULL COMMENT 'banner, cards, list, etc',
  `title` VARCHAR(191) DEFAULT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `button_text` TEXT DEFAULT NULL,
  `button_link` VARCHAR(511) DEFAULT NULL,
  `image_url` VARCHAR(511) DEFAULT NULL,
  `icon` VARCHAR(191) DEFAULT NULL,
  `badge_text` TEXT DEFAULT NULL,
  `color_scheme` VARCHAR(191) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `extra_json` VARCHAR(255) DEFAULT NULL COMMENT 'Additional metadata',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_home_contents_active` (`is_active`),
  KEY `idx_home_contents_section` (`section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 8: HORSE_RIDINGS - Horseback riding experiences
-- ============================================================================
CREATE TABLE `horse_ridings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `experience_type` VARCHAR(255) DEFAULT NULL COMMENT 'desert, beach, cultural, etc',
  `price` DECIMAL(12,2) DEFAULT NULL,
  `price_type` VARCHAR(255) DEFAULT NULL COMMENT 'per_person, per_hour, etc',
  `duration` VARCHAR(255) DEFAULT NULL COMMENT '30 minutes, 1 hour, half-day, etc',
  `description` TEXT DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `discount_code` VARCHAR(255) DEFAULT NULL,
  `skill_level` VARCHAR(255) DEFAULT NULL COMMENT 'beginner, intermediate, advanced',
  `status` VARCHAR(191) DEFAULT 'active',
  `is_featured` TINYINT(1) DEFAULT NULL,
  `discount_clicks` INT DEFAULT 0,
  `whatsapp_clicks` INT DEFAULT 0,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_horse_ridings_city` (`city`),
  KEY `idx_horse_ridings_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 9: LISTINGS - General business directory (Google Places synced)
-- ============================================================================
CREATE TABLE `listings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
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
  `source` VARCHAR(191) DEFAULT 'manual' COMMENT 'manual, google_places, user_submitted',
  `is_verified` TINYINT(1) DEFAULT NULL,
  `last_synced` VARCHAR(255) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT NULL,
  `featured_until` VARCHAR(255) DEFAULT NULL,
  `price_range` VARCHAR(255) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_listings_city` (`city`),
  KEY `idx_listings_category` (`category`),
  KEY `idx_listings_google_place_id` (`google_place_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 10: LIVE_SITUATIONS - Real-time city status (weather, traffic, rates)
-- ============================================================================
CREATE TABLE `live_situations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(191) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT NULL COMMENT 'all_good, caution, alert',
  `weather` VARCHAR(255) DEFAULT NULL,
  `temperature_c` DECIMAL(12,4) DEFAULT NULL,
  `traffic` VARCHAR(255) DEFAULT NULL COMMENT 'light, moderate, heavy',
  `alerts` VARCHAR(255) DEFAULT NULL,
  `events` VARCHAR(255) DEFAULT NULL,
  `recommendation` VARCHAR(255) DEFAULT NULL,
  `prices_summary` TEXT DEFAULT NULL,
  `meal_range` VARCHAR(255) DEFAULT NULL COMMENT 'e.g., 50-150 EGP',
  `coffee_range` VARCHAR(255) DEFAULT NULL,
  `taxi_range` VARCHAR(255) DEFAULT NULL,
  `usd_to_egp` DECIMAL(12,4) DEFAULT NULL,
  `eur_to_egp` DECIMAL(12,4) DEFAULT NULL,
  `rub_to_egp` DECIMAL(12,4) DEFAULT NULL,
  `gbp_to_egp` DECIMAL(12,4) DEFAULT NULL,
  `currency_note` TEXT DEFAULT NULL,
  `update_date` DATE DEFAULT NULL,
  `source` VARCHAR(191) DEFAULT 'automated',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_live_situations_city` (`city`),
  KEY `idx_live_situations_status` (`status`),
  UNIQUE KEY `unique_city_date` (`city`, `update_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 11: LOCAL_CONTACTS - Local service providers (taxi drivers, fixers, etc)
-- ============================================================================
CREATE TABLE `local_contacts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `service_type` VARCHAR(255) DEFAULT NULL COMMENT 'taxi_driver, fixer, translator, etc',
  `languages` JSON DEFAULT NULL COMMENT 'Array of language codes',
  `description` TEXT DEFAULT NULL,
  `phone_whatsapp` VARCHAR(255) DEFAULT NULL,
  `photo_url` VARCHAR(511) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
  `price_range` VARCHAR(255) DEFAULT NULL,
  `specialties` JSON DEFAULT NULL,
  `years_experience` INT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_local_contacts_city` (`city`),
  KEY `idx_local_contacts_service_type` (`service_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 12: LOCAL_QUESTIONS - Q&A from tourists with AI personas answering
-- ============================================================================
CREATE TABLE `local_questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question_text` TEXT DEFAULT NULL,
  `user_nationality` VARCHAR(255) DEFAULT NULL,
  `user_flag` VARCHAR(255) DEFAULT NULL,
  `assigned_persona_id` VARCHAR(191) DEFAULT NULL,
  `persona_name` VARCHAR(255) DEFAULT NULL COMMENT 'e.g., Ahmed (Egyptian), Tatiana (Russian)',
  `persona_flag` VARCHAR(255) DEFAULT NULL,
  `persona_city` VARCHAR(255) DEFAULT NULL,
  `answer_text` TEXT DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT 'pending' COMMENT 'pending, answered, verified',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_local_questions_status` (`status`),
  KEY `idx_local_questions_persona_city` (`persona_city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 13: LONG_STAY_SERVICES - Services for digital nomads & long-term residents
-- ============================================================================
CREATE TABLE `long_stay_services` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL COMMENT 'visa, housing, coworking, banking, etc',
  `description` TEXT DEFAULT NULL,
  `price_info` VARCHAR(255) DEFAULT NULL,
  `contact_phone` VARCHAR(80) DEFAULT NULL,
  `website` VARCHAR(511) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `languages` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_long_stay_services_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 14: NIGHTLIFE_VENUES - Bars, clubs, lounges
-- ============================================================================
CREATE TABLE `nightlife_venues` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `type` VARCHAR(191) DEFAULT NULL COMMENT 'bar, club, lounge, beach_club, etc',
  `description` TEXT DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `price_range` VARCHAR(255) DEFAULT NULL,
  `safety_rating` VARCHAR(255) DEFAULT NULL COMMENT 'safe, caution, avoid',
  `entry_fee` DECIMAL(12,4) DEFAULT NULL,
  `dress_code` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nightlife_venues_city` (`city`),
  KEY `idx_nightlife_venues_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 15: PLACES - Activities, attractions, experiences
-- ============================================================================
CREATE TABLE `places` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL COMMENT 'diving, hiking, cultural, food, etc',
  `price` DECIMAL(12,2) DEFAULT NULL,
  `price_unit` VARCHAR(191) DEFAULT NULL COMMENT 'per_person, per_group, per_hour',
  `images` JSON DEFAULT NULL COMMENT 'Array of image URLs',
  `main_image` VARCHAR(511) DEFAULT NULL,
  `google_maps_link` VARCHAR(511) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
  `is_available` TINYINT(1) DEFAULT 1,
  `status` VARCHAR(191) DEFAULT 'active',
  `host_email` VARCHAR(191) DEFAULT NULL,
  `host_name` VARCHAR(191) DEFAULT NULL,
  `inquiry_count` INT DEFAULT 0,
  `amenities` JSON DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_places_city` (`city`),
  KEY `idx_places_category` (`category`),
  KEY `idx_places_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 16: PRICE_ENTRIES - Individual service pricing database
-- ============================================================================
CREATE TABLE `price_entries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL COMMENT 'taxi, diving, hotel, food, etc',
  `city` VARCHAR(191) DEFAULT NULL,
  `min_price` DECIMAL(12,2) DEFAULT NULL,
  `max_price` DECIMAL(12,2) DEFAULT NULL,
  `currency` VARCHAR(191) DEFAULT 'EGP',
  `notes` TEXT DEFAULT NULL,
  `source_label` VARCHAR(255) DEFAULT NULL,
  `alert_type` VARCHAR(255) DEFAULT NULL COMMENT 'fair, overcharged, scam',
  `is_active` TINYINT(1) DEFAULT 1,
  `pending_suggestion` VARCHAR(255) DEFAULT NULL,
  `last_verified_date` DATE DEFAULT NULL,
  `item` VARCHAR(255) DEFAULT NULL COMMENT 'e.g., Taxi Naama Bay to Old Market',
  `local_price` DECIMAL(12,2) DEFAULT NULL,
  `fair_tourist_price` DECIMAL(12,2) DEFAULT NULL,
  `scam_price` DECIMAL(12,2) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_price_entries_city` (`city`),
  KEY `idx_price_entries_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 17: PRICE_INSIGHTS - Aggregated pricing intelligence
-- ============================================================================
CREATE TABLE `price_insights` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_name` VARCHAR(191) DEFAULT NULL,
  `location_label` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL,
  `reported_tourist_price` DECIMAL(12,4) DEFAULT NULL,
  `local_price_min` DECIMAL(12,4) DEFAULT NULL,
  `local_price_max` DECIMAL(12,4) DEFAULT NULL,
  `report_count` INT DEFAULT 0 COMMENT 'Number of reports included in average',
  `trust_label` VARCHAR(255) DEFAULT NULL COMMENT 'high_confidence, moderate, low',
  `context_note` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_price_insights_city` (`city`),
  KEY `idx_price_insights_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 18: REMOTE_WORK_SPOTS - Coworking, cafes with WiFi for digital nomads
-- ============================================================================
CREATE TABLE `remote_work_spots` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `type` VARCHAR(191) DEFAULT NULL COMMENT 'coworking, cafe, hotel, beach_club',
  `description` TEXT DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `wifi_speed_mbps` DECIMAL(12,4) DEFAULT NULL,
  `wifi_reliability` VARCHAR(255) DEFAULT NULL COMMENT 'excellent, good, occasional',
  `price_per_hour` DECIMAL(12,4) DEFAULT NULL,
  `price_per_day` DECIMAL(12,4) DEFAULT NULL,
  `power_outlets` TINYINT(1) DEFAULT NULL,
  `ac` TINYINT(1) DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_remote_work_spots_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 19: REVIEWS - User-submitted reviews & ratings
-- ============================================================================
CREATE TABLE `reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_id` VARCHAR(191) DEFAULT NULL COMMENT 'The ID of reviewed service/place',
  `rating` DECIMAL(8,4) DEFAULT NULL COMMENT '1-5 star rating',
  `comment` TEXT DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `author_country` VARCHAR(191) DEFAULT NULL,
  `photos` JSON DEFAULT NULL COMMENT 'Array of review photo URLs',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_city` (`city`),
  KEY `idx_reviews_service_id` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 20: RIDE_SHARES - Intercity ride-sharing bulletin board
-- ============================================================================
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
  `national_id_last4` VARCHAR(80) DEFAULT NULL COMMENT 'Last 4 digits for verification',
  `plate_number` VARCHAR(255) DEFAULT NULL,
  `car_type` VARCHAR(255) DEFAULT NULL,
  `gender_preference` VARCHAR(255) DEFAULT NULL,
  `driver_rating` DECIMAL(12,4) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT 'available' COMMENT 'available, filled, cancelled',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ride_shares_status` (`status`),
  KEY `idx_ride_shares_from_to` (`from_city`, `to_city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 21: SAVED_ITINERARIES - User-saved travel itineraries
-- ============================================================================
CREATE TABLE `saved_itineraries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(191) DEFAULT NULL,
  `city_label` VARCHAR(255) DEFAULT NULL,
  `days` INT DEFAULT NULL,
  `budget` VARCHAR(255) DEFAULT NULL COMMENT 'budget, moderate, luxury',
  `interests` VARCHAR(255) DEFAULT NULL COMMENT 'CSV: diving, culture, food, etc',
  `travelers` INT DEFAULT NULL COMMENT 'Number of people',
  `itinerary_text` TEXT DEFAULT NULL COMMENT 'Full itinerary markdown',
  `user_email` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_saved_itineraries_city` (`city`),
  KEY `idx_saved_itineraries_user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 22: SCAM_REPORTS - Community-reported scams & overcharging incidents
-- ============================================================================
CREATE TABLE `scam_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(191) DEFAULT NULL COMMENT 'taxi, shopping, tour, restaurant, etc',
  `severity` VARCHAR(255) DEFAULT NULL COMMENT 'minor, moderate, severe',
  `latitude` DECIMAL(12,4) DEFAULT NULL,
  `longitude` DECIMAL(12,4) DEFAULT NULL,
  `location_name` VARCHAR(191) DEFAULT NULL,
  `amount_lost` DECIMAL(12,2) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT 'pending' COMMENT 'pending, verified, spam',
  `upvotes` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_scam_reports_city` (`city`),
  KEY `idx_scam_reports_status` (`status`),
  KEY `idx_scam_reports_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 23: SERVICES - General service directory
-- ============================================================================
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
  `scam_score` DECIMAL(8,4) DEFAULT NULL COMMENT '0-1 where 1 is high scam risk',
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
  `price_range` VARCHAR(255) DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `commission_rate` DECIMAL(8,4) DEFAULT NULL,
  `subscription_tier` VARCHAR(255) DEFAULT NULL COMMENT 'free, bronze, silver, gold',
  `discount_views` INT DEFAULT 0,
  `discount_claims` INT DEFAULT 0,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_services_city` (`city`),
  KEY `idx_services_category` (`category`),
  KEY `idx_services_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 24: TOUR_OPERATORS - Licensed tour companies
-- ============================================================================
CREATE TABLE `tour_operators` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_name` VARCHAR(191) DEFAULT NULL,
  `logo_url` VARCHAR(511) DEFAULT NULL,
  `license_number` VARCHAR(255) DEFAULT NULL COMMENT 'Egyptian Ministry of Tourism license',
  `description` TEXT DEFAULT NULL,
  `cities_covered` JSON DEFAULT NULL COMMENT 'Array of cities served',
  `languages` JSON DEFAULT NULL,
  `tour_packages` JSON DEFAULT NULL COMMENT 'Array of package details',
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
  `status` VARCHAR(191) DEFAULT 'active',
  `is_verified` TINYINT(1) DEFAULT NULL,
  `complaint_count` INT DEFAULT 0,
  `agreed_to_terms` TINYINT(1) DEFAULT NULL,
  `refund_policy` TEXT DEFAULT NULL,
  `phone_internal` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(191) DEFAULT NULL,
  `interests_tags` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tour_operators_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 25: TOURIST_DEALS - Promotional discounts & offers
-- ============================================================================
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
  `is_active` TINYINT(1) DEFAULT 1,
  `photo` VARCHAR(255) DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tourist_deals_city` (`city`),
  KEY `idx_tourist_deals_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 26: TOURIST_STORIES - User-submitted travel stories & advice
-- ============================================================================
CREATE TABLE `tourist_stories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) DEFAULT NULL,
  `city` VARCHAR(191) DEFAULT NULL,
  `tourist_nationality` VARCHAR(255) DEFAULT NULL,
  `story_type` TEXT DEFAULT NULL COMMENT 'advice, warning, experience, lesson',
  `what_happened` TEXT DEFAULT NULL,
  `how_handled` TEXT DEFAULT NULL,
  `lesson_learned` TEXT DEFAULT NULL,
  `is_positive` TINYINT(1) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `upvotes` INT DEFAULT 0,
  `author_name` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tourist_stories_city` (`city`),
  KEY `idx_tourist_stories_positive` (`is_positive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 27: VERIFIED_DRIVERS - Pre-verified taxi drivers with ratings
-- ============================================================================
CREATE TABLE `verified_drivers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(191) DEFAULT NULL,
  `photo_url` VARCHAR(511) DEFAULT NULL,
  `whatsapp` VARCHAR(80) DEFAULT NULL,
  `cities_covered` JSON DEFAULT NULL,
  `languages` JSON DEFAULT NULL COMMENT 'Array of language codes',
  `car_model` VARCHAR(255) DEFAULT NULL,
  `car_year` INT DEFAULT NULL,
  `car_color` VARCHAR(255) DEFAULT NULL,
  `plate_number` VARCHAR(255) DEFAULT NULL,
  `national_id_last4` VARCHAR(80) DEFAULT NULL COMMENT 'Last 4 digits for verification',
  `description` TEXT DEFAULT NULL,
  `price_routes` JSON DEFAULT NULL COMMENT 'Array of route pricing: {from, to, price}',
  `avg_rating` DECIMAL(8,4) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
  `is_verified` TINYINT(1) DEFAULT NULL,
  `status` VARCHAR(191) DEFAULT 'active',
  `commission_rate` DECIMAL(8,4) DEFAULT NULL,
  `total_rides` INT DEFAULT 0,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_verified_drivers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 28: RESTAURANT - Dedicated restaurant discovery feed
-- ============================================================================
CREATE TABLE `restaurant` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `area` VARCHAR(191) DEFAULT NULL,
  `cuisine` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `website` VARCHAR(511) DEFAULT NULL,
  `maps_query` VARCHAR(255) DEFAULT NULL,
  `viator_search` VARCHAR(255) DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
  `price_range` VARCHAR(50) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `is_verified` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `source` VARCHAR(100) DEFAULT NULL,
  `created_by_id` BIGINT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_restaurant_city` (`city`),
  KEY `idx_restaurant_status` (`status`),
  KEY `idx_restaurant_featured` (`is_featured`),
  KEY `idx_restaurant_created_by` (`created_by_id`),
  CONSTRAINT `fk_restaurant_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 29: CAFE - Cafe / work-friendly coffee spot directory
-- ============================================================================
CREATE TABLE `cafe` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `area` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `phone` VARCHAR(80) DEFAULT NULL,
  `website` VARCHAR(511) DEFAULT NULL,
  `maps_query` VARCHAR(255) DEFAULT NULL,
  `photos` JSON DEFAULT NULL,
  `main_image` VARCHAR(511) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT NULL,
  `review_count` INT DEFAULT 0,
  `price_range` VARCHAR(50) DEFAULT NULL,
  `wifi_speed_mbps` DECIMAL(8,2) DEFAULT NULL,
  `has_power_outlets` TINYINT(1) DEFAULT 0,
  `is_work_friendly` TINYINT(1) DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'pending',
  `is_verified` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `source` VARCHAR(100) DEFAULT NULL,
  `created_by_id` BIGINT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cafe_city` (`city`),
  KEY `idx_cafe_work_friendly` (`is_work_friendly`),
  KEY `idx_cafe_status` (`status`),
  KEY `idx_cafe_created_by` (`created_by_id`),
  CONSTRAINT `fk_cafe_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ENABLE FOREIGN KEY CHECKS
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED DATA: USERS
-- ============================================================================
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `phone`, `city`, `is_active`, `created_at`) VALUES
('Locali Admin', 'admin@locali.eg', '$2a$10$tJ0e4R7EjJ1Z2ZqJ0Z4qO.nZZq0ZqJ0Z2ZqJ0Z4qO', 'admin', '+20 100 0000000', 'sharm-el-sheikh', 1, NOW());

-- ============================================================================
-- SEED DATA: CURRENCY_RATES (May 28, 2026)
-- ============================================================================
INSERT INTO `currency_rates` (`usd`, `eur`, `gbp`, `rub`, `pln`, `cad`, `aud`, `sar`, `rate_date`, `source`, `created_at`, `updated_at`) VALUES
(53.25, 57.80, 67.50, 0.68, 13.20, 39.10, 35.80, 14.20, '2026-05-28', 'openexchangerates', NOW(), NOW());

-- ============================================================================
-- SEED DATA: HOME_CONTENTS (CMS homepage sections)
-- ============================================================================
INSERT INTO `home_contents` (`section_key`, `section_type`, `title`, `subtitle`, `description`, `button_text`, `button_link`, `is_active`, `sort_order`, `created_at`) VALUES
('hero', 'banner', 'Navigate Egypt. Like a Local.', 'Real prices. Scam alerts. Verified services.', 'Your survival guide for Egypt — transparent pricing, insider tips, and real traveler experiences.', 'Get Started', '/explore', 1, 1, NOW()),
('features', 'cards', 'How Locali Works', NULL, 'Three core features to keep you safe and save money', NULL, NULL, 1, 2, NOW()),
('pricing_intelligence', 'section', 'Pricing Intelligence', 'Know the real prices before you get ripped off', 'Fair price vs. scam price breakdown for every service in Egypt', NULL, NULL, 1, 3, NOW());

-- ============================================================================
-- SEED DATA: LIVE_SITUATIONS (Current city status)
-- ============================================================================
INSERT INTO `live_situations` (`city`, `status`, `weather`, `temperature_c`, `traffic`, `usd_to_egp`, `eur_to_egp`, `gbp_to_egp`, `rub_to_egp`, `update_date`, `created_at`) VALUES
('sharm-el-sheikh', 'all_good', 'sunny', 32, 'light', 53.25, 57.80, 67.50, 0.68, '2026-05-28', NOW()),
('hurghada', 'all_good', 'sunny', 31, 'light', 53.25, 57.80, 67.50, 0.68, '2026-05-28', NOW()),
('luxor', 'caution', 'hot', 38, 'moderate', 53.25, 57.80, 67.50, 0.68, '2026-05-28', NOW()),
('aswan', 'all_good', 'sunny', 35, 'light', 53.25, 57.80, 67.50, 0.68, '2026-05-28', NOW()),
('el-gouna', 'all_good', 'sunny', 30, 'light', 53.25, 57.80, 67.50, 0.68, '2026-05-28', NOW());

-- ============================================================================
-- Database setup complete!
-- ============================================================================
-- To import this file into XAMPP MySQL:
-- 1. Open phpMyAdmin: http://localhost/phpmyadmin
-- 2. Click "Import" tab
-- 3. Choose this file and click "Go"
-- OR use command line:
-- mysql -u root < locali_xampp_setup.sql
-- ============================================================================
