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
    [summary] varchar(max) NULL,
    [country] varchar(256) NULL,
    [transferred] bit NULL,
    [successful] bit NULL,
    [customerId] bigint NOT NULL,
    [userId] bigint NULL,
    [ticketDate] datetime2 DEFAULT GETUTCDATE() NULL,
    [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL
  )
END