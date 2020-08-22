<template>
  <div style="background-color:#f3f4f5;height:1000px;">
    <i-cell-group>
      <i-chat-cell title="近来可好，有时间聚聚？" label="2019-12-12 10:22" style="float:left;min-width:55%;text-align:left;">
        <view slot="icon">
          <i-avatar src="../../../static/images/comment-avatar.png" />
        </view>
      </i-chat-cell>
      <i-chat-cell title="好呀明天有空" label="2019-12-12 10:22" style="float:right;min-width:55%;text-align:right;">
        <view slot="self" style="float:right;">
          <i-avatar src="../../../static/images/comment-avatar.png" />
        </view>
      </i-chat-cell>
      <i-chat-cell title="明天趣找你" label="2019-12-12 10:22" style="float:right;min-width:55%;text-align:right;">
        <view slot="self" style="float:right;">
          <i-avatar src="../../../static/images/comment-avatar.png" />
        </view>
      </i-chat-cell>
      <i-chat-cell title="可以吗？" label="2019-12-12 10:22" style="float:right;min-width:55%;text-align:right;">
        <view slot="self" style="float:right;">
          <i-avatar src="../../../static/images/comment-avatar.png" />
        </view>
      </i-chat-cell>
    </i-cell-group>

    <div style="position:fixed;bottom:0;width:100%">
      <i-row>
        <i-col span="18">
          <i-input i-class="chat" placeholder="请输入消息..." :maxlength="33" chat/>
        </i-col>
        <i-col span="6">
          <i-button size="small" type="primary" shape="circle">发送</i-button>
        </i-col>
      </i-row>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
.chat {
  background-color: #fff;
  border-radius: 20px;
  margin: 10px;
  width: 84%;
}
</style>