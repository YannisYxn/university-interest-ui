<template>
  <div>
    <i-radio-group :current="setting" vertical @change="handleChange">
      <i-radio value="4" label="接受所有打招呼">
        <span>接受所有打招呼</span>
      </i-radio>
      <i-radio value="0" label="不接受打招呼">
        <span>不接受打招呼</span>
      </i-radio>
      <i-radio value="1" label="只接受本校打招呼">
        <span>只接受本校打招呼</span>
      </i-radio>
      <i-radio value="2" label="接受同城其它学校打招呼">
        <span>接受同城及其它学校打招呼</span>
      </i-radio>
      <i-collapse v-if="setting == '2'" name="university" style="margin:20px;">
        <i-collapse-item title="学校列表" name="university">
          <view slot="content">
            <i-radio value="全选" label="全选" :checked="isAllChecked" color="#14d0b6" @change="handleAllChecked()"/>
            <i-checkbox-group :current="universitySetting" @change="handleUniversityChange">
              <i-checkbox 
                v-for="item in allUniversityList" 
                :key="item.id"
                :value="item.name"
                color="#14d0b6"
              />
            </i-checkbox-group>
          </view>
        </i-collapse-item>
      </i-collapse>
    </i-radio-group>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
      setting: "0",
      universitySetting: [],
      allUniversityList: [],  // 同城所有学校列表
      isAllChecked: false
    }
  },
  onShow() {
    this.userId = getQuery.getQuery().userId;

    // 获取同城学校列表
    this.$wxhttp.get({
      url: "/university/listUniversityByCity?userId=" + this.userId
    }).then(resp => {
      if(resp.code == 0){
        this.allUniversityList = resp.data;
        this.getSayHelloSetting();
      }else{
        wx.showToast({
          title: "获取同城学校列表错误",
          icon: "none"
        });
      }
    });
  },
  methods: {
    getSayHelloSetting() {
      // 获取打招呼设置状态
      this.$wxhttp.post({
        url: "/user/getSayHelloSetting?userId=" + this.userId
      }).then(resp => {
        if(resp.code == 0){
          if(resp.data.type == 3){
            // 接受同城所有学校打招呼
            this.setting = "2";
            this.universitySetting = this.allUniversityList.map(item => {
              return item.name
            });
            console.log(this.universitySetting)
            this.isAllChecked = true;
          }else{
            this.setting = String(resp.data.type);
            if(resp.data.universitySetting){
              // 接受同城部分学校打招呼
              this.universitySetting = resp.data.universityIdList;
              if(this.universitySetting.length === this.allUniversityList.length){
                this.isAllChecked = true;
              }else{
                this.isAllChecked = false;
              }
            }
          }
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    handleChange(current) {
      this.setting = current.target.value;
      if(this.setting == "0" || this.setting == "1" || this.setting == "4") {
        this.$wxhttp.post({
          url: "/user/sayHelloSetting",
          data: {
            type: Number(this.setting),
            userId: this.userId
          }
        }).then(resp => {
          if(resp.code == 0){
            wx.showToast({
              title: "设置成功"
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        })
      }else{
        this.isAllChecked = true;
        this.universitySetting = this.allUniversityList.map(item => {
          return item.id
        });
        this.$wxhttp.post({
          url: "/user/sayHelloSetting",
          data: {
            type: 3,
            userId: this.userId,
            universityIdList: this.universitySetting
          }
        }).then(resp => {
          if(resp.code == 0){
            wx.showToast({
              title: "设置成功"
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }
    },
    handleUniversityChange(current) {
      console.log(current)
      if(current.target.current) {
        this.universitySetting.push(current.target.value);
        console.log(this.universitySetting)
      }else{
        this.universitySetting.splice(this.universitySetting.indexOf(current.target.value));
        console.log(this.universitySetting)
      }
      if(this.universitySetting.length !== this.allUniversityList.length){
        this.isAllChecked = false;
        this.$wxhttp.post({
          url: "/user/sayHelloSetting",
          data: {
            type: 2,  // 部分学校
            userId: this.userId,
            universityIdList: this.universitySetting.map(item => {
              return this.allUniversityList.find(item1 => item1.name == item).id
            })
          }
        }).then(resp => {
          if(resp.code == 0){
            wx.showToast({
              title: "设置成功"
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }else{
        this.isAllChecked = true;
        this.$wxhttp.post({
          url: "/user/sayHelloSetting",
          data: {
            type: 3,  //全部学校
            userId: this.userId,
            universityIdList: this.allUniversityList.map(item => {
              return item.id
            })
          }
        }).then(resp => {
          if(resp.code == 0){
            wx.showToast({
              title: "设置成功"
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }
    },
    handleAllChecked() {
      this.isAllChecked = !this.isAllChecked;
      if(this.isAllChecked){
        this.universitySetting = this.allUniversityList.map(item => {
          return item.name
        });
        this.$wxhttp.post({
          url: "/user/sayHelloSetting",
          data: {
            type: 3,
            userId: this.userId,
            universityIdList: this.allUniversityList.map(item => {
              return item.id
            })
          }
        }).then(resp => {
          if(resp.code == 0){
            wx.showToast({
              title: "设置成功"
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }else{
        this.universitySetting = [];
      }
    }
  }
}
</script>

<style>
</style>