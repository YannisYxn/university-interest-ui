<template>
  <div>
    <div
      v-if="tempFilePath === ''"
      style="border: 1px #b6b6b6 solid;border-radius: 5px;text-align:center;margin:10px;height:120px;"
      @click="handleChooseImage"
    >
      <div style="margin-top:30px;">
       <i-icon color="#b6b6b6" size="60" type="add" />
      </div>
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
      >1. 请点击此处+，选择相册里的举报截图后，按发送截图按键完成举报，感谢您维护并净化校趣环境，举报截图由人工审核。
      无故及恶意举报ta人者，会被封号处理。</p>
      <p
        class="font"
        style="font-size:11px;line-height:2;color:#a3a4a4"
      >2. 一天限举报5次，政治、色情、谩骂、攻击、网贷、拉人头等与兴趣无关的话题及图片，欢迎举报，我们会及时人工处理举报，成功举报奖励5积分/次，感谢您维护校趣环境。</p>
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
import getQuery from '../../../utils/getPage';

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
  onShow() {
    this.tempFilePath = "";
  },
  methods: {
    handleChooseImage() {
      var that = this;
      wx.chooseImage({
        count: 1, //最多上传1张照片
        sizeType: ['original','compressed'], //压缩图
        sourceType: ['album'], //指定来源，相册和相机都可
        success(res) {
          that.tempFilePath = res.tempFilePaths[0];
        }
      });
    },
    handleTip() {
      var that = this;
      wx.showLoading({
        title: "加载中"
      });
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