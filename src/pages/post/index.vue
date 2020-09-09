<template>
  <div style="background-color:#f3f4f5">
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-avatar size="avatar" :src="userDetail.photo" />
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">{{ userDetail.name }}</p>
            <p style="font-size:12px;color:white;line-height:25px;">
              {{ userDetail.universityCampusName }}
              <i-tag style="color:#07a68e;">升学</i-tag>
            </p>
            <span style="font-size:11px;color:white;">{{ userDetail.createTime }}(加入)</span>
          </i-col>
          <i-col span="9">
            <p style="fong-size:12px;color:white;">ID:</p>
            <p style="fong-size:12px;color:white;">{{ userDetail.id }}</p>
            <p style="font-size:12px;color:white;line-height:25px;">积分:{{ userDetail.credit }}</p>
            <br />
            <i-tag class="i-tags" type="border" color="green">校内登录{{ userDetail.inCampusCount }}次</i-tag>
            <i-tag class="i-tags" type="border" color="red">校外登录{{ userDetail.outCampusCount }}次</i-tag>
          </i-col>
        </i-row>
      </div>
      <div style="margin:10px;">
        <p
          style="font-size:12px;color:white;"
        >简介：{{ userDetail.description ? userDetail.description : "无简介" }}</p>
      </div>
    </div>

    <div class="label">
      <span style="margin:5px;color:#ffffff">ta 的发帖 ({{ postList.length }})</span>
    </div>

    <div v-for="post in postList" :key="post.id" style="margin-top:15px;">
      <i-card
        post
        :postTitle="userDetail.name"
        :time="post.createTime"
        :thumb="userDetail.photo"
        :university="userDetail.universityCampusName"
      >
        <view slot="operation">
          <i-icon
            type="add"
            size="15"
            color="red"
            style="margin-left:5px;vertical-align:center;"
            @click="handleOperatePost(post.userId,post.id)"
          />
        </view>
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
      <i-load-more v-if="postList.length === 0" tip="该用户当前无帖子" :loading="false" />
      <i-load-more v-else :loading="false" />
    </div>

    <i-button v-if="userId !== selfUserId" type="primary" shape="circle">发送消息给ta</i-button>

    <i-action-sheet :visible="isAdd" :actions="addAction" show-cancel @cancel="handleCancel" />

    <!-- 帖子操作列表 -->
    <i-action-sheet
      :visible="postVisible"
      :actions="postAction"
      show-cancel
      @cancel="() => postVisible = false"
      @iclick="handleClickItem4post"
    />

    <i-modal :title="userDetail.stopDay === -2 ? '被举报，此号暂停使用' : '严重违规，此号已被封号'" :visible="visible" />
  </div>
</template>

<script>
import img from "../../../static/images/postImage.png";
import getQuery from '../../utils/getPage';

export default {
  data() {
    return {
      isAdd: false,
      imageUrl: img,
      addAction: [
        {
          name: "回到陌生"
        },
        {
          name: "举报"
        },
        {
          name: "拉黑"
        }
      ],
      userId: undefined,  //查看的用户id
      selfUserId: undefined,  //自己的用户id
      userDetail: {
        createTime: "",
        credit: undefined,
        description: "",
        id: undefined,
        inCampusCount: undefined,
        modifyUniversity: undefined,
        name: "",
        outCampusCount: undefined,
        photo: "",
        sex: undefined,
        stopDay: undefined,
        universityCampusId: undefined,
        universityCampusName: ""
      },
      useableVisible: false,
      postList: [],
      postAction: [],
      currentOperatedPostId: undefined,
      postVisible: false
    }
  },
  onShow() {
    this.userId = getQuery.getQuery().userId;
    this.selfUserId = getQuery.getQuery().selfUserId;
    this.getUserInfo();
    this.getPostList();
  },
  methods: {
    getUserInfo() {
      // 获取用户信息
      this.$wxhttp.get({
        url: "/user/getUserDetailById?userId=" + this.userId
      }).then(resp => {
        if(resp.code === 0){
          this.userDetail.createTime = this.$moment(resp.data.createTime).format("YYYY-MM-DD");
          this.userDetail.credit = resp.data.credit;
          this.userDetail.description = resp.data.description;
          this.userDetail.inCampusCount = resp.data.inCampusCount;
          this.userDetail.modifyUniversity = resp.data.modifyUniversity;
          this.userDetail.name = resp.data.name;
          this.userDetail.outCampusCount = resp.data.outCampusCount;
          this.userDetail.photo = resp.data.photo;
          this.userDetail.sex = resp.data.sex;
          this.userDetail.stopDay = resp.data.stopDay;
          this.userDetail.universityCampusId = resp.data.universityCampusId;
          this.userDetail.universityCampusName = resp.data.universityCampusName;
          if(this.userDetail.stopDay !== 0){
            this.useableVisible = true;
          }
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
        url: "/post/listUserPost?userId=" + this.userId
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
      })
    },
    handleAdd() {
      this.isAdd = true;
    },
    handleCancel() {
      this.isAdd = false;
    },
    handleOperatePost(postUserId,postId){
      if(postUserId == this.selfUserId){
        this.postAction = [{
          name: "删除帖子"
        }];
      }else{
        this.postAction = [{
          name: "举报帖子"
        }];
      }
      this.currentOperatedPostId = postId;
      this.postVisible = true;
    },
    handleClickItem4post() {
      if(this.postAction[0].name === "删除帖子"){
        this.$wxhttp.deleteRequest({
          url: "/post/id?postId=" + this.currentOperatedPostId + "&optUserId=" + this.userId
        }).then(resp => {
          if(resp.code === 0){
            wx.showToast({
              title: "删除成功"
            });
            this.getPostList();
          }else{
            wx.showToast({
              title: resp.msg,
              icon: "none"
            })
          }
        })
      }else{
        //举报帖子
      }
      this.postVisible = false;
    },
    handleComment(postId) {
      var userId = this.selfUserId;
      wx.navigateTo({
        url: "../comment/main?postId=" + postId + "&userId=" + userId
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
.label {
  margin-top: 10px;
  background-image: linear-gradient(to right, #14d0b6, #0ed4d6);
  height: 35px;
  display: flex;
  align-items: center;
  width: 40%;
  border-bottom-right-radius: 50px;
  border-top-right-radius: 50px;
}
</style>