<template>
  <div>
    <i-radio-group :current="setting" vertical @change="handleChange">
      <i-radio value="0" label="只接受本校打招呼">
        <span>只接受本校打招呼</span>
      </i-radio>
      <i-radio value="1" label="接受同城及其它学校打招呼">
        <span>接受同城及其它学校打招呼</span>
      </i-radio>
      <i-radio value="2" label="不接受打招呼">
        <span>不接受打招呼</span>
      </i-radio>
    </i-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      setting: "0"
    }
  },
  methods: {
    handleChange(current) {
      this.setting = current.target.value;
    }
  }
}
</script>

<style>

</style>