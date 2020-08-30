<template>
  <div style="margin-top:10px;">
    <i-cell-group>
      <i-cell
        v-for="group in groupList"
        v-show="group.status === 0 || (group.userId === userInfo.userId && [-1,3].includes(group.status))"
        :key="group.id"
        :title="group.name"
        @click="handleInterestGroup"
      >
        <view slot="icon">
          <i-avatar :src="group.logo"></i-avatar>
        </view>
        <view slot="badge">
          <i-badge :count="group.postCount" overflow-count="100" style="margin-right:10px;" />
        </view>
        <view slot="footer">
          <i-icon
            v-if="group.userId == userId"
            type="setup_fill"
            size="25"
            color="#67ddd3"
            @click="handleManageInterestGroup"
          />
        </view>
      </i-cell>
    </i-cell-group>
  </div>
</template>

<script>
import getQuery from '../../utils/getPage';

export default {
  data() {
    return {
      userId: undefined,
      universityId: undefined,
      groupList: []
    }
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: getQuery.getQuery().universityName + "兴趣组"
    });
    this.userId = getQuery.getQuery().userId;
    this.universityId = getQuery.getQuery().universityId;
    //获取本校兴趣组列表
    this.$wxhttp.get({
      url: "/group/listUniversityGroup?universityId=" + getQuery.getQuery().universityId
    }).then(resp => {
      if(resp.code === 0){
        this.groupList = resp.data;
      }else{
        wx.showToast({
          title: resp.msg,
          icon: 'none'
        });
      }
    })
  },
  methods: {
    handleInterestGroup() {
      wx.navigateTo({
        url: "../interestGroup/main"
      });
    },
    handleManageInterestGroup() {
      wx.navigateTo({
        url: "../manageInterestGroup/main"
      });
    }
  }
}
</script>

<style scoped>
</style>