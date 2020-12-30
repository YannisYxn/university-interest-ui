<template>
  <div style="min-height:100%;" id="chatPage">
    <div v-if="chatUserId == 0" style="margin: 15px;font-size: 11px;color: gray;">
      <span>消息通知，仅保留最近3天的；<br />打招呼选择，在 [我的] -> [设置] 里面；<br />收益列表，积分动态，兑换记录，分享记录，发帖被评论等，请在 [我的] 里面查看</span>
    </div>
    <div>
      <i-cell-group>
        <div v-for="(item,index) in chatMessageList" :key="item">
          <i-chat-cell
            v-if="item.fromUserId == chatUserId"
            :title="item.type == 0 || chatUserId == 0 ? item.content : ''"
            :label="item.createTime"
            style="float:left;min-width:55%;text-align:left;"
          >
            <view v-if="item.type == 1 && chatUserId !== 0" slot="img">
              <image :src="item.content" mode="widthFix" style="width:100%;" @click="handlePreview(item.content)"/>
            </view>
            <view slot="icon">
              <i-avatar :src="chatInfo.toUserPhoto" @click="handleUserInfo()"/>
            </view>
            <view slot="last">
              <div v-if="index == (chatMessageList.length-1)" style="height:110px;width:100%;">
              </div>
            </view>
          </i-chat-cell>
          <i-chat-cell
            v-else
            :title="item.type == 0 || chatUserId == 0 ? item.content : ''"
            :label="item.createTime"
            style="float:right;min-width:55%;text-align:right;"
          >
            <view v-if="item.type == 1 && chatUserId !== 0" slot="img">
              <image :src="item.content" mode="widthFix" style="width:100%;" @click="handlePreview(item.content)"/>
            </view>
            <view slot="self" style="float:right;">
              <i-avatar :src="chatInfo.fromUserPhoto" />
            </view>
            <view slot="last">
              <div v-if="index == (chatMessageList.length-1)" style="height:110px;width:100%;">
              </div>
            </view>
          </i-chat-cell>
        </div>
      </i-cell-group>
    </div>

    <div v-if="visible" style="position:fixed;bottom:0;width:100%;height:110px;background-color:white;">
      <i-row>
        <i-col span="15">
          <!-- <i-input :value="msg" @change="handleMsgChange" cursorSpacing="24" i-class="chat" placeholder="请输入消息..." :maxlength="33" chat style="background-color:#ececec;"/> -->
          <i-input
            :value="msg"
            i-class="chat"
            placeholder="请输入消息..."
            :maxlength="50"
            type="textarea"
            mode="wrapped"
            cursorSpacing="70"
            chat
            @change="handleMsgChange"
            style="background-color:#ececec;"
          />
        </i-col>
        <i-col span="8" offset="1">
          <i-button @click="sendEvent" size="small" type="primary" shape="circle">发送</i-button>
          <div style="margin-right:10px;">
            <i-row>
              <i-col span="12" style="text-align:center;">
                <i-avatar
                  size="small"
                  shape="square"
                  src="../../../static/images/photo.png"
                  @click="handleChooseImage"
                />
              </i-col>
              <i-col span="12" style="text-align:center;">
                <span style="color:#12d2c2;" @click="() => visibleCredit = true">送分</span>
              </i-col>
            </i-row>
          </div>
        </i-col>
      </i-row>
      <!-- <div>
        <i-row>
          <i-col span="12" style="text-align:center;">
            <span style="color:#12d2c2;" @click="() => visibleCredit = true">送分</span>
          </i-col>
          <i-col span="12" style="text-align:center;">
            <i-avatar
              size="small"
              shape="square"
              src="../../../static/images/photo.png"
              @click="handleChooseImage"
            />
          </i-col>
        </i-row>
      </div> -->
      <!-- <i-button type="primary" long="true" @click="() => visibleCredit = true">送分</i-button> -->
    </div>

    <!-- <i-modal
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
    </i-modal> -->
    <mp-dialog
      title="赠送积分"
      :show="visibleCredit"
      :buttons="[{text: '取消'}]"
      @buttontap="() => visibleCredit = false"
      @confirm="handleCredit()"
    >
      <i-input
        v-model="credit"
        maxlength="5"
        @change="handleCreditChange"
        credit
      />
      <br />
      <div style="text-align:center;">
        <span>点击上方，可自行填写赠送积分</span>
      </div>
    </mp-dialog>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';
import avatar from "../../../../static/images/benxiao.png";
export default {
  data() {
    return {
      userId: undefined,
      chatUserId: 0,
      chatInfo: {
        chatMessageList: []
      },
      chatMessageList: [],
      msg: "",
      roomId: undefined,
      socketOpen: false,
      socketMsgQueue: [],
      lockReconnect: false,
      limit: 0,
      avatar: avatar,
      credit: 5,
      visibleCredit: false,
      visible: false,
      unLoad: false,
      uploadFilePath: ""
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
    this.chatUserId = getQuery.getQuery().chatUserId;
    this.msg = "";
    this.visible = false;
    this.unLoad = false;
    this.chatMessageList = [];
    this.chatInfo.chatMessageList = [];
    if(this.chatUserId == 0){
      this.$wxhttp.get({
        url: "/message/getSystemMsgList?userId=" + this.userId
      }).then(resp => {
        if(resp.code == 0){
          wx.setNavigationBarTitle({
            title: "消息通知"
          });
          this.chatMessageList = resp.data.map(item => {
            return {
              ...item,
              content: item.content.replace(/<br>/gm, " "),
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm")
            }
          });
          this.chatInfo.toUserPhoto = this.avatar;
          // this.pageScrollToBottom();
          this.readNotificationMsg();
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      })
    }else{
      this.visible = true;
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
    this.unLoad = true;
    wx.closeSocket();
    this.userId = "";
    this.chatUserId = "";
    clearTimeout(this.timer);
  },
  methods: {
    getMessage() {
      this.$wxhttp.post({
        url: "/message/getChatRecord?fromUserId=" + this.userId + "&toUserId=" + this.chatUserId
      }).then(resp => {
        if(resp.code === 0){
          // 设置页面标题
          wx.setNavigationBarTitle({
            title: String(resp.data.toUserName) + " " +  String(resp.data.distance.toFixed(2)) + "km"
          });
          this.chatInfo = resp.data;
          this.chatMessageList = resp.data.chatMessageList.map(item => {
            return {
              ...item,
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm")
            }
          });
          this.pageScrollToBottom();
          this.readChatMsg();
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
        url: that.$wxhttp.wshost + "/chat/" + that.userId + "," + that.roomId,
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
        console.log("onSocket")
        this.setMessage(res.data)
        // var item = JSON.parse(res)
        // item.createTime = that.$moment(item.createTime).format("YYYY-MM-DD HH:mm:SS")
        // console.log(item)
        // that.chatInfo.chatMessageList.push(item)
        // that.pageScrollToBottom()
      })
      wx.onSocketOpen(() => {
        console.log('WebSocket连接打开')
        that.socketOpen = true;
      })
      wx.onSocketError((res) => {
        console.log('WebSocket连接打开失败')
        this.reconnect()
      })
      wx.onSocketClose((res) => {
        console.log('WebSocket 已关闭！');
        that.socketOpen = false;
        if(!this.unLoad){
          this.reconnect()
        }
      })
    },
    setMessage(res) {
      let that = this;
      var item = JSON.parse(res);
      if(item.fromUserId == this.userId){
        return
      }else{
        item.createTime = that.$moment(item.createTime).format("YYYY-MM-DD HH:mm");
        let chatMessageList = that.chatMessageList;
        chatMessageList.push(item);
        that.chatMessageList = chatMessageList;
        // this.setChatMessageList(chatMessageList);
        that.pageScrollToBottom();
      }
    },
    setChatMessageList(chatMessageList) {
      this.chatMessageList = chatMessageList;
    },
    // 滚动到页面底部
    pageScrollToBottom() {
      let that = this;
      wx.createSelectorQuery().select('#chatPage').boundingClientRect(function (rect) {
        let top = 500 * that.chatMessageList.length;
        // let top = rect.length;
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
            var item = {
              content: that.msg,
              createTime: that.$moment().locale('zh-cn').format("YYYY-MM-DD HH:mm"),
              fromUserId: that.userId,
              photo: that.chatInfo.fromUserPhoto,
              toUserId: that.chatUserId,
              type: 0
            }
            let chatMessageList = that.chatMessageList;
            chatMessageList.push(item);
            that.chatMessageList = chatMessageList;
            that.pageScrollToBottom();
            that.msg = "";
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
      var messageList = this.chatMessageList;
      if(messageList.length < 3){
        return false
      }
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
      if(this.chatUserId == 0){
        wx.showToast({
          title: "官方消息无个人主页哟",
          icon: "none"
        });
      }else{
        this.unLoad = true;
        wx.closeSocket();
        wx.navigateTo({
          url: "../../myPages/post/main?userId=" + this.chatUserId + "&selfUserId=" + this.userId
        });
      }
    },
    handleCreditChange(event) {
      this.credit = event.mp.detail.detail.value;
    },
    handleCredit() {
      // 赠送积分
      var regPos = /^\d+/;
      if(!regPos.test(this.credit)){
        wx.showToast({
          title: "请输入数字",
          icon: "none"
        });
      }else if(this.credit == '0'){
        wx.showToast({
          title: "请输入非负数",
          icon: "none"
        });
      }else{
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
            // 发送赠送积分的消息
            if (this.socketOpen) {
              wx.sendSocketMessage({
                data: JSON.stringify({ 'message': '赠出' + this.credit + '积分', 'receiveId': this.chatUserId+'', 'roomId': this.roomId,'type':'0' }),
                success(res) {
                  console.log("发送 积分 成功")
                  var item = {
                    content: '赠出' + this.credit + '积分',
                    createTime: that.$moment().locale('zh-cn').format("YYYY-MM-DD HH:mm"),
                    fromUserId: that.userId,
                    photo: that.chatInfo.fromUserPhoto,
                    toUserId: that.chatUserId,
                    type: 0
                  }
                  let chatMessageList = that.chatMessageList;
                  chatMessageList.push(item);
                  that.chatMessageList = chatMessageList;
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
    },
    readNotificationMsg() {
      // 已读消息
      this.$wxhttp.post({
        url: "/message/readMsg",
        data: {
          messageIdList: [],
          notificationIdList: this.chatMessageList.map(item => {
            return item.id
          })
        }
      })
    },
    readChatMsg() {
      // 已读消息
      this.$wxhttp.post({
        url: "/message/readMsg",
        data: {
          messageIdList: this.chatMessageList.map(item => {
            return item.id
          }),
          notificationIdList: []
        }
      })
    },
    handleChooseImage() {
      var that = this;

      if(that.judge_last_3()){
        wx.showToast({
          title: "未收到回复前最多发送3条消息",
          icon: "none"
        });
        return;
      }

      wx.chooseImage({
        count: 1, //最多上传1张照片
        sizeType: ['compressed'], //压缩图
        sourceType: ['album','camera'], //指定来源，相册和相机都可
        success(res) {
          wx.showLoading({
            title: "加载中"
          });
          //上传
          wx.uploadFile({
            url: that.$wxhttp.host + "/image/uploadMessageImg",
            filePath: res.tempFilePaths[0],
            name: "image",
            header: { "Content-Type": "multipart/form-data" },
            success(res2) {
              that.uploadFilePath = that.$wxhttp.hostForFile + String(JSON.parse(res2.data).data);
              // 发送图片
              if(that.socketOpen){
                wx.sendSocketMessage({
                  data: JSON.stringify({ 'message': that.uploadFilePath, 'receiveId': that.chatUserId+'', 'roomId': that.roomId,'type':'1' }),
                  success(res3) { 
                    console.log("发送 图片 成功");
                    var item = {
                      content: that.uploadFilePath,
                      createTime: that.$moment().locale('zh-cn').format("YYYY-MM-DD HH:mm"),
                      fromUserId: that.userId,
                      photo: that.chatInfo.fromUserPhoto,
                      toUserId: that.chatUserId,
                      type: 1
                    }
                    let chatMessageList = that.chatMessageList;
                    chatMessageList.push(item);
                    that.chatMessageList = chatMessageList;
                    that.pageScrollToBottom();
                  }
                });
              }else{
                wx.showToast({
                  title: "链接异常,请重试",
                  icon: "none"
                });
              }
            }
          });
        }
      });
    },
    handlePreview(url) {
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
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
