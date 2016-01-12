/*
Creates the Subcategory table
*/

-- 
IF (OBJECT_ID('Subcategory', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Subcategory] (
    [subcategoryId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [subcategoryName] varchar(256) NULL,
    [categoryId] bigint NULL, -- parent
    [disabled] bit NULL
  )
END

-- Ensure the correct coloumns are used by simple removing all others
IF (NOT EXISTS(SELECT * FROM sys.columns
              WHERE Name = N'disabled'
              AND Object_ID = Object_ID(N'Subcategory'))
    OR NOT EXISTS(SELECT * FROM [dbo].[Subcategory]
                  WHERE [subcategoryName] = 'Släppa reservationer'))
BEGIN
  DROP TABLE [dbo].[Subcategory]
END

IF (OBJECT_ID('Subcategory', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Subcategory] (
      [subcategoryId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
      [subcategoryName] varchar(256) NULL,
      [categoryId] bigint NULL, -- parent
      [disabled] bit NULL
    )
    
    INSERT INTO [dbo].[Subcategory] (
      [subcategoryName],
      [categoryId]
    )
    VALUES
      ('Annuellering/Uppsägning', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'E-handel')),
      ('Uppföljning av ärende', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'E-handel')),
      ('WebManager', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'E-handel')),
      ('Konto', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'E-handel')),
      ('Implementation', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'E-handel')),
      ('Återbetalning', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'E-handel')),
      ('Kom-i-gång', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'E-handel')),
      ('Test', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'E-handel')),
      
      ('Adressändring', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Faktura')),
      ('Felfakturering', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Faktura')), 
      ('Kreditering', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Faktura')), 
      ('Inkasso', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Faktura')),
      ('Obetalda fakturor', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Faktura')),
      ('Frågor', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Faktura')),
      ('Bestrida faktura', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Faktura')),
      
      ('Auktorisation', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Transaktion', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('BAX/TOF', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Släppa reservationer', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Adressändring', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Inlösenrapporter', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('3D secure', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Inlösenavtal/Pris/Villkor', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')), 
      ('Fleranvändaravtal', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Bolagsändring/ändring av organisationsnummer', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Bedrägeri', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Dagsavslut/Kassaavslut', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Redovisningsnummer (kundnr/inlösennr)', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Överlåtelse ny kund', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Inlösenstatus (boardingstatus)', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Tillägg (Amex/Diners)', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('MCC', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('DCC', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Kontonummerändring', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Avslut', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Utökning avtal/inlösen', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      ('Sales - Nytt Inlösen', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Inlösen')),
      
      ('Vidarekoppling internt', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Information')),
      ('Kontaktuppgifter Externt', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Information')),
      ('Kundinformation', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Information')),
      ('Varumärkesinformation', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Information')),
      
      ('Tilläggsprodukt: Kvittorullar', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Beställning')),
      ('Sladdar', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Beställning')),
      ('Space Pole', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Beställning')),
      ('Stickers', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Beställning')),
      ('SIM', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Beställning')),
      ('Övrigt', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Beställning')),
      
      ('Sales - Ny Terminal', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Orderstatus', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Terminnalavtal/Villkor/Pris', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Uppdateringar/Uppgraderingar (Mjukvara)', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Felmeddelanden/Tekniska problem', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Parameterinställningar', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Terminalinställningar', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('SIM-kort', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Terminallösenord', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Retur', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Kom-i-gång', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Dagsavslut/Kassaavslut', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Överlåtelse', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Terminaltransaktion', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Terminalrapport', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Reparationer', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Uppsägning', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal')),
      ('Diverse', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal'))
END

IF NOT EXISTS(SELECT * FROM [dbo].[Subcategory]
              WHERE [subcategoryName] = 'Uppsägning'
              AND [categoryId] = (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal'))
BEGIN
  INSERT INTO [dbo].[Subcategory] (
      [subcategoryName],
      [categoryId]
  )
  VALUES ('Uppsägning', (SELECT TOP 1 [categoryId] FROM [dbo].[Category] WHERE [categoryName] = 'Terminal'))
END
