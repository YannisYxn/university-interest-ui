<template>
  <div>
    <div
      v-if="tempFilePath === ''"
      style="border: 1px #b6b6b6 solid;border-radius: 5px;text-align:center;margin:10px;"
      @click="handleChooseImage"
    >
      <i-icon color="#b6b6b6" size="25" type="add" />
    </div>
    <div v-else style="text-align:center;margin:10px;width:240px;">
      <!-- <img :src="tempFilePath" style="max-width:100%;max-height:100%;" /> -->
      <image :src="tempFilePath" mode="widthFix" style="max-width:100%;" />
    </div>

    <div style="margin:20px;">
      <p class="font" style="font-size:15px;line-height:2;color:#a3a4a4">提示：</p>
      <p
        class="font"
        style="font-size:11px;line-height:2;color:#a3a4a4"
      >1. 感谢您维护校趣环境，谢谢。举报截图由人工审核。恶意举报者，将被封号处理。</p>
      <p
        class="font"
        style="font-size:11px;line-height:2;color:#a3a4a4"
      >2. 一天限举报5次，公开留联系方式的，多数是骗子，欢迎举报。成功举报5个积分/次</p>
    </div>
    <div style="height:20px;" />
    <div style="position:fixed;bottom:0;width:100%;">
      <i-button
        style="margin:10px;width:100%"
        shape="circle"
        type="primary"
        @click="handleTip"
      >发送举报截图</i-button>
    </div>
  </div>
</template>

<script>
import getQuery from '../../utils/getPage';

export default {
  data() {
    return {
      tempFilePath: ""
    }
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + getQuery.getQuery().userId
    }
  },
  methods: {
    handleChooseImage() {
      var that = this;
      wx.chooseImage({
        count: 1, //最多上传1张照片
        sizeType: ['original','compressed'], //压缩图
        sourceType: ['album','camera'], //指定来源，相册和相机都可
        success(res) {
          that.tempFilePath = res.tempFilePaths[0];
        }
      });
    },
    handleTip() {
      var that = this;
      if(this.tempFilePath){
        wx.uploadFile({
          url: that.$wxhttp.host + "/image/uploadReportImg",
          filePath: that.tempFilePath,
          name: "image",
          header: { "Content-Type": "multipart/form-data" },
          success(res) {
            //举报
            that.$wxhttp.post({
              url: "/manage/report",
              data: {
                img: that.$wxhttp.hostForFile + String(JSON.parse(res.data).data),
                userId: getQuery.getQuery().userId,
                relatedId: getQuery.getQuery().relatedId,
                reportedUserId: getQuery.getQuery().reportedUserId,
                type: getQuery.getQuery().type
              }
            }).then(resp => {
              if(resp.code === 0){
                wx.showToast({
                  title: "举报成功，感谢您维护校趣环境",
                  icon: "none",
                  duration: 3000,
                  success: () => {
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1
                      });
                    }, 3000);
                  }
                });
              }else{
                wx.showToast({
                  title: resp.msg,
                  icon: "none",
                  duration: 3000
                });
              }
            })
          },
          fail() {
            wx.showToast({
              title: "上传图片失败，请重新上传",
              icon: "none",
              duration: 3000
            });
          }
        });
      }else{
        wx.showToast({
          title: "举报图片不可为空",
          icon: "none",
          duration: 3000
        });
      }
    }
  }
}
</script>