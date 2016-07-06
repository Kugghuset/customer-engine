/*
Gets all callBack items
*/

SELECT 
    [callBackId]
  , [ticketId]
  , 
  , [userId]
  , [callBackDate]
  , [callBackStatus]
  , [reasonToPromote1]
  , [reasonToPromote2]
  , [reasonToDetract1]
  , [reasonToDetract2]
  , [callBackFollowUpAction]
  , [callBackComment]
  , [postCallBackNpscScore]
  , [isClosed]
FROM [dbo].[CallBack]
