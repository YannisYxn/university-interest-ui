<template>
  <div>
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-avatar size="avatar" src="../../../static/images/avatar.png" />
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">高小白</p>
            <p style="font-size:12px;color:white;line-height:25px;">
              厦大思明
              <i-tag style="color:#07a68e;">升学</i-tag>
            </p>
            <span style="font-size:11px;color:white;">2020-02-26(加入)</span>
            <i-tag class="i-tags" type="border" color="green">校内登录2次</i-tag>
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">ID:345637</p>
            <p style="font-size:12px;color:white;line-height:25px;">积分:3000</p>
            <i-icon type="add" size="16" color="red" @click="handleAdd" />
            <br />
            <i-tag class="i-tags" type="border" color="red">校外登录6次</i-tag>
          </i-col>
        </i-row>
      </div>
      <div style="margin:10px;">
        <p style="font-size:12px;color:white;">介绍：俺是一个老实人，看名字就指导，你们可别欺负我。</p>
      </div>
    </div>

    <div class="label">
      <span style="margin:5px;color:#ffffff"> ta 的发帖 (3)</span>
    </div>

    <div style="margin-top:10px;">
      <i-card title="高小白" extra="2019-12-12 10:24" thumb="../../../static/images/avatar.png">
        <view slot="content">
          <span>心情大好，晴空万里！</span>
          <image :src="imageUrl" style="padding:10px;height:120px;width:80%;"/>
        </view>
      </i-card>
    </div>

    <i-button type="primary" shape="circle">发送消息给ta</i-button>

    <i-action-sheet :visible="isAdd" :actions="addAction" show-cancel @cancel="handleCancel" />
  </div>
</template>

<script>
import img from "../../../static/images/postImage.png";
export default {
  data() {
    return {
      isAdd: false,
      imageUrl: img,
      addAction: [
        {
          name: "回到陌生"
        },
        {
          name: "举报"
        },
        {
          name: "拉黑"
        }
      ]
    }
  },
  methods: {
    handleAdd() {
      this.isAdd = true;
    },
    handleCancel() {
      this.isAdd = false;
    }
  }
}
</script>

<style>
.head {
  align-items: center;
  padding: 5px;
  background-image: linear-gradient(to bottom, #14d0b6, #0ed4d6);
  text-align: center;
  vertical-align: middle;
}
.label {
  margin-top: 10px;
  background-image: linear-gradient(to right,#14d0b6,#0ed4d6);
  height: 35px;
  display: flex;
  align-items: center;
  width: 40%;
  border-bottom-right-radius: 50px;
  border-top-right-radius: 50px;
}
</style>