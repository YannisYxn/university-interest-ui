<template>
  <div>
    <div class="head">
      <i-input
        v-model="searchKey"
        placeholder="搜索城市"
        maxlength="50"
        confirmType="search"
        mode="wrapped"
        style="width:100%;"
        @confirm="handleSearch"
        @change="handleSearchChange"
      />
      <i-icon
        type="delete_fill"
        size="25"
        style="margin-right:5px;"
        color="#ececec"
        @click="listAllCity"
      />
    </div>
    <i-cell-group>
      <i-cell
        v-for="city in cityList"
        :key="city"
        :title="city"
        is-link
        @click="handleCityUniversity(city)"
      ></i-cell>
    </i-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      universityList: [],
      cityList: [],
      searchKey: ""
    }
  },
  onShow() {
    this.searchKey = "";
    this.listAllCity();
  },
  methods: {
    listAllUniversity() {
      this.$wxhttp.get({
        url: "/university/listAllUniversity"
      }).then(resp => {
        if(resp.code == 0){
          this.universityList = resp.data;
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    listAllCity() {
      this.$wxhttp.post({
        url: "/university/listAllCity"
      }).then(resp => {
        if(resp.code == 0){
          this.cityList = resp.data;
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    handleSearchChange(event){
      console.log(event)
      this.searchKey = event.mp.detail.detail.value;
    },
    handleSearch() {
      this.cityList = this.cityList.filter(item => {
        return item.name.indexOf(this.searchKey) != -1 ? true : false
      });
    },
    handleMerchantUniversity(universityId, universityName) {
      wx.navigateTo({
        url: "../merchantUniversity/main?universityId=" + universityId + "&universityName=" + universityName
      });
    },
    handleCityUniversity(city) {

    }
  }
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