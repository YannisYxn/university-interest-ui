<template>
  <div>
    <div class="head">
      <i-input placeholder="请在这里搜索" mode="wrapped" style="width:100%;" />
    </div>
    <div style="margin-top:10px;margin-left:5px;display:flex;align-items:center;">
      <i-card
        title="本校兴趣组"
        thumb="../../../static/images/benxiao.png"
        @click="handleSelfUniversityInterestGroup"
      >
        <view slot="footer">距离近 都是同校</view>
      </i-card>
      <i-card
        @click="handleToCityUniversity"
        title="同城高校兴趣组"
        thumb="../../../static/images/tongcheng.png"
      >
        <view slot="footer">更多兴趣小组 都在这里</view>
      </i-card>
      <i-card @click="handleCreateGroup" title="创建">
        <view slot="footer">
          <i-icon type="add" size="25" color="#67ddd3" />
        </view>
      </i-card>
    </div>
    <div class="label">
      <span style="margin:5px;color:#ffffff">我创建及加入的兴趣组</span>
    </div>
    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell title="篮球狂人" @click="handleInterestGroup">
          <view slot="icon">
            <i-avatar src="../../../static/images/basketball.png"></i-avatar>
          </view>
          <view slot="badge">
            <i-badge count="1" overflow-count="1" style="margin-right:10px;" />
          </view>
          <view slot="footer">
            <i-icon type="setup_fill" size="25" color="#67ddd3" @click="handleManageInterestGroup" />
          </view>
        </i-cell>
        <i-cell title="我们爱说唱">
          <view slot="icon">
            <i-avatar src="../../../static/images/basketball.png"></i-avatar>
          </view>
          <view slot="badge">
            <i-badge count="2" overflow-count="1" style="margin-right:10px;" />
          </view>
          <view slot="footer">
            <i-icon type="setup_fill" size="25" color="#67ddd3" @click="handleManageInterestGroup" />
          </view>
        </i-cell>
        <i-cell title="英语口语下线talk">
          <view slot="icon">
            <i-avatar src="../../../static/images/basketball.png"></i-avatar>
          </view>
          <view slot="badge">
            <i-badge count="2" overflow-count="1" style="margin-right:10px;" />
          </view>
          <view slot="footer">
            <i-icon type="setup_fill" size="25" color="white" />
          </view>
        </i-cell>
      </i-cell-group>
    </div>

    <i-modal title="提示" :visible="visible2" @ok="handleClose2" @cancel="handleClose2">
      <p style="font-size:15px;line-height:20px;margin:0 20px;">请简单完善个人资料后，再建组，发帖，回复等操作。谢谢。</p>
      <div style="display:flex;align-items:center;margin-left:20px;">
        性别：
        <i-radio-group :current="current" @change="handleGenderChange">
          <i-radio v-for="item in gender" :key="item.name" :value="item.name"></i-radio>
        </i-radio-group>
      </div>
      <div style="display:flex;align-items:center;margin-left:20px;">
        昵称：
        <i-input mode="wrapped" placeholder="原微信昵称" />
      </div>
      <div style="display:flex;align-items:center;margin-left:20px;">
        简介：
        <div style="width:82%">
          <i-input type="textarea" mode="wrapped" placeholder="限25个字" maxlength="25" />
        </div>
      </div>
      <div style="display:flex;align-items:center;margin-left:20px;">
        <i-avatar>头</i-avatar>
        <span style="line-height:20px;">（可修改,上传不雅头像,会被封号）</span>
      </div>
    </i-modal>
    <i-modal title="提示" :visible="visible3" @ok="handleClose3" @cancel="handleClose3">
      <p style="font-size:15px;line-height:20px;margin:0 20px;">请您再本校地理范围登录校趣！</p>
      <p style="font-size:15px;line-height:20px;margin:0 20px;">或</p>
      <span style="font-size:15px;line-height:20px;margin:0 20px;">输入邀请码：</span>
      <i-input mode="wrapped" placeholder="请在这里输入" />
    </i-modal>
    <i-modal title="欢迎首次进入校趣" :visible="visible1" @ok="handleClose1" @cancel="handleClose1">
      <p style="font-size:15px;line-height:20px;margin:0 20px;">您是厦门大学思明校区的学生吗？不是的话，请在本校校区时登录校趣。谢谢。</p>
      <p style="font-size:10px;">提示：冒用ta人校区，被举报，会封号。</p>
    </i-modal>
    <i-modal title="请输入就读高校" :visible="visible4" @ok="handleGetUserInfo" @cancel="handleClose4">
      <i-input v-model="university" maxlength="10" placeholder="学校名称" />
    </i-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      university: "", //输入高校名称
      current: null,
      gender: [
        {
          id: 1,
          name: "男"
        },
        {
          id: 2,
          name: "女"
        }
      ]
    };
  },
  mounted() {
    var BASE_LINE = this.$store.state.BASE_LINE;
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: BASE_LINE + "/user/login?code=" + res.code,
            method: "POST",
            success(res) {
              that.visible4 = true;
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  },
  methods: {
    handleToCityUniversity() {
      wx.navigateTo({
        url: "../cityUniversityList/main"
      });
    },
    handleCreateGroup() {
      wx.navigateTo({
        url: "../createGroup/main"
      });
    },
    handleSelfUniversityInterestGroup() {
      wx.navigateTo({
        url: "../selfUniversityInterestGroup/main"
      });
    },
    handleInterestGroup() {
      wx.navigateTo({
        url: "../interestGroup/main"
      });
    },
    handleManageInterestGroup() {
      wx.navigateTo({
        url: "../manageInterestGroup/main"
      });
    },
    handleClose1() {
      this.visible1 = false;
    },
    handleClose2() {
      this.visible2 = false;
    },
    handleClose3() {
      this.visible3 = false;
    },
    handleClose4() {
      this.visible4 = false;
      this.visible1 = true;
    },
    handleGetUserInfo() {
      this.visible4 = false;
      wx.getUserInfo({
        success(res) {
          console.log(res.userInfo);
        }
      })
    },
    handleGenderChange(current) {
      this.current = current.target.value;
    }
  },

  created() {
    // let app = getApp()
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
.label {
  margin-top: 10px;
  background-image: linear-gradient(to right, #14d0b6, #0ed4d6);
  height: 35px;
  display: flex;
  align-items: center;
  width: 60%;
  border-bottom-right-radius: 50px;
  border-top-right-radius: 50px;
}

.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
.all {
  width: 7.5rem;
  height: 1rem;
  background-color: blue;
}
.all:after {
  display: block;
  content: "";
  clear: both;
}
.left {
  float: left;
  width: 3rem;
  height: 1rem;
  background-color: red;
}

.right {
  float: left;
  width: 4.5rem;
  height: 1rem;
  background-color: green;
}
</style>
