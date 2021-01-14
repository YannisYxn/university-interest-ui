<template>
  <div>
    <div class="head">
      <i-input
        v-model="searchKey"
        placeholder="请输入学校名称查看其校的校趣"
        maxlength="50"
        confirmType="search"
        mode="wrapped"
        style="width: 100%"
        @confirm="handleSearch"
        @change="handleSearchChange"
      />
      <i-icon
        type="delete_fill"
        size="25"
        style="margin-right: 5px"
        color="#ececec"
        @click="handleClearSearch"
      />
    </div>
    <div class="label">
      <span style="margin: 5px; color: #ffffff">{{ barTitle }}</span>
    </div>

    <!-- 兴趣组列表 -->
    <div style="margin-top: 5px">
      <i-cell-group>
        <i-cell
          v-for="group in groupList"
          :key="group.id"
          :title="group.name"
          @click="handleInterestGroup(group.id)"
        >
          <view slot="icon">
            <i-avatar :src="group.logo"></i-avatar>
          </view>
          <view slot="badge">
            <i-icon
              v-if="group.userId === userInfo.userId && group.status === -1"
              type="warning_fill"
              size="25"
              color="#67ddd3"
              @click="showToast(msg)"
            />
            <i-icon
              v-else-if="group.userId === userInfo.userId && group.status === 3"
              type="lock_fill"
              size="25"
              color="#67ddd3"
              @click="showToast(msg)"
            />
            <!-- <i-badge v-else :count="group.postCount" overflow-count="100" style="margin-right:10px;" /> -->
            <div v-else style="margin-right: 10px">
              <div style="width: 50px">
                <i-icon size="25" type="barrage_fill" color="#67ddd3" />
                <span style="color: #67ddd3; float: right">{{
                  group.postCount > 999 ? "999+" : group.postCount
                }}</span>
              </div>
            </div>
          </view>
        </i-cell>
      </i-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupList: [],
      searchKey: "",
      barTitle: "厦门大学"
    };
  },
  onShow() {
    this.searchKey = "";
    this.userId = getQuery.getQuery().userId;
  },
  methods: {
    handleSearchChange(event) {
      console.log(event);
      this.searchKey = event.mp.detail.detail.value;
    },
    handleSearch() {
      // 根据学校名搜索该校校区兴趣组
      wx.setNavigationBarTitle({
        title: "厦门大学兴趣组"
      });
    },
    getGroupList() {
      this.$wxhttp.post({
        url: "/group/listMyGroups?userId=" + this.userInfo.userId,
      }).then(resp => {
        if(resp.code === 0){
          this.groupList = resp.data;
        }
      });
    },
    handleClearSearch() {
      this.getGroupList();
      this.searchKey = "";
      this.barTitle = "厦门大学"
      wx.setNavigationBarTitle({
        title: "厦门大学兴趣组"
      });
    },
    handleInterestGroup(groupId) {
      wx.navigateTo({
        url: "../indexPages/interestGroup/main?groupId=" + groupId + "&userId=" + this.userInfo.userId
      });
    },
  },
};
</script>

<style>
.head {
  display: flex;
  align-items: center;
  padding: 5px;
  background-image: linear-gradient(to bottom, #14d0b6, #0ed4d6);
}
</style>