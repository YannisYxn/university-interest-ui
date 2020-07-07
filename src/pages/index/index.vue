<template>
  <div>
    <div class="head">
      <i-input placeholder="请在这里搜索" mode="wrapped" />
      <i-icon type="mobilephone" size="30" color="#ffffff"/>
      <i-icon type="mine" size="30" color="#ffffff"/>
      <i-icon type="coupons" size="30" color="#ffffff"/>
    </div>
    <div style="margin-top:10px;margin-left:10px;display:flex;align-items:center;">
      <i-card title="本校兴趣组" thumb="../../../static/images/benxiao.png" >
        <view slot="footer">距离近 都是同校</view>
      </i-card>
      <i-card @click="handleToCityUniversity" title="同城高校兴趣组" thumb="../../../static/images/tongcheng.png">
        <view slot="footer">更多兴趣小组 都在这里</view>
      </i-card>
      <i-card @click="handleCreateGroup" title="创建">
        <view slot="footer">
          <i-icon type="add" size="25" color="#67ddd3"/>
        </view>
      </i-card>
    </div>
    <div class="label">
      <span style="margin:5px;color:#ffffff">我创建及加入的兴趣组</span>
    </div>
    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell title="篮球狂人" is-link>
          <view slot="icon">
            <i-avatar size="small">篮</i-avatar>
          </view>
          <view slot="badge">
            <i-badge count="3" />
          </view>
        </i-cell>
        <i-cell title="我们爱说唱" is-link>
          <view slot="icon">
            <i-avatar size="small">唱</i-avatar>
          </view>
          <view slot="badge">
            <i-badge count="53" />
          </view>
        </i-cell>
        <i-cell title="英语口语下线talk" is-link>
          <view slot="icon">
            <i-avatar size="small">英</i-avatar>
          </view>
          <view slot="badge">
            <i-badge count="103" overflow-count="100" />
          </view>
        </i-cell>
      </i-cell-group>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
    }
  },

  components: {
    card
  },

  methods: {
    handleToCityUniversity() {
      wx.navigateTo({
        url: "../cityUniversityList/main"
      });
    },
    handleCreateGroup() {
      wx.navigateTo({
        url: "../createGroup/main"
      });
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style>
.head {
  display: flex;
  align-items: center;
  padding: 5px;
  background-image: linear-gradient(to bottom,#14d0b6,#0ed4d6);
}
.label {
  margin-top: 10px;
  background-image: linear-gradient(to right,#14d0b6,#0ed4d6);
  height: 35px;
  display: flex;
  align-items: center;
  width: 60%;
  border-bottom-right-radius: 50px;
  border-top-right-radius: 50px;
}

.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
.all{
  width:7.5rem;
  height:1rem;
  background-color:blue;
}
.all:after{
  display:block;
  content:'';
  clear:both;
}
.left{
  float:left;
  width:3rem;
  height:1rem;
  background-color:red;
}

.right{
  float:left;
  width:4.5rem;
  height:1rem;
  background-color:green;
}
</style>
