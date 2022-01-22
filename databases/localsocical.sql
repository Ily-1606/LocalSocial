-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.14-MariaDB-log - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for localsocical
CREATE DATABASE IF NOT EXISTS `localsocical` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `localsocical`;

-- Dumping structure for table localsocical.table_account
CREATE TABLE IF NOT EXISTS `table_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT '/assets/img/male.png',
  `face_recognition` varchar(255) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table localsocical.table_account: ~2 rows (approximately)
/*!40000 ALTER TABLE `table_account` DISABLE KEYS */;
INSERT INTO `table_account` (`id`, `first_name`, `last_name`, `email`, `password`, `avatar`, `face_recognition`, `phone_number`, `gender`, `create_time`) VALUES
	(1, 'Nguyen', 'Nguyen', 'khuonmatdangthuong45@gmail.com', '6d590d0d8702e8132a77913bf707de45', '/storage/avatar/for_user_1-1642852175.jpg', '/storage/face/for_user_1-1642852175.jpg', '0328267412', 1, '2020-11-07 16:21:42'),
	(2, 'Nguyễn', 'Nguyên', 'no1.ily1606@gmail.com', '6d590d0d8702e8132a77913bf707de45', '/assets/img/male.png', NULL, '0328267412', 1, '2020-11-11 14:14:45'),
	(3, 'Nguyen', 'Nguyen', 'test@gmail.com', '6d590d0d8702e8132a77913bf707de45', '/assets/img/male.png', NULL, '0328267412', 1, '2022-01-22 12:24:23');
/*!40000 ALTER TABLE `table_account` ENABLE KEYS */;

-- Dumping structure for table localsocical.table_config
CREATE TABLE IF NOT EXISTS `table_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `secure_code` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `update_time` timestamp NULL DEFAULT current_timestamp(),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table localsocical.table_config: ~1 rows (approximately)
/*!40000 ALTER TABLE `table_config` DISABLE KEYS */;
INSERT INTO `table_config` (`id`, `secure_code`, `email`, `update_time`) VALUES
	(1, '123456', '@gmail.com', '2022-01-22 18:47:17');
/*!40000 ALTER TABLE `table_config` ENABLE KEYS */;

-- Dumping structure for table localsocical.table_messages
CREATE TABLE IF NOT EXISTS `table_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `thread_id` int(11) NOT NULL,
  `message_text` text DEFAULT NULL,
  `attachment` text DEFAULT NULL,
  `user_send` int(11) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `hidden` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table localsocical.table_messages: ~0 rows (approximately)
/*!40000 ALTER TABLE `table_messages` DISABLE KEYS */;
INSERT INTO `table_messages` (`id`, `thread_id`, `message_text`, `attachment`, `user_send`, `create_time`, `hidden`) VALUES
	(1, 1, 'hello', NULL, 1, '2022-01-22 12:22:59', 0),
	(2, 1, '[like]', NULL, 2, '2022-01-22 12:23:29', 0),
	(3, 1, NULL, '/storage/1642854218.jpg', 2, '2022-01-22 12:23:38', 0),
	(4, 2, 'Hi', NULL, 3, '2022-01-22 12:24:30', 0),
	(5, 2, '[like]', NULL, 1, '2022-01-22 12:24:37', 0),
	(6, 4, 'Hi', NULL, 1, '2022-01-22 12:27:13', 0),
	(7, 5, 'Hello', NULL, 1, '2022-01-22 12:33:44', 0),
	(8, 5, '[like]', NULL, 1, '2022-01-22 12:36:51', 0),
	(9, 5, '[like]', NULL, 3, '2022-01-22 12:37:20', 0),
	(10, 5, 'gajgajg', NULL, 3, '2022-01-22 12:37:22', 0),
	(11, 5, 'aga', NULL, 1, '2022-01-22 12:37:27', 0);
/*!40000 ALTER TABLE `table_messages` ENABLE KEYS */;

-- Dumping structure for table localsocical.table_thread
CREATE TABLE IF NOT EXISTS `table_thread` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(30) DEFAULT 'per_to_per',
  `member_list` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`member_list`)),
  `adminnitranstor` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`adminnitranstor`)),
  `name_room` varchar(255) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_time` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table localsocical.table_thread: ~0 rows (approximately)
/*!40000 ALTER TABLE `table_thread` DISABLE KEYS */;
INSERT INTO `table_thread` (`id`, `type`, `member_list`, `adminnitranstor`, `name_room`, `create_time`, `update_time`) VALUES
	(1, 'per_to_per', '["1","2"]', NULL, NULL, '2022-01-22 12:21:23', 1642854209),
	(2, 'per_to_per', '["3","1"]', NULL, NULL, '2022-01-22 12:24:28', 1642854277),
	(5, 'group', '["1","2","3"]', '["1"]', 'UKN', '2022-01-22 12:33:40', 1642855047);
/*!40000 ALTER TABLE `table_thread` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
