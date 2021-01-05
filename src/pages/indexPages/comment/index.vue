<template>
  <div>
    <div style="margin-top:15px;">
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
                <div>
                  <i-icon size="30" type="message" />
                  <span
                    v-if="post.commentCount"
                    style="font-size:15px;vertical-align:middle;"
                  >{{ post.commentCount }}</span>
                </div>
              </i-col>
            </i-row>
          </div>
        </view>
      </i-card>
    </div>

    <div style="height:10px;margin-top:5px;"></div>

    <div>
      <i-cell-group>
        <i-comment-cell
          v-for="comment in post.commentDetailDTOList"
          :key="comment.id"
          :userId="comment.userId"
          :title="comment.userName"
          :label="comment.universityCampusName"
          :time="comment.createTime"
          :content="comment.content"
          @clickTitle="handlePersonalPage"
        >
          <view slot="icon">
            <i-avatar :src="comment.userPhoto" style="margin-right:10px;" />
          </view>
          <view slot="footer">
            <i-icon
              type="add"
              color="#67ddd3"
              size="15"
              @click="handleOperate(comment.userId,comment.id)"
            />
          </view>
        </i-comment-cell>
      </i-cell-group>
    </div>

    <div style="margin-top:25px;">
      <i-load-more v-if="post.commentDetailDTOList.length === 0" tip="该帖子当前无评论" :loading="false" />
      <i-load-more v-else :loading="false" />
    </div>

    <div style="height:50px" />

    <div style="position:fixed;bottom:0;margin-bottom:15px;width:100%;z-index:999;">
      <i-row>
        <i-col :span="18">
          <i-input
            v-model="comment"
            placeholder="限40字，敬请文明用语，污言秽语及不良信息、商业信息被举报，封号处理"
            :maxlength="40"
            type="textarea"
            mode="wrapped"
            cursorSpacing="60"
            comment
            @change="handleCommentChange"
          />
        </i-col>
        <i-col :span="6">
          <i-button type="primary" shape="circle" @click="handleComment">发送</i-button>
        </i-col>
      </i-row>
    </div>

    <!-- 评论用户操作列表 -->
    <i-action-sheet
      :visible="userVisible"
      :actions="userAction"
      show-cancel
      @cancel="() => userVisible = false"
      @iclick="handleClickItem"
    />
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';

export default {
  data() {
    return {
      userId: undefined,
      postId: undefined,
      post: {
        commentCount: undefined,
        commentDetailDTOList: [],
        content: "",
        createTime: "",
        groupId: undefined,
        groupName: "",
        id: undefined,
        img: "",
        universityCampusName: "",
        userId: undefined,
        userName: "",
        userPhoto: ""
      },
      comment: "",
      userVisible: false,
      userAction: [],
      currentOperatedCommentId: undefined,
      currentOperatedCommentUserId: undefined,
      latitude: undefined,
      longitude: undefined,
      isJoin: undefined,  //浏览者是否加入了该兴趣组
    }
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + this.userId
    }
  },
  mounted() {
    this.userId = getQuery.getQuery().userId;
    this.postId = getQuery.getQuery().postId;
    this.comment = "";
    //获取经纬度
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
                  that.latitude = res.latitude;
                  that.longitude = res.longitude;
                }
              });
            }
          })
        }else{
          // 用户已经同意小程序使用定位功能，后续调用 wx.getLocation 接口不会弹窗询问
          wx.getLocation({
            type: 'gcj02',
            success (res) {
              that.latitude = res.latitude;
              that.longitude = res.longitude;
            }
          });
        }
      }
    });
    //获取兴趣组
    this.$wxhttp.get({
      url: "/post/getPostById?postId=" + this.postId + "&userId=" + this.userId
    }).then(resp => {
      if(resp.code === 0){
        this.post = resp.data;
        this.post.createTime = this.$moment.unix(this.post.createTime).format("YYYY-MM-DD HH:mm");
        this.post.commentDetailDTOList = resp.data.commentDetailDTOList.map(item => {
          return {
            ...item,
            createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm")
          }
        });
        this.isJoin = resp.data.isJoin;
        // 如果是本人，已读评论
        if(resp.data.userId == this.userId){
          this.handleReadComment();
        }
      }else{
        wx.showToast({
          title: resp.msg,
          icon: "none"
        });
        wx.navigateBack({
          delta: 1
        });
      }
    });
  },
  methods: {
    getCommentList() {
      this.$wxhttp.get({
        url: "/comment?postId=" + this.postId
      }).then(resp => {
        if(resp.code === 0){
          this.post.commentDetailDTOList = resp.data.map(item => {
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
      this.handleReadComment();
    },
    handleComment() {
      if(this.globalData.isPerfectInfo == 0){
        wx.showToast({
          title: "请先在[我的]页面完善头像昵称",
          icon: "none"
        });
      }else if(this.isJoin == 0){
        wx.showToast({
          title: "请先点击此兴趣组主页右上角的[+]，加入此组",
          icon: "none"
        });
      }else{
        this.$wxhttp.post({
          url: "/comment",
          data: {
            content: this.comment,
            groupId: this.post.groupId,
            latitude: this.latitude,
            longitude: this.longitude,
            postId: this.postId,
            userId: this.userId
          }
        }).then(resp => {
          if(resp.code === 0){
            this.comment = "";
            wx.showToast({
              title: "发表成功"
            });
            this.getCommentList();
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            });
          }
        });
      }
    },
    handleCommentChange(event){
      this.comment = event.mp.detail.detail.value;
    },
    handleOperate(commentUserId,commentId){
      console.log(commentUserId,this.userId)
      if(commentUserId == this.userId){
        this.userAction = [
          {
            name: "删除评论"
          }
        ];
      }else{
        this.userAction = [
          {
            name: "举报评论"
          }
        ];
      }
      this.currentOperatedCommentId = commentId;
      this.currentOperatedCommentUserId = commentUserId;
      this.userVisible = true;
    },
    handleClickItem (detail) {
      const index = detail.mp.detail.index;
      this.userVisible = false;
      if(this.userAction[0].name === "删除评论"){
        this.$wxhttp.deleteRequest({
          url: "/comment/ID?commentId=" + this.currentOperatedCommentId + "&userId=" + this.userId
        }).then(resp => {
          if(resp.code === 0){
            wx.showToast({
              title: "删除成功"
            });
            this.getCommentList();
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            })
          }
        });
      }else if(this.userAction[0].name === "举报评论"){
        // 举报
        var that = this;
        wx.navigateTo({
          url: "../tip/main?type=4&userId=" + that.userId + 
          "&relatedId=" + that.currentOperatedCommentId + 
          "&reportedUserId=" + that.currentOperatedCommentUserId
        });
      }
    },
    handlePersonalPage(e) {
      // console.log(e.mp.detail)
      wx.navigateTo({
        url: "../../myPages/post/main?userId=" + e.mp.detail + "&selfUserId=" + this.userId
      });
    },
    handlePreview(url) {
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
      });
    },
    handleReadComment() {
      // 当发帖人是自己时，已读所有帖子评论
      this.$wxhttp.post({
        url: "/post/readComment?postId=" + this.postId
      });
    }
  }
}
</script>

<style>
</style>