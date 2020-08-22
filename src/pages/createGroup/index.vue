<template>
  <div>
    <div style="margin:5px;">
      <i-panel>
        <i-input title="兴趣组名称" right mode="wrapped" placeholder="请在这里输入,本校内名称唯一" />
        <i-input title="兴趣组介绍" right type="textarea" mode="wrapped" placeholder="限25个字" maxlength="25"/>
      </i-panel>
    </div>
    <div style="margin:20px;">
      <p class="font" style="font-size:15px;">提示：</p>
      <p class="font" style="font-size:11px;">1.每个人可以创建2个兴趣组，请管理维护浩自己创建的兴趣组，
        如果兴趣组内容被多人举报内容不适，此兴趣组将被取缔。兴趣组收益根据活跃度，分享软广告带来的收益，
        收益每周一通过微信发放。具体收益明细，请查看【我的】里的【兴趣组收益】。</p>
      <p class="font" style="font-size:11px;">2.管理兴趣组，左滑自创兴趣组里面的帖子，右侧有【删帖】【删+拉黑发帖人】2个按钮，
        右上角【加号+】，有解散此组按钮。</p>
      <p class="font" style="font-size:11px;">3.请勿发政治宗教人肉及商品买卖等不适宜话题，被举报，封号处理</p>
    </div>
    <div style="margin:20px;">
      <i-button type="primary">创建此组</i-button>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
.font{
  line-height: 20px;
  color: #b7b7b7;
}
</style>
