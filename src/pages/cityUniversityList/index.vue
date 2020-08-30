<template>
  <div>
    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell
          v-for="university in universityList"
          :key="university.id"
          :title="university.name"
          is-link
          @click="handleUniversityInterestGroup(university.id,university.name)"
        ></i-cell>
      </i-cell-group>
    </div>
  </div>
</template>

<script>
import getQuery from '../../utils/getPage';

export default {
  data() {
    return {
      universityList: []
    }
  },
  mounted() {
    this.$wxhttp.get({
      url: "/university/listUniversityByCity?userId=" + getQuery.getQuery().userId
    }).then(resp => {
      if(resp.code === 0){
        this.universityList = resp.data;
      }else{
        wx.showToast({
          title: resp.msg
        });
      }
    })
  },
  methods: {
    handleUniversityInterestGroup(universityId,universityName) {
      wx.navigateTo({
        url: 
          "../selfUniversityInterestGroup/main?userId=" + 
          getQuery.getQuery().userId + 
          "&universityId=" + 
          universityId + 
          "&universityName=" + 
          universityName
      });
    }
  }
}
</script>

<style>
</style>