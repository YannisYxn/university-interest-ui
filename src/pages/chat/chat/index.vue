<template>
  <div style="min-height:100%;" id="chatPage">
    <div>
      <i-cell-group>
        <div v-for="(item,index) in chatInfo.chatMessageList" :key="item">
          <i-chat-cell
            v-if="item.fromUserId == chatUserId"
            :title="item.content"
            :label="item.createTime"
            style="float:left;min-width:55%;text-align:left;"
          >
            <view slot="icon">
              <i-avatar :src="chatInfo.toUserPhoto" @click="handleUserInfo()"/>
            </view>
            <view slot="last">
              <div v-if="index == (chatInfo.chatMessageList.length-1)" style="height:60px;width:100%;">
              </div>
            </view>
          </i-chat-cell>
          <i-chat-cell
            v-else
            :title="item.content"
            :label="item.createTime"
            style="float:right;min-width:55%;text-align:right;"
          >
            <view slot="self" style="float:right;">
              <i-avatar :src="chatInfo.fromUserPhoto" />
            </view>
            <view slot="last">
              <div v-if="index == (chatInfo.chatMessageList.length-1)" style="height:100px;width:100%;">
              </div>
            </view>
          </i-chat-cell>
        </div>
      </i-cell-group>
    </div>

    <div style="position:fixed;bottom:0;width:100%;height:100px;">
      <i-row>
        <i-col span="18">
          <i-input :value="msg" @change="handleMsgChange" i-class="chat" placeholder="请输入消息..." :maxlength="33" chat />
        </i-col>
        <i-col span="6">
          <i-button @click="sendEvent" size="small" type="primary" shape="circle">发送</i-button>
        </i-col>
      </i-row>
      <i-button type="primary" long="true" @click="() => visibleCredit = true">送分</i-button>
    </div>

    <i-modal
      title="赠送积分"
      :visible="visibleCredit"
      @ok="handleCredit()"
      @cancel="() => visibleCredit = false"
    >
      <i-input-number
        v-model="credit"
        :min="0"
        :max="100"
        @change="handleCreditChange"
      />
    </i-modal>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';
import avatar from "../../../../static/images/avatar.png";
export default {
  data() {
    return {
      userId: undefined,
      chatUserId: undefined,
      chatInfo: {
        chatMessageList: []
      },
      msg: "",
      roomId: undefined,
      socketOpen: false,
      socketMsgQueue: [],
      lockReconnect: false,
      limit: 0,
      avatar: avatar,
      credit: 5,
      visibleCredit: false
    }
  },
  onShow() {
    this.userId = getQuery.getQuery().userId;
    this.chatUserId = getQuery.getQuery().chatUserId;
    if(this.chatUserId == 0){
      this.$wxhttp.get({
        url: "/message/getSystemMsgList?userId=" + this.userId
      }).then(resp => {
        if(resp.code == 0){
          wx.setNavigationBarTitle({
            title: "官方通知"
          });
          this.chatInfo.chatMessageList = resp.data.map(item => {
            return {
              ...item,
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm:SS")
            }
          });
          this.chatInfo.toUserPhoto = this.avatar;
          this.pageScrollToBottom();
        }
      })
    }else{
      if(this.userId < this.chatUserId){
        this.roomId = this.userId + "-" + this.chatUserId;
      }else{
        this.roomId = this.chatUserId + "-" + this.userId;
      }
      this.linkSocket();
      this.getMessage();
    }
  },
  onUnload: function() {
    wx.closeSocket();
  },
  methods: {
    getMessage() {
      this.$wxhttp.post({
        url: "/message/getChatRecord?fromUserId=" + this.userId + "&toUserId=" + this.chatUserId
      }).then(resp => {
        if(resp.code === 0){
          // 设置页面标题
          wx.setNavigationBarTitle({
            title: String(resp.data.toUserName) + " " +  String(resp.data.distance > 0 ? resp.data.distance : 0) + "km"
          });
          this.chatInfo = resp.data;
          this.chatInfo.chatMessageList = resp.data.chatMessageList.map(item => {
            return {
              ...item,
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm:SS")
            }
          });
          this.pageScrollToBottom();
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      })
    },
    handleMsgChange(event) {
      this.msg = event.mp.detail.detail.value;
    },
    linkSocket() {
      let that = this;
      wx.connectSocket({
        url: that.$wxhttp.wshost + "/chat/" + that.userId + "," + that.chatUserId,
        success() {
          that.socketOpen = true;
          that.initEventHandle();
        }
      })
    },
    initEventHandle() {
      let that = this
      wx.onSocketMessage((res) => {
        // 数据处理
        that.setMessage(res.data)
      })
      wx.onSocketOpen(() => {
        console.log('WebSocket连接打开')
      })
      wx.onSocketError((res) => {
        console.log('WebSocket连接打开失败')
        this.reconnect()
      })
      wx.onSocketClose((res) => {
        console.log('WebSocket 已关闭！');
        that.socketOpen = false;
        this.reconnect()
      })
    },
    setMessage(res) {
      this.chatInfo.chatMessageList.push(JSON.parse(res));
      this.pageScrollToBottom();
    },
    // 滚动到页面底部
    pageScrollToBottom() {
      let that = this;
      wx.createSelectorQuery().select('#chatPage').boundingClientRect(function (rect) {
        let top = 68 * that.chatInfo.chatMessageList.length;
        wx.pageScrollTo({
          scrollTop: top,
          duration: 0
        })
      }).exec()
    },
    // 断线重连
    reconnect() {
      if (this.lockReconnect) return;
      this.lockReconnect = true;
      clearTimeout(this.timer)
      if (this.limit < 12) {
        this.timer = setTimeout(() => {
          this.linkSocket();
          this.lockReconnect = false;
        }, 5000);
        this.limit = this.limit + 1;
      }
    },
    // 发送
    sendEvent() {
      let that = this;
      let msg = that.msg;
      if (msg == "") {
        wx.showToast({
          title: '信息不能为空',
          icon: 'none',
          mask: true,
        });
        return;
      }else if(that.judge_last_3()){
        wx.showToast({
          title: "未收到回复前最多发送3条消息",
          icon: "none"
        });
        return;
      }

      if (this.socketOpen) {
        wx.sendSocketMessage({
          data: JSON.stringify({ 'message': msg, 'receiveId': this.chatUserId+'', 'roomId': this.roomId,'type':'0' }),
          success(res) {
            console.log("发送 " + msg + " 成功")
            that.$root.$mp.page.setData({
              "$root[0].msg": ""
            });
            that.msg = "";
            that.chatInfo.chatMessageList.push({
              content: msg,
              createTime: that.$moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:SS"),
              fromUserId: that.userId,
              id: null,
              toUserId: that.chatUserId,
              type: 1
            });
            that.pageScrollToBottom();
          }
        });
      } else {
        wx.showToast({
          title: '链接已断,重新链接',
          icon: 'none',
          mask: true,
        });
      }
    },
    judge_last_3(){
      //判断最后三条是否为自己所发
      var messageList = this.chatInfo.chatMessageList;
      if(messageList[messageList.length-1].fromUserId == this.userId && 
      messageList[messageList.length-2].fromUserId == this.userId &&
      messageList[messageList.length-3].fromUserId == this.userId){
        return true
      }else{
        return false
      }
    },
    handleUserInfo() {
      // 跳转个人主页
      wx.closeSocket();
      wx.navigateTo({
        url: "../../myPages/post/main?userId=" + this.chatUserId + "&selfUserId=" + this.userId
      });
    },
    handleCreditChange(event) {
      this.credit = event.target.value;
    },
    handleCredit() {
      // 赠送积分
      console.log("test")
      this.$wxhttp.post({
        url: "/credit/giveCredit",
        data: {
          credit: this.credit,
          fromUserId: this.userId,
          toUserId: this.chatUserId
        }
      }).then(resp => {
        if(resp.code == 0){
          this.visibleCredit = false;
          wx.showToast({
            title: "赠送成功"
          });
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    }
  }
}
</script>

<style>
.chat {
  background-color: #fff;
  border-radius: 20px;
  margin: 10px;
  width: 84%;
}
page {
  background-color: #f3f4f5;
}
</style>
