<template>
  <div style="background-color:#f3f4f5;">
    <!-- <i-notice-bar color="#14d0b6" icon="systemprompt" loop ref="noticeBar">{{ latestMessage }}</i-notice-bar> -->
    <i-cell-group>
      <i-comment-cell
        title="消息通知"
        @click="handleChat(0)"
      >
        <view slot="icon">
          <i-badge v-if="systemUnreadCount !== 0" dot>
            <i-avatar :src="avatar" style="margin-right:10px;" />
            <!-- <span style="font-size:15px;margin:5px;">消息通知</span> -->
          </i-badge>
          <i-avatar v-else :src="avatar" style="margin-right:10px;" />
          <!-- <span v-else style="font-size:15px;margin:5px;">消息通知</span> -->
        </view>
      </i-comment-cell>
      <i-comment-cell
        v-for="item in messageList"
        :key="item"
        :title="item.userName"
        :label="item.userUniversityCampus"
        :time="item.distance + 'km ' + item.createTime"
        :content="item.messageType ==  0 ? item.content : (item.messageType == 1 ? '[图片]' : '[赠送积分]')"
        @click="handleChat(item.userId)"
      >
        <view slot="icon">
          <i-badge v-if="item.unReadCount !== 0" dot>
            <i-avatar :src="item.userPhoto" style="margin-right:10px;" />
          </i-badge>
          <i-avatar v-else :src="item.userPhoto" style="margin-right:10px;" />
        </view>
      </i-comment-cell>
      <i-comment-cell
        v-for="item in sayHelloList"
        :key="item"
        :userId="item.fromUserId"
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
          <i-button size="small" type="primary" shape="circle" @click="handleOK(item.id)">接受</i-button>
          <i-button size="small" type="error" shape="circle" @click="handleNO(item.id)">拒绝</i-button>
        </view>
      </i-comment-cell>
    </i-cell-group>

    <mp-dialog
      :title="stopDay === -2 ? '被举报，此号暂停使用' : '严重违规，此号已被封号'"
      :show="visible"
      @confirm="() => visible = false"
    >
    </mp-dialog>
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
      avatar: avatar,
      systemUnreadCount: 0,
      visible: false,
      stopDay: 0
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
    this.userId = this.globalData.userId;
    if(this.globalData.userType == 3){
      //商家
      wx.showToast({
        title: "商家无法进行其他操作",
        icon: "none",
        duration: 3000
      });
      setTimeout(() => {
        wx.navigateTo({
          url: "../indexPages/merchant/main"
        });
      }, 1500);
    }else if(this.globalData.isCheckUniversity === 0){
      //首次登录校趣，输入校区，授权信息，并完善个人信息
      wx.showToast({
        title: "首次登录，请在本人的大学校园内登陆校趣完成在校认证 或 输入邀请码 ",
        icon: "none",
        duration: 3000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: "../index/main"
            });
          },3000);
        }
      });
    }else if(this.globalData.status == -3) {
      // 注销
      wx.showToast({
        title: "账号已注销",
        icon: "none",
        duration: 3000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: "../index/main"
            });
          },3000);
        }
      });
    }else{
      //不是首次登录，获取兑换券列表
      this.$wxhttp.get({
        url: "/user/getUserDetailById?userId=" + this.userId
      }).then(resp => {
        if(resp.code === 0){
          this.stopDay = resp.data.stopDay;
          if(this.stopDay !== 0){
            this.visible = true;
          }else{
            this.getMessageList();
            // this.getLatestMessage();
            this.timer = setInterval(this.getMessageList, 50000);
            this.updateBadge();
          }
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    }
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
            wx.showTabBarRedDot({
              index: 1
            });
          }else{
            wx.hideTabBarRedDot({
              index: 1
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
          this.systemUnreadCount = resp.data.systemUnreadCount;
          this.messageList = resp.data.latestChatRecord.map(item => {
            return {
              ...item,
              createTime: this.$moment(item.createTime).format("YYYY-MM-DD HH:mm"),
              distance: item.distance.toFixed(2)
            }
          });
          this.sayHelloList = resp.data.sayHelloList.map(item => {
            return {
              ...item,
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm"),
              distance: item.distance.toFixed(2)
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
    },
    getLatestMessage() {
      this.$wxhttp.post({
        url: "/message/getLatestMessage?userId=" + this.userId
      }).then(resp => {
        if(resp.code == 0){
          this.latestMessage = resp.data.replace(/<br>/gm, " ");
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none",
            duration: 3000
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
            icon: "none",
            duration: 3000
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
            icon: "none",
            duration: 3000
          });
        }
      });
    },
    handlePersonalPage(e) {
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