
local MainScene = class("MainScene", cc.load("mvc").ViewBase)

-- MainScene.RESOURCE_FILENAME = "MainScene.csb"

function MainScene:onCreate()
    math.newrandomseed()
    cc.MenuItemFont:setFontName("arial")
    cc.MenuItemFont:setFontSize(32)

    local menuIAP = cc.Menu:create()
    menuIAP:move(display.cx,200)
           :addTo(self)

    cc.Menu:create(
        cc.MenuItemFont:create("Load"):onClicked(function()
                print("[IAP] load")
                sdkbox.IAP:refresh()
            end),
        cc.MenuItemFont:create("Restore"):onClicked(function()
                print("[IAP] restore")
                sdkbox.IAP:restore()
            end),
        cc.MenuItemFont:create("Close"):onClicked(function()
                cc.Director:getInstance():endToLua()
                os.exit(0)
            end)
        )
    :move(200,400)
    :addTo(self)
    :alignItemsVerticallyWithPadding(20)

    sdkbox.IAP:setDebug(true)
    sdkbox.IAP:init()
    sdkbox.PluginAchievement:init()
    sdkbox.PluginLeaderboard:init()
    sdkbox.PluginLeaderboard:setListener(function(event)
            dump(event, "IAP")
            if event.name == "onComplete" then
                print("[IAP] fetch leaderboard data complete ", event.leaderboard)
            elseif event.name == "onFail" then
                print("[IAP] fetch leaderboard date fail")
            end
        end)

    sdkbox.IAP:setListener(function(args)
            dump(args, "IAP")

            if args.event == "onSuccess" then
                -- Purchase success
                local product = args.product
                print("[IAP] Purchase successful:", product.name)
            elseif args.event == "onFailure" then
                -- Purchase failed
                -- msg is the error message
                local product = args.product
                print("[IAP] Purchase failed:", product.name, "error:", args.msg)
            elseif args.event == "onCanceled" then
                -- Purchase was canceled by user
                local product = args.product
                print("[IAP] Purchase canceled: ", product.name)
            elseif args.event == "onRestored" then
                local product = args.product
                print("[IAP] Restored: ", product.name)
            elseif args.event == "onProductRequestSuccess" then
                menuIAP:removeAllChildren()
                -- Returns you the data for all the iap products
                -- You can get each item using following method
                local products = args.products
                print("[IAP] onProductRequestSuccess", products)
                for k,v in pairs(products) do
                    print("[IAP] ================")
                    print("[IAP] name: ", v.name)
                    print("[IAP] price: ", v.price)
                    print("[IAP] ================")

                    cc.MenuItemFont:create(v.name):onClicked(function()
                            print("[IAP] buy item ", v.name)
                            sdkbox.IAP:purchase(v.name)
                        end)
                    :addTo(menuIAP)
                end
                menuIAP:alignItemsVerticallyWithPadding(10)

            elseif args.event == "onProductRequestFailure" then
                -- When product refresh request fails.
                print("[IAP] Failed to get products")
            end
        end)

    -- achievement && leaderboard test
    cc.Menu:create(
        cc.MenuItemFont:create("update leaderboard random [1,100]"):onClicked(function()
            local score = math.random() * 100 + 1
            print("[IAP] update leaderboard with score ", score)
            sdkbox.PluginLeaderboard:submitScore("1560", score);
        end),
        cc.MenuItemFont:create("fetch leaderboard"):onClicked(function()
            print("[IAP] fetch leaderboard")
            sdkbox.PluginLeaderboard:getLeaderboard("1560")
        end),
        cc.MenuItemFont:create("achievement test"):onClicked(function()
            print("[IAP] achievement test")
            sdkbox.PluginAchievement:unlock("3726");
        end)
        )
    :move(display.cx, display.height - 100)
    :addTo(self)
    :alignItemsVerticallyWithPadding(10)

end

return MainScene
