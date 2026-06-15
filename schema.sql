-- Database: campus_bus_tracker
-- MySQL 8 Syntax

CREATE DATABASE IF NOT EXISTS campus_bus_tracker;
USE campus_bus_tracker;

-- Drop existing tables to ensure clean execution (reverse order of dependencies)
DROP TABLE IF EXISTS delay_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS buses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS stops;
DROP TABLE IF EXISTS routes;

-- ==========================================
-- TABLE CREATION
-- ==========================================

-- 2. routes table
CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    total_distance_km DECIMAL(5,2)
);

-- 3. stops table
CREATE TABLE stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    stop_name VARCHAR(100) NOT NULL,
    stop_order INT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- 1. students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    college_email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    route_id INT,
    boarding_stop_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL,
    FOREIGN KEY (boarding_stop_id) REFERENCES stops(id) ON DELETE SET NULL
);

-- 4. buses table
CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) NOT NULL UNIQUE,
    driver_name VARCHAR(100) NOT NULL,
    route_id INT,
    current_lat DECIMAL(10,8),
    current_lng DECIMAL(11,8),
    status ENUM('On Route', 'Idle', 'In Maintenance', 'Arrived') DEFAULT 'Idle',
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL
);

-- 5. schedules table
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    stop_id INT NOT NULL,
    arrival_time TIME NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
);

-- 6. notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 7. delay_logs table
CREATE TABLE delay_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    delay_minutes INT NOT NULL,
    log_date DATE NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);


-- ==========================================
-- SAMPLE DATA INSERTION
-- ==========================================

-- Insert Routes
INSERT INTO routes (route_name, total_distance_km) VALUES
('Miyapur -> VCE', 45.50),
('Secunderabad -> VCE', 38.20),
('LB Nagar -> VCE', 32.10),
('Shaikpet -> VCE', 28.50);

-- Insert Stops (Miyapur Route)
-- Real GPS coordinates from Google Maps for Hyderabad landmarks
INSERT INTO stops (route_id, stop_name, stop_order, latitude, longitude) VALUES
(1, 'Miyapur', 1, 17.4965, 78.3730),
(1, 'JNTU', 2, 17.4967, 78.3925),
(1, 'KPHB', 3, 17.4930, 78.3994),
(1, 'Kukatpally', 4, 17.4851, 78.4094),
(1, 'Moosapet', 5, 17.4685, 78.4207),
(1, 'Bharat Nagar', 6, 17.4633, 78.4289),
(1, 'Ameerpet', 7, 17.4348, 78.4480),
(1, 'Punjagutta', 8, 17.4368, 78.4439),
(1, 'Khairatabad', 9, 17.4106, 78.4652),
(1, 'Lakdikapul', 10, 17.4034, 78.4652),
(1, 'Mehdipatnam', 11, 17.3959, 78.4312),
(1, 'Aramghar', 12, 17.3214, 78.4320),
(1, 'Shamshabad', 13, 17.2603, 78.3969),
(1, 'Vardhaman College of Engineering', 14, 17.2546, 78.3070);

-- Insert Stops (Secunderabad Route)
INSERT INTO stops (route_id, stop_name, stop_order, latitude, longitude) VALUES
(2, 'Secunderabad Station', 1, 17.4337, 78.5016),
(2, 'Paradise', 2, 17.4419, 78.4881),
(2, 'Vardhaman College of Engineering', 3, 17.2546, 78.3070);

-- Insert Stops (LB Nagar Route)
INSERT INTO stops (route_id, stop_name, stop_order, latitude, longitude) VALUES
(3, 'LB Nagar', 1, 17.3484, 78.5510),
(3, 'Dilsukhnagar', 2, 17.3688, 78.5247),
(3, 'Vardhaman College of Engineering', 3, 17.2546, 78.3070);

-- Insert Stops (Shaikpet Route)
INSERT INTO stops (route_id, stop_name, stop_order, latitude, longitude) VALUES
(4, 'Shaikpet', 1, 17.3980, 78.3965),
(4, 'Manikonda', 2, 17.3995, 78.3850),
(4, 'Narsingi', 3, 17.3768, 78.3512),
(4, 'Shamshabad', 4, 17.2543, 78.4290),
(4, 'Vardhaman College of Engineering', 5, 17.2546, 78.3070);

-- Insert Students
-- Using the boarding_stop_id 2 (JNTU) for the first student
-- All students have password 'student123'
INSERT INTO students (name, college_email, password_hash, route_id, boarding_stop_id) VALUES
('Harsh Sharma', 'student@vardhama', '$2b$10$DGIo5CP8MQfcLsXVT2QoluyJfBTGeWNGd1dwAaEuRbcTvwwfSbNBm', 1, 2),
('Neha Reddy', 'neha@vardhaman.org', '$2b$10$DGIo5CP8MQfcLsXVT2QoluyJfBTGeWNGd1dwAaEuRbcTvwwfSbNBm', 1, 4),
('Rahul Kumar', 'rahul@vardhaman.org', '$2b$10$DGIo5CP8MQfcLsXVT2QoluyJfBTGeWNGd1dwAaEuRbcTvwwfSbNBm', 2, 15),
('Priya Singh', 'priya@vardhaman.org', '$2b$10$DGIo5CP8MQfcLsXVT2QoluyJfBTGeWNGd1dwAaEuRbcTvwwfSbNBm', 3, 18),
('Charan', '24881a05em@student.vardhaman.org', '$2b$10$DGIo5CP8MQfcLsXVT2QoluyJfBTGeWNGd1dwAaEuRbcTvwwfSbNBm', 4, 21);

-- Insert Buses
INSERT INTO buses (bus_number, driver_name, route_id, current_lat, current_lng, status) VALUES
('VCE-12', 'Rajesh Kumar', 1, 17.4932, 78.3914, 'On Route'),
('VCE-07', 'Suresh Reddy', 1, 17.4375, 78.4483, 'On Route'),
('VCE-03', 'Venkat Rao', 2, 17.4344, 78.5013, 'Idle'),
('VCE-15', 'Prasad Yadav', 3, 17.3462, 78.5525, 'In Maintenance'),
('VCE-02', 'Mahesh Babu', 4, 17.3980, 78.3965, 'On Route');

-- Insert Schedules (for VCE-12 on Route 1)
INSERT INTO schedules (bus_id, stop_id, arrival_time) VALUES
(1, 1, '07:30:00'),
(1, 2, '07:45:00'),
(1, 3, '07:55:00'),
(1, 4, '08:05:00'),
(1, 14, '09:15:00');

-- Insert Notifications
INSERT INTO notifications (student_id, message) VALUES
(1, 'Bus VCE-12 is arriving at JNTU in 5 minutes.'),
(2, 'Bus VCE-12 is delayed by 10 minutes due to traffic near Kukatpally.');

-- Insert Delay Logs
INSERT INTO delay_logs (bus_id, delay_minutes, log_date) VALUES
(1, 10, '2026-06-14'),
(2, 5, '2026-06-14');
