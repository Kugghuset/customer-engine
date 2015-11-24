/*
Finds a ticket by its ticketId and joins it.
*/

SELECT
  [A].[ticketId],
  [A].[name],
  [A].[email],
  [A].[tel],
  [A].[summary],
  [A].[transferred],
  [A].[successful],
  [A].[customerId],
  [A].[userId],
  [A].[ticketDate],
  [B].[categoryId] AS [category.categoryId],
  [C].[categoryName] AS [category.name],
  [B].[subcategoryId] AS [subcategory.subcategoryId],
  [D].[subcategoryName] AS [subcategory.name],
  [B].[descriptorId] AS [descriptor.descriptorId],
  [E].[descriptorName] AS [descriptor.name]
FROM [dbo].[Ticket] AS [A]

-- Joins the categoryBlob, which is only used for joining the different levels of categories
LEFT JOIN [dbo].[CategoryBlob] AS [B]
ON [A].[ticketId] = [B].[ticketId]

-- Joins the category
LEFT JOIN [dbo].[Category] AS [C]
ON [B].[categoryId] = [C].[categoryId]

-- Joins the subcategory
LEFT JOIN [dbo].[Subcategory] AS [D]
ON [B].[subcategoryId] = [D].[subcategoryId]

-- Joins the descriptors
LEFT JOIN [dbo].[Descriptor] AS [E]
ON [B].[descriptorId] = [E].[descriptorId]

-- Gets only the matching ticket
WHERE [A].[ticketId]=@ticketId