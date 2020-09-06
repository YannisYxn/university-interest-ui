<template>
  <div style="background-color:#f3f4f5;">
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-avatar size="avatar" :src="groupDetail.logo" />
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">{{ groupDetail.name }}</p>
            <p style="font-size:10px;color:white;line-height:25px;">{{ groupDetail.memberCount }}个组员</p>
          </i-col>
          <i-col span="9">
            <i-icon
              type="add"
              size="25"
              color="red"
              style="float:right;"
              @click="() => interestGroupVisible = true"
            />
            <span style="font-size:10px;color:white;">创建者：{{ groupDetail.createUser }}</span>
            <p style="font-size:10px;color:white;line-height:25px;">{{ groupDetail.createTime }}(建组)</p>
          </i-col>
        </i-row>
      </div>
      <div style="margin:10px;">
        <p
          style="font-size:12px;color:white;"
        >简介：{{ groupDetail.description ? groupDetail.description : "无简介" }}</p>
      </div>
    </div>

    <div style="margin-top:10px;">
      <i-tabs :current="current" color="#14d0b6" @change="handleTabChange">
        <i-tab key="post" title="帖子列表"></i-tab>
        <i-tab key="member" title="组员列表"></i-tab>
      </i-tabs>
    </div>

    <div v-if="current === 'post'" style="background-color:#f3f4f5">
      <div v-for="post in postList" :key="post.id" style="margin-top:15px;">
        <i-card
          post
          :postTitle="post.userName"
          :time="post.createTime"
          :thumb="post.userPhoto"
          :university="post.universityCampusName"
        >
          <view slot="content">
            <span style="font-size:large;line-height:1.5;">{{ post.content }}</span>
            <div style="display:flex;width:240px;text-align:center;">
              <image :src="post.img" mode="widthFix" style="max-width:100%;" />
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

      <div style="margin-top:25px;">
        <i-load-more v-if="postList.length === 0" tip="该兴趣组当前无帖子" :loading="false" />
        <i-load-more v-else :loading="false" />
      </div>
    </div>

    <div style="margin-top:5px;" v-if="current === 'member'">
      <i-cell-group>
        <i-cell v-for="member in memberList" :key="member.id" :title="member.name">
          <view slot="icon">
            <i-avatar :src="member.photo" style="margin-right:10px;" />
          </view>
          <view slot="badge">
            <div style="margin-top:4%;">
              <span
                style="color:#9d9d9d;font-size:11px;"
              >{{ member.universityCampusName + " " }} {{ " " + member.createTime}}(加入)</span>
            </div>
          </view>
          <view slot="footer">
            <i-icon color="red" size="20" type="add" />
          </view>
        </i-cell>
      </i-cell-group>

      <div style="margin-top:25px;">
        <i-load-more v-if="memberList.length === 0" tip="该兴趣组当前无其他组员" :loading="false" />
        <i-load-more v-else :loading="false" />
      </div>
    </div>

    <i-button
      v-if="groupDetail.status === 0"
      type="primary"
      shape="circle"
      style="position:fixed;bottom:0;right:0;"
      @click="handlePost"
    >发帖</i-button>

    <!-- 兴趣组操作列表 -->
    <i-action-sheet
      :visible="interestGroupVisible"
      :actions="interestGroupAction"
      show-cancel
      @cancel="() => interestGroupVisible = false"
      @iclick="handleClickItem"
    />
  </div>
</template>

<script>
import img from "../../../static/images/shoe.png";
import getQuery from '../../utils/getPage';

export default {
  data() {
    return {
      imageUrl: img,
      current: "member",
      groupId: undefined,
      userId: undefined,
      groupDetail: {
        createTime: "",
        createUser: "",
        createUserId: undefined,
        description: "",
        id: undefined,
        isCreate: undefined,
        isJoin: undefined,
        logo: "",
        memberCount: undefined,
        name: "",
        postCount: undefined,
        status: undefined,
        universityId: undefined
      },
      postList: [],
      memberList: [],
      interestGroupVisible: false,
      interestGroupAction: [
        {
          name: "修改兴趣组信息"
        },
        {
          name: '分享此组',
          icon: 'share',
          openType: 'share'
        }
      ],
    };
  },
  onShow() {
    this.groupId = getQuery.getQuery().groupId;
    this.userId = getQuery.getQuery().userId;

    this.getGroupInfo();

    this.getMemberList();

    this.getPostList();
  },
  methods: {
    getGroupInfo(){
      //重置操作列表
      this.interestGroupAction = [
        {
          name: "修改兴趣组信息"
        },
        {
          name: '分享此组',
          icon: 'share',
          openType: 'share'
        }
      ];

      //请求兴趣组基本信息
      this.$wxhttp.get({
        url: 
          "/group/id?groupId=" + 
          getQuery.getQuery().groupId + 
          "&queryUserId=" + 
          getQuery.getQuery().userId
      }).then(resp => {
        if(resp.code === 0){
          this.groupDetail = resp.data;
          this.groupDetail.createTime = this.$moment.unix(this.groupDetail.createTime).format("YYYY-MM-DD");
          if(this.groupDetail.status !== 3){
            this.interestGroupAction.unshift({
              name: "冻结此组"
            },{
              name: "解散此组"
            });
          }else{
            this.interestGroupAction.unshift({
              name: "解冻此组"
            },{
              name: "解散此组"
            });
          }
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          })
        }
      });
    },
    getMemberList() {
      this.$wxhttp.post({
        url: "/group/listGroupMember?groupId=" + this.groupId
      }).then(resp => {
        if(resp.code === 0){
          this.memberList = resp.data.map(item => {
            return {
              ...item,
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD")
            }
          });
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    getPostList() {
      this.$wxhttp.get({
        url: "/post/listGroupPost?groupId=" + this.groupId
      }).then(resp => {
        if(resp.code === 0){
          this.postList = resp.data.map(item => {
            return {
              ...item,
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm:SS")
            }
          });
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    handleComment() {
      var userId = this.userId;
      wx.navigateTo({
        url: "../comment/main?postId=" + postId + "&userId=" + userId
      });
    },
    handlePost() {
      wx.navigateTo({
        url: "../createPost/main"
      });
    },
    handleTabChange(detail) {
      this.current = detail.target.key;
    },
    handleClickItem (detail) {
      const index = detail.mp.detail.index;
      if(this.groupDetail.isCreate === 1 && this.groupDetail.status === 0 && index === 0){
        //冻结此组
        this.$wxhttp.post({
          url: "/group/frozenGroup?userId=" + this.userId + "&groupId=" + this.groupId
        }).then(resp => {
          if(resp.code === 0){
            //冻结成功
            this.getGroupInfo();
            wx.showToast({
              title: "冻结成功",
              icon: "success"
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }else if(this.groupDetail.isCreate === 1 && this.groupDetail.status === 3 && index === 0){
        //解冻此组
        this.$wxhttp.post({
          url: "/group/thawGroup?userId=" + this.userId + "&groupId=" + this.groupId
        }).then(resp => {
          if(resp.code === 0){
            //解冻成功
            this.getGroupInfo();
            wx.showToast({
              title: "解冻成功",
              icon: "success"
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }else if(this.groupDetail.isCreate === 1 && index === 1){
        //解散此组
        this.$wxhttp.deleteRequest({
          url: "/group/id?userId=" + this.userId + "&groupId=" + this.groupId
        }).then(resp => {
          if(resp.code === 0){
            //解散成功
            wx.showToast({
              title: "解散成功",
              icon: "success"
            });
            wx.switchTab({
              url: "../index/main"
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }else if(index === 2){
        //修改兴趣组信息
        wx.navigateTo({
          url: "../modifyGroup/main?userId=" + this.userId + "&groupId=" + this.groupId
        });
      }
      this.interestGroupVisible = false;
    },
  }
};
</script>

<style scoped>
.head {
  align-items: center;
  padding: 5px;
  background-image: linear-gradient(to bottom, #14d0b6, #0ed4d6);
  text-align: center;
  vertical-align: middle;
}
.img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>