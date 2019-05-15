Config                          = {}
Config.Locale                   = 'en'

Config.Accounts                 = { 'bank', 'black_money' }
Config.AccountLabels            = { bank = _U('bank'), black_money = _U('black_money') }

Config.EnableSocietyPayouts     = false -- pay from the society account that the plyayers are employeed at instead of plain giving money. Requirement: esx_society
Config.ShowDotAbovePlayer       = false
Config.DisableWantedLevel       = true
Config.EnableWeaponPickup       = false
Config.EnableHud                = false -- enable the default hud? Display current job and accounts (black, bank & cash)

Config.RemoveInventoryItemDelay = 0 * 60000
Config.PaycheckInterval         = 10 * 60000
Config.MaxPlayers               = 32

Config.EnableDebug              = false
