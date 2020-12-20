<template>
  <div>
    <div v-for="ticket in ticketList" :key="ticket.id" style="margin-top:20px;width:100%;text-align:center;">
      <exchange-card v-if="ticket.type == 1">
        <view slot="content">
          <i-row>
            <i-col span="15">
              <p style="font-size:20px;line-height:30px;color:white;">{{ ticket.money }}元</p>
              <p style="font-size:15px;line-height:25px;color:white;">{{ ticket.sellerName }}</p>
              <p style="font-size:10px;line-height:20px;color:white;">{{ ticket.description }}</p>
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
      <exchange-card v-else group>
        <view slot="content">
          <i-row>
            <i-col span="15">
              <p style="font-size:20px;line-height:30px;color:white;">{{ ticket.money }}元</p>
              <p style="font-size:15px;line-height:25px;color:white;">{{ ticket.sellerName }}</p>
              <p style="font-size:10px;line-height:20px;color:white;">{{ ticket.description }}</p>
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
    this.userId = this.globalData.userId;
    if(this.globalData.userType == 3){
      //商家
      wx.showToast({
        title: "商家无法进行其他操作",
        icon: "none"
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
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: "../index/main"
            });
          },1500);
        }
      });
    }else if(this.globalData.status == -3) {
      // 注销
      wx.showToast({
        title: "账号已注销",
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
      this.getTicketList();
      this.updateBadge();
    }
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
    getTicketList() {
      wx.showLoading({
        title: "加载中"
      });
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
      if(this.globalData.isPerfectInfo == 0){
        wx.showToast({
          title: "请先在[我的]页面完善头像昵称",
          icon: "none"
        });
      }else{
        this.ticketId = ticketId;
        this.visible = true;
      }
    },
    doExchange() {
      this.visible = false;
      //兑换
      this.$wxhttp.post({
        url: "/ticket/exchange?userId=" + this.userId + "&ticketId=" + this.ticketId
      }).then(resp => {
        if(resp.code === 0){
          wx.showToast({
            title: "兑换成功",
            success: () => {
              setTimeout(() => {
                this.getTicketList();
              },1000);
            }
          });
          //更新兑换券列表
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none",
            success: () => {
              setTimeout(() => {
                this.getTicketList();
              },1000);
            }
          });
        }
      });
    }
  }
}
</script>