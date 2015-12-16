/*
Inserts a new ticket and a categoryBlob
*/

SET XACT_ABORT ON

BEGIN TRAN

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

UPDATE [dbo].[Ticket]
SET
  [dbo].[Ticket].[personId] = @personId,
  [dbo].[Ticket].[isReseller] = @isReseller,
  [dbo].[Ticket].[summary] = @summary,
  [dbo].[Ticket].[transferred] = @transferred,
  [dbo].[Ticket].[status] = @status,
  [dbo].[Ticket].[country] = @country,
  [dbo].[Ticket].[customerId] = @customerId,
  [dbo].[Ticket].[userId] = @userId,
  [dbo].[Ticket].[departmentId] = @departmentId,
  [dbo].[Ticket].[transferredDepartmentId] = @transferredDepartmentId,
  [dbo].[Ticket].[productId] = @productId,
  [dbo].[Ticket].[ticketDate] = @ticketDate,
  [dbo].[Ticket].[dateUpdated] = GETUTCDATE(),
  [dbo].[Ticket].[ticketDateClosed] = @ticketDateClosed
  

WHERE [ticketId] = @ticketId

UPDATE [dbo].[CategoryBlob]
SET
  [dbo].[CategoryBlob].[categoryId]= @categoryId,
  [dbo].[CategoryBlob].[subcategoryId]= @subcategoryId,
  [dbo].[CategoryBlob].[descriptorId]= @descriptorId

WHERE [dbo].[CategoryBlob].[ticketId] = @ticketId

COMMIT TRAN

