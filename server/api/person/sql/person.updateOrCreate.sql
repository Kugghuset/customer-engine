
/*
Needs adjustments, but should either create or update the current person.
Right now it's not predictable enough (2015-12-17)
*/

IF EXISTS(SELECT *
          FROM [dbo].[Person]
          WHERE [dbo].[Person].[tel] = @tel
            OR (
              [dbo].[Person].[email] = @email
              AND [dbo].[Person].[name] = name
              )
            )
BEGIN
  UPDATE [dbo].[Person]
  SET
    [dbo].[Person].[name] = @name,
    [dbo].[Person].[email] = @email,
    [dbo].[Person].[altTel] = @altTel
  WHERE [dbo].[Person].[tel] = @tel
    OR (
      [dbo].[Person].[email] = @email
      AND [dbo].[Person].[name] = name
      )
  
  SET @personId = (
    SELECT TOP 1 [personId]
    FROM [dbo].[Person]
    WHERE [dbo].[Person].[tel] = @tel
    OR (
      [dbo].[Person].[email] = @email
      AND [dbo].[Person].[name] = name
      )
  )
END
ELSE IF (@personId IS NULL
  AND (
    @name IS NOT NULL
    OR @email IS NOT NULL
    OR @tel IS NOT NULL
    OR @altTel IS NOT NULL
  )) OR NOT EXISTS(SELECT *
                  FROM [dbo].[Person]
                  WHERE [dbo].[Person].[tel] = @tel
                    OR (
                      [dbo].[Person].[email] = @email
                      AND [dbo].[Person].[name] = name
                      )
                    )
BEGIN
  INSERT INTO [dbo].[Person] (
    [name],
    [email],
    [tel],
    [altTel]
  )
  VALUES (
    @name,
    @email,
    @tel,
    @altTel
  )
  
  SET @personId = (
    SELECT MAX([personId])
    FROM [dbo].[Person]
  )
END