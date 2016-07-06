/*
Creates or updates the CallBack object.
*/

IF @callBackId IS NULL
BEGIN
  
  INSERT INTO [dbo].[CallBack] (
      [ticketId]
    , [npsId]
    , [userId]
    , [callBackDate]
    , [callBackStatus]
    , [agentName]
    , [reasonToPromote1]
    , [reasonToPromote2]
    , [reasonToDetract1]
    , [reasonToDetract2]
    , [callBackFollowUpAction]
    , [callBackComment]
    , [postCallBackNpscScore]
    , [isClosed]
    , [dateClosed]
  )
  VALUES (
      @ticketId
    , @npsId
    , @userId
    , @callBackDate
    , CASE
        WHEN @callBackStatus IS NOT NULL THEN @callBackStatus
        ELSE 'Not called'
      END
    , @agentName
    , @reasonToPromote1
    , @reasonToPromote2
    , @reasonToDetract1
    , @reasonToDetract2
    , @callBackFollowUpAction
    , @callBackComment
    , @postCallBackNpscScore
    , @isClosed
    , @dateClosed
  )
  
  SELECT @callBackId = MAX(callBackId) FROM [dbo].[CallBack]

END
ELSE
  UPDATE [dbo].[CallBack]
  SET   [ticketId] = @ticketId
      , [npsId] = @npsId
      , [userId] = @userId
      , [callBackDate] = @callBackDate
      , [callBackStatus] = CASE
          WHEN @callBackStatus IS NOT NULL THEN @callBackStatus
          ELSE 'Not called'
        END
      , [agentName] = @agentName
      , [reasonToPromote1] = @reasonToPromote1
      , [reasonToPromote2] = @reasonToPromote2
      , [reasonToDetract1] = @reasonToDetract1
      , [reasonToDetract2] = @reasonToDetract2
      , [callBackFollowUpAction] = @callBackFollowUpAction
      , [callBackComment] = @callBackComment
      , [postCallBackNpscScore] = @postCallBackNpscScore
      , [isClosed] = @isClosed
      , [dateClosed] = @dateClosed
      , [dateUpdated] = GETUTCDATE()
  WHERE [callBackId] = @callBackId
