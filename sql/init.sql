CREATE DATABASE IF NOT EXISTS hostel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE hostel_db;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  cnic VARCHAR(50),
  contact VARCHAR(50),
  guardian_name VARCHAR(255),
  guardian_contact VARCHAR(50),
  guardian_cnic VARCHAR(50),
  village VARCHAR(255),
  institution VARCHAR(255),
  fee_paid DECIMAL(12,2) DEFAULT 0,
  total_fee DECIMAL(12,2) DEFAULT 0,
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
