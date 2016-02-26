/*
Gets all CallBackStatus items
*/

SELECT 
    [callBackStatusId]
  , [callBackStatusName]
  , [shouldClose]
  , [dateCreated]
  , [dateUpdated]
FROM [dbo].[CallBackStatus]
