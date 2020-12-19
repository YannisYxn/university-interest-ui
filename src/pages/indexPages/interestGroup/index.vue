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

    <i-button
      v-if="groupDetail.isJoin === 1 && groupDetail.status === 0"
      type="primary"
      shape="circle"
      style="margin-top:15px;"
      @click="handlePost"
    >发帖</i-button>

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
          <!-- <i-input v-model="post.content" style="font-size:large;line-height:1.5;" type="textarea" disabled /> -->
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

    <div style="margin-top:25px;">
      <i-load-more v-if="postList.length === 0" tip="该兴趣组当前无帖子" :loading="false" />
      <i-load-more v-else :loading="false" />
    </div>

    <!-- 兴趣组操作列表 -->
    <i-action-sheet
      :visible="interestGroupVisible"
      :actions="interestGroupAction"
      show-cancel
      @cancel="() => interestGroupVisible = false"
      @iclick="handleClickItem"
    />

    <!-- 帖子操作列表 -->
    <i-action-sheet
      :visible="postVisible"
      :actions="postAction"
      show-cancel
      @cancel="() => postVisible = false"
      @iclick="handleClickItem4post"
    />
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
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
      interestGroupVisible: false,
      interestGroupAction: [
        {
          name: '分享此组',
          icon: 'share',
          openType: 'share'
        }
      ],
      postVisible: false,
      postAction: [],
      currentOperatedPostId: undefined,
      currentOperatedPostUserId: undefined
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

    this.getPostList();
  },
  methods: {
    getPostList() {
      wx.showLoading({
        title: "加载中"
      });
      //请求小组底下所有帖子
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
            icon: "none"
          });
        }
      });
    },
    getGroupInfo(){
      //重置操作列表
      this.interestGroupAction = [
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
          if(this.groupDetail.isCreate === 1){
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
            this.interestGroupAction.unshift({
              name: "举报此组"
            });
            if(this.groupDetail.isJoin === 1){
              this.interestGroupAction.unshift({
                name: "退出此组"
              });
            }else{
              this.interestGroupAction.unshift({
                name: "加入此组"
              });
            }
          }
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          })
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
          icon: "none"
        });
      }else{
        wx.navigateTo({
          url: "../createPost/main?userId=" + this.userId + "&groupId=" + this.groupId
        });
      }
    },
    handleClickItem (detail) {
      const index = detail.mp.detail.index;
      if(this.groupDetail.isCreate === 0 && this.groupDetail.isJoin === 0 && index === 0){
        //加入此组
        this.$wxhttp.post({
          url: "/group/join?userId=" + this.userId + "&groupId=" + this.groupId,
        }).then(resp => {
          if(resp.code === 0){
            //加入成功
            wx.showToast({
              title: "加入成功",
              icon: "success",
              success: () => {
                setTimeout(() => {
                  this.getGroupInfo();
                }, 1000)
              }
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }else if(this.groupDetail.isCreate === 0 && this.groupDetail.isJoin === 1 && index === 0){
        //退出此组
        this.$wxhttp.deleteRequest({
          url: "/group/out?userId=" + this.userId + "&groupId=" + this.groupId
        }).then(resp => {
          if(resp.code === 0){
            //退出成功
            // this.getGroupInfo();
            wx.showToast({
              title: "退出成功",
              icon: "success",
              success: () => {
                setTimeout(() => {
                  this.getGroupInfo();
                }, 1000)
              }
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }else if(this.groupDetail.isCreate === 0 && index === 1){
        //举报此组
        var that = this;
        wx.navigateTo({
          url: "../tip/main?type=1&userId=" + that.userId + "&relatedId=" + that.groupId
        });
      }else if(this.groupDetail.isCreate === 1 && this.groupDetail.status === 0 && index === 0){
        //冻结此组
        this.$wxhttp.post({
          url: "/group/frozenGroup?userId=" + this.userId + "&groupId=" + this.groupId
        }).then(resp => {
          if(resp.code === 0){
            //冻结成功
            // this.getGroupInfo();
            wx.showToast({
              title: "冻结成功",
              icon: "success",
              success: () => {
                setTimeout(() => {
                  this.getGroupInfo();
                }, 1000)
              }
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
            // this.getGroupInfo();
            wx.showToast({
              title: "解冻成功",
              icon: "success",
              success: () => {
                setTimeout(() => {
                  this.getGroupInfo();
                }, 1000)
              }
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
              icon: "success",
              success: () => {
                setTimeout(() => {
                  wx.switchTab({
                    url: "../index/main"
                  });
                }, 1000)
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
      this.interestGroupVisible = false;
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
      this.currentOperatedPostId = postId;
      this.currentOperatedPostUserId = postUserId;
      this.postVisible = true;
    },
    handleClickItem4post() {
      if(this.postAction[0].name === "删除帖子"){
        this.$wxhttp.deleteRequest({
          url: "/post/id?postId=" + this.currentOperatedPostId + "&optUserId=" + this.userId
        }).then(resp => {
          if(resp.code === 0){
            wx.showToast({
              title: "删除成功",
              success: () => {
                setTimeout(() => {
                  this.getPostList();
                }, 1000)
              }
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
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
    handlePersonalPage(e) {
      // console.log(e.mp.detail)
      console.log(e.mp.detail)
      wx.navigateTo({
        url: "../../myPages/post/main?userId=" + e.mp.detail + "&selfUserId=" + this.userId
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