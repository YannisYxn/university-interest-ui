<template>
  <div>
    <div style="align-items:center;margin-top:20px;">
      <i-input
        v-model="content"
        style="height:200px;"
        type="textarea"
        mode="wrapped"
        placeholder="请写出要说的诉求，我们会在一个工作日内回复你，限99字"
        asking
        maxlength="99"
        @change="handleContentChange"
      />
    </div>
    <i-button style="margin-top:20px;" shape="circle" type="primary" @click="handleAsking">提交</i-button>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
      content: "",
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
    this.content = "";
    this.userId = getQuery.getQuery().userId;
  },
  methods:{
    handleAsking() {
      if(this.content === ""){
        wx.showToast({
          title: "诉求内容不可为空",
          icon: "none"
        });
      }else{
        this.$wxhttp.post({
          url: "/manage/require",
          data: {
            content: this.content,
            userId: getQuery.getQuery().userId
          }
        }).then(resp => {
          if(resp.code === 0){
            wx.showToast({
              title: "提交诉求成功"
            });
            wx.navigateBack({
              delta: 1
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        })
      }
    },
    handleContentChange(event) {
      this.content = event.mp.detail.detail.value;
    },
  }
}
</script>

<style>
</style>