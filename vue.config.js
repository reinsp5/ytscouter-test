module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: "ytScouter",
        appId: "jp.you-march.ytscouter",
        afterSign: "./scripts/notarize.js",
        publish: [
          {
            provider: "github",
            owner: "you-march",
            repo: "ytscouter-client",
            token: "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",
            private: true
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