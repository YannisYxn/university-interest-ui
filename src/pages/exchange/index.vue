<template>
  <div>
    <div v-for="ticket in ticketList" :key="ticket.id" style="margin-top:20px;width:100%;text-align:center;">
      <exchange-card>
        <view slot="content">
          <i-row>
            <i-col span="15">
              <p style="font-size:20px;line-height:30px;color:white;">{{ ticket.money }}元</p>
              <p style="font-size:15px;line-height:25px;color:white;">{{ ticket.sellerName }}</p>
              <p style="font-size:10px;line-height:20px;color:white;">买单时，输入兑换码直减{{ ticket.money }}元</p>
              <p style="font-size:10px;line-height:15px;color:white;">有效日期：{{ ticket.deadline }}前</p>
            </i-col>
            <i-col span="9">
              <p style="font-size:15px;line-height15px;color:white;">{{ ticket.needCreditNum }}积分</p>
              <i-button type="exchange" shape="circle" @click="handleExchange(ticket.id)">立即兑换</i-button>
              <p style="font-size:10px;line-height:15px;color:white;">总共：{{ ticket.totalNum }}张</p>
              <p style="font-size:10px;line-height:15px;color:white;">剩余：{{ ticket.remainingNum }}张</p>
            </i-col>
          </i-row>
        </view>
      </exchange-card>
    </div>

    <div style="margin-top:25px;">
      <i-load-more v-if="ticketList.length === 0" tip="当前无优惠券" :loading="false" />
      <i-load-more v-else :loading="false" />
    </div>

    <mp-dialog
      title="确认"
      :show="visible"
      :buttons="[{text: '取消'}]"
      @buttontap="() => visible = false"
      @confirm="doExchange"
    >
      <span>是否确认兑换?</span>
    </mp-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: undefined,
      ticketList: [],
      visible: false,
      ticketId: undefined
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
                wx.switchTab("../index/main");
              }else{
                //不是首次登录，获取兑换券列表
                that.getTicketList();
                that.updateBadge();
              }
            }else{
              wx.showToast({
                title: resp.msg,
                icon: 'none'
              })
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
    getTicketList() {
      this.$wxhttp.get({
        url: "/ticket?userId=" + this.userId
      }).then(resp => {
        if(resp.code === 0){
          this.ticketList = resp.data.map(item => {
            return {
              ...item,
              deadline: this.$moment(item.deadline).format("YYYY-MM-DD")
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
    handleExchange(ticketId) {
      this.ticketId = ticketId;
      this.visible = true;
    },
    doExchange() {
      this.visible = false;
      //兑换
      this.$wxhttp.post({
        url: "/ticket/exchange?userId=" + this.userId + "&ticketId=" + this.ticketId
      }).then(resp => {
        if(resp.code === 0){
          wx.showToast({
            title: "兑换成功"
          });
          //更新兑换券列表
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
        // 无论兑换成功与否，更新兑换券列表
        this.getTicketList();
      });
    }
  }
}
</script>