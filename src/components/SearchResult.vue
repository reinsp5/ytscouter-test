<template>
  <!-- Result start -->
  <div class="uk-container uk-container-expand">
    <!-- ResultCard start -->
    <div class="uk-section uk-section-xsmall">
      <div class="uk-container uk-container-expand">
        <div class="uk-card uk-card-default uk-width-expand">
          <div
            class="
              uk-flex
              uk-card-header
              uk-width-expand
              uk-padding-remove
              uk-flex-middle
            "
          >
            <div
              class="
                uk-width-small
                uk-padding-small
                uk-padding-remove-left
                uk-padding-remove-right
                uk-text-center
              "
              :class="{ 'uk-background-primary': searchResult.excellent }"
            >
              <span
                class="uk-text-small"
                :class="{ white: searchResult.excellent }"
                >係数</span
              >
              <span
                class="uk-text-large uk-text-bolder"
                :class="{ white: searchResult.excellent }"
                >{{ searchResult.excellentPoint }}</span
              ><!--<span v-if="searchResult.excellent" class="uk-badge uk-text-large">優良</span>-->
            </div>
            <div class="uk-margin-small-left">
              <span class="uk-h4"
                ><a :href="videoURL">{{
                  searchResult.videoSnippet.title
                }}</a></span
              >
            </div>
          </div>

          <div class="uk-card-body">
            <div uk-grid>
              <!-- サムネイル start -->
              <div class="uk-width-1-5 thumbnail">
                <a v-bind:href="videoURL"
                  ><img class="uk-width-1-1" :src="thumbnailUrl" alt=""
                /></a>
              </div>
              <!-- サムネイル end   -->

              <!-- 統計情報 start -->
              <div class="uk-width-expand count">
                <!-- 動画情報 -->
                <table class="uk-table">
                  <thead>
                    <tr>
                      <th class="uk-padding-remove uk-text-center">再生回数</th>
                      <td class="uk-padding-remove uk-text-right">
                        <span class="uk-text-large uk-text-bolder">{{
                          viewCount
                        }}</span>
                      </td>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <th class="uk-padding-remove uk-text-center">高評価</th>
                      <td class="uk-padding-remove uk-text-right">
                        <span
                          class="uk-text-large uk-text-bolder uk-text-success"
                          >{{ likeCount }}</span
                        >
                      </td>
                      <th class="uk-padding-remove uk-text-center">低評価</th>
                      <td class="uk-padding-remove uk-text-right">
                        <span
                          class="uk-text-large uk-text-bolder uk-text-danger"
                          >{{ dislikeCount }}</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <th class="uk-padding-remove uk-text-center">コメント</th>
                      <td class="uk-padding-remove uk-text-right">
                        <span class="uk-text-large uk-text-bolder">{{
                          commentCount
                        }}</span>
                      </td>
                      <th class="uk-padding-remove uk-text-center">投稿日</th>
                      <td class="uk-padding-remove uk-text-right">
                        <span class="uk-text-large uk-text-bolder">{{
                          videoPublishedAt
                        }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- チャンネル情報 -->
                <table class="uk-table">
                  <thead>
                    <tr>
                      <th class="uk-padding-remove">チャンネル</th>
                      <td colspan="3" class="uk-padding-remove uk-text-bolder">
                        <a :href="channelURL">{{
                          searchResult.channelSnippet.title
                        }}</a>
                      </td>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <th class="uk-padding-remove">チャンネル登録者数</th>
                      <td class="uk-padding-remove uk-text-bolder">
                        {{ channelScriberCount }}
                      </td>
                      <th class="uk-padding-remove">チャンネル再生回数</th>
                      <td class="uk-padding-remove uk-text-bolder">
                        {{ channelViewCount }}
                      </td>
                    </tr>
                    <tr>
                      <th class="uk-padding-remove">チャンネル開設日</th>
                      <td class="uk-padding-remove uk-text-bolder">
                        {{ channelPublishedAt }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- 統計情報 end  -->

              <!-- ChartArea start -->
              <div class="uk-width-1-3">
                <ChartArea
                  :data="chartData"
                  :id="searchResult.videoId"
                ></ChartArea>
              </div>
              <!-- ChartArea end  -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ResultCard end   -->
  </div>
</template>

<script>
import ChartArea from "./ChartArea.vue";

export default {
  data() {
    return {
      isExcellent: false,
    };
  },
  components: {
    ChartArea,
  },
  props: {
    searchResult: Object,
  },
  computed: {
    thumbnailUrl() {
      const thumbnails = this.searchResult.videoSnippet.thumbnails;

      if ("maxres" in thumbnails) return thumbnails.maxres.url;
      if ("high" in thumbnails) return thumbnails.high.url;
      if ("medium" in thumbnails) return thumbnails.medium.url;
      if ("standard" in thumbnails) return thumbnails.standard.url;

      return thumbnails.default.url;
    },
    videoURL() {
      return "https://www.youtube.com/watch?v=" + this.searchResult.videoId;
    },
    channelURL() {
      return "https://www.youtube.com/channel/" + this.searchResult.channelId;
    },
    viewCount() {
      return Number(
        this.searchResult.videoStatistics.viewCount
      ).toLocaleString();
    },
    likeCount() {
      return Number(
        this.searchResult.videoStatistics.likeCount
      ).toLocaleString();
    },
    dislikeCount() {
      return Number(
        this.searchResult.videoStatistics.dislikeCount
      ).toLocaleString();
    },
    commentCount() {
      return Number(
        this.searchResult.videoStatistics.commentCount
      ).toLocaleString();
    },
    channelViewCount() {
      return Number(
        this.searchResult.channelStatistics.viewCount
      ).toLocaleString();
    },
    channelScriberCount() {
      if (!this.searchResult.channelStatistics.hiddenSubscriberCount) {
        return Number(
          this.searchResult.channelStatistics.subscriberCount
        ).toLocaleString();
      } else {
        return "登録者数非公開";
      }
    },
    videoPublishedAt() {
      const ts = Date.parse(this.searchResult.videoSnippet.publishedAt);
      const jst = new Date(ts);
      return (
        jst.getFullYear() + "." + (jst.getMonth() + 1) + "." + jst.getDate()
      );
    },
    channelPublishedAt() {
      const ts = Date.parse(this.searchResult.channelSnippet.publishedAt);
      const jst = new Date(ts);
      return (
        jst.getFullYear() + "." + (jst.getMonth() + 1) + "." + jst.getDate()
      );
    },
    chartData: function () {
      return [
        Number(this.searchResult.videoStatistics.likeCount),
        Number(this.searchResult.videoStatistics.dislikeCount),
      ];
    },
  },
};
</script>

<style>
.white {
  color: white;
}
</style>