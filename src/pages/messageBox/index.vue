<template>
  <div style="background-color:#f3f4f5;">
    <i-notice-bar icon="systemprompt" loop>麦麦在帖子 “想找人一起跑步” 回复你 “一起跑”</i-notice-bar>
    <i-cell-group>
      <i-swipeout i-class="i-swipeout-demo-item" :operateWidth="70">
        <view slot="content">
          <i-comment-cell
            title="ZC"
            label="厦大思明"
            time="2km 2019-12-12 10:22"
            content="好久不见，我去你学校找你玩亚"
          >
            <view slot="icon">
              <i-avatar src="../../../static/images/comment-avatar.png" style="margin-right:10px;" />
            </view>
          </i-comment-cell>
        </view>
        <view slot="button" class="i-swipeout-demo-button-group">
          <view class="i-swipeout-demo-button">删除</view>
        </view>
      </i-swipeout>
      <i-swipeout i-class="i-swipeout-demo-item" :operateWidth="70">
        <view slot="content">
          <i-comment-cell
            title="ZC"
            label="厦大思明"
            time="2km 2019-12-12 10:22"
            content="好久不见，我去你学校找你玩亚"
          >
            <view slot="icon">
              <i-avatar src="../../../static/images/comment-avatar.png" style="margin-right:10px;" />
            </view>
          </i-comment-cell>
        </view>
        <view slot="button" class="i-swipeout-demo-button-group">
          <view class="i-swipeout-demo-button">删除</view>
        </view>
      </i-swipeout>
    </i-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style>
.i-swipeout-demo-item {
  border-bottom: #333 solid 1px;
}
.i-swipeout-demo-button-group {
  height: 100%;
  width: 100%;
}
.i-swipeout-demo-button {
  width: 80px;
  float: left;
  display: flex;
  height: 100%;
  justify-content: center;
  background: red;
  color: #fff;
  align-items: center;
}
</style>