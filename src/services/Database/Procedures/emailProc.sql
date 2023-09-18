USE Linkup;
GO

CREATE OR ALTER PROC uspResetUserPwd AS 
BEGIN
    SELECT code, user_id, u.email,u.username FROM resetPwd 
    INNER JOIN users u on user_id = u.id
   WHERE is_sent = 0
END;
GO

CREATE OR ALTER PROC uspSetCodeSent(@code VARCHAR(200)) AS 
BEGIN
    UPDATE resetPwd
    SET is_sent = 1
    WHERE code=@code
END;
GO


SELECT * FROM resetPwd
