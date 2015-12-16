IF @personId IS NULL
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
ELSE
  UPDATE [dbo].[Person]
  SET
    [dbo].[Person].[name] = @name,
    [dbo].[Person].[email] = @email,
    [dbo].[Person].[altTel] = @altTel,
    [dbo].[Person].[tel] = @tel,
    [dbo].[Person].[customerId] = @customerId
  WHERE [dbo].[Person].[personId] = @personId
    