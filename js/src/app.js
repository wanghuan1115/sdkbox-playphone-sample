
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        var self = this;
        var size = cc.winSize;

        cc.MenuItemFont.setFontName('arial');
        cc.MenuItemFont.setFontSize(32);

        self.menuIAP = new cc.Menu();
        self.menuIAP.setPosition(size.width/2,200);
        this.addChild(self.menuIAP);

        var menu = new cc.Menu(
            new cc.MenuItemFont("Load", this.onIAPLoad, this),
            new cc.MenuItemFont("Restore", this.onIAPRestore, this)
            );
        menu.setPosition(200, 400);
        menu.alignItemsVerticallyWithPadding(20);
        this.addChild(menu);

        sdkbox.IAP.setDebug(true);
        sdkbox.IAP.init();
        sdkbox.PluginAchievement.init();
        sdkbox.PluginLeaderboard.init();
        sdkbox.PluginLeaderboard.setListener({
            onComplete: function(leaderboard) {
                console.log("[IAP] fetch leaderbaord data complete " + leaderboard);
            },
            onFail: function() {
                console.log("[IAP] fetch leaderboard data failed");
            }
        });
        sdkbox.IAP.setListener({
            onSuccess : function (product) {
                //Purchase success
                console.log("[IAP] Purchase successful: " + product.name)
            },
            onFailure : function (product, msg) {
                //Purchase failed
                //msg is the error message
                console.log("[IAP] Purchase failed: " + product.name + " error: " + msg);
            },
            onCanceled : function (product) {
                //Purchase was canceled by user
                console.log("[IAP] Purchase canceled: " + product.name);
            },
            onRestored : function (product) {
                //Purchase restored
                console.log("[IAP] Restored: " + product.name);
            },
            onProductRequestSuccess : function (products) {
                self.menuIAP.removeAllChildren();
                //Returns you the data for all the iap products
                //You can get each item using following method
                for (var i = 0; i < products.length; i++) {
                    console.log("[IAP] ================");
                    console.log("[IAP] name: " + products[i].name);
                    console.log("[IAP] price: " + products[i].price);
                    console.log("[IAP] ================");


                    var productName = products[i].name;
                    var btn = new cc.MenuItemFont(productName);
                    btn.name = productName
                    btn.setCallback(function (sender) {
                        console.log("[IAP] buy item " + sender.name);
                        sdkbox.IAP.purchase(sender.name);
                    }, null);
                    self.menuIAP.addChild(btn);
                }
                self.menuIAP.alignItemsVerticallyWithPadding(10);
            },
            onProductRequestFailure : function (msg) {
                //When product refresh request fails.
                console.log("[IAP] Failed to get products");
            }
        });

        menu = new cc.Menu(
            new cc.MenuItemFont("update leaderboard random [1,100]", function(sender) {
                var score = Math.floor(Math.random()*99) + 1;
                console.log("[IAP] random value: " + score);
                sdkbox.PluginLeaderboard.submitScore("1552", score);
            }, null),
            new cc.MenuItemFont("fetch", function(sender) {
                sdkbox.PluginLeaderboard.getLeaderboard("1552");
            }, null),
            new cc.MenuItemFont("achievement test", function(sender) {
                sdkbox.PluginAchievement.unlock("3724");
            }, null)
            );
        menu.setPosition(size.width/2, size.height - 100);
        menu.alignItemsVerticallyWithPadding(10);
        this.addChild(menu);

        return true;
    },
    onIAPLoad: function() {
        console.log("[IAP] load");
        sdkbox.IAP.refresh();
    },
    onIAPRestore: function() {
        console.log("[IAP] restore");
        sdkbox.IAP.restore();
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

