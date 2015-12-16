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

-- Ticket
INSERT INTO [dbo].[Ticket] (
  [personId],
  [isReseller],
  [summary],
  [transferred],
  [status],
  [country],
  [customerId],
  [userId],
  [departmentId],
  [transferredDepartmentId],
  [productId],
  [ticketDate],
  [ticketDateClosed]
)
VALUES (
  @personId,
  @isReseller,
  @summary,
  @transferred,
  @status,
  @country,
  @customerId,
  @userId,
  @departmentId,
  @transferredDepartmentId,
  @productId,
  @ticketDate,
  @ticketDateClosed
)

-- Categort blob
INSERT INTO [dbo].[CategoryBlob] (
  [ticketId],
  [categoryId],
  [subcategoryId],
  [descriptorId]
)
SELECT MAX([dbo].[Ticket].[ticketId]) AS [ticketId],
  @categoryId AS [categoryId],
  @subcategoryId AS [subcategoryId],
  @descriptorId AS [descriptorId]
FROM [dbo].[Ticket]

COMMIT TRAN

-- Select the newly created ticket done in other file.
-- The files are combined using javascript
DECLARE @ticketId BIGINT

SET @ticketId = (
  SELECT MAX([ticketId])
  FROM [dbo].[Ticket]
)
