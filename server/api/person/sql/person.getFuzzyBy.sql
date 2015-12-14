/*
Gets organisations by a fuzzy search
*/

IF EXISTS(SELECT * FROM sys.columns
          WHERE Name = N'{ colName }'
          AND Object_ID = Object_ID(N'Person'))

BEGIN
  SELECT TOP 12 [personId], [name], [email], [tel], [altTel]
  FROM [dbo].[Person]
  WHERE [{ colName }] LIKE '%' + @query + '%';
END
