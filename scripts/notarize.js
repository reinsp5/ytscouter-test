require("dotenv").config();
process.env.DEBUG = "electron-notarize*";
const { notarize } = require("electron-notarize");

const password = `@keychain:AC_PASSWORD`;

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: "jp.you-march.ytscouter", //★自分のアプリのBundleID(appId)に変更★
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: password,
    ascProvider: process.env.ASC_PROVIDER,
  });
};