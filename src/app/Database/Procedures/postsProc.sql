USE Linkup;
GO



CREATE OR ALTER PROC uspCreatePost (@id VARCHAR(200),@image VARCHAR(200),@message VARCHAR(200),@user_id VARCHAR(200)) AS
BEGIN
    INSERT INTO posts(id,user_id,[image],[message])
    VALUES(@id,@user_id,@image,@message)
END;
GO


CREATE OR ALTER PROC uspGetPosts AS
BEGIN
    SELECT TOP 100 p.id, p.[image],p.[message], p.user_id, u.username, comments, likes FROM posts p 
    LEFT JOIN (SELECT username, id FROM users) u on u.id = p.user_id 
    LEFT JOIN (SELECT post_id, COUNT(*) AS comments FROM comments GROUP BY post_id) c on c.post_id = p.id 
    LEFT JOIN (SELECT post_id, COUNT(*) AS likes FROM likePost GROUP BY post_id) lp on lp.post_id = p.id 
    WHERE p.is_deleted = 0
END;
GO

CREATE OR ALTER PROC uspGetComments(@post_id VARCHAR(200)) AS
BEGIN
    SELECT * FROM comments c
    LEFT JOIN (SELECT username, id FROM users) u on c.user_id = u.id
    LEFT JOIN (SELECT comment_id, COUNT(*) AS likes FROM likeComment GROUP BY comment_id) lc on c.id = lc.comment_id
     WHERE post_id = @post_id AND is_deleted = 0
END;
GO


CREATE OR ALTER PROC uspCreateComments(@id VARCHAR(200),@message VARCHAR(200),@image VARCHAR(200),@post_id VARCHAR(200),@user_id VARCHAR(200),@parent_comment VARCHAR(200),@level INT) AS
BEGIN
    INSERT INTO comments(id,[message],[image],post_id,user_id,parent_comment,[level])
    VALUES(@id,@message,@image,@post_id,@user_id,@parent_comment,@level)
END;
GO

-- select * from users