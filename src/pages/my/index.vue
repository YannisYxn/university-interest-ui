<template>
  <div>
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-avatar size="large">头</i-avatar>
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">高小白</p>
            <p style="font-size:12px;color:white;line-height:25px;">厦大思明
              <i-tag style="color:black;">升学</i-tag>
            </p>
            <span style="font-size:11px;color:white;">2020-02-26(加入)</span>
            <i-tag class="i-tags" type="border" color="green">校内登录2次</i-tag>
            <i-tag class="i-tags" type="border" color="red">校外登录6次</i-tag>
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">ID:345637</p>
            <p style="font-size:12px;color:white;line-height:25px;">积分:3000</p>
            <i-icon type="brush" size="25" color="white" />
          </i-col>
        </i-row>
      </div>
      <div style="margin:10px;">
        <p style="font-size:12px;color:white;">介绍：俺是一个老实人，看名字就指导，你们可别欺负我。</p>
      </div>
      <div style="margin:5px;text-align:center;">
        <i-row>
          <i-col span="8">
            <i-card>
              <view slot="content">
                <p style="font-size:25px;">9999</p>
                <i-icon type="emoji" size="20" />
                上周兴趣组收益
              </view>
            </i-card>
          </i-col>
          <i-col span="8">
            <i-card>
              <view slot="content">
                <p style="font-size:25px;">9999</p>
                <i-icon type="emoji" size="20" />
                上周发帖收益
              </view>
            </i-card>
          </i-col>
          <i-col span="8">
            <i-card>
              <view slot="content">
                <p style="font-size:25px;">9999</p>
                <i-icon type="emoji" size="20" />
                上周分享收益
              </view>
            </i-card>
          </i-col>
        </i-row>
      </div>
    </div>

    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell title="积分动态" is-link>
        </i-cell>
        <i-cell title="兑换记录" is-link url="../exchangeRecord/main">
        </i-cell>
        <i-cell title="我的发帖" is-link>
        </i-cell>
        <i-cell title="分享记录" is-link>
        </i-cell>
        <i-cell title="分享链接" is-link>
        </i-cell>
        <i-cell title="诉求" is-link>
        </i-cell>
        <i-cell title="校趣规则" is-link>
        </i-cell>
      </i-cell-group>
    </div>
  </div>
</template>

<style>
.head {
  align-items: center;
  padding: 5px;
  background-image: linear-gradient(to bottom,#14d0b6,#0ed4d6);
  text-align: center;
  vertical-align: middle;
}
</style>