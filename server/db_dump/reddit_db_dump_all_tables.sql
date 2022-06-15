-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: reddit_db
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'My updated comment on post 1','2022-05-04 16:03:54','2022-05-04 16:03:59',1,1,NULL);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `commentvotes`
--

LOCK TABLES `commentvotes` WRITE;
/*!40000 ALTER TABLE `commentvotes` DISABLE KEYS */;
INSERT INTO `commentvotes` VALUES (-1,'2022-05-04 16:04:05','2022-05-04 16:04:05',1,1),(-1,'2022-05-04 16:08:26','2022-05-04 16:08:26',1,2);
/*!40000 ALTER TABLE `commentvotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'My First post on subreddit 1 edit1','edited some content about my first post','2022-05-04 16:03:35','2022-05-04 16:03:40',1,1);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `postvotes`
--

LOCK TABLES `postvotes` WRITE;
/*!40000 ALTER TABLE `postvotes` DISABLE KEYS */;
INSERT INTO `postvotes` VALUES (-1,'2022-05-04 16:03:46','2022-05-04 16:03:46',1,1);
/*!40000 ALTER TABLE `postvotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `subredditmember`
--

LOCK TABLES `subredditmember` WRITE;
/*!40000 ALTER TABLE `subredditmember` DISABLE KEYS */;
/*!40000 ALTER TABLE `subredditmember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `subreddits`
--

LOCK TABLES `subreddits` WRITE;
/*!40000 ALTER TABLE `subreddits` DISABLE KEYS */;
INSERT INTO `subreddits` VALUES (1,'My first subreddit edit1','A Subreddit to test the functionality',1,'2022-05-04 16:03:26','2022-05-04 16:03:31',1);
/*!40000 ALTER TABLE `subreddits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'johncoder','john',NULL,'john@gmail.com','$2a$08$RfMRkLcRSNDJDl4.h5Rgd.boLYJy6Zs2z5KMjNBPXey3xI8c9XzzK','2022-05-04 16:03:13','2022-05-04 16:03:13'),(2,'janesinger','jane',NULL,'jane@gmail.com','$2a$08$NtalLBIpbpgWU6H9XgwByegwb5Oiqkh5BHk/bi3CD9I5vsYO.Nx/K','2022-05-04 16:07:57','2022-05-04 16:07:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-05  0:02:03
