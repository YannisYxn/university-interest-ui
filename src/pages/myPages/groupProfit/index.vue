<template>
  <div>
    <div style="margin-top: 15px; text-align: center">
      <i-card>
        <view slot="content">
          <i-row>
            <i-col span="11">
              <p style="font-size: 16px">22.5</p>
              <i-avatar shape="square" size="small" src="../../../static/images/lastweek.png" />
              <span style="font-size: 11px; margin-left:5px;">你的上周收益</span>
            </i-col>
            <i-col span="11" offset="1">
              <p style="font-size: 15px">9999</p>
              <i-avatar shape="square" size="small" src="../../../static/images/profit.png" />
              <span style="font-size: 11px; margin-left:5px;">此项累计收益</span>
            </i-col>
          </i-row>
        </view>
      </i-card>
    </div>

    <div style="margin-top: 10px;">
      <i-cell-group>
        <i-cell>
          <span style="font-size:11px;line-height:2;color:#8b8b8b">2020-2-10至2020-2-16</span>
          <span style="float:right;font-size:11px;line-height:2;">收益：<span style="font-size:11px;line-height:2;color:red">22.50元</span></span>
          <br />
          <span style="font-size:11px;line-height:2;">所分享及举报活跃度在校占比0.3%</span>
          <br />
          <span style="font-size:11px;line-height:2;">此周本校兑换收益30000元，所有兴趣组占比25%</span>
          <br />
          <span style="font-size:11px;line-height:2;">计算结果  30000 × 25% × 0.3% = 22.50</span>
        </i-cell>
      </i-cell-group>
    </div>

    <div style="margin-top:20px;">
      <!-- <i-load-more v-if="ticketList.length === 0" tip="当前无优惠券" :loading="false" />
      <i-load-more v-else :loading="false" /> -->
      <i-load-more :loading="false" />
    </div>

    <div style="margin-left:15px;margin-right:15px;">
      <span style="font-size:11px;line-height:2;color:#8b8b8b">提示：</span>
      <br />
      <span style="font-size:11px;line-height:2;color:#8b8b8b">收益每周一结算，通过微信支付到账。收益分配期限，自首次登陆校趣之日起三年。</span>
    </div>
  </div>
</template>

<script>
export default {

};
</script>