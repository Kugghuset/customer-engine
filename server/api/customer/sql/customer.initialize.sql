/*
Initializes the Customer if it's not created already.
*/

IF (OBJECT_ID('Customer', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Customer] (
    [customerId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [orgNr] varchar(256) NULL,
    [orgName] varchar(256) NULL,
    [customerName] varchar(256) NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateChanged] datetime2 DEFAULT GETUTCDATE() NULL
  )
END