/*
Inserts a user and returns it.
*/

SET XACT_ABORT ON

BEGIN TRAN

INSERT INTO [dbo].[User] (
  [email],
  [password],
  [name],
  [departmentId]
)
VALUES (
  @email,
  @password,
  @name,
  @departmentId
)

COMMIT TRAN

SELECT TOP 1
  [U].[userId],
  [U].[email],
  [U].[name],
  [D].[departmentId] AS [department.departmentId],
  [D].[departmentName] AS [department.departmentName],
  [D].[country] AS [department.country]
  
FROM [dbo].[User] AS [U]

-- Join on departmentId
LEFT JOIN [dbo].[Department] AS [D]
ON [U].[departmentId] = [D].[departmentId]

ORDER BY [U].[userId] DESC
