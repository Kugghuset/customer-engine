/*
Initializes the Person if it's not created already.
NPS Dates can be found in that table.
*/

IF (OBJECT_ID('Person', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Person] (
    [personId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [name] varchar(256) NULL,
    [email] varchar(256) NULL,
    [tel] varchar(256) NULL,
    [altTel] varchar(256) NULL,
    [customerId] bigint NULL, -- parent-ish
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateContacted] datetime2 NULL -- For the NPS integration
  )
END

-- Delete isReseller from columns if it exists
IF EXISTS(SELECT * FROM sys.columns
          WHERE Name = N'isReseller'
          AND Object_ID = Object_ID(N'Person'))
BEGIN
  ALTER TABLE [dbo].[Person]
  DROP COLUMN [isReseller]
END

IF NOT EXISTS(SELECT * FROM sys.columns
              WHERE Name = N'dateContacted'
              AND Object_ID = Object_ID(N'Person'))
BEGIN
  ALTER TABLE [dbo].[Person]
  ADD [dateContacted] datetime2 NULL
END