<template>
  <div style="background-color:#f3f4f5;">
    <i-notice-bar icon="systemprompt" loop>麦麦在帖子 “想找人一起跑步” 回复你 “一起跑”</i-notice-bar>
    <i-cell-group>
      <i-comment-cell
        v-for="item in messageList"
        :key="item"
        :title="item.userName"
        :label="item.userUniversityCampus"
        :time="(item.distance < 0 ? 0 : item.distance) + 'km ' + item.createTime"
        :content="item.content"
        @click="handleChat(item.userId)"
      >
        <view slot="icon">
          <i-avatar :src="item.userPhoto" style="margin-right:10px;" />
        </view>
      </i-comment-cell>
    </i-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: undefined,
      messageList: []
    };
  },
  onShow() {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          that.$wxhttp.post({
            url: "/user/login?code=" + res.code,
          }).then(resp => {
            if(resp.code === 0){
              that.userId = resp.data.id;
              that.getMessageList();
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
  methods: {
    getMessageList(){
      this.$wxhttp.get({
        url: "/message/getYouXinList?userId=" + this.userId 
      }).then(resp => {
        if(resp.code === 0){
          this.messageList = resp.data.latestChatRecord.map(item => {
            return {
              ...item,
              createTime: this.$moment(item.createTime).format("YYYY-MM-DD HH:mm:SS")
            }
          });
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
        url: "../chat/main?chatUserId=" + chatUserId + "&userId=" + this.userId
      });
    }
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