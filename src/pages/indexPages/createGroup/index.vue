<template>
  <div>
    <div style="margin:5px;">
      <i-panel>
        <i-input
          v-model="name"
          title="兴趣组名称"
          maxlength="12"
          right
          mode="wrapped"
          placeholder="请在这里输入,本校内名称唯一"
          @change="handleNameChange"
        />
        <div style="margin:10px;">
          <p class="font" style="font-size:11px;">
            兴趣组名称最好有关键词呦，以便同兴趣的小伙伴搜索加入
          </p>
        </div>
        <i-input
          v-model="introduction"
          title="兴趣组介绍"
          right
          high
          type="textarea"
          mode="wrapped"
          placeholder="限25个字"
          maxlength="25"
          @change="handleIntroductionChange"
        />
        <div class="add" @click="handleChooseImage">
          <i-avatar :src="tempFilePath">L</i-avatar>
          <i-icon v-if="tempFilePath == ''" type="add" size="25" />
          <span v-if="tempFilePath == ''">添加兴趣组logo</span>
        </div>
      </i-panel>
    </div>
    <div style="margin:20px;">
      <p class="font" style="font-size:15px;">提示：</p>
      <p class="font" style="font-size:11px;">
        1.每个人可以创建2个兴趣组，请管理维护好自己创建的兴趣组，
        如果兴趣组内容被多人举报内容不适，此兴趣组将被取缔。兴趣组收益根据活跃度，分享软广告带来的收益，
        收益每周一通过微信发放。具体收益明细，请查看【我的】里的【兴趣组收益】。
      </p>
      <p class="font" style="font-size:11px;">
        2.管理兴趣组，左滑自创兴趣组里面的帖子，右侧有【删帖】【删+拉黑发帖人】2个按钮，
        右上角【加号+】，有解散此组按钮。
      </p>
      <p class="font" style="font-size:11px;">3.请勿发政治宗教人肉及商品买卖等不适宜话题，被举报，封号处理</p>
    </div>
    <div style="margin:20px;">
      <i-button type="primary" @click="handleCreateGroup">创建此组</i-button>
    </div>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
      name: "", //兴趣组名字
      introduction: "", //兴趣组介绍
      tempFilePath: "",  //logo路径
      latitude: undefined,
      longitude: undefined,
      userId: undefined
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
    // 获取当前的地理位置
    this.userId = getQuery.getQuery().userId;
    this.name = "";
    this.introduction = "";
    this.tempFilePath = "";
    // var that = this;
    // wx.getLocation({
    //   type: 'gcj02',
    //   success (res) {
    //     that.latitude = res.latitude
    //     that.longitude = res.longitude
    //   }
    // });
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
    handleChooseImage() {
      var that = this;
      wx.chooseImage({
        count: 1, //最多上传1张照片
        sizeType: ['compressed'], //压缩图
        sourceType: ['album','camera'], //指定来源，相册和相机都可
        success(res) {
          that.tempFilePath = res.tempFilePaths[0];
        }
      })
    },
    handleCreateGroup() {
      if(this.name.indexOf(" ") !== -1){
        //兴趣组名称不能包含空格
        wx.showToast({
          title: "兴趣组名称不能包含空格",
          icon: "none",
          duration: 3000
        });
      }else{
        if(this.name!=="" && this.introduction !== "" && this.tempFilePath!==""){
          var that = this;
          wx.uploadFile({
            url: that.$wxhttp.host + "/image/uploadLogo",
            filePath: that.tempFilePath,
            name: "image",
            header: { "Content-Type": "multipart/form-data" },
            success(res) {
              // 上传logo成功后获取返回路径再请求创建兴趣组接口
              that.$wxhttp.post({
                url: "/group",
                data: {
                  createTime: new Date(),
                  description: that.introduction,
                  latitude: that.latitude,
                  longitude: that.longitude,
                  logo: that.$wxhttp.hostForFile + String(JSON.parse(res.data).data),
                  name: that.name,
                  userId: that.userId
                }
              }).then(resp => {
                if(resp.code === 0){
                  this.globalData.createGroupCount = this.globalData.createGroupCount + 1;
                  wx.showToast({
                    title: '创建成功',
                    icon: 'success',
                    duration: 3000,
                    success: () => {
                      setTimeout(() => {
                        wx.reLaunch({
                          url: "../../index/main"
                        });
                      },3000)
                    }
                  });
                }else{
                  wx.showToast({
                    title: resp.msg,
                    icon: 'none',
                    duration: 3000,
                    success: () => {
                      setTimeout(() => {
                        wx.showToast({
                          title: "在校园边缘的时候，建组操作建议在室外宽阔的地方",
                          icon: "none"
                        });
                      }, 3000);
                    }
                  });
                }
              })
            }
          })
        }else{
          wx.showToast({
            title: '请完善名称、简介与Logo',
            icon: 'none',
            duration: 3000
          });
        }
      }
    },
    handleNameChange(event) {
      this.name = event.mp.detail.detail.value;
    },
    handleIntroductionChange(event) {
      this.introduction = event.mp.detail.detail.value;
    }
  }
};
</script>

<style>
.font {
  line-height: 20px;
  color: #b7b7b7;
}
.add {
  margin: 5px 10px;
  background-color: #ececec;
  border-radius: 10px;
  text-align: center;
  color: #9f9f9f;
  padding: 5px;
}
</style>
