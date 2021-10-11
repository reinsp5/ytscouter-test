<template>
  <div class="uk-container uk-container-expand">
    <!-- RequestForm start -->
    <form id="requestForm" name="requestForm" @submit.prevent="requestAPI()">
      <div class="uk-flex uk-flex-column">
        <!-- キーワード -->
        <div uk-grid>
          <div class="uk-width-2-3 uk-width-1-2@m">
            <label class="uk-form-label" for="query">キーワード</label>
            <div class="uk-inline uk-width-expand">
              <span class="uk-form-icon" uk-icon="icon: search"></span>
              <input
                v-model="keywords"
                class="uk-input"
                type="text"
                name="query"
                list="suggestList"
                required
              />
              <datalist id="suggestList">
                <option
                  v-for="suggest in suggests"
                  :key="suggest.data"
                  :value="suggest.data"
                />
              </datalist>
            </div>
          </div>

          <!-- 検索ボタン -->
          <div class="uk-width-auto uk-margin-top">
            <div class="uk-inline uk-width-expand">
              <button
                class="uk-button uk-button-primary"
                type="submit"
                :disabled="isDisable"
              >
                検索
              </button>
            </div>
          </div>

          <!-- CSV書出ボタン -->
          <div class="uk-width-auto uk-margin-top">
            <div class="uk-inline uk-width-expand">
              <button
                @click="saveAsCSV"
                class="uk-button uk-button-secondary"
                type="button"
                :disabled="isDisable"
              >
                CSV出力
              </button>
            </div>
          </div>
        </div>

        <fieldset class="uk-fieldset uk-margin-small-top">
          <legend class="uk-legend">検索オプション</legend>

          <div class="uk-child-width-expand" uk-grid="margin: 0;">
            <!-- 取得件数 -->
            <div class="uk-width-1-6@m">
              <label class="uk-form-label" for="unit">取得件数</label>
              <div class="uk-inline uk-width-expand">
                <input
                  class="uk-input"
                  type="number"
                  name="unit"
                  :placeholder="'default:' + defaultUnit"
                />
              </div>
            </div>

            <!-- 優良判定条件 -->
            <div class="uk-width-1-6@m">
              <label class="uk-form-label" for="border">優良判定条件</label>
              <div class="uk-inline uk-width-expand">
                <input
                  class="uk-input"
                  type="number"
                  name="border"
                  :placeholder="'default:' + defaultBorder"
                />
              </div>
            </div>

            <!-- 簡易日付指定 -->
            <div class="uk-width-1-6@m">
              <label class="uk-form-label uk-margin-right" for="selectDate"
                >簡易期間指定</label
              >
              <select
                @change="changeSelectDate"
                v-model="selectDate"
                class="uk-select"
                name="selectDate"
                id="selectDate"
              >
                <option
                  v-for="option in selectDateOptions"
                  :key="option.label"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- 取得開始日 -->
            <div class="uk-width-1-4@m">
              <label class="uk-form-label uk-margin-right" for="fromDate"
                >取得開始日</label
              >
              <div class="uk-inline uk-width-expand">
                <span class="uk-form-icon" uk-icon="icon: calendar"></span>
                <input
                  class="uk-input"
                  type="date"
                  name="fromDate"
                  v-model="fromDate"
                  :disabled="calendarDisabled"
                />
              </div>
            </div>

            <!-- 取得終了日 -->
            <div class="uk-width-1-4@m">
              <label class="uk-form-label uk-margin-right" for="toDate"
                >取得終了日</label
              >
              <div class="uk-inline uk-width-expand">
                <span class="uk-form-icon" uk-icon="icon: calendar"></span>
                <input
                  class="uk-input"
                  type="date"
                  name="toDate"
                  v-model="toDate"
                  :disabled="calendarDisabled"
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </form>
    <!-- RequestForm end   -->

    <!-- Summary start -->
    <div class="uk-h4 uk-margin-medium-top" uk-grid="margin: 0;">
      <!-- 優良数 -->
      <div>
        <div class="uk-width-auto">優良数： {{ excellentVideoAmount }}</div>
      </div>

      <!-- 平均再生数 -->
      <div>
        <div class="uk-width-auto">平均再生数： {{ viewAverage }}</div>
      </div>

      <!-- 登録者数１万人超 -->
      <div>
        <div class="uk-width-expand uk-inline">
          登録者数１万人超： {{ excellentChannelAmount }}
        </div>
      </div>

      <!-- 登録者数１万人以下 -->
      <div>
        <div class="uk-width-expand uk-inline">
          登録者数１万人以下： {{ poorChannelAmount }}
        </div>
      </div>
    </div>
    <!-- Summary end   -->

    <!-- Options start -->
    <div class="uk-margin-small-top" uk-grid="margin: 0;">
      <div class="uk-width-medium@s">
        <label class="uk-form-label" for="sort">ソート</label>
        <div class="uk-inline uk-width-expand">
          <select
            class="uk-select"
            name="sort"
            v-model="sortType"
            v-on:change="sortBy"
          >
            <option value="viewest">再生回数</option>
            <option value="likeCnt">高評価数</option>
            <option value="dislikeCnt">低評価数</option>
            <option value="excellPoint">係数</option>
            <option value="publish">チャンネル開設日</option>
            <option value="subscriber">チャンネル登録者数</option>
          </select>
        </div>
      </div>

      <div class="uk-width-small@s uk-margin-top">
        <div class="uk-inline uk-width-expand">
          <select
            class="uk-select"
            name="order"
            v-model="orderType"
            v-on:change="sortBy"
          >
            <option value="desc">降順</option>
            <option value="asc">昇順</option>
          </select>
        </div>
      </div>

      <div class="uk-flex uk-flex-middle">
        <div class="uk-inline uk-margin-left">
          <label for="onlyExcellent" class="uk-form-label">優良のみ</label>
          <input
            type="checkbox"
            v-model="onlyExcellent"
            id="onlyExcellent"
            name="onlyExcellent"
            class="uk-checkbox"
          />
        </div>
      </div>
    </div>
    <!-- Options end   -->

    <!-- Result Area -->
    <search-result
      v-for="item in filterExcellent"
      :searchResult="item"
      :key="item.videoId"
    />

    <!-- Error Dialog -->
    <div id="error-dialog" uk-modal>
      <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <h2 class="uk-modal-title">ERROR!</h2>
        <p>{{ errorMessage }}</p>
        <p class="uk-text-right">
          <button
            type="button"
            class="uk-button uk-button-danger uk-modal-close"
          >
            CLOSE
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import _ from "lodash";
import axios from "axios";
import xml2js from "xml2js";
import UIkit from "uikit";
import SearchResult from "../components/SearchResult.vue";

export default {
  components: {
    SearchResult
  },
  data() {
    return {
      keywords: "",
      suggests: [],
      googleApiKey: "",
      scouterApiKey: "",
      digest: "",
      regionCode: "",
      selectDateOptions: [
        { label: "", value: "" },
        { label: "過去７日間", value: "oneWeek" },
        { label: "過去１４日間", value: "twoWeek" },
        { label: "過去１ヶ月間", value: "oneMonth" }
      ],
      selectDate: "",
      calendarDisabled: false,
      fromDate: "",
      toDate: "",
      params: {},
      searchResults: [],
      sortType: "viewest",
      orderType: "desc",
      onlyExcellent: false,
      errorMessage: "",
      defaultUnit: 50,
      defaultBorder: 3,
      isDisable: false,
      userInfo: [],
      options: {
        headers: {
          Authorization: `Bearer ${this.scouterApiKey}`
        }
      }
    };
  },
  async mounted() {
    await this.checkApi();
    this.regionCode = await ipcRenderer.invoke("get-regionCode");
  },
  methods: {
    // 簡易期間指定機能
    changeSelectDate() {
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setHours(0, 0, 0, 0); // FromDateの時刻は00:00:00とする
      switch (this.selectDate) {
        case "oneWeek": // 直近一週間
          fromDate.setDate(toDate.getDate() - 7); // FromDateにToDateの７日前の日付を設定する
          this.params.publishedAfter = this.convertRFC3339(fromDate); // 現在時刻をFromDateに設定
          this.params.publishedBefore = this.convertRFC3339(toDate); // 現在時刻をToDateに設定
          this.fromDate = "";
          this.toDate = "";
          this.calendarDisabled = true; // 取得開始日 と 取得終了日 を無効化する
          break;

        case "twoWeek": // 直近二週間
          fromDate.setDate(toDate.getDate() - 14); // FromDateにToDateの７日前の日付を設定する
          this.params.publishedAfter = this.convertRFC3339(fromDate); // 現在時刻をFromDateに設定
          this.params.publishedBefore = this.convertRFC3339(toDate); // 現在時刻をToDateに設定
          this.fromDate = "";
          this.toDate = "";
          this.calendarDisabled = true; // 取得開始日 と 取得終了日 を無効化する
          break;

        case "oneMonth": // 直近一ヶ月
          fromDate.setMonth(toDate.getMonth() - 1); // FromDateにToDateの７日前の日付を設定する
          this.params.publishedAfter = this.convertRFC3339(fromDate); // 現在時刻をFromDateに設定
          this.params.publishedBefore = this.convertRFC3339(toDate); // 現在時刻をToDateに設定
          this.fromDate = "";
          this.toDate = "";
          this.calendarDisabled = true; // 取得開始日 と 取得終了日 を無効化する
          break;

        default:
          // それ以外（空白）
          delete this.params.publishedAfter; // publishedAfterを削除する
          delete this.params.publishedBefore; // publishedBeforeを削除する
          this.calendarDisabled = false; // 取得開始日 と 取得終了日 を有効化する
      }
    },
    async checkApi() {
      try {
        this.googleApiKey = await ipcRenderer.invoke("get-googleApiKey");
        if (!this.googleApiKey) {
          throw new Error("GoogleAPIキーを設定してください。"); // GoogleAPIキーが未設定
        }

        this.scouterApiKey = await ipcRenderer.invoke("get-scouterApiKey");
        if (!this.scouterApiKey) {
          throw new Error("ytScouterAPIキーを設定してください。"); // ytScouterAPIキーが未設定
        }
      } catch (e) {
        // エラーダイアログを表示する
        this.errorMessage = e.message;
        this.isDisable = true;
        this.openErrorDialog();
        return;
      }

      try {
        this.options.headers.Authorization = `Bearer ${this.scouterApiKey}`;
        const resp = await axios.get(
          "https://ytscouter.you-march.jp/api/user",
          this.options
        );
        this.userInfo = resp.data;
        this.digest = await ipcRenderer.invoke("get-digest");
        if (this.digest != this.userInfo.digest) {
          throw new Error("すでに他のデバイスでytScouterを使用中です。");
        }
      } catch (e) {
        // エラーダイアログを表示する
        this.errorMessage = e.message;
        this.isDisable = true;
        this.openErrorDialog();
        return;
      }
    },
    async requestAPI() {
      await this.checkApi();

      try {
        this.userInfo = await axios.get(
          "https://ytscouter.you-march.jp/api/user",
          this.options
        );
        if (this.userInfo.data.userType != "premium") {
          if (this.userInfo.data.limitPerDay >= 3) {
            this.isDisable = true;
            this.errorMessage = "１日あたりの利用回数の上限に達しています。";
            this.openErrorDialog();
            return;
          }
        }
      } catch (error) {
        this.isDisable = true;
        this.errorMessage = error.response.data.message;
        this.openErrorDialog();
      }

      const requestForm = document.requestForm; // リクエストフォーム
      const formValid = requestForm.checkValidity(); // Formチェック実行

      if (!formValid) return; // Formにエラーがある場合は処理を中断

      //const params = {};

      this.params.key = this.googleApiKey;
      this.params.part = "id,snippet";
      this.params.q = requestForm.query.value; // 検索クエリ
      this.params.type = "video";
      this.params.regionCode = this.regionCode;
      this.params.order = "viewCount";

      this.params.maxResults = requestForm.unit.value
        ? requestForm.unit.value
        : this.defaultUnit; // 取得数

      if (!this.selectDate) {
        // 簡易日付指定機能を使用していない場合
        let fromDate = null;
        if (this.fromDate) {
          fromDate = new Date(this.fromDate);
          fromDate.setHours(0, 0, 0, 0); // 時刻 00:00:00.000
          this.params.publishedAfter = this.convertRFC3339(fromDate);
        }

        let toDate = null;
        if (this.toDate) {
          toDate = new Date(this.toDate);
          toDate.setHours(23, 59, 59, 999); // 時刻 23:59:59.999
          this.params.publishedBefore = this.convertRFC3339(toDate);
        }

        if (fromDate !== null && toDate !== null) {
          if (fromDate.getTime() > toDate.getTime()) {
            //日付逆転
            this.errorMessage =
              "取得開始日が取得終了日を超えることはできません。";
            this.openErrorDialog();
            return;
          }
        }
      }

      const searchData = await this.requestSearch(this.params);

      if (!searchData) return; // SearchAPIからデータを正常に取得できたか？

      const videosData = await this.requestVideos(searchData);

      if (!videosData) return; // VideosAPIからデータを正常に取得できたか？

      const channelsData = await this.requestChannels(searchData);

      if (!channelsData) return; // ChannelsAPIからデータを正常に取得できたか？

      this.params.border = requestForm.border.value
        ? requestForm.border.value
        : this.defaultBorder; // 優良判定条件
      this.searchResults = [];
      this.searchResults = this.createSearchResult(
        this.params.border,
        this.params.maxResults,
        videosData,
        channelsData
      );
      console.log(this.searchResults);
      this.stackWords(this.params);
      this.countUpLimit();
      this.sortBy();
    },
    async requestSearch(params) {
      let resp = "";
      try {
        resp = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: params
        });
      } catch (error) {
        this.errorMessage = error.response.data.error.message;
        this.openErrorDialog();
      }
      return resp.data;
    },
    async requestVideos(searchData) {
      let resp = "";
      try {
        const videoIds = [];
        searchData.items.forEach((item) => {
          videoIds.push(item.id.videoId);
        });
        resp = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            key: this.googleApiKey,
            part: "id,snippet,statistics",
            id: videoIds.join()
          }
        });
      } catch (error) {
        this.errorMessage = error.response.data.error.message;
        this.openErrorDialog();
      }
      return resp.data;
    },
    async requestChannels(searchData) {
      let resp = "";
      try {
        const channelIds = [];
        searchData.items.forEach((item) => {
          channelIds.push(item.snippet.channelId);
        });
        resp = await axios.get(
          "https://www.googleapis.com/youtube/v3/channels",
          {
            params: {
              key: this.googleApiKey,
              part: "id,snippet,statistics",
              id: channelIds.join()
            }
          }
        );
        this.channelsData = resp.data;
      } catch (error) {
        this.errorMessage = error.response.data.error.message;
        this.openErrorDialog();
      }
      return resp.data;
    },
    createSearchResult(border, unit, videosData, channelsData) {
      const resp = {};
      const items = []; // resp.items
      let viewAvg = 0;
      // videosData.items[].snippet.channelId <--> channelsData.items[].id
      let excellentCount = 0;
      videosData.items.forEach((videoItem) => {
        const channelItem = channelsData.items.find((item) => {
          return videoItem.snippet.channelId == item.id;
        });
        if (channelItem) {
          if (!isNaN(videoItem.statistics.viewCount)) {
            // レスポンスitems組立
            const item = {};
            let excellent = false;
            const excellentPoint = this.calcExcellPoint(
              videoItem.statistics,
              channelItem.statistics
            );
            if (excellentPoint >= border) {
              excellentCount++;
              excellent = true;
            }
            item["videoId"] = videoItem.id;
            item["channelId"] = channelItem.id;
            item["videoSnippet"] = videoItem.snippet;
            item["videoStatistics"] = this.videoStatisticsFormat(
              videoItem.statistics
            );
            item["channelSnippet"] = channelItem.snippet;
            item["channelStatistics"] = this.channelStatisticsFormat(
              channelItem.statistics
            );
            item["excellentPoint"] = excellentPoint;
            item["excellent"] = excellent;
            item["visible"] = true;
            items.push(item);

            viewAvg += Number(videoItem.statistics.viewCount);
          }
        }
      });

      // レスポンス組立

      resp["viewAvg"] = Math.floor(viewAvg / items.length);
      resp["items"] = items;
      resp["excellentCount"] = excellentCount;
      resp["channelAmount"] = this.calcChannelAmount(channelsData.items);
      resp["excellentChannelAmount"] = this.calcExcellChannelCount(resp.items);
      resp["poorChannelAmount"] =
        resp["channelAmount"] - resp["excellentChannelAmount"];
      return resp;
    },
    videoStatisticsFormat(videoStat) {
      if (!("likeCount" in videoStat)) videoStat.likeCount = 0;
      if (!("dislikeCount" in videoStat)) videoStat.dislikeCount = 0;

      return videoStat;
    },
    channelStatisticsFormat(channelStat) {
      if (channelStat.hiddenSubscriberCount == true) {
        channelStat.subscriberCount = 0;
      }
      return channelStat;
    },
    calcExcellPoint(videoStat, channelStat) {
      // 登録者数は公開されているか？
      if (!channelStat.hiddenSubscriberCount) {
        const subscCount = Number(channelStat.subscriberCount);
        const videoViewCount = Number(videoStat.viewCount);
        const excellentPoint =
          Math.ceil((videoViewCount / subscCount) * Math.pow(10, 2)) /
          Math.pow(10, 2);
        return excellentPoint;
      } else {
        return 0;
      }
    },
    calcExcellChannelCount(items) {
      const filterdItems = items.filter((item) => {
        return item.channelStatistics.subscriberCount >= 10000;
      });
      const excellentChannels = [];
      filterdItems.forEach((item) => {
        excellentChannels.push(item.channelId);
      });
      const cleanExcellentChannels = new Set(excellentChannels); // 重複排除
      return cleanExcellentChannels.size;
    },
    calcChannelAmount(items) {
      const channelIds = [];
      items.forEach((channelItem) => {
        channelIds.push(channelItem.id);
      });
      const cleanChannelIds = new Set(channelIds); // 重複排除
      return cleanChannelIds.size;
    },
    sortBy() {
      //並び替え
      switch (this.sortType) {
        case "viewest":
          this.searchResults.items.sort(
            this.sortLevel2(
              "videoStatistics",
              "viewCount",
              "int",
              this.orderType
            )
          );
          break;
        case "likeCnt":
          this.searchResults.items.sort(
            this.sortLevel2(
              "videoStatistics",
              "likeCount",
              "int",
              this.orderType
            )
          );
          break;
        case "dislikeCnt":
          this.searchResults.items.sort(
            this.sortLevel2(
              "videoStatistics",
              "dislikeCount",
              "int",
              this.orderType
            )
          );
          break;
        case "excellPoint":
          this.searchResults.items.sort(
            this.sortLevel1("excellentPoint", "org", this.orderType)
          );
          break;
        case "publish":
          this.searchResults.items.sort(
            this.sortLevel2(
              "channelSnippet",
              "publishedAt",
              "date",
              this.orderType
            )
          );
          break;
        case "subscriber":
          this.searchResults.items.sort(
            this.sortLevel2(
              "channelStatistics",
              "subscriberCount",
              "int",
              this.orderType
            )
          );
          break;
      }
    },
    sortLevel1(key, dataType, order = "asc") {
      return (a, b) => {
        let varA = "";
        let varB = "";

        switch (dataType) {
          case "string":
            varA = String(a[key]);
            varB = String(b[key]);
            break;
          case "int":
            varA = Number(a[key]);
            varB = Number(b[key]);
            break;
          case "date":
            varA = Date.parse(a[key]);
            varB = Date.parse(b[key]);
            break;
          case "org":
            varA = a[key];
            varB = b[key];
            break;
          default:
            return 0;
        }

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == "desc" ? comparison * -1 : comparison;
      };
    },
    sortLevel2(key1, key2, dataType, order = "asc") {
      return (a, b) => {
        let varA = "";
        let varB = "";

        switch (dataType) {
          case "string":
            varA = String(a[key1][key2]);
            varB = String(b[key1][key2]);
            break;
          case "int":
            varA = Number(a[key1][key2]);
            varB = Number(b[key1][key2]);
            break;
          case "date":
            varA = Date.parse(a[key1][key2]);
            varB = Date.parse(b[key1][key2]);
            break;
          case "org":
            varA = a[key1][key2];
            varB = b[key1][key2];
            break;
          default:
            return 0;
        }

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == "desc" ? comparison * -1 : comparison;
      };
    },
    stackWords(params) {
      const reqBody = new FormData();
      reqBody.append("query", params.q);
      reqBody.append("unit", params.maxResults);
      reqBody.append("border", params.border);
      reqBody.append("fromDate", params.publishedAfter);
      reqBody.append("toDate", params.publishedBefore);
      axios.post("https://ytscouter.you-march.jp/api/stackWords", reqBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.scouterApiKey}`
        }
      });
    },
    openErrorDialog() {
      const erDialog = document.getElementById("error-dialog");
      UIkit.modal(erDialog).show();
    },
    convertRFC3339(date) {
      return (
        date.getFullYear() +
        "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getDate()).slice(-2) +
        "T" +
        ("00" + date.getHours()).slice(-2) +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2) +
        "Z"
      );
    },
    countUpLimit() {
      axios.get("https://ytscouter.you-march.jp/api/countUpLimit", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.scouterApiKey}`
        }
      });
    },
    saveAsCSV() {
      const resultArray = JSON.parse(JSON.stringify(this.searchResults.items)); // 検索結果をstringfyで整形した後、parseで配列へ変換する
      const csvText = this.convResults2CSV(resultArray); // 上記の配列をCSV文字列へ変換する
      ipcRenderer
        .invoke("output-csv", csvText)
        .then((data) => {
          // キャンセルで閉じた
          if (data.status === undefined) {
            return false;
          }

          // 保存に失敗
          if (!data.status) {
            return false;
          }

          // 保存成功
        })
        .catch((err) => {
          console.error(err);
        });
    },
    convResults2CSV(resultArray) {
      let csv =
        "動画タイトル\t動画URL\tチャンネル名\tチャンネルURL\t再生回数\tチャンネル登録者数\t係数\tチャンネル開設日\t動画投稿日\tgood数\tbad数\n"; // タイトル行
      resultArray.forEach((element) => {
        csv += `${element.videoSnippet.title}\thttps://www.youtube.com/watch?v=${element.videoId}\t${element.videoSnippet.channelTitle}\thttps://www.youtube.com/channel/${element.videoSnippet.channelId}\t${element.videoStatistics.viewCount}\t${element.channelStatistics.subscriberCount}\t${element.excellentPoint}\t${element.channelSnippet.publishedAt}\t${element.videoSnippet.publishedAt}\t${element.videoStatistics.likeCount}\t${element.videoStatistics.dislikeCount}\n`;
      });
      return csv;
    }
  },
  computed: {
    filterExcellent() {
      if (this.searchResults.length != 0) {
        if (this.onlyExcellent) {
          return this.searchResults.items.filter((item) => {
            return item.excellent === true;
          });
        } else {
          return this.searchResults.items;
        }
      }
      return this.searchResults;
    },
    viewAverage() {
      const num = Number(this.searchResults.viewAvg);
      if (Number.isNaN(num)) {
        return "";
      } else {
        return num.toLocaleString();
      }
    },
    excellentVideoAmount() {
      if (this.searchResults.excellentCount) {
        return (
          Number(this.searchResults.excellentCount) +
          "/" +
          Number(this.searchResults.items.length)
        );
      } else {
        return "";
      }
    },
    excellentChannelAmount() {
      if (this.searchResults.channelAmount) {
        return (
          Number(this.searchResults.excellentChannelAmount) +
          "/" +
          Number(this.searchResults.channelAmount)
        );
      } else {
        return "";
      }
    },
    poorChannelAmount() {
      if (this.searchResults.channelAmount) {
        return (
          Number(this.searchResults.poorChannelAmount) +
          "/" +
          Number(this.searchResults.channelAmount)
        );
      } else {
        return "";
      }
    }
  },
  watch: {
    keywords: _.debounce(function () {
      if (this.keywords.length != 0) {
        // キーワードの入力があるときのみ実行
        axios
          .get("http://www.google.com/complete/search", {
            params: {
              hl: "ja", // 日本
              ds: "yt", // YouTubeの検索結果
              ie: "utf_8", // 入力文字コード
              oe: "utf_8", // 出力文字コード
              output: "toolbar", // XML形式で取得
              q: this.keywords // 入力されたキーワード
            }
          })
          .then((res) => {
            const parser = new xml2js.Parser({
              explicitArray: false
            });
            parser.parseString(res.data, (error, json) => {
              const results = json.toplevel.CompleteSuggestion;
              this.suggests = [];
              results.forEach((element) => {
                this.suggests.push(element.suggestion.$);
              });
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, 1000)
  }
};
</script>

<style></style>
