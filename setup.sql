-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 21, 2025 at 05:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_campus`
--

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `category`, `latitude`, `longitude`, `description`) VALUES
(1, 'Computer Science and Engineering', 'Departments', 23.21684000, 77.40937600, 'CSE Department Block - A & B\r\n'),
(2, 'Mechanical Engineering', 'Departments', 23.21436000, 77.40838000, 'Mechanical labs and workshops'),
(3, 'Civil Engineering', 'Departments', 23.21459000, 77.40750000, 'Civil Engineering Labs and Seminar Hall'),
(4, 'Electronics and Communication', 'Departments', 23.21659000, 77.40730000, 'Electronics &Communication technology labs'),
(5, 'Neelam Food Centre', 'Food', 23.21515000, 77.40313000, 'Main dining area with diverse food options'),
(6, 'Top N Town', 'Food', 23.21720400, 77.40402000, 'Quick snacks and dairy products'),
(7, 'Susangat: The Taste of MANIT', 'Food', 23.21257000, 77.41147000, 'Veg Food and Thali'),
(8, 'MANIT Canteen', 'Food', 23.21543100, 77.40654800, 'Canteen for students'),
(9, 'Main Building', 'Building', 23.21640800, 77.40585300, 'Director\'s Office and Other Deparments'),
(10, 'Central Library', 'Building', 23.21565600, 77.40758800, 'Extensive collection of books and digital resources'),
(11, 'Academic Building', 'Building', 23.21765400, 77.40384300, 'Dean, Examination Office'),
(12, 'Sports Complex', 'Building', 23.21221500, 77.40619900, 'Indoor and outdoor sports facilities'),
(13, 'Lotus Lake', 'Place', 23.21132000, 77.40042000, 'Artificial lake and boat club'),
(14, 'MANIT Park', 'Place', 23.21652400, 77.40509800, 'Green space for relaxation'),
(15, 'Main Gate', 'Place', 23.22088300, 77.40400200, 'Primary entrance near Link Road Number 3'),
(16, 'Stationary', 'Shop', 23.21503300, 77.40321100, 'Basic stores for student needs'),
(17, 'NTB (New Teaching Block)', 'Building', 23.21750000, 77.40852000, '1st year classes block'),
(18, 'DASA Shop', 'Shop', 23.20978800, 77.40940900, 'Boys Hostel Stationary'),
(19, 'Rolta Incubation Centre', 'Building', 23.21618000, 77.40439000, 'Place for startup incubation'),
(20, 'Hotspot', 'Food', 23.21750400, 77.40610400, 'Famous spot for food');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
