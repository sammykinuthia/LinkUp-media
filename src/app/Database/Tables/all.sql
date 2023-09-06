-- CREATE DATABASE Linkup;
-- GO
USE Linkup;
GO



CREATE TABLE users(
    id VARCHAR(200) PRIMARY KEY,
    full_name VARCHAR(200),
    username VARCHAR(200) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    phone VARCHAR(200),
    image VARCHAR(200),
    password VARCHAR(200) NOT NULL,
    created_at DATE DEFAULT GETDATE(),
    is_deleted BIT DEFAULT 0
);
GO

-- DROP TABLE resetPwd
CREATE TABLE resetPwd(
    code VARCHAR(200) PRIMARY KEY,
    user_id VARCHAR(200) NOT NULL,
    is_sent BIT DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
GO


CREATE TABLE posts(
    id VARCHAR(200) PRIMARY KEY,
    message VARCHAR(1000),
    image VARCHAR(200),
    user_id VARCHAR(200) NOT NULL,
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
GO

CREATE TABLE comments(
    id VARCHAR(200) PRIMARY KEY,
    message VARCHAR(1000),
    image VARCHAR(200),
    user_id VARCHAR(200) NOT NULL,
    post_id VARCHAR(200) NOT NULL,
    level INT DEFAULT 0,
    is_deleted BIT DEFAULT 0,
    parent_comment VARCHAR(200),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES posts(id),
    -- FOREIGN KEY(parent_comment) REFERENCES comments(id),
);
GO
-- ALTER TABLE comments
-- ADD parent_comment VARCHAR(200) NULL, FOREIGN KEY(parent_comment) REFERENCES comments(id)



CREATE TABLE follow(
    user_id VARCHAR(200) NOT NULL,
    followed_user_id VARCHAR(200) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(followed_user_id) REFERENCES users(id),
    PRIMARY KEY(user_id,followed_user_id)
);
GO

CREATE TABLE likePost(
    post_id  VARCHAR(200) NOT NULL,
    user_id  VARCHAR(200) NOT NULL,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    PRIMARY KEY(user_id,post_id)
);
GO

CREATE TABLE likeComment(
    comment_id  VARCHAR(200) NOT NULL,
    user_id  VARCHAR(200) NOT NULL,
    FOREIGN KEY(comment_id) REFERENCES comments(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    PRIMARY KEY(user_id,comment_id)
);
GO




