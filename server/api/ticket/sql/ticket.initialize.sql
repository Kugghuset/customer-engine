/*
Initializes the ticket table
*/

IF (OBJECT_ID('Ticket', 'U') IS  NULL)
BEGIN
  CREATE TABLE [dbo].[Ticket] (
    [ticketId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [name] varchar(256) NULL,
    [email] varchar(256) NULL,
    [tel] varchar(256) NULL,
    [altTel] varchar(256) NULL,
    [summary] varchar(max) NULL,
    [country] varchar(256) NULL,
    [transferred] bit NULL,
    [successful] bit NULL,
    [status] varchar(256) NULL,
    [departmentId] bigint NULL,
    [customerId] bigint NULL,
    [userId] bigint NULL,
    [ticketDate] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateUpdated] datetime2 DEFAULT GETUTCDATE() NULL
  )
END
ELSE
  -- Add altTel column if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'altTel'
                AND Object_ID = Object_ID(N'Ticket'))
  BEGIN
      ALTER TABLE [dbo].[Ticket]
      ADD [altTel] varchar(256) NULL
  END
  
  -- Add status column if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'status'
                AND Object_ID = Object_ID(N'Ticket'))
  BEGIN
      ALTER TABLE [dbo].[Ticket]
      ADD [status] varchar(256) NULL
  END
  
  -- Add departmentId column if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'departmentId'
                AND Object_ID = Object_ID(N'Ticket'))
  BEGIN
      ALTER TABLE [dbo].[Ticket]
      ADD [departmentId] bigint NULL
  END
  
  -- Modify customerId to be NULLable if non nullable
  IF (SELECT COLUMNPROPERTY(OBJECT_ID('Ticket', 'U'), 'customerId', 'AllowsNull')) = 0
  BEGIN
      ALTER TABLE [dbo].[Ticket]
      ALTER COLUMN [customerId] bigint NULL
  END
    
  -- Adds dateUpdated if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'dateUpdated'
                AND Object_ID = Object_ID(N'Ticket'))
  BEGIN
      ALTER TABLE [dbo].[Ticket]
      ADD [dateUpdated] datetime2 DEFAULT GETUTCDATE() NULL
  END
