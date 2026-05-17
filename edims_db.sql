-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2026 at 12:19 PM
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
-- Database: `edims_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `auditlog`
--

CREATE TABLE `auditlog` (
  `log_id` bigint(20) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `module` varchar(100) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `createdAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auditlog`
--

INSERT INTO `auditlog` (`log_id`, `action_type`, `module`, `record_id`, `details`, `createdAt`, `user_id`) VALUES
(1, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-13 21:01:31', 104),
(2, 'CREATE', 'Challan', 2, '{\"challan_no\":\"2\",\"po_id\":1,\"delivery_date\":\"2026-05-22\",\"line_count\":1}', '2026-05-13 21:01:54', 104),
(3, 'CREATE', 'Challan', 3, '{\"challan_no\":\"3\",\"po_id\":1,\"delivery_date\":\"2026-05-14\",\"line_count\":1}', '2026-05-13 21:02:42', 104),
(4, 'CREATE', 'Bill', 1, '{\"bill_no\":\"1\",\"vendor_id\":1,\"bill_date\":\"2026-05-14\",\"challan_ids\":[2,1,3],\"bill_amount\":\"22500.00\"}', '2026-05-13 21:03:23', 104),
(5, 'CREATE', 'StockIssue', 1, '{\"item_id\":1,\"quantity_issued\":2,\"dept_id\":1,\"purpose\":\"b\",\"issue_date\":\"2026-05-14\"}', '2026-05-13 21:03:41', 104),
(6, 'UPDATE', 'Bill', 1, '{\"summary\":\"Bill #1 marked as Completed.\",\"bill_no\":\"1\"}', '2026-05-13 21:04:34', 104),
(7, 'CREATE', 'User', 106, '{\"username\":\"admin12\",\"role\":\"Staff\",\"full_name\":\"admin12\"}', '2026-05-13 21:05:42', 104),
(8, 'REQUEST', 'Auth', 106, '{\"action\":\"password_reset_email_sent\"}', '2026-05-13 21:12:00', 106),
(9, 'UPDATE', 'User', 106, '{\"action\":\"password_reset_via_token\"}', '2026-05-13 21:12:56', 106),
(10, 'REQUEST', 'Auth', 106, '{\"action\":\"password_reset_email_sent\"}', '2026-05-13 21:14:06', 106),
(11, 'UPDATE', 'User', 106, '{\"action\":\"password_reset_via_token\"}', '2026-05-13 21:14:27', 106),
(12, 'REQUEST', 'Auth', 106, '{\"action\":\"password_reset_email_sent\"}', '2026-05-13 21:15:21', 106),
(13, 'UPDATE', 'User', 106, '{\"action\":\"password_reset_via_token\"}', '2026-05-13 21:15:47', 106),
(14, 'REQUEST', 'Auth', 104, '{\"action\":\"password_reset_email_sent\"}', '2026-05-13 21:17:24', 104),
(15, 'UPDATE', 'User', 104, '{\"action\":\"password_reset_via_token\"}', '2026-05-13 21:17:58', 104),
(16, 'REQUEST', 'Auth', 106, '{\"action\":\"password_reset_email_sent\"}', '2026-05-13 21:19:24', 106),
(17, 'UPDATE', 'User', 106, '{\"action\":\"password_reset_via_token\"}', '2026-05-13 21:19:45', 106),
(18, 'LOGIN', 'Auth', 106, '{\"username\":\"admin12\",\"role\":\"Staff\"}', '2026-05-13 21:20:00', 106),
(19, 'LOGIN', 'Auth', 106, '{\"username\":\"admin12\",\"role\":\"Staff\"}', '2026-05-14 08:09:26', 106),
(20, 'REQUEST', 'Auth', 104, '{\"action\":\"password_reset_email_sent\"}', '2026-05-14 08:10:10', 104),
(21, 'UPDATE', 'User', 104, '{\"action\":\"password_reset_via_token\"}', '2026-05-14 08:10:33', 104),
(22, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-14 08:10:43', 104),
(23, 'LOGIN', 'Auth', 106, '{\"username\":\"admin12\",\"role\":\"Staff\"}', '2026-05-14 08:11:17', 106),
(24, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-14 08:14:32', 104),
(25, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-14 08:16:42', 104),
(26, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-14 09:23:14', 104),
(27, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-14 10:19:59', 104),
(28, 'UPDATE', 'Vendor', 1, '{\"vendor_name\":\"MK papers\",\"gst_no\":\"BGH4FH8HFDH8H8F\"}', '2026-05-14 10:20:24', 104),
(29, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-14 10:52:11', 104),
(30, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-17 08:33:42', 104),
(31, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-17 08:51:05', 104),
(32, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-17 09:19:59', 104),
(33, 'CREATE', 'LedgerBook', 1, '{\"accession_no\":\"1\",\"dept_id\":1}', '2026-05-17 09:21:01', 104),
(34, 'UPDATE', 'LedgerBook', 1, '{\"action\":\"issue\",\"issued_to_name\":\"shravan\"}', '2026-05-17 09:21:32', 104),
(35, 'LOGIN', 'Auth', 104, '{\"username\":\"admin\",\"role\":\"Admin\"}', '2026-05-17 10:15:09', 104);

-- --------------------------------------------------------

--
-- Table structure for table `billchallans`
--

CREATE TABLE `billchallans` (
  `bill_challan_id` int(11) NOT NULL,
  `bill_id` int(11) DEFAULT NULL,
  `challan_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billchallans`
--

INSERT INTO `billchallans` (`bill_challan_id`, `bill_id`, `challan_id`) VALUES
(2, 1, 1),
(1, 1, 2),
(3, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `billitems`
--

CREATE TABLE `billitems` (
  `bill_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `bill_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billitems`
--

INSERT INTO `billitems` (`bill_item_id`, `quantity`, `rate`, `bill_id`, `item_id`) VALUES
(1, 45, 500.00, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(11) NOT NULL,
  `bill_no` varchar(100) NOT NULL,
  `bill_date` datetime NOT NULL,
  `bill_amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Completed') NOT NULL DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bills`
--

INSERT INTO `bills` (`bill_id`, `bill_no`, `bill_date`, `bill_amount`, `status`, `createdAt`, `user_id`, `vendor_id`) VALUES
(1, '1', '2026-05-14 00:00:00', 22500.00, 'Completed', '2026-05-13 21:03:23', 104, 1);

-- --------------------------------------------------------

--
-- Table structure for table `challanitems`
--

CREATE TABLE `challanitems` (
  `challan_item_id` int(11) NOT NULL,
  `quantity_received` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `challan_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `challanitems`
--

INSERT INTO `challanitems` (`challan_item_id`, `quantity_received`, `createdAt`, `challan_id`, `item_id`) VALUES
(1, 8, '2026-05-13 21:00:20', 1, 1),
(2, 12, '2026-05-13 21:01:54', 2, 1),
(3, 25, '2026-05-13 21:02:41', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `challans`
--

CREATE TABLE `challans` (
  `challan_id` int(11) NOT NULL,
  `challan_no` varchar(100) NOT NULL,
  `delivery_date` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `po_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `challans`
--

INSERT INTO `challans` (`challan_id`, `challan_no`, `delivery_date`, `createdAt`, `user_id`, `po_id`) VALUES
(1, '1', '2026-05-14 00:00:00', '2026-05-13 21:00:20', 104, 1),
(2, '2', '2026-05-22 00:00:00', '2026-05-13 21:01:54', 104, 1),
(3, '3', '2026-05-14 00:00:00', '2026-05-13 21:02:41', 104, 1);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `dept_id` int(11) NOT NULL,
  `dept_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`dept_id`, `dept_name`, `createdAt`) VALUES
(1, 'Department A', '2026-05-13 20:49:35');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `size` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `current_stock` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `size`, `color`, `current_stock`, `createdAt`) VALUES
(1, 'blueprism', 'A4', 'black', 43, '2026-05-13 20:47:45');

-- --------------------------------------------------------

--
-- Table structure for table `ledgerbooks`
--

CREATE TABLE `ledgerbooks` (
  `ledger_id` int(11) NOT NULL,
  `accession_no` varchar(50) NOT NULL,
  `dept_id` int(11) NOT NULL,
  `academic_year` varchar(20) NOT NULL COMMENT 'e.g. 2024-25',
  `half` enum('First Half','Second Half') NOT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT 'Optional label e.g. B.Sc CS Sem I results',
  `rack_code` varchar(50) DEFAULT NULL COMMENT 'Shelf/rack location when in store',
  `status` enum('In Rack','Issued') NOT NULL DEFAULT 'In Rack',
  `issued_to_name` varchar(255) DEFAULT NULL,
  `issued_to_contact` varchar(100) DEFAULT NULL,
  `issued_at` datetime DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ledgerbooks`
--

INSERT INTO `ledgerbooks` (`ledger_id`, `accession_no`, `dept_id`, `academic_year`, `half`, `title`, `rack_code`, `status`, `issued_to_name`, `issued_to_contact`, `issued_at`, `remarks`, `createdAt`, `updatedAt`) VALUES
(1, '1', 1, '2026', 'First Half', 'MCA sem 1', NULL, 'Issued', 'shravan', 'fggj', '2026-05-17 09:21:32', NULL, '2026-05-17 09:21:01', '2026-05-17 09:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `ledgermovements`
--

CREATE TABLE `ledgermovements` (
  `movement_id` int(11) NOT NULL,
  `ledger_id` int(11) NOT NULL,
  `action` enum('Issue','Return') NOT NULL,
  `issued_to_name` varchar(255) DEFAULT NULL,
  `issued_to_contact` varchar(100) DEFAULT NULL,
  `rack_code` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ledgermovements`
--

INSERT INTO `ledgermovements` (`movement_id`, `ledger_id`, `action`, `issued_to_name`, `issued_to_contact`, `rack_code`, `user_id`, `notes`, `createdAt`) VALUES
(1, 1, 'Issue', 'shravan', 'fggj', NULL, 104, NULL, '2026-05-17 09:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `purchaseorderitems`
--

CREATE TABLE `purchaseorderitems` (
  `po_item_id` int(11) NOT NULL,
  `quantity_ordered` int(11) NOT NULL,
  `quantity_received` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `po_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchaseorderitems`
--

INSERT INTO `purchaseorderitems` (`po_item_id`, `quantity_ordered`, `quantity_received`, `createdAt`, `po_id`, `item_id`) VALUES
(1, 45, 45, '2026-05-13 21:00:04', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `purchaseorders`
--

CREATE TABLE `purchaseorders` (
  `po_id` int(11) NOT NULL,
  `purchase_no` varchar(100) NOT NULL,
  `status` enum('Pending Delivery','Completed') NOT NULL DEFAULT 'Pending Delivery',
  `order_date` datetime NOT NULL,
  `remarks` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchaseorders`
--

INSERT INTO `purchaseorders` (`po_id`, `purchase_no`, `status`, `order_date`, `remarks`, `createdAt`, `user_id`, `vendor_id`) VALUES
(1, '1', 'Completed', '2026-05-14 00:00:00', '', '2026-05-13 21:00:04', 104, 1);

-- --------------------------------------------------------

--
-- Table structure for table `stockissues`
--

CREATE TABLE `stockissues` (
  `issue_id` int(11) NOT NULL,
  `quantity_issued` int(11) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `issue_date` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `dept_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stockissues`
--

INSERT INTO `stockissues` (`issue_id`, `quantity_issued`, `purpose`, `issue_date`, `createdAt`, `user_id`, `item_id`, `dept_id`) VALUES
(1, 2, 'b', '2026-05-14 00:00:00', '2026-05-13 21:03:41', 104, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('Admin','Staff') NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `full_name`, `role`, `last_login`, `email`, `reset_token`, `reset_token_expiry`, `createdAt`) VALUES
(104, 'admin', '$2b$10$3frjdFM9KkPWeboiHbLPCOi7oNjh/D0/C16u7xsamHDbXDxVKRWA.', 'Administrator', 'Admin', '2026-05-17 10:15:09', 'shravan.b.patel954@gmail.com', NULL, NULL, '2025-12-08 00:18:18'),
(105, 'admin1', '$2b$10$MnHvtzxGGoqDInAYNHwPbO0.la/dH/LivaXYBuKVJIOvUul57E8fC', 'Administrator', 'Admin', '2025-12-07 19:02:36', NULL, NULL, NULL, '2025-12-08 00:32:20'),
(106, 'admin12', '$2b$10$LppBzBdOvadYBnYe1xBv2OsLeS8KOqj6uK2WRkWBe6gw/RLHSRWZ6', 'admin12', 'Staff', '2026-05-14 08:11:17', 'shravan.b.patel80@gmail.com', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `vendor_id` int(11) NOT NULL,
  `vendor_name` varchar(255) NOT NULL,
  `gst_no` varchar(15) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`vendor_id`, `vendor_name`, `gst_no`, `contact_person`, `phone`, `email`, `address`, `createdAt`) VALUES
(1, 'MK papers', 'BGH4FH8HFDH8H8F', 'mk', '8104476767', 'mkpapers@gmail.com', 'mumbai', '2026-05-13 20:49:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `billchallans`
--
ALTER TABLE `billchallans`
  ADD PRIMARY KEY (`bill_challan_id`),
  ADD UNIQUE KEY `BillChallans_challan_id_bill_id_unique` (`bill_id`,`challan_id`),
  ADD KEY `challan_id` (`challan_id`);

--
-- Indexes for table `billitems`
--
ALTER TABLE `billitems`
  ADD PRIMARY KEY (`bill_item_id`),
  ADD KEY `bill_id` (`bill_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD UNIQUE KEY `bill_no` (`bill_no`),
  ADD UNIQUE KEY `bill_no_2` (`bill_no`),
  ADD UNIQUE KEY `bill_no_3` (`bill_no`),
  ADD UNIQUE KEY `bill_no_4` (`bill_no`),
  ADD UNIQUE KEY `bill_no_5` (`bill_no`),
  ADD UNIQUE KEY `bill_no_6` (`bill_no`),
  ADD UNIQUE KEY `bill_no_7` (`bill_no`),
  ADD UNIQUE KEY `bill_no_8` (`bill_no`),
  ADD UNIQUE KEY `bill_no_9` (`bill_no`),
  ADD UNIQUE KEY `bill_no_10` (`bill_no`),
  ADD UNIQUE KEY `bill_no_11` (`bill_no`),
  ADD UNIQUE KEY `bill_no_12` (`bill_no`),
  ADD UNIQUE KEY `bill_no_13` (`bill_no`),
  ADD UNIQUE KEY `bill_no_14` (`bill_no`),
  ADD UNIQUE KEY `bill_no_15` (`bill_no`),
  ADD UNIQUE KEY `bill_no_16` (`bill_no`),
  ADD UNIQUE KEY `bill_no_17` (`bill_no`),
  ADD UNIQUE KEY `bill_no_18` (`bill_no`),
  ADD UNIQUE KEY `bill_no_19` (`bill_no`),
  ADD UNIQUE KEY `bill_no_20` (`bill_no`),
  ADD UNIQUE KEY `bill_no_21` (`bill_no`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `challanitems`
--
ALTER TABLE `challanitems`
  ADD PRIMARY KEY (`challan_item_id`),
  ADD KEY `challan_id` (`challan_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `challans`
--
ALTER TABLE `challans`
  ADD PRIMARY KEY (`challan_id`),
  ADD UNIQUE KEY `challan_no` (`challan_no`),
  ADD UNIQUE KEY `challan_no_2` (`challan_no`),
  ADD UNIQUE KEY `challan_no_3` (`challan_no`),
  ADD UNIQUE KEY `challan_no_4` (`challan_no`),
  ADD UNIQUE KEY `challan_no_5` (`challan_no`),
  ADD UNIQUE KEY `challan_no_6` (`challan_no`),
  ADD UNIQUE KEY `challan_no_7` (`challan_no`),
  ADD UNIQUE KEY `challan_no_8` (`challan_no`),
  ADD UNIQUE KEY `challan_no_9` (`challan_no`),
  ADD UNIQUE KEY `challan_no_10` (`challan_no`),
  ADD UNIQUE KEY `challan_no_11` (`challan_no`),
  ADD UNIQUE KEY `challan_no_12` (`challan_no`),
  ADD UNIQUE KEY `challan_no_13` (`challan_no`),
  ADD UNIQUE KEY `challan_no_14` (`challan_no`),
  ADD UNIQUE KEY `challan_no_15` (`challan_no`),
  ADD UNIQUE KEY `challan_no_16` (`challan_no`),
  ADD UNIQUE KEY `challan_no_17` (`challan_no`),
  ADD UNIQUE KEY `challan_no_18` (`challan_no`),
  ADD UNIQUE KEY `challan_no_19` (`challan_no`),
  ADD UNIQUE KEY `challan_no_20` (`challan_no`),
  ADD UNIQUE KEY `challan_no_21` (`challan_no`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `po_id` (`po_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`dept_id`),
  ADD UNIQUE KEY `dept_name` (`dept_name`),
  ADD UNIQUE KEY `dept_name_2` (`dept_name`),
  ADD UNIQUE KEY `dept_name_3` (`dept_name`),
  ADD UNIQUE KEY `dept_name_4` (`dept_name`),
  ADD UNIQUE KEY `dept_name_5` (`dept_name`),
  ADD UNIQUE KEY `dept_name_6` (`dept_name`),
  ADD UNIQUE KEY `dept_name_7` (`dept_name`),
  ADD UNIQUE KEY `dept_name_8` (`dept_name`),
  ADD UNIQUE KEY `dept_name_9` (`dept_name`),
  ADD UNIQUE KEY `dept_name_10` (`dept_name`),
  ADD UNIQUE KEY `dept_name_11` (`dept_name`),
  ADD UNIQUE KEY `dept_name_12` (`dept_name`),
  ADD UNIQUE KEY `dept_name_13` (`dept_name`),
  ADD UNIQUE KEY `dept_name_14` (`dept_name`),
  ADD UNIQUE KEY `dept_name_15` (`dept_name`),
  ADD UNIQUE KEY `dept_name_16` (`dept_name`),
  ADD UNIQUE KEY `dept_name_17` (`dept_name`),
  ADD UNIQUE KEY `dept_name_18` (`dept_name`),
  ADD UNIQUE KEY `dept_name_19` (`dept_name`),
  ADD UNIQUE KEY `dept_name_20` (`dept_name`),
  ADD UNIQUE KEY `dept_name_21` (`dept_name`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`),
  ADD UNIQUE KEY `items_item_name_size_color` (`item_name`,`size`,`color`);

--
-- Indexes for table `ledgerbooks`
--
ALTER TABLE `ledgerbooks`
  ADD PRIMARY KEY (`ledger_id`),
  ADD UNIQUE KEY `accession_no` (`accession_no`),
  ADD UNIQUE KEY `accession_no_2` (`accession_no`),
  ADD UNIQUE KEY `accession_no_3` (`accession_no`),
  ADD UNIQUE KEY `accession_no_4` (`accession_no`),
  ADD KEY `ledger_books_dept_id_academic_year_half` (`dept_id`,`academic_year`,`half`),
  ADD KEY `ledger_books_status` (`status`),
  ADD KEY `ledger_books_rack_code` (`rack_code`);

--
-- Indexes for table `ledgermovements`
--
ALTER TABLE `ledgermovements`
  ADD PRIMARY KEY (`movement_id`),
  ADD KEY `ledger_id` (`ledger_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `purchaseorderitems`
--
ALTER TABLE `purchaseorderitems`
  ADD PRIMARY KEY (`po_item_id`),
  ADD KEY `po_id` (`po_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `purchaseorders`
--
ALTER TABLE `purchaseorders`
  ADD PRIMARY KEY (`po_id`),
  ADD UNIQUE KEY `purchase_no` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_2` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_3` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_4` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_5` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_6` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_7` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_8` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_9` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_10` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_11` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_12` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_13` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_14` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_15` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_16` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_17` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_18` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_19` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_20` (`purchase_no`),
  ADD UNIQUE KEY `purchase_no_21` (`purchase_no`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `stockissues`
--
ALTER TABLE `stockissues`
  ADD PRIMARY KEY (`issue_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `dept_id` (`dept_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `username_14` (`username`),
  ADD UNIQUE KEY `username_15` (`username`),
  ADD UNIQUE KEY `username_16` (`username`),
  ADD UNIQUE KEY `username_17` (`username`),
  ADD UNIQUE KEY `username_18` (`username`),
  ADD UNIQUE KEY `username_19` (`username`),
  ADD UNIQUE KEY `username_20` (`username`),
  ADD UNIQUE KEY `username_21` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`vendor_id`),
  ADD UNIQUE KEY `vendor_name` (`vendor_name`),
  ADD UNIQUE KEY `gst_no` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_2` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_2` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_3` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_3` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_4` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_4` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_5` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_5` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_6` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_6` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_7` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_7` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_8` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_8` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_9` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_9` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_10` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_10` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_11` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_11` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_12` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_12` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_13` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_13` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_14` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_14` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_15` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_15` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_16` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_16` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_17` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_17` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_18` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_18` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_19` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_19` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_20` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_20` (`gst_no`),
  ADD UNIQUE KEY `vendor_name_21` (`vendor_name`),
  ADD UNIQUE KEY `gst_no_21` (`gst_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `billchallans`
--
ALTER TABLE `billchallans`
  MODIFY `bill_challan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `billitems`
--
ALTER TABLE `billitems`
  MODIFY `bill_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `challanitems`
--
ALTER TABLE `challanitems`
  MODIFY `challan_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `challans`
--
ALTER TABLE `challans`
  MODIFY `challan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `dept_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ledgerbooks`
--
ALTER TABLE `ledgerbooks`
  MODIFY `ledger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ledgermovements`
--
ALTER TABLE `ledgermovements`
  MODIFY `movement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `purchaseorderitems`
--
ALTER TABLE `purchaseorderitems`
  MODIFY `po_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `purchaseorders`
--
ALTER TABLE `purchaseorders`
  MODIFY `po_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stockissues`
--
ALTER TABLE `stockissues`
  MODIFY `issue_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `vendor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD CONSTRAINT `auditlog_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_18` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_20` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `auditlog_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `billchallans`
--
ALTER TABLE `billchallans`
  ADD CONSTRAINT `billchallans_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_10` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_11` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_12` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_13` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_14` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_15` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_16` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_17` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_18` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_19` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_2` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_20` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_21` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_22` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_23` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_24` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_25` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_26` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_27` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_28` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_29` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_3` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_30` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_31` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_32` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_33` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_34` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_35` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_36` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_37` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_38` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_39` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_4` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_40` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_41` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_42` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_5` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_6` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_7` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_8` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `billchallans_ibfk_9` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `billitems`
--
ALTER TABLE `billitems`
  ADD CONSTRAINT `billitems_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_10` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_11` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_12` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_13` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_14` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_15` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_16` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_17` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_18` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_19` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_20` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_21` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_22` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_23` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_24` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_25` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_26` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_27` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_28` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_29` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_3` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_30` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_31` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_32` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_33` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_34` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_35` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_36` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_37` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_38` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_39` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_4` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_40` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_41` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_42` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_5` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_6` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_7` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_8` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `billitems_ibfk_9` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_10` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_12` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_14` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_16` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_18` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_20` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_22` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_24` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_26` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_28` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_30` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_32` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_33` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_34` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_35` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_36` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_37` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_38` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_39` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_4` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_40` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_41` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_42` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_6` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_8` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bills_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `challanitems`
--
ALTER TABLE `challanitems`
  ADD CONSTRAINT `challanitems_ibfk_1` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_10` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_11` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_12` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_13` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_14` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_15` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_16` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_17` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_18` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_19` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_20` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_21` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_22` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_23` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_24` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_25` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_26` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_27` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_28` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_29` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_3` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_30` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_31` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_32` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_33` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_34` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_35` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_36` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_37` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_38` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_39` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_4` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_40` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_41` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_42` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_5` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_6` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_7` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_8` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challanitems_ibfk_9` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`challan_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `challans`
--
ALTER TABLE `challans`
  ADD CONSTRAINT `challans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_10` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_12` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_14` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_16` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_18` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_2` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_20` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_22` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_24` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_26` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_28` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_30` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_32` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_33` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_34` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_35` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_36` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_37` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_38` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_39` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_4` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_40` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_41` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_42` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_6` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_8` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `challans_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `ledgerbooks`
--
ALTER TABLE `ledgerbooks`
  ADD CONSTRAINT `ledgerbooks_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgerbooks_ibfk_2` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgerbooks_ibfk_3` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgerbooks_ibfk_4` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ledgermovements`
--
ALTER TABLE `ledgermovements`
  ADD CONSTRAINT `ledgermovements_ibfk_1` FOREIGN KEY (`ledger_id`) REFERENCES `ledgerbooks` (`ledger_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgermovements_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgermovements_ibfk_3` FOREIGN KEY (`ledger_id`) REFERENCES `ledgerbooks` (`ledger_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgermovements_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgermovements_ibfk_5` FOREIGN KEY (`ledger_id`) REFERENCES `ledgerbooks` (`ledger_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgermovements_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgermovements_ibfk_7` FOREIGN KEY (`ledger_id`) REFERENCES `ledgerbooks` (`ledger_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ledgermovements_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `purchaseorderitems`
--
ALTER TABLE `purchaseorderitems`
  ADD CONSTRAINT `purchaseorderitems_ibfk_1` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_10` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_11` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_12` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_13` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_14` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_15` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_16` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_17` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_18` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_19` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_20` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_21` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_22` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_23` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_24` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_25` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_26` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_27` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_28` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_29` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_3` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_30` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_31` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_32` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_33` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_34` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_35` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_36` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_37` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_38` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_39` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_4` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_40` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_41` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_42` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_5` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_6` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_7` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_8` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorderitems_ibfk_9` FOREIGN KEY (`po_id`) REFERENCES `purchaseorders` (`po_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `purchaseorders`
--
ALTER TABLE `purchaseorders`
  ADD CONSTRAINT `purchaseorders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_10` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_12` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_14` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_16` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_18` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_20` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_22` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_24` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_26` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_28` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_30` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_32` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_33` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_34` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_35` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_36` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_37` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_38` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_39` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_4` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_40` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_41` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_42` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_6` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_8` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorders_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stockissues`
--
ALTER TABLE `stockissues`
  ADD CONSTRAINT `stockissues_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_11` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_12` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_14` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_15` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_17` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_18` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_20` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_21` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_22` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_23` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_24` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_26` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_27` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_28` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_29` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_3` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_30` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_32` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_33` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_34` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_35` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_36` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_37` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_38` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_39` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_40` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_41` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_42` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_43` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_44` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_45` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_46` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_47` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_48` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_49` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_5` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_50` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_51` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_52` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_53` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_54` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_55` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_56` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_57` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_58` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_59` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_6` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_60` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_61` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_62` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_63` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_8` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockissues_ibfk_9` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
