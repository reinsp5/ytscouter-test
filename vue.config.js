module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: "ytScouter",
        appId: "work.reinsp5.ytscouter-test",
        afterSign: "./scripts/notarize.js",
        publish: [
          {
            provider: "github",
            owner: "reinsp5",
            repo: "ytscouter-test",
            private: false
          }
        ],
        win: {
          artifactName: "${productName}-setup-win.${ext}",
          icon: "src/assets/macicon.iconset/icon_512x512@2x.png",
          target: {
            target: "nsis",
            arch: ["x64"]
          }
        },
        mac: {
          artifactName: "${productName}-setup-mac.${ext}",
          icon: "src/assets/macicon.icns",
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist",
          target: [
            {
              target: "dmg",
              arch: ["x64"]
            },
            {
              target: "zip",
              arch: ["x64"]
            }
          ]
        }
      }
    }
  }
}