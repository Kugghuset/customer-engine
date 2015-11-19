/*
Finds all users matching the @id (which should be only one).
*/

SELECT [userId], [email], [name]
FROM [dbo].[User]
WHERE [userId] = @id;