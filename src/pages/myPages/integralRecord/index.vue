<template>
  <div>
    <div class="label">
      <span style="margin:5px;color:#ffffff">目前积分数：{{ totalCredit }}</span>
    </div>
    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell
          v-for="record in records"
          :key="record"
          style="margiin-top:5px;font-size:10px;"
          :title="record.changeTypeMes"
          :label="record.createTime"
          :add="record.changeNum > 0"
          :minus="record.changeNum < 0"
          :value="record.changeNum"
        ></i-cell>
      </i-cell-group>
    </div>

    <div style="margin-top:25px;">
      <i-load-more v-if="records.length === 0" tip="用户当前无积分动态记录" :loading="false" />
      <i-load-more v-else :loading="false" />
    </div>

    <div style="margin:20px;">
      <p class="font" style="font-size:15px;">提示：</p>
      <p class="font" style="font-size:11px;">积分获得方式：首次成功登录校趣+30，成功分享链接+20/次，有10人以上回复的热帖+15，成功举报+5/次</p>
    </div>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
      records: [],
      totalCredit: undefined
    }
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + getQuery.getQuery().userId
    }
  },
  mounted() {
    //获取积分动态
    this.$wxhttp.get({
      url: "/credit/getUserCredit?userId=" + getQuery.getQuery().userId
    }).then(resp => {
      if(resp.code === 0){
        this.totalCredit = resp.data.totalCredit;
        this.records = resp.data.creditChangeLogVOList.map(item => {
          return {
            ...item,
            createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm")
          }
        });
      }else{
        wx.showToast({
          title: resp.msg,
          icon: "none"
        })
      }
    });
  }
}
</script>

<style>
.label {
  margin-top: 10px;
  background-image: linear-gradient(to right, #14d0b6, #0ed4d6);
  height: 35px;
  display: flex;
  align-items: center;
  width: 50%;
  border-bottom-right-radius: 50px;
  border-top-right-radius: 50px;
}
.font {
  line-height: 20px;
  color: #b7b7b7;
}
</style>