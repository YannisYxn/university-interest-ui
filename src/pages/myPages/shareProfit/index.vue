<template>
  <div>
    <div style="margin-top: 15px; text-align: center">
      <i-card title="收益明细">
        <view slot="content">
          <i-row>
            <i-col span="11">
              <p style="font-size: 16px">{{ lastWeekMoney }}</p>
              <i-avatar
                shape="square"
                size="small"
                src="../../../static/images/lastweek.png"
              />
              <span style="font-size: 12px; margin-left: 5px"
                >你的上周收益</span
              >
            </i-col>
            <i-col span="11" offset="1">
              <p style="font-size: 15px">{{ totalMoney }}</p>
              <i-avatar
                shape="square"
                size="small"
                src="../../../static/images/profit.png"
              />
              <span style="font-size: 12px; margin-left: 5px"
                >此项累计收益</span
              >
            </i-col>
          </i-row>
        </view>
      </i-card>
    </div>

    <div style="margin-top: 10px">
      <i-cell-group>
        <i-cell v-for="item in everyWeekMoneyVOList" :key="item">
          <span style="font-size: 11px; line-height: 2; color: #8b8b8b"
            >{{ item.weekRange }}</span
          >
          <span style="float: right; font-size: 11px; line-height: 2"
            >收益：<span style="font-size: 11px; line-height: 2; color: red"
              >{{ item.weekMoney }}元</span
            ></span
          >
          <br />
          <span style="font-size: 11px; line-height: 2"
            >{{ item.weekMoneyDesc }}</span
          >
          <br />
        </i-cell>
      </i-cell-group>
    </div>

    <div style="margin-top: 20px">
      <i-load-more v-if="everyWeekMoneyVOList.length === 0" tip="当前此项无收益" :loading="false" />
      <i-load-more v-else :loading="false" />
    </div>

    <div style="margin-left: 15px; margin-right: 15px">
      <span style="font-size: 11px; line-height: 2; color: #8b8b8b"
        >提示：</span
      >
      <br />
      <span style="font-size: 11px; line-height: 2; color: #8b8b8b"
        >收益每周一结算，通过微信支付到账。收益分配期限，自首次登陆校趣之日起三年。</span
      >
    </div>
  </div>
</template>

<script>
import getQuery from "../../../utils/getPage";

export default {
  data() {
    return {
      userId: undefined,
      everyWeekMoneyVOList: [],
      lastWeekMoney: 0.00,
      totalMoney: 0.00
    }
  },
  onShow() {
    this.userId = getQuery.getQuery().userId;
    this.$wxhttp.get({
      url: "/money/getShareMoneyDetail?userId=" + this.userId
    }).then(resp => {
      if(resp.code == 0){
        this.everyWeekMoneyVOList = resp.data.everyWeekMoneyVOList;
        this.lastWeekMoney = resp.data.lastWeekMoney;
        this.totalMoney = resp.data.totalMoney;
      }else{
        wx.showToast({
          title: resp.msg,
          icon: "none"
        });
      }
    })
  }
};
</script>