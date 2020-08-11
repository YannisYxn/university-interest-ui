<template>
  <div>
    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell title="厦门大学" is-link @click="handleUniversityInterestGroup">
        </i-cell>
        <i-cell title="集美大学" is-link @click="handleUniversityInterestGroup">
        </i-cell>
      </i-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    handleUniversityInterestGroup() {
      wx.navigateTo({
        url: "../selfUniversityInterestGroup/main"
      });
    }
  }
}
</script>

<style>

</style>