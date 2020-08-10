<template>
  <div>
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-avatar size="avatar" src="../../../static/images/avatar.png" />
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">高小白</p>
            <p style="font-size:12px;color:white;line-height:25px;">
              厦大思明
              <i-tag style="color:#07a68e;">升学</i-tag>
            </p>
            <span style="font-size:11px;color:white;">2020-02-26(加入)</span>
            <i-tag class="i-tags" type="border" color="green">校内登录2次</i-tag>
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">ID:345637</p>
            <p style="font-size:12px;color:white;line-height:25px;">积分:3000</p>
            <i-icon type="brush" size="15" color="white" @click="handleModify" />
            <br />
            <i-tag class="i-tags" type="border" color="red">校外登录6次</i-tag>
          </i-col>
        </i-row>
      </div>
      <div style="margin:10px;">
        <p style="font-size:12px;color:white;">介绍：俺是一个老实人，看名字就指导，你们可别欺负我。</p>
      </div>
      <div style="margin-top:5px;text-align:center;">
        <i-card>
          <view slot="content">
            <i-row>
              <i-col span="7">
                <p style="font-size:16px;">9999</p>
                <i-avatar
                  size="mini"
                  src="../../../static/images/interest.png"
                />
                <span style="font-size:9px;">上周兴趣组收益</span>
              </i-col>
              <i-col span="7" offset="1">
                <p style="font-size:16px;">9999</p>
                <i-avatar
                  size="mini"
                  src="../../../static/images/post.png"
                />
                <span style="font-size:9px;">上周发帖收益</span>
              </i-col>
              <i-col span="7" offset="1">
                <p style="font-size:16px;">9999</p>
                <i-avatar
                  size="mini"
                  src="../../../static/images/shareRecord.png"
                />
                <span style="font-size:9px;">上周分享收益</span>
              </i-col>
            </i-row>
          </view>
        </i-card>
      </div>
    </div>

    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell title="积分动态" is-link url="../integralRecord/main">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/score.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="兑换记录" is-link url="../exchangeRecord/main">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/exchange.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="我的发帖" is-link url="../post/main">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/post.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="分享记录" is-link url="../shareRecord/main">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/shareRecord.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="分享链接" is-link>
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/shareLink.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="诉求" is-link url="../asking/main">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/asking.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="校趣规则" is-link url="../rule/main">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/rule.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
      </i-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    handleModify() {
      wx.navigateTo({
        url: "../modify/main"
      });
    }
  }
}
</script>

<style>
.head {
  align-items: center;
  padding: 5px;
  background-image: linear-gradient(to bottom, #14d0b6, #0ed4d6);
  text-align: center;
  vertical-align: middle;
}
</style>