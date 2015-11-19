/*
Inserts a user and returns it.
*/

INSERT INTO [dbo].[User] (
  [email],
  [name]
)
VALUES (
  @email,
  @name
);

SELECT TOP 1 [userId], [email], [name]
FROM [dbo].[User]
ORDER BY [userId] DESC;