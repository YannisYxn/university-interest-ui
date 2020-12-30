<template>
  <div>
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-avatar size="avatar" :src="userDetail.photo" @click="handlePreview(userDetail.photo)"/>
            <i-avatar style="position:absolute;top:55px;left:21%;" size="mini" v-if="userDetail.sex == 1" :src="boy" />
            <i-avatar style="position:absolute;top:55px;left:21%;" size="mini" v-else-if="userDetail.sex == 2" :src="girl" />
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">{{ userDetail.name }}</p>
            <p style="font-size:12px;color:white;line-height:25px;">
              {{ userDetail.universityCampusName }}
            </p>
            <span style="font-size:11px;color:white;">{{ userDetail.createTime }}(加入)</span>
            <br />
            <i-icon
              v-if="userId !== selfUserId"
              type="add"
              size="25"
              color="white"
              style="line-height:2;"
              @click="() => isAdd = true"
            />
          </i-col>
          <i-col span="9">
            <p style="fong-size:10px;color:white;">ID:</p>
            <p style="fong-size:10px;color:white;">{{ userId }}</p>
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

    <i-row>
      <i-col span="10">
        <div class="label">
          <span style="margin:5px;color:#ffffff">ta 的发帖 ({{ postList.length }})</span>
        </div>
      </i-col>
      <i-col span="14">
        <div style="float:right;margin:5px;">
          <i-button v-if="userId !== selfUserId && isFriend" size="small" type="primary" long shape="circle" @click="handleChat">发送消息给ta</i-button>
          <i-button v-if="userId !== selfUserId && !isFriend" size="small" type="primary" long shape="circle" @click="() => visibleFriend = true">跟ta打招呼</i-button>
        </div>
      </i-col>
    </i-row>

    <div v-for="post in postList" :key="post.id" style="margin-top:10px;">
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
              <i-col span="12">
                <div @click="handleComment(post.id)">
                  <i-icon size="30" type="message" />
                  <span
                    v-if="post.commentCount"
                    style="font-size:15px;vertical-align:middle;"
                  >{{ post.commentCount }}</span>
                </div>
              </i-col>
              <i-col span="12">
                <span>发于: <br />
                  <span style="color:#14d0b6;" @click="handleRouterGroup(post.groupId)">{{ post.groupName }}</span>
                </span>
              </i-col>
            </i-row>
          </div>
        </view>
      </i-card>
    </div>

    <div style="margin-top:25px;margin-bottom:30px;">
      <i-load-more v-if="postList.length === 0" tip="该用户当前无帖子" :loading="false" />
      <i-load-more v-else :loading="false" />
    </div>

    <!-- <div style="position:fixed;bottom:0;width:100%;margin:10px;">
      <i-button v-if="userId !== selfUserId && isFriend" type="primary" long shape="circle" @click="handleChat">发送消息给ta</i-button>
      <i-button v-if="userId !== selfUserId && !isFriend" type="primary" long shape="circle" @click="() => visibleFriend = true">跟ta打招呼</i-button>
    </div> -->

    <i-action-sheet :visible="isAdd" :actions="addAction" show-cancel @cancel="handleCancel" @iclick="handleClickItem4user"/>

    <!-- 帖子操作列表 -->
    <i-action-sheet
      :visible="postVisible"
      :actions="postAction"
      show-cancel
      @cancel="() => postVisible = false"
      @iclick="handleClickItem4post"
    />

    <!-- <i-modal :title="userDetail.stopDay === -2 ? '被举报，此号暂停使用' : '严重违规，此号已被封号'" :visible="visible" /> -->
    <mp-dialog
      :title="stopDay === -2 ? '被举报，此号暂停使用' : '严重违规，此号已被封号'"
      :show="visible"
      @confirm="() => visible = false"
    >
    </mp-dialog>

    <!-- <i-modal
      title="跟ta打招呼"
      :visible="visibleFriend"
      @ok="handleSayHello"
      @cancel="() => visibleFriend = false"
    >
      <i-input
        v-model="sayHelloContent"
        type="textarea"
        maxlength="25"
        placeholder="打招呼内容"
        @change="handleContentChange"
      />
    </i-modal> -->
    <mp-dialog
      title="跟ta打招呼(消耗1积分)"
      :show="visibleFriend"
      :buttons="[{text: '取消'}]"
      @buttontap="() => visibleFriend = false"
      @confirm="handleSayHello"
    >
      <i-input
        v-model="sayHelloContent"
        maxlength="25"
        placeholder="打招呼内容"
        disabled
      />
    </mp-dialog>
  </div>
</template>

<script>
import getQuery from '../../../utils/getPage';
import boy from "../../../../static/images/boy.png";
import girl from "../../../../static/images/girl.png";

export default {
  data() {
    return {
      isAdd: false,
      boy: boy,
      girl: girl,
      addAction: [
        {
          name: "回到陌生/拉黑"
        },
        {
          name: "举报"
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
      postVisible: false,
      isFriend: false,
      visibleFriend: false,
      sayHelloContent: "你好，可以交个朋友吗？"
    }
  },
  onShareAppMessage(object){
    // console.log(object)
    return {
      title: "校趣，欢迎加入校趣，不止有趣",
      path: "/pages/index/main?shareUserId=" + this.userId
    }
  },
  onShow() {
    this.userId = getQuery.getQuery().userId;
    this.selfUserId = getQuery.getQuery().selfUserId;
    this.getUserInfo();
    this.getPostList();
    this.judgeFriend();
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
              createTime: this.$moment.unix(item.createTime).format("YYYY-MM-DD HH:mm")
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
    judgeFriend() {
      // 判断两人是否为朋友
      this.$wxhttp.post({
        url: "/user/queryIsFriend?oneUserId=" + this.userId + "&twoUserId=" + this.selfUserId
      }).then(resp => {
        if(resp.code == 0){
          if(resp.data == 0){
            this.isFriend = false;
            this.addAction = [
              {
                name: "打招呼"
              },
              {
                name: "举报"
              }
            ];
          }else{
            this.isFriend = true;
            this.addAction = [
              {
                name: "回到陌生/拉黑"
              },
              {
                name: "举报"
              }
            ];
          }
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
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
        var that = this;
        wx.navigateTo({
          url: "../../indexPages/tip/main?type=3&userId=" + that.userId + 
          "&relatedId=" + that.currentOperatedPostId + 
          "&reportedUserId=" + that.currentOperatedPostUserId
        });
      }
      this.postVisible = false;
    },
    handleClickItem4user(detail) {
      const index = detail.mp.detail.index;
      this.isAdd = false;
      if(index == 0){
        if(this.addAction[0].name == "回到陌生/拉黑"){
          // 回到陌生、拉黑
          this.$wxhttp.post({
            url: "/user/backToStranger?fromUserId=" + this.selfUserId + "&toUserId=" + this.userId
          }).then(resp => {
            if(resp.code == 0){
              wx.showToast({
                title: "操作成功"
              });
            }else{
              wx.showToast({
                title: resp.msg,
                icon: "none"
              });
            }
          });
        }else{
          // 打招呼
          this.visibleFriend = true;
        }
      }else{
        // 举报用户
        var that = this;
        wx.navigateTo({
          url: "../../indexPages/tip/main?type=2&userId=" + that.selfUserId + 
          "&reportedUserId=" + that.userId
        });
      }
    },
    handleComment(postId) {
      var userId = this.selfUserId;
      wx.navigateTo({
        url: "../../indexPages/comment/main?postId=" + postId + "&userId=" + userId
      });
    },
    handleContentChange(event) {
      this.sayHelloContent = event.mp.detail.detail.value;
    },
    handleSayHello() {
      this.$wxhttp.post({
        url: "/user/sayHello?fromUserId=" + this.selfUserId + "&toUserId=" + this.userId
      }).then(resp => {
        if(resp.code == 0) {
          wx.showToast({
            title: "发送成功"
          });
          this.visibleFriend = false;
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none"
          });
        }
      });
    },
    handleChat() {
      wx.navigateTo({
        url: "../../chat/chat/main?userId=" + this.selfUserId + "&chatUserId=" + this.userId
      });
    },
    handlePreview(url) {
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
      });
    },
    handleRouterGroup(groupId) {
      // 跳转兴趣组
      wx.navigateTo({
        url: "../../indexPages/interestGroup/main?userId=" + this.globalData.userId + "&groupId=" + groupId
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
  border-bottom-right-radius: 50px;
  border-top-right-radius: 50px;
}
</style>