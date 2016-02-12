/*
Sets the lastLoggedIn to now and selects the user.
*/

-- Update lastLoggedIn
UPDATE [dbo].[User]
SET [dbo].[User].[lastLoggedIn] = GETUTCDATE()
WHERE [dbo].[User].[userId] = @userId

-- Select user on new
SELECT
    [U].[userId]
  , [U].[email]
  , [U].[name]
  , [U].[password]
  , [U].[lastLoggedIn]
  , [D].[departmentId] AS [department.departmentId]
  , [D].[departmentName] AS [department.departmentName]
  , [D].[country] AS [department.country]
  , [R].[role]
  , [R].[roleName]
  
FROM [dbo].[User] AS [U]

-- Join on departmentId
LEFT JOIN [dbo].[Department] AS [D]
ON [U].[departmentId] = [D].[departmentId]

LEFT JOIN [dbo].[Role] AS [R]
ON [U].[role] = [R].[role]

WHERE [U].[userId] = @userId