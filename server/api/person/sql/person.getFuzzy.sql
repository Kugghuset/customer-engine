/*
Gets organisations by a fuzzy search
*/

SELECT TOP 12 [personId], [name], [email], [tel], [altTel]
FROM [dbo].[Person]
WHERE [name] LIKE '%' + @query + '%'
   OR [email] LIKE '%' + @query + '%'
   OR [tel] LIKE '%' + @query + '%'
   OR [altTel] LIKE '%' + @query + '%';
   