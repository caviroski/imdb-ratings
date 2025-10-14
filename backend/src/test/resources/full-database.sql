-- Database: imdb
-- MySQL dump compatible with GitHub Actions

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- ----------------------------
-- Table structure for imdb_ratings
-- ----------------------------
DROP TABLE IF EXISTS `imdb_ratings`;
CREATE TABLE `imdb_ratings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` varchar(255),
  `original_title` varchar(255),
  `imdb_const` varchar(255),
  `directors` varchar(2500),
  `genres` varchar(255),
  `year` integer,
  `runtime_minutes` integer,
  `country_of_origin` varchar(255),
  `date_rated` date,
  `title_type` varchar(255),
  `your_rating` integer,
  `url` varchar(500),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_imdb_const` (`imdb_const`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for imdb_contains
-- ----------------------------
DROP TABLE IF EXISTS `imdb_contains`;
CREATE TABLE `imdb_contains` (
  `imdb_const` BIGINT NOT NULL,
  `file_date` varchar(255) DEFAULT NULL,
  KEY `FK_imdb_contains` (`imdb_const`),
  CONSTRAINT `FK_imdb_contains` FOREIGN KEY (`imdb_const`) REFERENCES `imdb_ratings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for imdb_num_votes
-- ----------------------------
DROP TABLE IF EXISTS `imdb_num_votes`;
CREATE TABLE `imdb_num_votes` (
  `imdb_const` BIGINT NOT NULL,
  `num_votes` integer,
  `file_date` varchar(255) NOT NULL,
  PRIMARY KEY (`imdb_const`, `file_date`),
  CONSTRAINT `FK_imdb_num_votes` FOREIGN KEY (`imdb_const`) REFERENCES `imdb_ratings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for imdb_ratings_map
-- ----------------------------
DROP TABLE IF EXISTS `imdb_ratings_map`;
CREATE TABLE `imdb_ratings_map` (
  `imdb_const` BIGINT NOT NULL,
  `imdb_rating` float(53),
  `file_date` varchar(255) NOT NULL,
  PRIMARY KEY (`imdb_const`, `file_date`),
  CONSTRAINT `FK_imdb_ratings_map` FOREIGN KEY (`imdb_const`) REFERENCES `imdb_ratings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Insert data (example)
-- ----------------------------
LOCK TABLES `imdb_ratings` WRITE;
INSERT INTO `imdb_ratings` (`id`, `title`, `imdb_const`) VALUES (1, 'Movie 1', 'tt0000001');
INSERT INTO `imdb_ratings` (`id`, `title`, `imdb_const`) VALUES (2, 'Movie 2', 'tt0000002');
UNLOCK TABLES;

LOCK TABLES `imdb_contains` WRITE;
INSERT INTO `imdb_contains` (`imdb_const`, `file_date`) VALUES (1, '25.09.2025');
INSERT INTO `imdb_contains` (`imdb_const`, `file_date`) VALUES (2, '25.09.2025');
UNLOCK TABLES;

LOCK TABLES `imdb_num_votes` WRITE;
INSERT INTO `imdb_num_votes` (`imdb_const`, `num_votes`, `file_date`) VALUES (1, 1000, '25.09.2025');
UNLOCK TABLES;

LOCK TABLES `imdb_ratings_map` WRITE;
INSERT INTO `imdb_ratings_map` (`imdb_const`, `imdb_rating`, `file_date`) VALUES (1, 7.5, '25.09.2025');
UNLOCK TABLES;

/*!40014 SET FOREIGN_KEY_CHECKS=1 */;
/*!40014 SET UNIQUE_CHECKS=1 */;
