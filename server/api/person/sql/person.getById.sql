/*
Gets organisations by a fuzzy search
*/

SELECT TOP 12 [personId], [name], [email], [tel], [altTel]
FROM [dbo].[Person]
WHERE [personId] = @personId;
   