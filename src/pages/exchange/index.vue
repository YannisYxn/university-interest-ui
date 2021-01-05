<template>
  <div>
    <div v-for="ticket in ticketList" :key="ticket.id" style="margin-top:20px;width:100%;">
      <exchange-card v-if="ticket.type == 1" :background="normalExchange">
        <view slot="content">
          <i-row>
            <i-col span="15">
              <div style="border-right: solid white 1px;padding:6px;">
                <p style="font-size:25px;line-height:30px;color:white;font-weight:bold;">{{ ticket.money }}元</p>
                <p style="font-size:20px;line-height:25px;color:white;">{{ ticket.sellerName }}</p>
                <p style="font-size:10px;line-height:20px;color:white;">{{ ticket.description }}</p>
                <p style="font-size:10px;line-height:15px;color:white;">使用有效日期：兑换时间{{ ticket.deadline }}前</p>
              </div>
            </i-col>
            <i-col span="9">
              <div style="text-align:center;">
                <p style="font-size:18px;line-height15px;color:white;margin:10px;font-weight:bold;">{{ ticket.needCreditNum }}积分</p>
                <!-- <i-button type="exchange" shape="circle" @click="handleExchange(ticket.id)">立即兑换</i-button> -->
                <!-- <p style="font-size:10px;line-height:15px;color:white;">总共：{{ ticket.totalNum }}张</p> -->
                <img style="width:70px;height:30px;margin:5px" src="../../../static/images/normal_exchange_button.png" alt="" @click="handleExchange(ticket.id)"/>
                <p style="font-size:10px;line-height:15px;color:white;">剩余：{{ ticket.remainingNum }}张</p>
              </div>
            </i-col>
          </i-row>
        </view>
      </exchange-card>
      <exchange-card v-else group :background="groupExchange">
        <view slot="content">
          <i-row>
            <i-col span="15">
              <div style="border-right: solid white 1px;padding:6px;">
                <p style="font-size:25px;line-height:30px;color:white;font-weight:bold;">{{ ticket.money }}元</p>
                <p style="font-size:20px;line-height:25px;color:white;">{{ ticket.sellerName }}</p>
                <p style="font-size:10px;line-height:20px;color:white;" v-html="ticket.description">{{  }}</p>
              </div>
            </i-col>
            <i-col span="9">
              <div style="text-align:center">
                <p style="font-size:18px;line-height15px;color:white;margin:10px;font-weight:bold;">{{ ticket.needCreditNum }}积分</p>
                <!-- <i-button type="exchange" shape="circle" @click="handleExchange(ticket.id)">立即兑换</i-button> -->
                <!-- <p style="font-size:10px;line-height:15px;color:white;">总共：{{ ticket.totalNum }}张</p> -->
                <img style="width:70px;height:30px;margin:5px" src="../../../static/images/group_exchange_button.png" alt="" @click="handleExchange(ticket.id)"/>
                <p style="font-size:10px;line-height:15px;color:white;">剩余：{{ ticket.remainingNum }}张</p>
              </div>
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
      <span>是否确认兑换?兑换后</span>
      <br />
      <div style="text-align:center;">
        <span>请在兑换记录里面查看兑换码</span>
      </div>
    </mp-dialog>
  </div>
</template>

<script>
import normalExchange from "../../../static/images/normal_exchange.png";
import groupExchange from "../../../static/images/group_exchange.png";

export default {
  data() {
    return {
      userId: undefined,
      ticketList: [],
      visible: false,
      ticketId: undefined,
      normalExchange: normalExchange,
      groupExchange: groupExchange
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