ALTER TABLE comments ADD COLUMN parent_id INT NULL AFTER target_id;

ALTER TABLE comments ADD FOREIGN KEY (parent_id) REFERENCES comments (id) ON DELETE CASCADE;
