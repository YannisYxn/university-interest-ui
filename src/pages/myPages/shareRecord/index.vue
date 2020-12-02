<template>
  <div>
    <div style="margin-top:5px;">
      <i-cell-group>
        <share-record
          v-for="record in records"
          :key="record.id"
          style="margin-top:5px;font-size:10px;"
          :title="record.createTime"
          :name="record.friendName"
          :university="record.friendUniversityCampusName"
          value="成功登录校趣"
        >
          <view slot="badge">
            <i-avatar :src="record.friendPhoto"></i-avatar>
          </view>
        </share-record>
      </i-cell-group>
    </div>

    <div style="margin-top:25px;">
      <i-load-more v-if="records.length === 0" tip="用户当前无分享记录" :loading="false" />
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
    this.$wxhttp.get({
      url: "/user/share?userId=" + getQuery.getQuery().userId
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
        });
      }
    });
  }
}
</script>

<style>
</style>