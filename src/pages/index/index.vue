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
        thumb="../../../static/images/tongcheng.jpg"
      >
        <view slot="footer">更多兴趣小组 都在这里</view>
      </i-card>
      <i-card v-if="createGroupCount < 2" @click="handleCreateGroup" title="创建">
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
              <div style="width:50px;">
                <i-icon size="25" type="barrage_fill" color="#67ddd3"/>
                <span style="color:#67ddd3;float:right;">{{ group.postCount > 999 ? '999+' : group.postCount }}</span>
              </div>
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
          <span style="font-size:inherit;line-height:1.5;" v-html="post.content">{{  }}</span>
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
      <br />
      <p style="font-size:15px;line-height:20px;margin:0 20px;color:#14d0b6" @click="() => visibleUniversityRequire = true">校区反馈</p>
    </mp-dialog>
    <mp-dialog
      title="欢迎首次进入校趣"
      :show="visible1"
      :buttons="[{text: '取消'},{text: '校区反馈'}]"
      @buttontap="handleClose1"
      @confirm="() => visible1 = false"
    >
      <p style="font-size:15px;line-height:20px;margin:0 20px;">您是厦门大学思明校区的学生吗？不是的话，请在本校校区时登录校趣。谢谢。</p>
      <p style="font-size:10px;">提示：冒用ta人校区，被举报，会封号。</p>
    </mp-dialog>
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
      title="校区反馈"
      :show="visibleUniversityRequire"
      :buttons="[{text: '取消'}]"
      @buttontap="() => visibleUniversityRequire = false"
      @confirm="handleUniversityRequire"
    >
      <i-input
        v-model="requireUniversityName"
        maxlength="10"
        placeholder="学校名字"
        @change="handleUniveristyNameChange"
      />
      <i-input
        v-model="requireUniveristyCampusName"
        maxlength="10"
        placeholder="校区名字"
        @change="handleUniveristyCampusNameChange"
      />
      <br />
      <p style="font-size:13px;line-height:20px;margin:0 20px;">如果您在本大学的校园内，请在这里写下您的学校及校区名称，我们及时处理定位问题，谢谢</p>
    </mp-dialog>
    <mp-dialog
      title="是否订阅校趣消息"
      :show="visibleMessage"
      :buttons="[{text: '取消'}]"
      @buttontap="() => visibleMessage = false"
      @confirm="handleSubscriptions"
    >
    </mp-dialog>
    <mp-dialog
      title="账号已注销"
      :show="visibleLogout"
    >
      <span>此账号已注销，不可再次登录校趣，不可进行任何操作</span>
    </mp-dialog>

    <mp-dialog
      :title="stopDay === -2 ? '被举报，此号暂停使用' : '严重违规，此号已被封号'"
      :show="visible"
      @confirm="() => visible = false"
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
      visibleUniversityRequire: false,
      visibleLogout: false,
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
        universityCampusId: undefined, //认证校区id
        status: undefined
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
      isChecked: false,
      requireUniversityName: "",
      requireUniveristyCampusName: "",
      createGroupCount: 0,
      stopDay: 0,
      visible: false
    };
  },
  onShow() {
    if(this.searchKey){
      this.handleClearSearch();
    }
    if(this.globalData.userType == 3){
      //商家
      wx.navigateTo({
        url: "../indexPages/merchant/main"
      });
    }else if(this.userInfo.status == -3){
      this.visibleLogout = true;
    }else if(this.userInfo.isCheckUniversity === 0){
      //首次登录校趣，输入校区，授权信息，并完善个人信息
      this.handleOnUniversity();
    }else if(this.userInfo.userId){
      this.getGroupList();
    }
    this.createGroupCount = this.globalData.createGroupCount;
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
              that.userInfo.status = resp.data.status;
              that.createGroupCount = resp.data.createGroupCount;
              that.globalData.userId = resp.data.id;
              that.globalData.universityId = resp.data.universityId;
              that.globalData.universityName = resp.data.universityName;
              that.globalData.universityCampusId = resp.data.universityCampusId;
              that.globalData.isCheckUniversity = resp.data.isCheckUniversity;
              that.globalData.status = resp.data.status;
              that.globalData.isPerfectInfo = resp.data.isPerfectInfo;  //是否完善信息
              that.globalData.userType = resp.data.type;
              that.globalData.createGroupCount = resp.data.createGroupCount;
              if(resp.data.type == 3){
                wx.navigateTo({
                  url: "../indexPages/merchant/main?userId=" +  resp.data.id
                });
              }else if(resp.data.status == -3){
                that.visibleLogout = true;
              }else{
                if(resp.data.isCheckUniversity === 0){
                  //首次登录校趣，输入校区，授权信息，并完善个人信息
                  // that.visible4 = true;
                  that.handleOnUniversity();
                }else{
                  //不是首次登录，获取兴趣组列表
                  that.getUserStatus();
                  that.getGroupList();
                  that.handleLoginLocation();
                  that.isChecked = true;
                }
                that.updateBadge();
              }
            }else{
              wx.showToast({
                title: resp.msg,
                icon: 'none',
                duration: 3000
              });
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
          wx.showToast({
            title: "登录失败",
            icon: 'none',
            duration: 3000
          });
        }
      }
    });

    // 全局定时，获取有信未读消息数
    // setInterval(() => {
    //   this.updateBadge();
    // }, 10000)
    // this.checkSubscriptions();
  },
  methods: {
    updateBadge() {
      this.$wxhttp.unloadGet({
        url: "/message/unreadNumber?userId=" + this.userInfo.userId
      }).then(resp2 => {
        if(resp2.code == 0){
          if(resp2.data !== 0){
            wx.showTabBarRedDot({
              index: 1
            });
          }else{
            wx.hideTabBarRedDot({
              index: 1
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
          title: '未认证学校不可创建兴趣组',
          icon: "none",
          duration: 3000
        });
      }else if(this.globalData.isPerfectInfo == 0) {
        //未完善信息不可创建
        wx.showToast({
          title: "请先在[我的]页面完善头像昵称",
          icon: "none",
          duration: 3000
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
    handleClose1(e) {
      if(e.target.index == 0){
        // 点击取消
        this.visible1 = false;
      }else{
        // 校区反馈
        this.visibleUniversityRequire = true;
      }
    },
    // handleClose2() {
    //   this.visible2 = false;
    // },
    handleClose3() {
      this.visible3 = false;
      // 完善信息
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
        }
      });
    },
    handleClose4() {
      // 确认校区时点否出现提示
      this.visible4 = false;
      wx.showToast({
        title: "请在本学校范围时登录",
        icon: "none",
        duration: 3000,
        success: () => {
          setTimeout(() => {
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
              }
            });
          }, 3000)
        }
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
            this.globalData.isCheckUniversity = 1;
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
              icon: "none",
              duration: 3000
            });
          }
        });
      }else{
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
          // this.userInfo.isCheckUniversity = 1;
          this.universityCampusName = resp.data.universityCampusName;
          this.userInfo.universityCampusName = resp.data.universityCampusName;
          this.userInfo.universityId = resp.data.universityId;
          this.userInfo.universityName = resp.data.universityName;
          this.userInfo.universityCampusId = resp.data.universityCampusId;
          this.globalData.userType = 1;
          this.visible4 = true; //确认校区
        }else if(resp.code === 4){
          //不在学校范围内
          wx.showToast({
            title: "在校园边缘的时候，首次登录建议在室外宽阔的地方",
            icon: "none",
            duration: 3000,
            success: () => {
              setTimeout(() => {
                this.visible4 = false;
                this.visible3 = true;
              }, 3000);
            }
          });
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none",
            duration: 3000
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
          this.globalData.isPerfectInfo = 1;
          this.getGroupList();
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none",
            duration: 3000
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
          icon: 'none',
          duration: 3000
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
                createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm")
              }
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: 'none',
              duration: 3000
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
        icon: "none",
        duration: 3000
      });
    },
    handleInvitationCode() {
      this.visible3 = false;
      // 完善商家信息
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
        }
      });
      if(this.invitationCode !== ""){
        this.$wxhttp.post({
          url: "/user/checkInivitationCode",
          data: {
            code: this.invitationCode,
            userId: this.userInfo.userId
          }
        }).then(resp => {
          if(resp.code === 0){
            this.globalData.userType = resp.data;
            wx.navigateTo({
              url: "../indexPages/merchant/main?userId=" + this.userInfo.userId
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none",
              duration: 3000
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
            icon: "none",
            duration: 3000
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
          // 保持每次都访问一遍
          // that.visibleMessage = true;
          if (!res.subscriptionsSetting['mainSwitch'] || 
            !res.subscriptionsSetting['PZ8DIZXPMO62AMyS7N7yth3sHReBcO1FOQHHPChQQVk'] ||
            res.subscriptionsSetting['PZ8DIZXPMO62AMyS7N7yth3sHReBcO1FOQHHPChQQVk'] !== 'accept') {
              that.visibleMessage = true;
          }
        }
      });
    },
    handleSubscriptions() {
      var that = this;
      wx.requestSubscribeMessage({
        tmplIds: ['PZ8DIZXPMO62AMyS7N7yth3sHReBcO1FOQHHPChQQVk'],
        success(res) {
          that.visibleMessage = false;
          wx.showToast({
            title: "订阅成功",
            duration: 3000
          });
        },
        fail(res) {
          console.log(res)
          that.visibleMessage = false;
          wx.showToast({
            title: "订阅失败",
            icon: "none",
            duration: 3000
          });
        }
      });
    },
    handlePreview(url) {
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
      });
    },
    handleUniversityRequire() {
      if(this.requireUniversityName === ""){
        wx.showToast({
          title: "学校名字不可为空",
          icon: "none",
          duration: 3000
        });
      }else{
        this.visibleUniversityRequire = false;
        this.$wxhttp.post({
          url: "/manage/require",
          data: {
            content: "学校反馈：学校名字[" + this.requireUniversityName + "]  校区名字[" + this.requireUniveristyCampusName + "]",
            userId: this.userInfo.userId
          }
        }).then(resp => {
          if(resp.code === 0){
            wx.showToast({
              title: "提交诉求成功",
              duration: 3000
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none",
              duration: 3000
            });
          }
        })
      }
    },
    handleUniveristyNameChange(event) {
      this.requireUniversityName = event.mp.detail.detail.value;
    },
    handleUniveristyCampusNameChange(event) {
      this.requireUniveristyCampusName = event.mp.detail.detail.value;
    },
    getUserStatus() {
      //获取用户详细信息
      this.$wxhttp.get({
        url: "/user/getUserDetailById?userId=" + this.userInfo.userId
      }).then(resp => {
        if(resp.code === 0){
          this.stopDay = resp.data.stopDay;
          if(this.stopDay !== 0){
            this.visible = true;
          }
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
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
