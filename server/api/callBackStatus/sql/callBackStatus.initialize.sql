/*
Creates the CallBackStatus table
*/

IF (Object_ID('CallBackStatus', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[CallBackStatus] (
      [callBackStatusId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [callBackStatusName] varchar(255) NULL
    , [shouldClose] bit NULL DEFAULT 0
    , [dateCreated] datetime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] datetime2 DEFAULT GETUTCDATE() NULL
  )
  
  -- Insert the base values
  INSERT INTO [dbo].[CallBackStatus] (
      [callBackStatusName]
    , [shouldClose]
  )
  VALUES
    ('Not called', 0)
  , ('Call completed', 1)
  , ('Call back later', 0)
  , ('No reply - called several times', 0)
  , ('Customer don''t want to talk', 1)
  , ('No call back needed', 1)
END