<template>
  <div>
    <div style="margin-top:5px;">
      <i-cell-group>
        <exchange-cell
          v-for="record in records"
          :key="record.id"
          style="margin-top:5px;font-size:10px;"
          :title="record.ticketName"
          :label="record.createTime"
          :value="'兑换码：' + record.code"
          @click="handleClip(record.code)"
        ></exchange-cell>
      </i-cell-group>
    </div>

    <div style="margin-top:25px;">
      <i-load-more v-if="records.length === 0" tip="用户当前无兑换记录" :loading="false" />
      <i-load-more v-else :loading="false" />
    </div>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
      records: []
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
    //获取兑换记录
    this.$wxhttp.get({
      url: "/ticket/exchangeLog?userId=" + getQuery.getQuery().userId
    }).then(resp => {
      if(resp.code === 0){
        this.records = resp.data.map(item => {
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
    })
  },
  methods: {
    handleClip(code){
      wx.setClipboardData({
        data: code,
        success (res) {
          wx.showToast({
            title: "邀请码已复制"
          });
          // wx.getClipboardData({
          //   success (res) {
          //     console.log(res.data) // data
          //   }
          // })
        }
      })
    }
  }
}
</script>

<style>
</style>