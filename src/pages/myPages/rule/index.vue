<template>
  <div style="margin:15px;">
    <p class="title">校趣是在校大学生同建共分享收益的兴趣组小平台，为了给大家一个干净清爽的环境，请遵守校趣规则。</p>
    <p class="content">1. 请注意自我的言行，如果发帖发信内容引起ta人不适，将会被举报。如被多人举报，将被临时停用14天，严重者直接封号处理，如有法律后果自行负责。<br />
      {{"  "}}每人仅有2个创建兴趣组的机会，如果所创建的兴趣组，被多人举报内容不适，此组将被取缔。
    </p>
    <p class="content">2. 收益分配方式，校趣采用兑换方式取得收益，客户在本校校趣兑换投放所产生总收益的75%分配给本校同学，创建兴趣组占比25%，发帖占比25%，分享链接及举报占比25%，
      具体数据请查看【我的】里面的3个收益明细。<br />{{"  "}}收益每周一结算，收益通过微信支付发给同学们。收益分配期限，自首次登录校趣之日起三年。
    </p>
  </div>
</template>

<script>
import getQuery from "../../../utils/getPage";

export default {
  data() {
    return {
      userId: undefined
    }
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + this.userId
    }
  },
  onShow() {
    this.userId = getQuery.getQuery().userId
  }
}
</script>

<style scoped>
.title {
  font-size: 18px;
  line-height: 26px;
}
.content {
  font-size: 17px;
  line-height: 24px;
  margin: 5px;
  margin-top: 30px;
}
</style>