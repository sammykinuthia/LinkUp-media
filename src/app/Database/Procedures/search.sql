USE Linkup;
GO



CREATE OR ALTER PROC uspSearch
    (@text VARCHAR(200))
AS
BEGIN
    SELECT id, [message], 1 AS is_post FROM posts WHERE [message] LIKE '%'+@text+'%' 
END;
GO

EXEC uspSearch 's'