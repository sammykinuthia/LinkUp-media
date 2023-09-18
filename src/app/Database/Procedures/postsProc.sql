USE Linkup;
GO



CREATE OR ALTER PROC uspCreatePost
    (@id VARCHAR(200),
    @image VARCHAR(200),
    @message VARCHAR(200),
    @user_id VARCHAR(200))
AS
BEGIN
    INSERT INTO posts
        (id,user_id,[image],[message])
    VALUES(@id, @user_id, @image, @message)
END;
GO


CREATE OR ALTER PROC uspGetPosts
    (@user_id VARCHAR(200))
AS
BEGIN
    SELECT TOP 100
        p.id,
        p.[image],
        p.[message],
        p.user_id,
        u.username,
        comments,
        likes,
        ISNULL(lp.liked, 0) AS liked,
        followed_user_id
    FROM posts p
        LEFT JOIN (SELECT username, id
        FROM users) u ON u.id = p.user_id
        LEFT JOIN (SELECT post_id, COUNT(*) AS comments
        FROM comments
        GROUP BY post_id) c ON c.post_id = p.id
        LEFT JOIN (SELECT post_id, COUNT(*) AS likes
        FROM likePost
        GROUP BY post_id) lpcount ON lpcount.post_id = p.id
        LEFT JOIN (SELECT user_id, followed_user_id
        FROM follow
        WHERE followed_user_id = @user_id) f ON f.user_id = p.user_id
        LEFT JOIN (SELECT post_id, 1 AS liked
        FROM likePost
        WHERE user_id = @user_id ) lp ON lp.post_id = p.id
    WHERE p.is_deleted = 0;
END;
GO
-- 
-- SELECT user_id, followed_user_id FROM follow WHERE followed_user_id = '9340cb5e-e952-4f31-9d0d-e508d43dce2d'
-- SELECT * FROM users
-- GO

CREATE OR ALTER PROC uspGetPostsExplore
    (@user_id VARCHAR(200))
AS
BEGIN
    SELECT TOP 100
        p.id,
        p.[image],
        p.[message],
        p.user_id,
        u.username,
        comments,
        likes,
        ISNULL(lp.liked, 0) AS liked,
        followed_user_id
    FROM posts p
        LEFT JOIN (SELECT username, id
        FROM users) u ON u.id = p.user_id
        LEFT JOIN (SELECT post_id, COUNT(*) AS comments
        FROM comments
        GROUP BY post_id) c ON c.post_id = p.id
        LEFT JOIN (SELECT post_id, COUNT(*) AS likes
        FROM likePost
        GROUP BY post_id) lpcount ON lpcount.post_id = p.id
        LEFT JOIN (SELECT post_id, 1 AS liked
        FROM likePost
        WHERE user_id = @user_id ) lp ON lp.post_id = p.id
        LEFT JOIN(SELECT user_id, followed_user_id
        FROM follow
        WHERE followed_user_id = @user_id) f ON f.user_id = u.id
    WHERE p.is_deleted = 0 AND p.user_id <> @user_id
;
END;
GO
-- EXEC uspGetPosts '9340cb5e-e952-4f31-9d0d-e508d43dce2d'
-- Exec  uspGetPostsExplore '90571e98-df6a-42f2-9b9c-cbb74e3cb799'
-- go
-- SELECT * FROM users
-- SELECT * FROM posts
-- SELECT * FROM follow
-- go


CREATE OR ALTER PROC uspGetComments(@post_id VARCHAR(200))
AS
BEGIN
    SELECT c.id, c.[image], c.[level], c.parent_comment, c.post_id, c.user_id, likes, username, c.[message]
    FROM comments c
        LEFT JOIN (SELECT username, id
        FROM users) u on c.user_id = u.id
        LEFT JOIN (SELECT comment_id, COUNT(*) AS likes
        FROM likeComment
        GROUP BY comment_id) lc on c.id = lc.comment_id
    WHERE post_id = @post_id AND is_deleted = 0
END;
    GO


CREATE OR ALTER PROC uspCreateComments(@id VARCHAR(200),
    @message VARCHAR(200),
    @image VARCHAR(200),
    @post_id VARCHAR(200),
    @user_id VARCHAR(200),
    @parent_comment VARCHAR(200),
    @level INT)
AS
BEGIN
    INSERT INTO comments
        (id,[message],[image],post_id,user_id,parent_comment,[level])
    VALUES(@id, @message, @image, @post_id, @user_id, @parent_comment, @level)
END;
GO

CREATE OR ALTER PROC uspLikePost(@user_id VARCHAR(200),
    @post_id VARCHAR(200))
AS
BEGIN
    INSERT INTO likePost
        (user_id, post_id)
    VALUES(@user_id, @post_id)
END;
GO

CREATE OR ALTER PROC uspLikeComment(@user_id VARCHAR(200),
    @comment_id VARCHAR(200))
AS
BEGIN
    INSERT INTO likeComment
        (user_id, comment_id)
    VALUES(@user_id, @comment_id)
END;
GO

-- SELECT * FROM comments
-- "63f94a23-51d9-4e4e-89e5-92c9811e8c91,90571e98-df6a-42f2-9b9c-cbb74e3cb799"