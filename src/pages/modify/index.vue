<template>
  <div>
    <div style="margin:5px;">
      <i-panel>
        <div style="display:flex;margin:5px;margin-left:150px;">
          <i-avatar size="large" shape="square">头</i-avatar>
        </div>
        <i-input title="昵称" right mode="wrapped" placeholder="高小白" />
        <i-input title="介绍" right type="textarea" mode="wrapped" placeholder="大家好，我是高小白。" maxlength="25"/>
      </i-panel>
    </div>
    <div style="margin-top:25px;">
      <i-button type="primary" shape="circle">确认</i-button>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>

</style>