/*
Gets all users from DB.
*/

SELECT
    [U].[userId]
  , [U].[email]
  , [U].[name]
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

ORDER BY [U].[name], [U].[email]