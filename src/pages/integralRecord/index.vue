<template>
  <div>
    <div class="label">
      <span style="margin:5px;color:#ffffff">目前积分数：3000</span>
    </div>
    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell style="margiin-top:5px;font-size:10px;" title="成功分享链接" label="2020-2-5 19:27" add value="+20">
        </i-cell>
        <i-cell style="margin-top:5px;font-size:10px;" title="兑换" label="2020-2-4 09:36" minus value="-20">
        </i-cell>
      </i-cell-group>
    </div>
    <div style="margin:20px;">
      <p class="font" style="font-size:15px;">提示：</p>
      <p class="font" style="font-size:11px;">积分获得方式：首次成功登录校趣+30，成功分享链接+20/次，有10人以上回复的热帖+15，成功举报+5/次</p>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
.label {
  margin-top: 10px;
  background-image: linear-gradient(to right,#14d0b6,#0ed4d6);
  height: 35px;
  display: flex;
  align-items: center;
  width: 50%;
  border-bottom-right-radius: 50px;
  border-top-right-radius: 50px;
}
.font{
  line-height: 20px;
  color: #b7b7b7;
}
</style>