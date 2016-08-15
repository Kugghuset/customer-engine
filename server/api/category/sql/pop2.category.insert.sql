

IF NOT EXISTS(SELECT * FROM [dbo].[Category]
          WHERE [categoryName] = 'BDM')
BEGIN
  UPDATE [dbo].[Category]
    SET [disabled] = 1
  UPDATE [dbo].[Subcategory]
    SET [disabled] = 1
  UPDATE [dbo].[Descriptor]
    SET [disabled] = 1

  INSERT INTO [dbo].[Category] (
    [categoryName]
  ) VALUES
      ('Ecommerce')
    , ('BDM')
    , ('Invoice')
    , ('Acquiring')
    , ('Information')
    , ('Order')
    , ('Terminal')
    , ('Shipment')
    , ('Termination')
    , ('Follow up cancel agreement')
    , ('Major system failure')

  INSERT INTO [dbo].[Subcategory] (
    [subcategoryName],
    [categoryId]
  )
  VALUES
    ('Login information', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Ecommerce' AND ISNULL([disabled], 0) = 0))
  , ('Transaction', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Ecommerce' AND ISNULL([disabled], 0) = 0))
  , ('Technical information/implementation', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Ecommerce' AND ISNULL([disabled], 0) = 0))
  , ('Initial setup / Get started', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Ecommerce' AND ISNULL([disabled], 0) = 0))
  , ('3D-secure', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Ecommerce' AND ISNULL([disabled], 0) = 0))

  , ('Agreement transfer', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'BDM' AND ISNULL([disabled], 0) = 0))
  , ('Incompatible licens', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'BDM' AND ISNULL([disabled], 0) = 0))
  , ('Discounts', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'BDM' AND ISNULL([disabled], 0) = 0))
  , ('Account Management', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'BDM' AND ISNULL([disabled], 0) = 0))

  , ('Change of address', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Invoice' AND ISNULL([disabled], 0) = 0))
  , ('Billing inaccuracie', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Invoice' AND ISNULL([disabled], 0) = 0))
  , ('Credit', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Invoice' AND ISNULL([disabled], 0) = 0))
  , ('Debt collection', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Invoice' AND ISNULL([disabled], 0) = 0))
  , ('Unpaid invoices', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Invoice' AND ISNULL([disabled], 0) = 0))
  , ('Questions', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Invoice' AND ISNULL([disabled], 0) = 0))
  , ('Dispute invoice', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Invoice' AND ISNULL([disabled], 0) = 0))

  , ('Authorization', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Transaction', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('BAX TOF', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Release reservations', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Change of address', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Acquiring reports', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('3D secure', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Acquiring contracts', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Multiple user agreements', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Change of company or org number', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Fraud', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Daily closing or Cash register report', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Questions on accounting, customer or Acquiring no', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('ARN or Detailed transaction', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('AOS Close Accounts', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Handover of new customer', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Acquiring status Boarding status', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Add-ons Amex or Diners', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('MCC', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('DCC', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Change of account number', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Enlargement of agreement acquiring', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Missing Funds', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('Sales New Acquiring', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))
  , ('General Information', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0))

  , ('Transfer internally', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Information' AND ISNULL([disabled], 0) = 0))
  , ('Contact details Externally', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Information' AND ISNULL([disabled], 0) = 0))
  , ('Customer information', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Information' AND ISNULL([disabled], 0) = 0))
  , ('Brand information', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Information' AND ISNULL([disabled], 0) = 0))
  , ('Technical information', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Information' AND ISNULL([disabled], 0) = 0))

  , ('Receipt rolls', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Order' AND ISNULL([disabled], 0) = 0))
  , ('Cords', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Order' AND ISNULL([disabled], 0) = 0))
  , ('Space Pole', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Order' AND ISNULL([disabled], 0) = 0))
  , ('Stickers', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Order' AND ISNULL([disabled], 0) = 0))
  , ('SIM', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Order' AND ISNULL([disabled], 0) = 0))
  , ('Other', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Order' AND ISNULL([disabled], 0) = 0))
  , ('Terminals', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Order' AND ISNULL([disabled], 0) = 0))

  , ('Sales New Terminal', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Status of order', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Terminal agreement', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Upgrades or Updates software', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Error messages Technical issues', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Settings for parameters', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Terminal Settings', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('SIM card', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Password for terminal', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Initial setup / Get started', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Daily closing / Cash register report', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Hand over / transferral', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Missing funds', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('BAX application', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Account configuration', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Activation of account', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Accounting assistance', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Terminal transaction', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Terminal report', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Repairs', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))
  , ('Misc', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0))

  , ('Return label', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Shipment' AND ISNULL([disabled], 0) = 0))
  , ('Status of shipment', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Shipment' AND ISNULL([disabled], 0) = 0))
  , ('Tracking Number', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Shipment' AND ISNULL([disabled], 0) = 0))

  , ('Terminal', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0))
  , ('Acquiring', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0))
  , ('Combination', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0))
  , ('E-COM', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0))

  , ('Termination at DPC', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Follow up cancel agreement' AND ISNULL([disabled], 0) = 0))
  , ('Customer keeps making transactions', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Follow up cancel agreement' AND ISNULL([disabled], 0) = 0))

  , ('Settlements ', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Major system failure' AND ISNULL([disabled], 0) = 0))
  , ('Invoice', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Major system failure' AND ISNULL([disabled], 0) = 0))
  , ('File transfer', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Major system failure' AND ISNULL([disabled], 0) = 0))
  , ('Payment service down', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Major system failure' AND ISNULL([disabled], 0) = 0))
  , ('Other', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Major system failure' AND ISNULL([disabled], 0) = 0))

  INSERT INTO [dbo].[Descriptor] (
    [descriptorName],
    [subcategoryId]
  )
  VALUES
    ('General questions', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Transaction' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Ecommerce' AND ISNULL([disabled], 0) = 0)))
  , ('Capture', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Transaction' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Ecommerce' AND ISNULL([disabled], 0) = 0)))
  , ('Refunds', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Transaction' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Ecommerce' AND ISNULL([disabled], 0) = 0)))

  , ('Correction wrong key', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Authorization' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Wrong TOF', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Authorization' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Wrong Account number', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Authorization' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Refunds/Debit', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Authorization' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('General questions', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Authorization' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))

  , ('Registrate acquiring number on BAX/TOF', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'BAX TOF' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Remove acquiring number on BAX/TOF', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'BAX TOF' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))

  , ('Report questions', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring reports' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Send report', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring reports' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Change of report form', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring reports' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Adjustment to report', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring reports' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Change of e-mailadress', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring reports' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))

  , ('Price', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring contracts' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Change terms of condition - better', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring contracts' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Change terms of condition - worse', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring contracts' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Questions', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring contracts' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))

  , ('Change of account form sent', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Change of account number' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))
  , ('Changed account number', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Change of account number' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0)))

  , ('Price', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal agreement' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Terms and Conditions', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal agreement' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))

  , ('SIM slot', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Chip reader', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Freeze of terminal', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Software', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Buttons', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Communication Error', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Not Approved', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Printer problem', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Blue screen', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Battery or cord', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Cash register or Connection to Cash register', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Case protection', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Error messages Technical issues' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))

  , ('License', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Settings for parameters' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Place on Customer', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Settings for parameters' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Currency', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Settings for parameters' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Move Terminal', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Settings for parameters' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Acquiring agreement', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Settings for parameters' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))

  , ('General questions', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal transaction' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Refund', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal transaction' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Debit', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal transaction' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))

  , ('Service & Repair', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Repairs' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Substitution product', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Repairs' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('DOA', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Repairs' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))
  , ('Questions', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Repairs' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))

  , ('Questions', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Misc' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0)))

  , ('Business closures', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Company restructure', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Dissatisfied with the product', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Better offer from competitor', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Closed by partner', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Other', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Terminal' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))

  , ('Business closures', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Company restructure', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Dissatisfied with the product', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Better offer from competitor', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Closed by partner', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Other', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Acquiring' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))

  , ('Business closures', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Combination' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Company restructure', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Combination' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Dissatisfied with the product', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Combination' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Better offer from competitor', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Combination' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Closed by partner', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Combination' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))
  , ('Other', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Combination' AND ISNULL([disabled], 0) = 0 AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Termination' AND ISNULL([disabled], 0) = 0)))

END
