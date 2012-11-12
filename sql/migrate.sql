ALTER TABLE comments ADD COLUMN parent_id INT NULL AFTER target_id;

ALTER TABLE comments ADD FOREIGN KEY (parent_id) REFERENCES comments (id) ON DELETE CASCADE;


-- Recreate views, to include parent_id column

CREATE OR REPLACE VIEW visible_comments AS SELECT * FROM comments WHERE deleted = 0;

-- comments table joined with users and targets for easier quering
CREATE OR REPLACE VIEW full_visible_comments AS SELECT
    c.*,
    users.username,
    users.external_id,
    users.email,
    users.moderator,
    targets.domain,
    targets.type,
    targets.cls,
    targets.member
FROM visible_comments AS c
    LEFT JOIN users ON c.user_id = users.id
    LEFT JOIN targets ON c.target_id = targets.id;

-- the same as above, but including deleted comments
CREATE OR REPLACE VIEW full_comments AS SELECT
    c.*,
    users.username,
    users.external_id,
    users.email,
    users.moderator,
    targets.domain,
    targets.type,
    targets.cls,
    targets.member
FROM comments AS c
    LEFT JOIN users ON c.user_id = users.id
    LEFT JOIN targets ON c.target_id = targets.id;
