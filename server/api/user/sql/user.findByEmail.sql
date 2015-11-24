/*
Finds all users matching the @email (which should be only one).
*/

SELECT [userId], [email], [name]
FROM [dbo].[User]
WHERE [email] = @email