<template>
  <div>
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-avatar size="avatar" :src="groupDetail.logo" @click="handlePreview(groupDetail.logo)"/>
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">{{ groupDetail.name }}</p>
            <p style="font-size:10px;color:white;line-height:25px;">{{ groupDetail.memberCount }}个组员</p>
          </i-col>
          <i-col span="9">
            <span style="font-size:10px;color:white;">创建者：{{ groupDetail.createUser }}</span>
            <p style="font-size:10px;color:white;line-height:25px;">{{ groupDetail.createTime }}(建组)</p>
            <br />
            <i-icon
              type="add"
              size="25"
              color="white"
              style="float:center;"
              @click="() => interestGroupVisible = true"
            />
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

    <div v-if="current === 'post'">
      <i-button
        v-if="groupDetail.status === 0"
        type="primary"
        shape="circle"
        style="margin-top:15px;"
        fontsize="large"
        @click="handlePost"
      >发&#12288;&#12288;帖</i-button>
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
          <view slot="operation">
            <i-icon
              type="add"
              size="15"
              color="#67ddd3"
              style="margin-left:5px;vertical-align:center;"
              @click="handleOperatePost(post.userId,post.id)"
            />
          </view>
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
                    <i-badge v-if="post.userId == userId && post.newComment" dot>
                      <i-icon size="30" type="message" />
                    </i-badge>
                    <i-icon v-else size="30" type="message" />
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
        <i-cell v-for="member in memberList" :key="member.id" :title="member.name" @click="handlePersonalPageForUserList(member.id)">
          <view slot="icon">
            <i-avatar :src="member.photo" style="margin-right:10px;" />
          </view>
          <view slot="badge">
            <div style="margin-top:4%;">
              <span
                style="color:#9d9d9d;font-size:11px;margin-left:10px;"
              >{{ member.universityCampusName + " "}} <br /> {{ " " + member.createTime}}(加入)</span>
            </div>
          </view>
          <view slot="footer">
            <i-icon color="#67ddd3" size="20" type="add" @click="handleOperateMember(member.id)"/>
          </view>
        </i-cell>
      </i-cell-group>

      <div style="margin-top:25px;">
        <i-load-more v-if="memberList.length === 0" tip="该兴趣组当前无其他组员" :loading="false" />
        <i-load-more v-else :loading="false" />
      </div>
    </div>

    <!-- 兴趣组操作列表 -->
    <i-action-sheet
      :visible="interestGroupVisible"
      :actions="interestGroupAction"
      show-cancel
      @cancel="() => interestGroupVisible = false"
      @iclick="handleClickItem"
    />

    <i-action-sheet
      :visible="postVisible"
      :actions="postAction"
      show-cancel
      @cancel="() => postVisible = false"
      @iclick="handleClickItem4post"
    />

    <i-action-sheet
      :visible="memberVisible"
      :actions="memberAction"
      show-cancel
      @cancel="() => memberVisible = false"
      @iclick="handleClickItem4member"
    />
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
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
      memberAction: [
        {
          name: "拉黑"
        }
      ],
      postVisible: false,
      memberVisible: false,
      postAction: [],
      currentOperatedPostId: undefined,
      currentOperatedMemberId: undefined
    };
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + this.userId
    }
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
            icon: "none",
            duration: 3000
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
            icon: "none",
            duration: 3000
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
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm")
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
    handleComment(postId) {
      var userId = this.userId;
      wx.navigateTo({
        url: "../comment/main?postId=" + postId + "&userId=" + userId
      });
    },
    handlePost() {
      if(this.globalData.isPerfectInfo == 0) {
        wx.showToast({
          title: "请先在[我的]页面完善头像昵称",
          icon: "none",
          duration: 3000
        });
      }else{
        wx.navigateTo({
          url: "../createPost/main?groupId=" + this.groupId + "&userId=" + this.userId
        });
      }
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
            wx.showToast({
              title: "冻结成功",
              icon: "success",
              duration: 3000,
              success: () => {
                setTimeout(() => {
                  this.getGroupInfo();
                },3000);
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
      }else if(this.groupDetail.isCreate === 1 && this.groupDetail.status === 3 && index === 0){
        //解冻此组
        this.$wxhttp.post({
          url: "/group/thawGroup?userId=" + this.userId + "&groupId=" + this.groupId
        }).then(resp => {
          if(resp.code === 0){
            //解冻成功
            wx.showToast({
              title: "解冻成功",
              icon: "success",
              duration: 3000,
              success: () => {
                setTimeout(() => {
                  this.getGroupInfo();
                },3000);
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
      }else if(this.groupDetail.isCreate === 1 && index === 1){
        //解散此组
        this.$wxhttp.deleteRequest({
          url: "/group/id?userId=" + this.userId + "&groupId=" + this.groupId
        }).then(resp => {
          if(resp.code === 0){
            //解散成功
            wx.showToast({
              title: "解散成功",
              icon: "success",
              duration: 3000,
              success: () => {
                setTimeout(() => {
                  wx.switchTab({
                    url: "../../index/main"
                  });
                },3000);
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
      }else if(index === 2){
        //修改兴趣组信息
        wx.navigateTo({
          url: "../modifyGroup/main?userId=" + this.userId + "&groupId=" + this.groupId
        });
      }
      this.interestGroupVisible = false;
    },
    handleOperateMember(memberId) {
      this.currentOperatedMemberId = memberId;
      this.memberVisible = true;
    },
    handleClickItem4member(memberId) {
      // 回到陌生、拉黑
      this.$wxhttp.post({
        url: "/group/blockGroupMember",
        data: {
          groupId: this.groupId,
          memberId: this.currentOperatedMemberId,
          userId: this.userId
        }
      }).then(resp => {
        if(resp.code == 0){
          wx.showToast({
            title: "操作成功",
            duration: 3000,
            success: () => {
              setTimeout(() => {
                this.memberVisible = false;
                this.getMemberList();
              },3000);
            }
          });
        }else{
          this.memberVisible = false;
          wx.showToast({
            title: resp.msg,
            icon: "none",
            duration: 3000
          });
        }
      });
    },
    handleClickItem4post() {
      if(this.postAction[0].name === "删除帖子"){
        this.$wxhttp.deleteRequest({
          url: "/post/id?postId=" + this.currentOperatedPostId + "&optUserId=" + this.userId
        }).then(resp => {
          if(resp.code === 0){
            wx.showToast({
              title: "删除成功",
              duration: 3000,
              success: () => {
                setTimeout(() => {
                  this.getPostList();
                },3000);
              }
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none",
              duration: 3000
            })
          }
        })
      }else{
        //举报帖子
        var that = this;
        wx.navigateTo({
          url: "../tip/main?type=3&userId=" + that.userId + 
          "&relatedId=" + that.currentOperatedPostId + 
          "&reportedUserId=" + that.currentOperatedPostUserId
        });
      }
      this.postVisible = false;
    },
    handleOperatePost(postUserId,postId){
      if(postUserId == this.userId){
        this.postAction = [{
          name: "删除帖子"
        }];
      }else{
        this.postAction = [{
          name: "举报帖子"
        }];
      }
      this.currentOperatedPostUserId = postUserId;
      this.currentOperatedPostId = postId;
      this.postVisible = true;
    },
    handlePersonalPage(e) {
      // console.log(e.mp.detail)
      wx.navigateTo({
        url: "../../myPages/post/main?userId=" + e.mp.detail + "&selfUserId=" + this.userId
      });
    },
    handlePersonalPageForUserList(visitUserId) {
      wx.navigateTo({
        url: "../../myPages/post/main?userId=" + visitUserId + "&selfUserId=" + this.userId
      });
    },
    handlePreview(url) {
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
      });
    }
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