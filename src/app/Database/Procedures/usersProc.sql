USE Linkup;
GO


CREATE OR ALTER PROC uspRegisterUser
    (@id VARCHAR(200),
    @username VARCHAR(200),
    @email VARCHAR(200),
    @password VARCHAR(200))
AS
BEGIN
    INSERT INTO users
        (id, username,email,[password])
    VALUES(@id, @username, @email, @password)
END;
GO

CREATE OR ALTER PROC uspUpdateUser
    (@id VARCHAR(200),
    @username VARCHAR(200),
    @email VARCHAR(200),
    @name VARCHAR(200),
    @image VARCHAR(200),
    @phone VARCHAR(200))
AS
BEGIN
    UPDATE users
    SET username=@username, full_name=@name,phone=@phone,[image]=@image,email=@email
    WHERE id=@id;
    SELECT id, username, full_name AS name, [image], phone, email
    FROM users
    WHERE id = @id
END;
GO



CREATE OR ALTER PROC uspGetUserByEmail
    (@email VARCHAR(200))
AS
BEGIN
    SELECT password, username, email, id
    from users
    WHERE email = @email
END;
GO

CREATE OR ALTER PROC uspGetUser
    (@id VARCHAR(200))
AS
BEGIN
   SELECT u.id, u.full_name AS name, u.username, u.email, u.phone, u.[image],
        p.posts, f.followers, fl.following
    FROM users u
        LEFT JOIN ( SELECT user_id, COUNT(*) AS posts FROM posts GROUP BY user_id) p ON u.id = p.user_id
        LEFT JOIN ( SELECT followed_user_id,  COUNT(*) AS followers FROM follow GROUP BY followed_user_id ) f ON u.id = f.followed_user_id
        LEFT JOIN ( SELECT user_id, COUNT(*) AS following FROM follow GROUP BY user_id ) fl ON u.id = fl.user_id
    WHERE u.id = @id;
END;
GO

CREATE OR ALTER PROCEDURE uspGetCurrentUser
    @id VARCHAR(200)
AS
BEGIN
    SELECT u.id, u.full_name AS name, u.username, u.email, u.phone, u.[image],
        p.posts, f.followers, fl.following
    FROM users u
        LEFT JOIN ( SELECT user_id, COUNT(*) AS posts FROM posts GROUP BY user_id) p ON u.id = p.user_id
        LEFT JOIN ( SELECT followed_user_id,  COUNT(*) AS followers FROM follow GROUP BY followed_user_id ) f ON u.id = f.followed_user_id
        LEFT JOIN ( SELECT user_id, COUNT(*) AS following FROM follow GROUP BY user_id ) fl ON u.id = fl.user_id
    WHERE u.id = @id;
END;
GO

CREATE OR ALTER PROC uspSaveResetCode
    (@id VARCHAR(200),
    @code VARCHAR(200))
AS
BEGIN
    INSERT INTO resetPwd
        (user_id, code)
    VALUES(@id, @code)
END;
GO

-- SELECT * from resetCode

CREATE  OR ALTER PROC uspCheckVerificationCode(@user_id VARCHAR(200),
    @code VARCHAR(200))
AS
BEGIN
    SELECT *
    FROM resetCode
    WHERE code= @code AND user_id = @user_id
END;
GO

CREATE OR ALTER PROC uspChangePassword
    (@email VARCHAR(200),
    @password VARCHAR(200))
AS
BEGIN
    UPDATE users
    SET password = @password
    WHERE email = @email
END;
GO

CREATE OR ALTER PROC uspGetUsersFollowing(@user_id VARCHAR(200))
AS
BEGIN
    SELECT u.full_name, u.username, u.id, u.[image], u.phone, u.email
    FROM follow f
        INNER JOIN users u ON f.user_id = u.id
    WHERE user_id = @user_id
END;
GO



CREATE OR ALTER PROC uspGetUsersNotFollowing(@user_id VARCHAR(200))
AS
BEGIN
    SELECT TOP 100 full_name, username, id, email, phone FROM users
    WHERE id NOT IN(SELECT f.followed_user_id FROM follow f
        INNER JOIN users u ON f.user_id = u.id
        WHERE user_id = @user_id AND f.followed_user_id !=@user_id
        )
END;
GO

CREATE OR ALTER PROC uspFollowUser
    (@id VARCHAR(200),
    @follow_id VARCHAR(200))
AS
BEGIN
    INSERT INTO follow
        (user_id, followed_user_id)
    VALUES(@id, @follow_id)
END;
GO



-- "b69c8b5b-524e-4b72-998b-922f0cb30f4b"
-- SELECT * FROM follow
-- SELECT id FROM users