<template>
  <div>
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-icon type="brush" style="float:right" size="20" color="white" @click="handleModify" />
            <i-avatar size="avatar" :src="photo" @click="handlePreview(photo)"/>
            <i-avatar style="position:absolute;top:77px;left:22%;" size="mini" v-if="sex == 1" src="../../../static/images/boy.png" />
            <i-avatar style="position:absolute;top:77px;left:22%;" size="mini" v-else-if="sex == 2" src="../../../static/images/girl.png" />
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">{{ name }}</p>
            <p style="font-size:12px;color:white;line-height:25px;">
              {{ universityCampusName }}
            </p>
            <span style="font-size:11px;color:white;">{{ createTime }}(加入)</span>
          </i-col>
          <i-col span="9">
            <p style="fong-size:12px;color:white;">ID:</p>
            <p style="fong-size:12px;color:white;">{{ userId }}</p>
            <p style="font-size:12px;color:white;line-height:25px;">积分:{{ credit }}</p>
            <br />
            <i-tag class="i-tags" type="border" color="green">校内登录{{ inCampusCount }}次</i-tag>
            <br />
            <i-tag class="i-tags" type="border" color="black">校外登录{{ outCampusCount }}次</i-tag>
          </i-col>
        </i-row>
      </div>
      <div style="margin:10px;">
        <p style="font-size:12px;color:white;">简介：{{ description ? description : "无简介" }}</p>
      </div>
      <div style="margin-top:5px;text-align:center;">
        <i-card title="收益列表">
          <view slot="content">
            <i-row>
              <i-col span="7" @click="handleProfit('group')">
                <p style="font-size:16px;">{{ profit.lastWeekGroupMoney }}</p>
                <i-avatar
                  size="mini"
                  src="../../../static/images/interest.png"
                />
                <span style="font-size:9px;">上周兴趣组收益</span>
              </i-col>
              <i-col span="7" offset="1" @click="handleProfit('post')">
                <p style="font-size:16px;">{{ profit.lastWeekPostMoney }}</p>
                <i-avatar
                  size="mini"
                  src="../../../static/images/post.png"
                />
                <span style="font-size:9px;">上周发帖收益</span>
              </i-col>
              <i-col span="7" offset="1" @click="handleProfit('share')">
                <p style="font-size:16px;">{{ profit.lastWeekShareMoney }}</p>
                <i-avatar
                  size="mini"
                  src="../../../static/images/shareRecord.png"
                />
                <span style="font-size:9px;">上周分享收益</span>
              </i-col>
            </i-row>
          </view>
        </i-card>
      </div>
    </div>

    <div style="margin-top:5px;">
      <i-cell-group>
        <i-cell title="积分动态" is-link :url="'../myPages/integralRecord/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/score.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="兑换记录" is-link :url="'../myPages/exchangeRecord/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/exchange.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="我的发帖" is-link :url="'../myPages/post/main?userId=' + userId + '&selfUserId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/post.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="分享记录" is-link :url="'../myPages/shareRecord/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/shareRecord.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="设置" is-link :url="'../myPages/setting/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/setting.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="分享校趣">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/shareLink.png"
              style="margin-right:10px;"
            />
          </view>
          <view slot="footer">
            <button open-type="share" style="background-color:white'">
              <i-icon type="share_fill"/>
            </button>
          </view>
        </i-cell>
        <i-cell title="反馈" is-link :url="'../myPages/asking/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/asking.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="校趣规则" is-link :url="'../myPages/rule/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/rule.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
      </i-cell-group>
    </div>

    <mp-dialog
      :title="stopDay === -2 ? '违规被举报，此号暂停使用14天，下次违规封号处理' : '严重违规，此号已被封号'"
      :show="visible"
      @confirm="() => visible = false"
    >
    </mp-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      createTime: "",
      credit: undefined,
      description: "",
      userId: undefined,
      inCampusCount: undefined,
      modifyUniversity: undefined,
      name: "",
      outCampusCount: undefined,
      photo: "",
      sex: undefined,
      stopDay: undefined,
      universityCampusId: undefined,
      universityCampusName: "",
      visible: false,
      university: "",
      latitude: undefined,
      longitude: undefined,
      profit: {
        createTime: "",
        id: undefined,
        lastWeekGroupMoney: 0.00,
        lastWeekPostMoney: 0.00,
        lastWeekShareMoney: 0.00
      }
    }
  },
  onShow() {
    this.userId = this.globalData.userId;
    if(this.globalData.userType == 3){
      //商家
      wx.showToast({
        title: "商家无法进行其他操作",
        icon: "none",
        duration: 3000
      });
      setTimeout(() => {
        wx.navigateTo({
          url: "../indexPages/merchant/main"
        });
      }, 1500);
    }else if(this.globalData.isCheckUniversity === 0){
      //首次登录校趣，输入校区，授权信息，并完善个人信息
      wx.showToast({
        title: "首次登录，请在本人的大学校园内登陆校趣完成在校认证 或 输入邀请码 ",
        icon: "none",
        duration: 3000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: "../index/main"
            });
          },3000);
        }
      });
    }else if(this.globalData.status == -3) {
      // 注销
      wx.showToast({
        title: "账号已注销",
        icon: "none",
        duration: 3000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: "../index/main"
            });
          },3000);
        }
      });
    }else{
      //不是首次登录，获取兴趣组列表
      this.getUserInfo();
      this.getLastWeekMoney();
      this.updateBadge();
    }

    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          that.$wxhttp.post({
            url: "/admin/wxAdminLogin?code=" + res.code
          });
        }
      }
    });
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣",
      path: "/pages/index/main?shareUserId=" + this.userId
    }
  },
  methods: {
    updateBadge() {
      this.$wxhttp.unloadGet({
        url: "/message/unreadNumber?userId=" + this.userId
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
    getUserInfo() {
      if(this)
      //获取用户详细信息
      this.$wxhttp.get({
        url: "/user/getUserDetailById?userId=" + this.userId
      }).then(resp => {
        if(resp.code === 0){
          this.createTime = this.$moment(resp.data.createTime).format("YYYY-MM-DD");
          this.credit = resp.data.credit;
          this.description = resp.data.description;
          this.inCampusCount = resp.data.inCampusCount;
          this.modifyUniversity = resp.data.modifyUniversity;
          this.name = resp.data.name;
          this.outCampusCount = resp.data.outCampusCount;
          this.photo = resp.data.photo;
          this.sex = resp.data.sex;
          this.stopDay = resp.data.stopDay;
          this.universityCampusId = resp.data.universityCampusId;
          this.universityCampusName = resp.data.universityCampusName;
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
    },
    getLastWeekMoney() {
      // 获取上周收益
      this.$wxhttp.get({
        url: "/money/getLastWeekMoney?userId=" + this.userId
      }).then(resp => {
        if(resp.code == 0){
          this.profit = {
            createTime: resp.data.createTime,
            id: resp.data.id,
            lastWeekGroupMoney: resp.data.lastWeekGroupMoney,
            lastWeekPostMoney: resp.data.lastWeekPostMoney,
            lastWeekShareMoney: resp.data.lastWeekShareMoney
          };
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      })
    },
    handleModify() {
      wx.navigateTo({
        url: "../myPages/modify/main?userId=" + this.userId
      });
    },
    handleProfit(type) {
      if(type == 'share') {
        wx.navigateTo({
          url: "../myPages/shareProfit/main?userId=" + this.userId
        });
      }else if(type == 'group') {
        wx.navigateTo({
          url: "../myPages/groupProfit/main?userId=" + this.userId
        });
      }else{
        wx.navigateTo({
          url: "../myPages/postProfit/main?userId=" + this.userId
        });
      }
    },
    handlePreview(url) {
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
      });
    }
  }
}
</script>

<style>
.head {
  align-items: center;
  padding: 5px;
  background-image: linear-gradient(to bottom, #14d0b6, #0ed4d6);
  text-align: center;
  vertical-align: middle;
}
button::after{
  border: none;
}
</style>