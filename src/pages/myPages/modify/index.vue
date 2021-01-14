<template>
  <div>
    <div style="margin: 5px">
      <i-panel>
        <div style="display: flex; margin: 5px; margin-left: 43%">
          <i-avatar
            size="large"
            shape="square"
            :src="tempFilePath || avatarUrl"
            @click="handleChooseImage"
            >头</i-avatar
          >
        </div>
        <i-input
          v-model="name"
          title="昵称"
          right
          mode="wrapped"
          placeholder="名称"
          maxlength="12"
          @change="handleNameChange"
        />
        <div class="sex">
          <span style="font-size: 14px" class="sex-label">性别：</span>
          <img
            style="width: 50px; height: 50px; margin-left: 20px"
            :src="girl"
            alt=""
            :class="currentSex !== 2 ? 'g' : ''"
            @click="handleSexChange(2)"
          />
          <img
            style="width: 50px; height: 50px; margin-left: 20px"
            :src="boy"
            alt=""
            :class="currentSex !== 1 ? 'g' : ''"
            @click="handleSexChange(1)"
          />
        </div>
        <div style="margin: 10px">
          <p class="font" style="font-size: 11px; color: #a3a4a4">
            性别确认后不可修改
          </p>
        </div>
        <i-input
          v-model="introduction"
          type="textarea"
          right
          high
          title="简介"
          mode="wrapped"
          placeholder="简介"
          maxlength="99"
          @change="handleIntroductionChange"
        />
      </i-panel>
    </div>

    <div style="margin: 20px">
      <p class="font" style="font-size: 15px; line-height: 2; color: #a3a4a4">
        提示：
      </p>
      <p class="font" style="font-size: 11px; line-height: 2; color: #a3a4a4">
        一个自然年可修改5次，头像及简介不允许涉及政治敏感与色情，违者直接封号处理。
      </p>
    </div>

    <div style="margin-top: 25px; width: 100%">
      <i-button type="primary" shape="circle" @click="handleModify"
        >确认</i-button
      >
    </div>
  </div>
</template>

<script>
import getQuery from "../../../utils/getPage";
import girl from "../../../../static/images/girl.png";
import boy from "../../../../static/images/boy.png";

export default {
  data() {
    return {
      avatarUrl: "",
      name: "",
      introduction: "",
      tempFilePath: "",
      girl: girl,
      boy: boy,
      currentSex: undefined,
      originalSex: undefined, //数据库中的性别，判断能不能更改
    };
  },
  onShareAppMessage(object) {
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + getQuery.getQuery().userId,
    };
  },
  onShow() {
    //获取信息
    this.$wxhttp
      .get({
        url: "/user/getUserDetailById?userId=" + getQuery.getQuery().userId,
      })
      .then((resp) => {
        if (resp.code === 0) {
          this.avatarUrl = resp.data.photo;
          this.name = resp.data.name;
          this.introduction = resp.data.description;
          this.currentSex = resp.data.sex;
          this.originalSex = resp.data.sex;
        } else {
          wx.showToast({
            title: resp.msg,
            icon: "none",
            duration: 3000
          });
        }
      });
  },
  methods: {
    handleNameChange(event) {
      this.name = event.mp.detail.detail.value;
    },
    handleIntroductionChange(event) {
      this.introduction = event.mp.detail.detail.value;
    },
    handleModify() {
      if (
        this.name !== "" &&
        this.introduction !== "" &&
        (this.tempFilePath !== "" || this.avatarUrl !== "") &&
        (this.currentSex == 1 || this.currentSex == 2)
      ) {
        if (this.tempFilePath) {
          var that = this;
          wx.uploadFile({
            url: that.$wxhttp.host + "/image/uploadLogo",
            filePath: that.tempFilePath,
            name: "image",
            header: { "Content-Type": "multipart/form-data" },
            success(res) {
              that.$wxhttp
                .put({
                  url: "/user",
                  data: {
                    description: that.introduction,
                    id: getQuery.getQuery().userId,
                    name: that.name,
                    sex: that.currentSex,
                    photo:
                      that.$wxhttp.hostForFile +
                      String(JSON.parse(res.data).data),
                  },
                })
                .then((resp) => {
                  if (resp.code === 0) {
                    wx.showToast({
                      title: "更改成功",
                      duration: 3000
                    });
                    that.globalData.isPerfectInfo = 1;
                    wx.navigateBack({
                      delta: 1,
                    });
                  } else {
                    wx.showToast({
                      title: resp.msg,
                      icon: "none",
                      duration: 3000
                    });
                  }
                });
            },
          });
        } else {
          this.$wxhttp
            .put({
              url: "/user",
              data: {
                description: this.introduction,
                id: getQuery.getQuery().userId,
                name: this.name,
                photo: this.avatarUrl,
                sex: this.currentSex,
              },
            })
            .then((resp) => {
              if (resp.code === 0) {
                wx.showToast({
                  title: "更改成功",
                  duration: 3000
                });
                wx.navigateBack({
                  delta: 1,
                });
              } else {
                wx.showToast({
                  title: resp.msg,
                  icon: "none",
                  duration: 3000
                });
              }
            });
        }
      } else {
        wx.showToast({
          title: "请完善名称、性别、简介与Logo",
          icon: "none",
          duration: 3000
        });
      }
    },
    handleChooseImage() {
      var that = this;
      wx.chooseImage({
        count: 1, //最多上传1张照片
        sizeType: ["original", "compressed"], //压缩图
        sourceType: ["album", "camera"], //指定来源，相册和相机都可
        success(res) {
          that.tempFilePath = res.tempFilePaths[0];
        },
      });
    },
    handleSexChange(sexValue) {
      if (!this.originalSex) {
        this.currentSex = sexValue;
      } else {
        wx.showToast({
          title: "性别确认后不可修改",
          icon: "none",
          duration: 3000
        });
      }
    },
  },
};
</script>

<style>
.g {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
}
.sex {
  position: relative;
  display: flex;
  background: #fff;
  align-items: center;
  line-height: 1.4;
  font-size: 14px;
  overflow: hidden;
  padding: 7px 15px;
  color: #495060;
  margin: 5px 10px;
  background-color: #ececec;
  border-radius: 10px;
}
.sex-label {
  display: block;
  color: #495060;
  min-width: 65px;
  padding-right: 10px;
}
</style>