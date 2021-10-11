<template>
  <div class="uk-section">
    <div class="uk-container">
      <h1 class="uk-h1">設定</h1>
      <table class="uk-table uk-width-expand">
        <tbody>
          <tr>
            <th class="uk-width-1-6">Google API キー</th>
            <td>
              <div class="uk-inline uk-width-xlarge uk-margin-left">
                <span class="uk-form-icon" uk-icon="icon: google"></span>
                <input
                  v-model="googleApiKey"
                  type="text"
                  class="uk-input uk-width-expand"
                  name="googleApiKey"
                  id="googleApiKey"
                />
              </div>
              <button
                class="uk-button uk-button-primary uk-margin-left"
                @click="setGoogleApiKey()"
              >
                設定
              </button>
            </td>
          </tr>
          <tr>
            <th>ytScouterAPI キー</th>
            <td>
              <div class="uk-inline uk-width-xlarge uk-margin-left">
                <span class="uk-form-icon" uk-icon="icon: lock"></span>
                <input
                  v-model="scouterApiKey"
                  type="text"
                  class="uk-input uk-width-expand"
                  name="scouterApiKey"
                  id="scouterApiKey"
                />
              </div>
              <button
                class="uk-button uk-button-primary uk-margin-left"
                @click="setScouterApiKey()"
              >
                設定
              </button>
            </td>
          </tr>
          <tr>
            <th>検索基準国</th>
            <td>
              <div class="uk-inline uk-width-xlarge uk-margin-left">
                <select
                  @change="setRegionCode()"
                  v-model="regionCode"
                  name="country"
                  id="country"
                  class="uk-select uk-width-expand"
                >
                  <region-code-options />
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import axios from "axios";
import RegionCodeOptions from "../components/RegionCodeOptions.vue";

export default {
  components: { RegionCodeOptions },
  data() {
    return {
      googleApiKey: "",
      scouterApiKey: "",
      regionCode: "JP",
    };
  },
  async mounted() {
    this.googleApiKey = await ipcRenderer.invoke("get-googleApiKey");
    this.scouterApiKey = await ipcRenderer.invoke("get-scouterApiKey");
    this.regionCode = await ipcRenderer.invoke("get-regionCode");
  },
  methods: {
    setGoogleApiKey() {
      ipcRenderer.invoke("set-googleApiKey", this.googleApiKey);
    },
    setScouterApiKey() {
      ipcRenderer.invoke("set-scouterApiKey", this.scouterApiKey);

      const digest = this.sha256(this.scouterApiKey).then((hash) => {
        const body = new FormData();
        body.append("digest", hash);
        axios
          .post("https://ytscouter.you-march.jp/api/user/saveDigest", body, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.scouterApiKey}`,
            },
          })
          .then((response) => {
            ipcRenderer.invoke("set-digest", hash);
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },
    setRegionCode() {
      ipcRenderer.invoke("set-regionCode", this.regionCode);
    },
    async sha256(text) {
      const time = new Date();
      const uint8 = new TextEncoder().encode(text + time.getTime());
      const digest = await crypto.subtle.digest("SHA-256", uint8);
      return Array.from(new Uint8Array(digest))
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("");
    },
  },
};
</script>

<style>
</style>