<template>
  <div>
    <div style="margin-top:10px;">
      <i-tabs :current="current" color="#14d0b6" @change="handleTabChange">
        <i-tab key="post" title="兑换券列表"></i-tab>
        <i-tab key="member" title="兴趣组列表"></i-tab>
      </i-tabs>
    </div>

    <div style="margin-top:5px;" v-if="current === 'ticket'">
      <div v-for="ticket in ticketList" :key="ticket.id" style="margin-top:20px;width:100%;text-align:center;">
        <exchange-card group>
          <view slot="content">
            <i-row>
              <i-col span="15">
                <p style="font-size:20px;line-height:30px;color:white;">{{ ticket.money }}元</p>
                <p style="font-size:15px;line-height:25px;color:white;">{{ ticket.sellerName }}</p>
                <p style="font-size:10px;line-height:20px;color:white;">{{ ticket.description }}</p>
              </i-col>
              <i-col span="9">
                <p style="font-size:15px;line-height15px;color:white;">{{ ticket.needCreditNum }}积分</p>
                <i-button type="exchange" shape="circle" disabled>立即兑换</i-button>
                <p style="font-size:10px;line-height:15px;color:white;">总共：{{ ticket.totalNum }}张</p>
                <p style="font-size:10px;line-height:15px;color:white;">剩余：{{ ticket.remainingNum }}张</p>
              </i-col>
            </i-row>
          </view>
        </exchange-card>
      </div>

      <div style="margin-top:25px;">
        <i-load-more v-if="ticketList.length === 0" tip="当前学校无优惠券" :loading="false" />
        <i-load-more v-else :loading="false" />
      </div>
    </div>

    <div style="margin-top:5px;" v-if="current === 'interestGroup'">
      <i-cell-group>
        <i-cell
          v-for="group in groupList"
          v-show="group.status === 0 || (group.userId === userId && [-1,3].includes(group.status))"
          :key="group.id"
          :title="group.name"
          @click="handleInterestGroup(group.id)"
        >
          <view slot="icon">
            <i-avatar :src="group.logo"></i-avatar>
          </view>
          <view slot="badge">
            <!-- <i-badge :count="group.postCount" overflow-count="100" style="margin-right:10px;" /> -->
            <i-icon size="25" type="barrage_fill" color="#67ddd3"/>
            <span style="color:#67ddd3;">{{ group.postCount }}</span>
          </view>
          <!-- <view slot="footer">
            <i-icon
              v-if="group.userId == userId"
              type="setup_fill"
              size="25"
              color="#67ddd3"
              @click="handleManageInterestGroup(group.id)"
            />
          </view> -->
        </i-cell>
      </i-cell-group>

      <div style="margin-top:25px;">
        <i-load-more v-if="groupList.length === 0" tip="该学校当前无兴趣组" :loading="false" />
        <i-load-more v-else :loading="false" />
      </div>
    </div>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
      current: "ticket",
      universityId: undefined,
      universityName: "",
      ticketList: [],
      groupList: []
    }
  },
  onShow() {
    this.universityId = getQuery.getQuery().universityId;
    this.universityName = getQuery.getQuery().universityName;
    wx.setNavigationBarTitle({
      title: getQuery.getQuery().universityName + "兑换券与兴趣组详情"
    });
    this.current = "ticket";
    this.listTicket();
    this.listInterestGroup();
  },
  methods: {
    listTicket() {
      this.$wxhttp.get({
        url: "/ticket/listTicketByUniversityId?universityId=" + this.universityId
      }).then(resp => {
        if(resp.code == 0){
          this.ticketList = resp.data.map(item => {
            return {
              ...item,
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD")
            }
          });
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none",
            duration: 3000
          });
        }
      });
    },
    listInterestGroup() {
      this.$wxhttp.get({
        url: "/group/listUniversityGroup?universityId=" + this.universityId
      }).then(resp => {
        if(resp.code == 0){
          this.groupList = resp.data;
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none",
            duration: 3000
          });
        }
      });
    },
    handleTabChange(detail) {
      this.current = detail.target.key;
    },
  }
}
</script>