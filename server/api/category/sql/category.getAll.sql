/*
Gets all categories
*/

SELECT [categoryId], [categoryName]
FROM [dbo].[Category]
WHERE [disabled] IS NULL
  OR [disabled] = 0