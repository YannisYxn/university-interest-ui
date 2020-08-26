<template>
  <div>
    <div style="margin:5px;">
      <i-panel>
        <i-input v-model="name" title="兴趣组名称" maxlength="12" right mode="wrapped" placeholder="请在这里输入,本校内名称唯一" @change="handleNameChange"/>
        <i-input
          v-model="introduction"
          style="height:100px;"
          title="兴趣组介绍"
          right
          high
          type="textarea"
          mode="wrapped"
          placeholder="限25个字"
          maxlength="25"
        />
        <div class="add" @click="handleChooseImage">
          <i-avatar :src="tempFilePath">L</i-avatar>
          <i-icon type="add" size="25"/>
          <span>添加兴趣组logo</span>
        </div>
      </i-panel>
    </div>
    <div style="margin:20px;">
      <p class="font" style="font-size:15px;">提示：</p>
      <p class="font" style="font-size:11px;">
        1.每个人可以创建2个兴趣组，请管理维护浩自己创建的兴趣组，
        如果兴趣组内容被多人举报内容不适，此兴趣组将被取缔。兴趣组收益根据活跃度，分享软广告带来的收益，
        收益每周一通过微信发放。具体收益明细，请查看【我的】里的【兴趣组收益】。
      </p>
      <p class="font" style="font-size:11px;">
        2.管理兴趣组，左滑自创兴趣组里面的帖子，右侧有【删帖】【删+拉黑发帖人】2个按钮，
        右上角【加号+】，有解散此组按钮。
      </p>
      <p class="font" style="font-size:11px;">3.请勿发政治宗教人肉及商品买卖等不适宜话题，被举报，封号处理</p>
    </div>
    <div style="margin:20px;">
      <i-button type="primary" @click="handleCreateGroup">创建此组</i-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "", //兴趣组名字
      introduction: "", //兴趣组介绍
      tempFilePath: "",  //logo路径
    }
  },
  methods: {
    handleChooseImage() {
      var that = this;
      wx.chooseImage({
        count: 1, //最多上传1张照片
        sizeType: ['compressed'], //压缩图
        sourceType: ['album','camera'], //指定来源，相册和相机都可
        success(res) {
          that.tempFilePath = res.tempFilePaths[0];
        }
      })
    },
    handleCreateGroup() {
      console.log(this.name)
      console.log(this.tempFilePath)
      if(this.name!=="" && this.tempFilePath!==""){
        // this.$wxhttp.post({
        //   url: "/image/uploadLogo",
        //   data: this.tempFilePath,
        //   headers: {
        //     'content-type': "multipart/form-data" // 默认值
        //   },
        // }).then(resp => {
        //   if(resp.code === 0){
        //     wx.navigateTo({
        //       url: "../index/main"
        //     });
        //   }
        // });
        var that = this;
        console.log(that.tempFilePath)
        wx.uploadFile({
          url: "http://116.62.239.164:8080/xiaoqu/image/uploadLogo",
          filePath: that.tempFilePath,
          name: "image",
          header: { "Content-Type": "multipart/form-data" },
          success(res) {
            console.log(res)
          }
        })
      }else{
        wx.showToast({
          title: '必须完善名称与Logo',
          icon: 'success'
        });
      }
    },
    handleNameChange(event) {
      this.name = event.mp.detail.detail.value;
    },
    handleIntroductionChange(event) {
      this.introduction = event.mp.detail.detail.value;
    }
  }
};
</script>

<style>
.font {
  line-height: 20px;
  color: #b7b7b7;
}
.add {
  margin: 5px 10px;
  background-color: #ececec;
  border-radius: 10px;
  text-align: center;
  color: #9f9f9f;
  padding: 5px;
}
</style>
