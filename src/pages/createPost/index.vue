<template>
  <div>
    <div style="margin-top:10px;display:block;">
      <i-panel>
        <i-input asking type="textarea" placeholder="请输入你想说的..." />
        <div style="border: 1px #b6b6b6 solid;border-radius: 5px;text-align:center;margin:10px;">
          <i-icon color="#b6b6b6" size="25" type="add" />
        </div>
      </i-panel>
    </div>
    <div style="margin:20px;">
      <p class="font" style="font-size:15px;line-height:2;color:#a3a4a4">提示：</p>
      <p class="font" style="font-size:11px;line-height:2;color:#a3a4a4">
        1. 想要删除自己的发帖，请在【我的】里面【我的发帖】点击【+】号中的删除
      </p>
      <p class="font" style="font-size:11px;line-height:2;color:#a3a4a4">
        2. 请注意自己的发帖言行，多次被举报帖子内容不适，将被封号
      </p>
    </div>
    <div style="position:fixed;bottom:0;width:100%;">
      <i-button style="margin:10px;width:100%" shape="circle" type="primary">发布</i-button>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>

</style>