<template>
  <div style="background-color:#f3f4f5;">
    <i-notice-bar icon="systemprompt" loop ref="noticeBar">{{ latestMessage }}</i-notice-bar>
    <i-cell-group>
      <i-comment-cell
        title="官方通知"
        @click="handleChat(0)"
      >
        <view slot="icon">
          <i-avatar :src="avatar" style="margin-right:10px;" />
        </view>
      </i-comment-cell>
      <i-comment-cell
        v-for="item in messageList"
        :key="item"
        :title="item.userName"
        :label="item.userUniversityCampus"
        :time="item.distance + 'km ' + item.createTime"
        :content="item.content"
        @click="handleChat(item.userId)"
      >
        <view slot="icon">
          <i-avatar :src="item.userPhoto" style="margin-right:10px;" />
        </view>
        <view slot="badge">
          <i-badge v-if="item.unReadCount !== 0" dot />
        </view>
      </i-comment-cell>
      <i-comment-cell
        v-for="item in sayHelloList"
        :key="item"
        :userId="item.userId"
        :title="item.fromUserName"
        :label="item.fromUserUniversityCampusIdName"
        :time="item.distance + 'km ' + item.createTime"
        :content="item.content"
        @clickTitle="handlePersonalPage"
      >
        <view slot="icon">
          <i-avatar :src="item.fromUserPhoto" style="margin-right:10px;" />
        </view>
        <view slot="footer">
          <i-button size="small" type="primary" shape="circle" @click="handleOK(item.id)">OK</i-button>
          <i-button size="small" type="error" shape="circle" @click="handleNO(item.id)">NO</i-button>
        </view>
      </i-comment-cell>
    </i-cell-group>
  </div>
</template>

<script>
import avatar from "../../../static/images/benxiao.png"

export default {
  data() {
    return {
      userId: undefined,
      messageList: [],
      sayHelloList: [],
      latestMessage: "",
      avatar: avatar
    };
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + this.userId
    }
  },
  onShow() {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          that.$wxhttp.post({
            url: "/user/login",
            data: {
              code: res.code
            }
          }).then(resp => {
            if(resp.code === 0){
              that.userId = resp.data.id;
              if(resp.data.isCheckUniversity === 0){
                //首次登录校趣，输入校区，授权信息，并完善个人信息
                wx.showToast({
                  title: "首次登录，请在本人的大学校园内登陆校趣完成在校认证 或 输入邀请码 ",
                  icon: "none",
                  success: () => {
                    setTimeout(() => {
                      wx.switchTab({
                        url: "../index/main"
                      });
                    },1500);
                  }
                });
              }else{
                //不是首次登录，获取兑换券列表
                that.getMessageList();
                that.getLatestMessage();
                that.timer = setInterval(that.getMessageList, 10000);
                that.updateBadge();
              }
            }else{
              wx.showToast({
                title: resp.msg,
                icon: 'none'
              });
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
          wx.showToast({
            title: "登录失败",
            icon: 'none'
          });
        }
      }
    });

    
  },
  onHide() {
    clearInterval(this.timer);
  },
  methods: {
    updateBadge() {
      this.$wxhttp.unloadGet({
        url: "/message/unreadNumber?userId=" + this.userId
      }).then(resp2 => {
        if(resp2.code == 0){
          if(resp2.data !== 0){
            wx.setTabBarBadge({
              index: 1,
              text: String(resp2.data)
            });
          }
        }
      });
    },
    getMessageList(){
      this.$wxhttp.unloadGet({
        url: "/message/getYouXinList?userId=" + this.userId 
      }).then(resp => {
        if(resp.code === 0){
          this.messageList = resp.data.latestChatRecord.map(item => {
            return {
              ...item,
              createTime: this.$moment(item.createTime).format("YYYY-MM-DD HH:mm:SS"),
              distance: item.distance.toFixed(2)
            }
          });
          this.sayHelloList = resp.data.sayHelloList.map(item => {
            return {
              ...item,
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm:SS"),
              distance: item.distance.toFixed(2)
            }
          })
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      })
    },
    getLatestMessage() {
      this.$wxhttp.post({
        url: "/message/getLatestMessage?userId=" + this.userId
      }).then(resp => {
        if(resp.code == 0){
          this.latestMessage = resp.data;
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      })
    },
    handleChat(chatUserId) {
      wx.navigateTo({
        url: "../chat/chat/main?chatUserId=" + chatUserId + "&userId=" + this.userId
      });
    },
    handleOK(notificationId) {
      this.$wxhttp.post({
        url: "/user/clickOK?notificationId=" + notificationId
      }).then(resp => {
        if(resp.code === 0){
          this.getMessageList();
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    handleNO(notificationId) {
      this.$wxhttp.post({
        url: "/user/clickNO?notificationId=" + notificationId
      }).then(resp => {
        if(resp.code === 0){
          this.getMessageList();
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    handlePersonalPage(e) {
      // console.log(e.mp.detail)
      wx.navigateTo({
        url: "../myPages/post/main?userId=" + e.mp.detail + "&selfUserId=" + this.userId
      });
    },
  }
};
</script>

<style>
.i-swipeout-demo-item {
  border-bottom: #333 solid 1px;
}
.i-swipeout-demo-button-group {
  height: 100%;
  width: 100%;
}
.i-swipeout-demo-button {
  width: 80px;
  float: left;
  display: flex;
  height: 100%;
  justify-content: center;
  background: red;
  color: #fff;
  align-items: center;
}
</style>