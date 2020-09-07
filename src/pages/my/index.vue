<template>
  <div>
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-avatar size="avatar" :src="photo" />
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">{{ name }}</p>
            <p style="font-size:12px;color:white;line-height:25px;">
              {{ universityCampusName }}
              <i-tag style="color:#07a68e;">升学</i-tag>
            </p>
            <span style="font-size:11px;color:white;">{{ createTime }}(加入)</span>
            <i-tag class="i-tags" type="border" color="green">校内登录{{ inCampusCount }}次</i-tag>
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">ID:</p>
            <p style="fong-size:15px;color:white;">{{ userId }}</p>
            <p style="font-size:12px;color:white;line-height:25px;">积分:{{ credit }}</p>
            <i-icon type="brush" size="15" color="white" @click="handleModify" />
            <br />
            <i-tag class="i-tags" type="border" color="red">校外登录{{ outCampusCount }}次</i-tag>
          </i-col>
        </i-row>
      </div>
      <div style="margin:10px;">
        <p style="font-size:12px;color:white;">简介：{{ description ? description : "无简介" }}</p>
      </div>
      <div style="margin-top:5px;text-align:center;">
        <i-card>
          <view slot="content">
            <i-row>
              <i-col span="7">
                <p style="font-size:16px;">9999</p>
                <i-avatar
                  size="mini"
                  src="../../../static/images/interest.png"
                />
                <span style="font-size:9px;">上周兴趣组收益</span>
              </i-col>
              <i-col span="7" offset="1">
                <p style="font-size:16px;">9999</p>
                <i-avatar
                  size="mini"
                  src="../../../static/images/post.png"
                />
                <span style="font-size:9px;">上周发帖收益</span>
              </i-col>
              <i-col span="7" offset="1">
                <p style="font-size:16px;">9999</p>
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
        <i-cell title="积分动态" is-link :url="'../integralRecord/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/score.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="兑换记录" is-link :url="'../exchangeRecord/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/exchange.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="我的发帖" is-link url="../post/main">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/post.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="分享记录" is-link :url="'../shareRecord/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/shareRecord.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="分享链接" is-link>
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/shareLink.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="诉求" is-link :url="'../asking/main?userId=' + userId">
          <view slot="icon">
            <i-avatar
              size="small"
              src="../../../static/images/asking.png"
              style="margin-right:10px;"
            />
          </view>
        </i-cell>
        <i-cell title="校趣规则" is-link url="../rule/main">
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

    <i-modal
      :title="stopDay === -2 ? '被举报，此号暂停使用' : '严重违规，此号已被封号'"
      :visible="visible"
    />
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
      visible: false
    }
  },
  mounted() {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          that.$wxhttp.post({
            url: "/user/login?code=" + res.code,
          }).then(resp => {
            if(resp.code === 0){
              that.userId = resp.data.id;
              if(resp.data.isCheckUniversity === 0){
                //首次登录校趣，输入校区，授权信息，并完善个人信息
                wx.switchTab("../index/main");
              }else{
                //不是首次登录，获取兴趣组列表
                that.getUserInfo();
              }
            }else{
              wx.showToast({
                title: resp.msg,
                icon: 'none'
              })
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
  },
  methods: {
    getUserInfo() {
      //获取用户详细信息
      this.$wxhttp.get({
        url: "/user/getUserDetailById?userId=" + this.userId
      }).then(resp => {
        if(resp.code === 0){
          this.createTime = this.$moment.unix(resp.data.createTime).format("YYYY-MM-DD");
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
      })
    },
    handleModify() {
      wx.navigateTo({
        url: "../modify/main"
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
</style>