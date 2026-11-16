-- ============================================================================
-- CAMPUSSYNC MASTER MYSQL RELATIONAL SCHEMA & SEEDER
-- App Type: Real-Time Faculty Collaboration & Workflow Board (Kanban)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `campussync_db` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `campussync_db`;

-- Disable foreign key checks temporarily for clean re-seeding
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `columns`;
DROP TABLE IF EXISTS `boards`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `departments`;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. Table: departments
-- ----------------------------------------------------------------------------
CREATE TABLE `departments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `short_code` VARCHAR(10) NOT NULL UNIQUE,
  `color_hex` VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Table: users (RBAC Roles: 'Dean', 'Dept Head', 'Professor', 'IT', 'Accounts')
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `role` ENUM('Dean', 'Dept Head', 'Professor', 'IT', 'Accounts') NOT NULL DEFAULT 'Professor',
  `department_id` INT UNSIGNED NULL,
  `avatar_initials` VARCHAR(5) NOT NULL DEFAULT 'CS',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_user_department` FOREIGN KEY (`department_id`) 
    REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Table: boards
-- ----------------------------------------------------------------------------
CREATE TABLE `boards` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `created_by` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_board_creator` FOREIGN KEY (`created_by`) 
    REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Table: columns (Standard 4 Columns)
-- ----------------------------------------------------------------------------
CREATE TABLE `columns` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `board_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `position_order` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_column_board` FOREIGN KEY (`board_id`) 
    REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Table: tasks (Includes Target Department for Private Routing & Status Attribution)
-- ----------------------------------------------------------------------------
CREATE TABLE `tasks` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `column_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `creator_id` INT UNSIGNED NOT NULL,
  `target_department_id` INT UNSIGNED NULL COMMENT 'NULL means Public task; Non-null restricts to target department',
  `due_date` DATE NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Proposed',
  `last_moved_by_name` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_task_column` FOREIGN KEY (`column_id`) 
    REFERENCES `columns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_task_creator` FOREIGN KEY (`creator_id`) 
    REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_task_target_department` FOREIGN KEY (`target_department_id`) 
    REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Table: comments
-- ----------------------------------------------------------------------------
CREATE TABLE `comments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `task_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `text` TEXT NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_comment_task` FOREIGN KEY (`task_id`) 
    REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Table: activity_logs (For Cycle Time & Department Workload Analytics)
-- ----------------------------------------------------------------------------
CREATE TABLE `activity_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `task_id` INT UNSIGNED NOT NULL,
  `action_type` VARCHAR(50) NOT NULL,
  `details` TEXT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_log_task` FOREIGN KEY (`task_id`) 
    REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

-- Seed Departments
INSERT INTO `departments` (`id`, `name`, `short_code`, `color_hex`) VALUES
(1, 'Computer Science', 'CS', '#3B82F6'),
(2, 'Engineering', 'ENG', '#10B981'),
(3, 'Accounts & Finance', 'ACC', '#F59E0B'),
(4, 'Information Technology', 'IT', '#8B5CF6'),
(5, 'Deans Office', 'DEAN', '#EC4899');

-- Seed Users across Multi-Tier Roles
INSERT INTO `users` (`id`, `name`, `email`, `role`, `department_id`, `avatar_initials`) VALUES
(1, 'Dean Elena Miller', 'emiller@university.edu', 'Dean', 5, 'EM'),
(2, 'Dr. Arthur Aris', 'aaris@university.edu', 'Dept Head', 1, 'AA'),
(3, 'Prof. Richard Davis', 'rdavis@university.edu', 'Professor', 1, 'RD'),
(4, 'Prof. Sarah Jenkins', 'sjenkins@university.edu', 'Professor', 2, 'SJ'),
(5, 'Marcus Vance', 'mvance@university.edu', 'IT', 4, 'MV'),
(6, 'Clara Oswald', 'coswald@university.edu', 'Accounts', 3, 'CO');

-- Seed Board
INSERT INTO `boards` (`id`, `title`, `created_by`) VALUES
(1, 'Academic Faculty Collaboration & Workflow Board', 1);

-- Seed Columns (4 Standard Columns)
INSERT INTO `columns` (`id`, `board_id`, `title`, `position_order`) VALUES
(1, 1, 'Proposed Changes', 1),
(2, 1, 'Department Review', 2),
(3, 1, 'Dean Approval', 3),
(4, 1, 'Finalized', 4);

-- Seed Tasks
-- Task 1: Public CS Task in 'Proposed Changes'
INSERT INTO `tasks` (`id`, `column_id`, `title`, `description`, `creator_id`, `target_department_id`, `due_date`, `status`, `last_moved_by_name`, `created_at`) VALUES
(1, 1, 'CS101 Intro Syllabus Modernization', 'Update curriculum to include AI ethics and modern Python tooling for introductory students.', 3, NULL, '2026-08-15', 'Proposed', 'Prof. Richard Davis', '2026-07-20 09:00:00'),

-- Task 2: Public Engineering Task in 'Department Review'
(2, 2, 'Robotics Lab Equipment Upgrades', 'Proposal for replacing legacy oscilloscopes and microcontroller kits in the robotics lab.', 4, NULL, '2026-08-20', 'In Review', 'Dr. Arthur Aris', '2026-07-18 10:30:00'),

-- Task 3: TARGETED ROUTING (IT -> Accounts ONLY) in 'Department Review'
(3, 2, 'FY2026 Cloud Computing Budget Allocation', 'Confidential budget request from IT Department specifically routed to Accounts & Finance for server clusters.', 5, 3, '2026-08-10', 'In Review', 'Marcus Vance', '2026-07-22 14:15:00'),

-- Task 4: Public CS Task in 'Dean Approval'
(4, 3, 'AI Research Lab Curriculum Integration', 'Formal submission for establishing an undergraduate research track in generative AI systems.', 2, NULL, '2026-08-30', 'Dean Approval', 'Dr. Arthur Aris', '2026-07-15 11:20:00'),

-- Task 5: Finalized Task
(5, 4, 'Fall 2026 Exam Schedule Finalization', 'Completed schedule coordination across CS and Engineering departments.', 2, NULL, '2026-07-28', 'Finalized', 'Dean Elena Miller', '2026-07-10 08:00:00');

-- Seed Comments
INSERT INTO `comments` (`id`, `task_id`, `user_id`, `text`, `timestamp`) VALUES
(1, 1, 2, 'Looks great! Please ensure we include a section on LLM prompting principles.', '2026-07-21 10:00:00'),
(2, 1, 3, 'Updated the reading list to reflect the latest 2026 standards.', '2026-07-22 09:30:00'),
(3, 3, 6, 'Accounts has reviewed the cloud compute line items. Will need Dean approval once verified.', '2026-07-23 15:45:00'),
(4, 4, 1, 'Pending final review of the lab room allocation before formal approval.', '2026-07-25 14:00:00');

-- Seed Activity Logs (for Analytics: Cycle time & workload)
INSERT INTO `activity_logs` (`id`, `user_id`, `task_id`, `action_type`, `details`, `timestamp`) VALUES
(1, 3, 1, 'CREATED', 'Created task CS101 Intro Syllabus Modernization', '2026-07-20 09:00:00'),
(2, 4, 2, 'CREATED', 'Created task Robotics Lab Equipment Upgrades', '2026-07-18 10:30:00'),
(3, 2, 2, 'MOVED', 'Moved task to Department Review (Moved by Dr. Arthur Aris)', '2026-07-19 11:00:00'),
(4, 5, 3, 'CREATED', 'Created task FY2026 Cloud Computing Budget Allocation (Targeted: Accounts)', '2026-07-22 14:15:00'),
(5, 2, 4, 'CREATED', 'Created task AI Research Lab Curriculum Integration', '2026-07-15 11:20:00'),
(6, 2, 4, 'MOVED', 'Moved task to Dean Approval (Moved by Dr. Arthur Aris)', '2026-07-24 16:20:00'),
(7, 1, 5, 'MOVED', 'Moved task to Finalized (Moved by Dean Elena Miller)', '2026-07-28 17:00:00');
