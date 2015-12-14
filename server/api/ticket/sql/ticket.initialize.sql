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
    [isReseller] bit NULL,
    -- [personId] bigint NULL,
    [summary] varchar(max) NULL,
    [country] varchar(256) NULL,
    [transferred] bit NULL,
    [status] varchar(256) NULL,
    [departmentId] bigint NULL,
    [transferredDepartmentId] bigint NULL,
    [productId] bigint NULL,
    [customerId] bigint NULL,
    [userId] bigint NULL,
    [ticketDate] datetime2 DEFAULT GETUTCDATE() NULL,
    [ticketDateClosed] datetime2 NULL, -- Should be set when the status is set to closed.
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
    
  -- Adds isReseller if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'isReseller'
                AND Object_ID = Object_ID(N'Ticket'))
  BEGIN
      ALTER TABLE [dbo].[Ticket]
      ADD [isReseller] bit NULL
  END
    
  -- Removes successful if it exists
  IF EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'successful'
                AND Object_ID = Object_ID(N'Ticket'))
  BEGIN
      ALTER TABLE [dbo].[Ticket]
      DROP COLUMN [successful]
  END
  
  -- Add productId column if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'productId'
                AND Object_ID = Object_ID(N'Ticket'))
  BEGIN
      ALTER TABLE [dbo].[Ticket]
      ADD [productId] bigint NULL
  END
  
  -- Change departmentId to transferredDepartmentId if transferredDepartmentId doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'transferredDepartmentId'
                AND Object_ID = Object_ID(N'Ticket'))
  BEGIN
      -- Rename departmentId to transferredDepartmentId
      EXEC sp_rename 'Ticket.departmentId', 'transferredDepartmentId', 'COLUMN'
      
      -- Add transferredDepartmentId
      ALTER TABLE [dbo].[Ticket]
      ADD [departmentId] bigint NULL
  END
  
  -- Add ticketDateClosed if it doesn't exist
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'ticketDateClosed'
                AND Object_ID = Object_ID(N'Ticket'))
  BEGIN
      ALTER TABLE [dbo].[Ticket]
      ADD [ticketDateClosed] datetime2 NULL
  END
  
  -- IF NOT EXISTS(SELECT * FROM sys.columns
  --               WHERE Name = N'personId'
  --               AND Object_ID = Object_ID(N'Ticket'))
  -- BEGIN
  --     ALTER TABLE [dbo].[Ticket]
  --     ADD COLUMN [personId] bigint NULL
      /*
        Somehow handle conversion of existing tickets' persons
        and remove old properties?
      */
  -- END
