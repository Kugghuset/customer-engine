/*
Initializes the Customer if it's not created already.
*/

IF (OBJECT_ID('Customer', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Customer] (
    [customerId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [customerNumber] varchar(256) NULL,
    [orgName] varchar(256) NULL,
    [orgNr] varchar(256) NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL,
    [isLocal] bit NULL, -- Specifies whether the customer is created inside Tickety or is external
    [isMerged] bit DEFAULT 1 NULL -- Specifies whether the customer is merged by the merge script
  )
END
ELSE

  -- Add the [isLocal] column if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'isLocal'
                AND Object_ID = Object_ID(N'Customer'))
  BEGIN
    ALTER TABLE [dbo].[Customer]
    ADD [isLocal] bit NULL
  END
  
  -- Add the [isMerged] column if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'isMerged'
                AND Object_ID = Object_ID(N'Customer'))
  BEGIN
      
    ALTER TABLE [dbo].[Customer]
    ADD [isMerged] bit DEFAULT 1 NULL
    
    EXEC('
      UPDATE [dbo].[Customer]
      SET [isMerged] = CASE
        WHEN [isLocal] = 1 THEN 0
        ELSE 1
      END
    ')
    
  END

