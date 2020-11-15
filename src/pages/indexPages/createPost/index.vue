<template>
  <div>
    <div style="margin-top:10px;display:block;">
      <i-panel>
        <i-input
          v-model="content"
          asking
          mode="wrapped"
          type="textarea"
          maxlength="99"
          placeholder="请输入你想说的..."
          @change="handleContentChange"
        />
        <div
          v-if="tempFilePath === ''"
          style="border: 1px #b6b6b6 solid;border-radius: 5px;text-align:center;margin:10px;"
          @click="handleChooseImage"
        >
          <i-icon color="#b6b6b6" size="25" type="add" />
        </div>
        <div v-else style="text-align:center;margin:10px;width:240px;">
          <!-- <img :src="tempFilePath" style="max-width:100%;max-height:100%;" /> -->
          <image :src="tempFilePath" mode="widthFix" style="max-width:100%;"/>
        </div>
      </i-panel>
    </div>
    <div style="margin:20px;margin-bottom:60px;">
      <p class="font" style="font-size:15px;line-height:2;color:#a3a4a4">提示：</p>
      <p
        class="font"
        style="font-size:11px;line-height:2;color:#a3a4a4"
      >1. 想要删除自己的发帖，请在【我的】里面【我的发帖】点击【+】号中的删除</p>
      <p
        class="font"
        style="font-size:11px;line-height:2;color:#a3a4a4"
      >2. 请注意自己的发帖言行，多次被举报帖子内容不适，将被封号</p>
    </div>
    <div style="height:20px;" />
    <div style="position:fixed;bottom:0;width:100%;">
      <i-button style="margin:10px;width:100%" shape="circle" type="primary" @click="handlePost">发布</i-button>
    </div>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
      groupId: undefined,
      content: "",
      tempFilePath: "",
      latitude: undefined,
      longitude: undefined,
      mode: ""  //跳转模式
    }
  },
  mounted() {
    this.groupId = getQuery.getQuery().groupId;
    this.userId = getQuery.getQuery().userId;
    // 查找是否授权地理位置，未授权则要求用户授权地理位置
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success () {
              // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
              wx.getLocation({
                type: 'wgs84',
                success (res) {
                  that.latitude = res.latitude;
                  that.longitude = res.longitude;
                }
              });
            }
          })
        }else{
          // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
          wx.getLocation({
            type: 'wgs84',
            success (res) {
              that.latitude = res.latitude;
              that.longitude = res.longitude;
            }
          });
        }
      }
    });
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
    handleContentChange(event) {
      this.content = event.mp.detail.detail.value;
    },
    handlePost() {
      var that = this;
      if(this.content || this.tempFilePath){
        wx.uploadFile({
          url: that.$wxhttp.host + "/image/uploadPostImg",
          filePath: that.tempFilePath,
          name: "image",
          header: { "Content-Type": "multipart/form-data" },
          success(res) {
            //全部图片上传成功，创建帖子
            that.$wxhttp.post({
              url: "/post",
              data: {
                content: that.content,
                latitude: that.latitude,
                longitude: that.longitude,
                groupId: that.groupId,
                img: that.$wxhttp.hostForFile + String(JSON.parse(res.data).data),
                userId: that.userId
              }
            }).then(resp => {
              if(resp.code === 0){
                wx.showToast({
                  title: "发帖成功"
                });
                wx.navigateBack({
                  delta: 1
                });
              }else{
                wx.showToast({
                  title: resp.msg,
                  icon: "none"
                });
              }
            })
          }
        });
      }else{
        wx.showToast({
          title: "内容不可为空",
          icon: "none"
        });
      }
    }
  }
}
</script>

<style>
</style>