<template>
  <div>
    <div style="margin-top:10px;display:block;">
      <i-panel>
        <i-input
          :value="content"
          asking
          mode="wrapped"
          type="textarea"
          maxlength="99"
          placeholder="限99字，敬请文明用语，污言秽语及不良信息、商业信息被举报，封号处理"
          @change="handleContentChange"
        />
        <span v-if="isFill" style="color:red;margin:10px;font-size:12px;">字数已达到限制！</span>
        <div
          v-if="uploadFilePath === ''"
          style="border: 1px #b6b6b6 solid;border-radius: 5px;text-align:center;margin:10px;"
          @click="handleChooseImage"
        >
          <i-icon color="#b6b6b6" size="25" type="add" />
        </div>
        <div v-else style="text-align:center;margin:10px;">
          <!-- <img :src="tempFilePath" style="max-width:100%;max-height:100%;" /> -->
          <i-icon style="position:absolute;left:88%;" color="red" size="18" type="delete_fill" @click="deleteImage"/>
          <image :src="uploadFilePath" mode="widthFix" style="max-width:100%;" @click="handleChooseImage"/>
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
      <i-button style="margin:10px;width:100%" shape="circle" type="primary" fontsize="large" @click="handlePostPosition">发&#12288;&#12288;布</i-button>
    </div>

    <mp-dialog
      title="是否保留编辑"
      :show="visibleKeep"
      :buttons="[{text: '取消'}]"
      @buttontap="handleClean"
      @confirm="() => visibleKeep = false"
    >
      <div style="text-align:center;">
        <span>存在已编辑内容，是否保留？</span>
      </div>
    </mp-dialog>
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
      uploadFilePath: "",
      latitude: undefined,
      longitude: undefined,
      mode: "",  //跳转模式
      isFill: false,
      visibleKeep: false
    }
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + this.userId
    }
  },
  mounted() {
    this.groupId = getQuery.getQuery().groupId;
    this.userId = getQuery.getQuery().userId;

    if(this.content || this.uploadFilePath){
      this.visibleKeep = true;
    }
    
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
                type: 'gcj02',
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
            type: 'gcj02',
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
    handleClean() {
      //清除编辑内容
      this.content = "";
      this.tempFilePath = "";
      this.uploadFilePath = "";
      this.visibleKeep = false;
    },
    handleChooseImage() {
      var that = this;
      var content = that.content;
      wx.showLoading({
        title: '加载中' // 数据请求前loading
      });
      wx.chooseImage({
        count: 1, //最多上传1张照片
        sizeType: ['compressed'], //压缩图
        sourceType: ['album','camera'], //指定来源，相册和相机都可
        success(res) {
          that.tempFilePath = res.tempFilePaths[0];
          that.content = content;
          wx.compressImage({
            src: res.tempFilePaths[0],
            quality: 40,
            success(res3) {
              wx.uploadFile({
                url: that.$wxhttp.host + "/image/uploadPostImg",
                filePath: res3.tempFilePath,
                name: "image",
                header: { "Content-Type": "multipart/form-data" },
                success(res2) {
                  that.uploadFilePath = that.$wxhttp.hostForFile + String(JSON.parse(res2.data).data);
                  wx.hideLoading();
                }
              });
            }
          });
        }
      });
      wx.hideLoading();
    },
    deleteImage() {
      this.tempFilePath = "";
      this.uploadFilePath = "";
    },
    onUnload() {
      // 页面返回，确认是否保持编辑

    },
    handleContentChange(event) {
      this.content = event.mp.detail.detail.value;
      if(this.content.length == 99){
        this.isFill = true;
      }else{
        this.isFill = false
      }
    },
    handlePostPosition() {
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
                  type: 'gcj02',
                  success (res) {
                    that.latitude = res.latitude;
                    that.longitude = res.longitude;
                    that.handlePost();
                  }
                });
              }
            })
          }else{
            // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
            wx.getLocation({
              type: 'gcj02',
              success (res) {
                that.latitude = res.latitude;
                that.longitude = res.longitude;
                that.handlePost();
              }
            });
          }
        }
      });
    },
    handlePost() {
      var that = this; 
      if(this.content){
        if(this.uploadFilePath){
          wx.showLoading({
            title: '加载中' // 数据请求前loading
          });
          //全部图片上传成功，创建帖子
          that.$wxhttp.post({
            url: "/post",
            data: {
              content: that.content.replace(/(\r\n|\n|\r)/gm, "<br>"),
              latitude: that.latitude,
              longitude: that.longitude,
              groupId: that.groupId,
              img: that.uploadFilePath,
              userId: that.userId
            }
          }).then(resp => {
            if(resp.code === 0){
              wx.showToast({
                title: "发帖成功",
                duration: 3000
              });
              wx.navigateBack({
                delta: 1
              });
            }else{
              wx.showToast({
                title: resp.msg,
                icon: "none",
                duration: 3000
              });
            }
          });
        }else{
          this.$wxhttp.post({
            url: "/post",
            data: {
              content: this.content.replace(/(\r\n|\n|\r)/gm, "<br>"),
              latitude: this.latitude,
              longitude: this.longitude,
              groupId: this.groupId,
              img: "",
              userId: this.userId
            }
          }).then(resp => {
            if(resp.code === 0){
              wx.showToast({
                title: "发帖成功",
                duration: 3000
              });
              wx.navigateBack({
                delta: 1
              });
            }else{
              wx.showToast({
                title: resp.msg,
                icon: "none",
                duration: 3000,
                success: () => {
                  setTimeout(() => {
                    wx.showToast({
                      title: "在校园边缘的时候，发帖操作建议在室外宽阔的地方",
                      icon: "none"
                    });
                  }, 3000);
                }
              });
            }
          });
        }
      }else{
        wx.showToast({
          title: "内容不可为空",
          icon: "none",
          duration: 3000
        });
      }
    }
  }
}
</script>

<style>
</style>