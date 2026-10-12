CREATE DATABASE IF NOT EXISTS daychange_v1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE daychange_v1;
CREATE TABLE IF NOT EXISTS users (
 id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, display_name VARCHAR(80) NOT NULL,
 preferred_language ENUM('en','ja','zh','fr','es') NOT NULL DEFAULT 'en', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS activities (
 id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, category ENUM('여행','건강','배움','관계','취미','휴식') NOT NULL,
 title VARCHAR(150) NOT NULL, description TEXT, estimated_cost INT UNSIGNED NOT NULL DEFAULT 0,
 duration_minutes INT UNSIGNED NOT NULL DEFAULT 30, UNIQUE KEY uq_activity_title(title)
);
CREATE TABLE IF NOT EXISTS daily_plans (
 id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, user_id BIGINT UNSIGNED NOT NULL,
 plan_date DATE NOT NULL, activity_id BIGINT UNSIGNED NOT NULL, status ENUM('planned','done') NOT NULL DEFAULT 'planned',
 note TEXT NULL, completed_at DATETIME NULL, UNIQUE KEY uq_plan_user_date(user_id,plan_date),
 CONSTRAINT fk_plan_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 CONSTRAINT fk_plan_activity FOREIGN KEY(activity_id) REFERENCES activities(id)
);
CREATE TABLE IF NOT EXISTS vocabulary (
 id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, language_code ENUM('en','ja','zh','fr','es') NOT NULL,
 word VARCHAR(150) NOT NULL, pronunciation VARCHAR(150) NOT NULL, meaning VARCHAR(150) NOT NULL,
 example_text VARCHAR(300) NULL, UNIQUE KEY uq_word_lang(language_code,word)
);
CREATE TABLE IF NOT EXISTS learning_progress (
 id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, user_id BIGINT UNSIGNED NOT NULL, word_id BIGINT UNSIGNED NOT NULL,
 repetitions INT UNSIGNED NOT NULL DEFAULT 0, last_result ENUM('again','good') NULL,
 next_review_date DATE NOT NULL, last_studied_at DATETIME NULL,
 UNIQUE KEY uq_progress_user_word(user_id,word_id), INDEX ix_review(user_id,next_review_date),
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(word_id) REFERENCES vocabulary(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS learning_history (
 id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, user_id BIGINT UNSIGNED NOT NULL,
 word_id BIGINT UNSIGNED NOT NULL, result ENUM('again','good') NOT NULL, studied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(word_id) REFERENCES vocabulary(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_settings (
 user_id BIGINT UNSIGNED PRIMARY KEY,
 employment_type ENUM('worker','free') NOT NULL DEFAULT 'worker',
 schedule_mode ENUM('daily','weekends') NOT NULL DEFAULT 'daily',
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
