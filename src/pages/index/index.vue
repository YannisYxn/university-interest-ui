<template>
  <div>
    <div class="head">
      <i-input
        v-model="searchKey"
        placeholder="请在这里搜索"
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
        @click="handleClearSearch"
      />
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
      <span style="margin:5px;color:#ffffff">{{ barTitle }}</span>
    </div>

    <!-- 兴趣组列表 -->
    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell
          v-for="group in groupList"
          v-show="group.status === 0 || (group.userId === userInfo.userId && [-1,3].includes(group.status))"
          :key="group.id"
          :title="group.name"
          @click="handleInterestGroup(group.id)"
        >
          <view slot="icon">
            <i-avatar :src="group.logo"></i-avatar>
          </view>
          <view slot="badge">
            <i-icon
              v-if="(group.userId === userInfo.userId && group.status === -1)"
              type="warning_fill"
              size="25"
              color="#67ddd3"
              @click="showToast(msg)"
            />
            <i-icon
              v-else-if="(group.userId === userInfo.userId && group.status === 3)"
              type="lock_fill"
              size="25"
              color="#67ddd3"
              @click="showToast(msg)"
            />
            <!-- <i-badge v-else :count="group.postCount" overflow-count="100" style="margin-right:10px;" /> -->
            <div v-else style="margin-right:10px;">
              <i-icon size="25" type="barrage_fill" color="#67ddd3"/>
              <span style="color:#67ddd3;">{{ group.postCount }}</span>
            </div>
          </view>
          <view slot="footer">
            <i-icon
              v-if="group.userId === userInfo.userId"
              type="setup_fill"
              size="25"
              color="#67ddd3"
              @click="handleManageInterestGroup(group.id)"
            />
          </view>
        </i-cell>
      </i-cell-group>
    </div>

    <!-- 帖子列表 -->
    <div v-for="post in postList" :key="post.id" style="margin-top:15px;">
      <i-card
        post
        :postTitle="post.userName"
        :time="post.createTime"
        :thumb="post.userPhoto"
        :university="post.universityCampusName"
        :userId="post.userId"
        @clickTitle="handlePersonalPage"
      >
        <view slot="content">
          <span style="font-size:large;line-height:1.5;">{{ post.content }}</span>
          <div v-if="post.img" style="display:flex;width:240px;text-align:center;">
            <image :src="post.img" mode="widthFix" style="max-width:100%;" @click="handlePreview(post.img)"/>
          </div>
        </view>
        <view slot="footer">
          <div style="text-align:center;margin-top:10px;">
            <i-row>
              <i-col span="24">
                <div @click="handleComment(post.id)">
                  <i-icon size="30" type="message" />
                  <span
                    v-if="post.commentCount"
                    style="font-size:15px;vertical-align:middle;"
                  >{{ post.commentCount }}</span>
                </div>
              </i-col>
              <!-- <i-col span="12">
                <i-icon size="30" type="dislike" />
                <span style="font-size=50px;">5566</span>
              </i-col>-->
            </i-row>
          </div>
        </view>
      </i-card>
    </div>

    <div style="margin-top: 20px;">
      <i-load-more v-if="groupList.length === 0 && postList.length === 0" tip="无相关的兴趣组或帖子" :loading="false" />
      <i-load-more v-else :loading="false" />
    </div>

    <!-- 弹窗列表 -->
    <!-- <i-modal title="提示" :visible="visible2" @ok="handleUserInfo" @cancel="handleClose2">
      <p style="font-size:15px;line-height:20px;margin:0 20px;">请简单完善个人资料后，再建组，发帖，回复等操作。谢谢。</p>
      <div style="display:flex;align-items:center;margin-left:20px;">
        性别：
        <i-radio-group :current="userInfo.gender" @change="handleGenderChange">
          <i-radio v-for="item in gender" :key="item.id" :value="item.id" :label="item.name"></i-radio>
        </i-radio-group>
      </div>
      <div style="display:flex;align-items:center;margin-left:20px;">
        昵称：
        <i-input v-model="userInfo.nickName" mode="wrapped" placeholder="原微信昵称" />
      </div>
      <div style="display:flex;align-items:center;margin-left:20px;">
        简介：
        <div style="width:82%">
          <i-input
            v-model="userInfo.introduction"
            type="textarea"
            mode="wrapped"
            placeholder="限25个字"
            maxlength="25"
          />
        </div>
      </div>
      <div style="display:flex;align-items:center;margin-left:20px;">
        <i-avatar :src="userInfo.avatarUrl">头</i-avatar>
        <span style="line-height:20px;">（可修改,上传不雅头像,会被封号）</span>
      </div>
    </i-modal> -->
    <!-- <i-modal title="提示" :visible="visible3" @ok="handleClose3" @cancel="handleClose3">
      <p style="font-size:15px;line-height:20px;margin:0 20px;">请您在本校地理范围登录校趣！</p>
      <p style="font-size:15px;line-height:20px;margin:0 20px;">或</p>
      <span style="font-size:15px;line-height:20px;margin:0 20px;">输入邀请码：</span>
      <i-input v-model="invitationCode" mode="wrapped" placeholder="请在这里输入" @change="handleInvitationCodeChange"/>
    </i-modal> -->
    <mp-dialog
      title="提示"
      :show="visible3"
      :buttons="[{text: '取消'}]"
      @buttontap="handleClose3"
      @confirm="handleInvitationCode"
    >
      <p style="font-size:15px;line-height:20px;margin:0 20px;">首次登陆校趣需要在本人的大学校园范围内呦！</p>
      <p style="font-size:15px;line-height:20px;margin:0 20px;">或</p>
      <span style="font-size:15px;line-height:20px;margin:0 20px;">输入邀请码：</span>
      <i-input :value="invitationCode" mode="wrapped" maxlength="10" placeholder="请在这里输入" @change="handleInvitationCodeChange"/>
    </mp-dialog>
    <!-- <i-modal title="欢迎首次进入校趣" :visible="visible1" @ok="handleClose1" @cancel="handleClose1">
      <p style="font-size:15px;line-height:20px;margin:0 20px;">您是厦门大学思明校区的学生吗？不是的话，请在本校校区时登录校趣。谢谢。</p>
      <p style="font-size:10px;">提示：冒用ta人校区，被举报，会封号。</p>
    </i-modal> -->
    <mp-dialog
      title="欢迎首次进入校趣"
      :show="visible1"
      :buttons="[{text: '取消'}]"
      @buttontap="handleClose1"
      @confirm="handleClose1"
    >
      <p style="font-size:15px;line-height:20px;margin:0 20px;">您是厦门大学思明校区的学生吗？不是的话，请在本校校区时登录校趣。谢谢。</p>
      <p style="font-size:10px;">提示：冒用ta人校区，被举报，会封号。</p>
    </mp-dialog>
    <!-- <i-modal
      title="请输入就读高校"
      :visible="visible4"
      @ok="handleOnUniversity"
      @cancel="handleClose4"
      openType="getUserInfo"
      @getUserInfo="getUserInfo"
    >
      <i-input
        v-model="university"
        maxlength="10"
        placeholder="学校名称"
        @change="handleUniversityChange"
      />
    </i-modal> -->
    <mp-dialog
      title="请确认校区"
      :show="visible4"
      :buttons="[{text: '取消'}]"
      openType="getUserInfo"
      @buttontap="handleClose4"
      @confirm="getUserInfo"
    >
      <i-input
        v-model="universityCampusName"
        maxlength="10"
        placeholder="暂无检测到学校"
        disabled
      />
    </mp-dialog>
    <mp-dialog
      title="是否订阅校趣消息"
      :show="visibleMessage"
      :buttons="[{text: '取消'}]"
      @buttontap="() => visibleMessage = false"
      @confirm="handleSubscriptions"
    >
    </mp-dialog>
  </div>
</template>

<script>
import getQuery from '../../utils/getPage';
export default {
  data() {
    return {
      visible1: false,
      // visible2: false,
      visible3: false,
      visible4: false,
      visibleMessage: false,
      universityCampusName: "", //输入高校名称
      userInfo: { //用户信息
        userId: "",
        isCheckUniversity: "",  //是否确认过学校
        avatarUrl: "",
        gender: undefined,
        nickName: "",
        introduction: "",
        universityId: undefined,  //认证学校id
        universityName: "",
        universityCampusId: undefined //认证校区id
      },
      latitude: undefined, //纬度，范围为 -90~90，负数表示南纬
      longitude: undefined,  //经度，范围为 -180~180，负数表示西经
      groupList: [],  //兴趣组列表
      postList: [], //帖子列表
      gender: [
        {
          id: 1,
          name: "男"
        },
        {
          id: 2,
          name: "女"
        }
      ],
      searchKey: "", //搜索框内容
      barTitle: "我创建及加入的兴趣组",
      invitationCode: "",
      shareUserId: undefined,
      isChecked: false
    };
  },
  onShow() {
    if(this.searchKey){
      this.handleClearSearch();
    }
    if(this.userInfo.isCheckUniversity === 0){
      //首次登录校趣，输入校区，授权信息，并完善个人信息
      this.handleOnUniversity();
    }else if(this.userInfo.userId){
      this.getGroupList();
    }
  },
  onLoad(options) {
    if(getQuery.getQuery().shareUserId){
      this.shareUserId = getQuery.getQuery().shareUserId;
    }
    var that = this;
    wx.showLoading({
      title: '加载中' // 数据请求前loading
    });
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          that.$wxhttp.post({
            url: "/user/login",
            data: {
              code: res.code,
              shareUserId: that.shareUserId
            }
          }).then(resp => {
            if(resp.code === 0){
              that.userInfo.userId = resp.data.id;
              // 绑定校区信息
              that.userInfo.universityId = resp.data.universityId;
              that.userInfo.universityName = resp.data.universityName;
              that.userInfo.universityCampusId = resp.data.universityCampusId;
              that.userInfo.isCheckUniversity = resp.data.isCheckUniversity;
              if(resp.data.isCheckUniversity === 0){
                //首次登录校趣，输入校区，授权信息，并完善个人信息
                // that.visible4 = true;
                that.handleOnUniversity();
              }else{
                //不是首次登录，获取兴趣组列表
                that.getGroupList();
                that.handleLoginLocation();
                that.isChecked = true;
              }
              that.updateBadge();
            }else{
              wx.showToast({
                title: resp.msg,
                icon: 'none'
              });
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
          wx.showToast({
            title: "登录失败",
            icon: 'none'
          });
        }
      }
    });

    // 全局定时，获取有信未读消息数
    // setInterval(() => {
    //   this.updateBadge();
    // }, 10000)
    this.checkSubscriptions();
  },
  methods: {
    updateBadge() {
      this.$wxhttp.unloadGet({
        url: "/message/unreadNumber?userId=" + this.userInfo.userId
      }).then(resp2 => {
        if(resp2.code == 0){
          if(resp2.data !== 0){
            wx.setTabBarBadge({
              index: 1,
              text: String(resp2.data)
            });
          }
        }
      });
    },
    handleToCityUniversity() {
      wx.navigateTo({
        url: "../indexPages/cityUniversityList/main?userId=" + this.userInfo.userId
      });
    },
    handleCreateGroup() {
      if(this.userInfo.isCheckUniversity === 0){
        //未确认过学校不可创建兴趣组
        wx.showToast({
          title: '未认证学校不可创建兴趣组'
        });
      }else{
        //确认过学校跳转创建兴趣组页面
        wx.navigateTo({
          url: "../indexPages/createGroup/main?userId=" + this.userInfo.userId
        });
      }
    },
    handleSelfUniversityInterestGroup() {
      if(this.isChecked){
        wx.navigateTo({
          url: 
            "../indexPages/selfUniversityInterestGroup/main?userId=" + 
            this.userInfo.userId + 
            "&universityId=" + 
            this.userInfo.universityId + 
            "&universityName=" + 
            this.userInfo.universityName
        });
      }
    },
    handleInterestGroup(groupId) {
      wx.navigateTo({
        url: "../indexPages/interestGroup/main?groupId=" + groupId + "&userId=" + this.userInfo.userId
      });
    },
    handleManageInterestGroup(groupId) {
      wx.navigateTo({
        url: "../indexPages/manageInterestGroup/main?groupId=" + groupId + "&userId=" + this.userInfo.userId
      });
    },
    handleClose1() {
      this.visible1 = false;
    },
    // handleClose2() {
    //   this.visible2 = false;
    // },
    handleClose3() {
      this.visible3 = false;
    },
    handleClose4() {
      // 确认校区时点否出现提示
      this.visible4 = false;
      wx.showToast({
        title: "请在本学校范围时登录",
        icon: "none"
      });
    },
    getUserInfo(detail) {
      this.visible4 = false;
      if(this.userInfo.universityName){
        this.$wxhttp.post({
          url: "/user/confirmUniversityCampus?userId=" + this.userInfo.userId + "&universityCampusId=" + this.userInfo.universityCampusId
        }).then(resp => {
          if(resp.code == 0){
            this.isChecked = true;
            var that = this;
            wx.getUserInfo({
              success(res) {
                that.userInfo = {
                  ...that.userInfo,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender,
                  nickName: res.userInfo.nickName
                };
                that.uploadUserInfoFirstTime();
                that.handleLoginLocation();
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
    },
    handleOnUniversity() {
      // 查找是否授权地理位置，未授权则要求用户授权地理位置
      var that = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success () {
                // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
                wx.getLocation({
                  type: 'gcj02',
                  success (res) {
                    that.isOnUniversity(res.latitude,res.longitude);
                  }
                });
              }
            })
          }else{
            // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
            wx.getLocation({
              type: 'gcj02',
              success (res) {
                that.isOnUniversity(res.latitude,res.longitude);
              }
            });
          }
        }
      });
    },
    handleGenderChange(current) {
      this.userInfo.gender = current.target.value;
    },
    handleUserInfo() {
      //完善个人信息
      if(this.userInfo.gender === undefined){
        wx.showToast({
          title: "性别不可为空"
        });
      }else if(this.userInfo.nickName === ""){
        wx.showToast({
          title: "昵称不可为空"
        });
      }else if(this.userInfo.avatarUrl === ""){
        wx.showToast({
          title: "请上传头像"
        });
      }else{
        this.$wxhttp.post({
          url: "/user/firstUploadUserInfo",
          data: {
            id: this.userInfo.userId,
            name: this.userInfo.nickName,
            photo: this.userInfo.avatarUrl,
            sex: this.userInfo.gender,
            description: this.userInfo.introduction
          }
        }).then(resp => {
          if(resp.code !== 0){
            wx.showToast({
              title: resp.msg
            });
          }
        })
      }
    },
    isOnUniversity(latitude,longitude) {
      // 判断当前位置是否处于校内
      var that = this;
      this.$wxhttp.post({
        url: "/user/onUniversity",
        data: {
          latitude: latitude,
          longitude: longitude,
          // universityName: this.university,
          userId: this.userInfo.userId
        }
      }).then(resp => {
        if(resp.code === 0){
          // 成功在校内登录
          this.userInfo.isCheckUniversity = 1;
          this.universityCampusName = resp.data.universityCampusName;
          this.userInfo.universityCampusName = resp.data.universityCampusName;
          this.userInfo.universityId = resp.data.universityId;
          this.userInfo.universityName = resp.data.universityName;
          this.userInfo.universityCampusId = resp.data.universityCampusId;
          this.visible4 = true; //确认校区
        }else if(resp.code === 4){
          //不在学校范围内
          this.visible4 = false;
          this.visible3 = true;
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    uploadUserInfoFirstTime() {
      // 首次上传用户信息
      this.$wxhttp.post({
        url: "/user/firstUploadUserInfo",
        data: {
          description: this.userInfo.introduction,
          id: this.userInfo.userId,
          name: this.userInfo.nickName,
          photo: this.userInfo.avatarUrl,
          sex: this.userInfo.gender
        }
      }).then(resp => {
        if(resp.code === 0){
          this.getGroupList();
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    handleUniversityChange(event){
      this.university = event.mp.detail.detail.value;
    },
    handleSearchChange(event){
      this.searchKey = event.mp.detail.detail.value;
    },
    handleInvitationCodeChange(event){
      this.invitationCode = event.mp.detail.detail.value;
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
    handleSearch() {
      //首页搜索框，搜索兴趣组与相关帖子
      if(this.searchKey === ""){
        //未输入搜索内容
        wx.showToast({
          title: '搜索内容为空',
          icon: 'none'
        });
      }else{
        this.$wxhttp.post({
          url: "/group/search",
          data: {
            searchKey: this.searchKey,
            universityCampusId: this.userInfo.universityCampusId
          }
        }).then(resp => {
          if(resp.code === 0){
            this.barTitle = "相关的兴趣组与帖子";
            this.groupList = resp.data.groupList;
            this.postList = resp.data.postList.map(item => {
              return {
                ...item,
                createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm:SS")
              }
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: 'none'
            })
          }
        });
      }
    },
    handleClearSearch() {
      this.getGroupList();
      this.searchKey = "";
      this.postList = [];
      this.barTitle = "我创建及加入的兴趣组"
    },
    handleComment(postId) {
      wx.navigateTo({
        url: "../indexPages/comment/main?userId=" + this.userInfo.userId + "&postId=" + postId
      });
    },
    showToast(msg) {
      wx.showToast({
        title: msg,
        icon: "none"
      });
    },
    handleInvitationCode() {
      this.visible3 = false;
      if(this.invitationCode !== ""){
        this.$wxhttp.post({
          url: "/user/checkInivitationCode",
          data: {
            code: this.invitationCode,
            userId: this.userInfo.userId
          }
        }).then(resp => {
          if(resp.code === 0){
            // 完善商家信息
            wx.getUserInfo({
              success(res) {
                that.userInfo = {
                  ...that.userInfo,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender,
                  nickName: res.userInfo.nickName
                };
                that.uploadUserInfoFirstTime();
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
    },
    handleLoginLocation() {
      // 查找是否授权地理位置，未授权则要求用户授权地理位置
      var that = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success () {
                // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
                wx.getLocation({
                  type: 'gcj02',
                  success (res) {
                    that.saveLoginLocation(res.latitude,res.longitude);
                  }
                });
              }
            })
          }else{
            // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
            wx.getLocation({
              type: 'gcj02',
              success (res) {
                that.saveLoginLocation(res.latitude,res.longitude);
              }
            });
          }
        }
      });
      
    },
    saveLoginLocation(latitude, longitude) {
      this.$wxhttp.post({
        url: "/user/saveLoginLocation",
        data: {
          latitude: latitude,
          longitude: longitude,
          userId: this.userInfo.userId
        }
      }).then(resp => {
        if(resp.code != 0){
          wx.showToast({
            title: resp,msg,
            icon: "none"
          });
        }
      });
    },
    handlePersonalPage(e) {
      // console.log(e.mp.detail)
      wx.navigateTo({
        url: "../myPages/post/main?userId=" + e.mp.detail + "&selfUserId=" + this.userInfo.userId
      });
    },
    checkSubscriptions() {
      // 订阅消息
      var that = this;
      wx.getSetting({
        withSubscriptions: true,
        success(res) {
          if (!res.subscriptionsSetting['mainSwitch'] || 
            !res.subscriptionsSetting['QMyzhlEEfg40tA6TL1v5OXVKVMp1WwZ6lW2xHwItNLM'] ||
            res.subscriptionsSetting['QMyzhlEEfg40tA6TL1v5OXVKVMp1WwZ6lW2xHwItNLM'] !== 'accept') {
              that.visibleMessage = true;
          }
        }
      });
    },
    handleSubscriptions() {
      var that = this;
      wx.requestSubscribeMessage({
        tmplIds: ['QMyzhlEEfg40tA6TL1v5OXVKVMp1WwZ6lW2xHwItNLM'],
        success(res) {
          that.visibleMessage = false;
          wx.showToast({
            title: "订阅成功"
          });
        },
        fail(res) {
          console.log(res)
          that.visibleMessage = false;
          wx.showToast({
            title: "订阅失败",
            icon: "none"
          });
        }
      });
    },
    handlePreview(url) {
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
      });
    }
  },

  created() {
    // let app = getApp()
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + this.userInfo.userId
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
