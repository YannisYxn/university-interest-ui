<template>
  <div>
    <i-cell-group>
      <i-cell title="打招呼设置" is-link :url="'../helloSetting/main?userId=' + userId">
      </i-cell>
      <i-cell title="升学" @click="handleOnUniversity">
      </i-cell>
      <i-cell title="注销" @click="() => visibleForLogout = true">
      </i-cell>
    </i-cell-group>

    <mp-dialog
      title="请确认校区"
      :show="visibleForUniversity"
      :buttons="[{text: '取消'}]"
      @buttontap="handleClose"
      @confirm="handleFurtherEducation"
    >
      <i-input
        v-model="universityCampusName"
        maxlength="10"
        placeholder="校区名字"
        disabled
      />
    </mp-dialog>
    <mp-dialog
      title="确认注销？"
      :show="visibleForLogout"
      :buttons="[{text: '取消'}]"
      @buttontap="() => visibleForLogout = false"
      @confirm="handleLogout"
    >
      <span>若确认注销个人所有数据将被清空，此微信号以后不能再登录校趣</span>
    </mp-dialog>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
      visibleForUniversity: false,
      visibleForLogout: false,
      universityCampusName: "",
      userId: undefined,
      latitude: undefined,
      longitude: undefined
    }
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + this.userId
    }
  },
  onShow() {
    this.userId = getQuery.getQuery().userId;
  },
  methods: {
    handleOnUniversity() {
      //获取经纬度
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
                    that.isOnUniversity(res.latitude,res.longitude);
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
                that.isOnUniversity(res.latitude,res.longitude);
              }
            });
          }
        }
      });
    },
    isOnUniversity(latitude,longitude) {
      // 判断当前位置是否处于校内
      var that = this;
      this.$wxhttp.post({
        url: "/user/onUniversity",
        data: {
          latitude: latitude,
          longitude: longitude,
          // universityName: this.university,
          userId: this.userId
        }
      }).then(resp => {
        if(resp.code === 3){
          //学校不存在
          wx.showToast({
            title: '学校不存在',
            duration: 3000
          });
        }else if(resp.code === 4){
          //不在学校范围内
          wx.showToast({
            title: "未在学校范围内",
            icon: "none",
            duration: 3000
          });
        }else if(resp.code === 0){
          // 成功在校内登录
          this.universityId = resp.data.universityId;
          this.universityName = resp.data.universityName;
          this.universityCampusName = resp.data.universityCampusName;
          this.universityCampusId = resp.data.universityCampusId;
          this.visibleForUniversity = true; //确认校区
        }
      });
    },
    handleClose() {
      this.visibleForUniversity = false;
    },
    handleFurtherEducation() {
      this.visibleForUniversity = false;
      if(this.universityCampusName) {
        // 处理用户升学
        this.$wxhttp.post({
          url: "/user/furtherEducation?userId=" + this.userId + "&universityCampusId" + this.universityCampusId
        }).then(resp => {
          if(resp.code == 0){
            wx.showToast({
              title: "升序操作成功",
              duration: 3000
            });
            this.getUserInfo();
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none",
              duration: 3000
            });
          }
        });
      }else{
        wx.showToast({
          title: "地理位置异常",
          icon: "none",
          duration: 3000
        });
      }
    },
    handleLogout() {
      //处理注销
      this.$wxhttp.post({
        url: "/user/logout?userId=" + this.userId
      }).then(resp => {
        if(resp.code == 0){
          wx.showToast({
            title: "注销成功",
            duration: 3000,
            success: () => {
              setTimeout(() => {
                wx.reLaunch({
                  url: "../../index/main"
                });
              },3000)
            }
          })
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none",
            duration: 3000
          });
        }
      })
    }
  }
}
</script>

<style>
</style>