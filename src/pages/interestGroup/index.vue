<template>
  <div>
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
            <i-icon type="add" size="25" color="red" style="float:right;" />
            <span style="font-size:10px;color:white;">创建者：{{ groupDetail.createUser }}</span>
            <p
              style="font-size:10px;color:white;line-height:25px;"
            >{{ groupDetail.createTime }}(建组)</p>
          </i-col>
        </i-row>
      </div>
      <div style="margin:10px;">
        <p
          style="font-size:12px;color:white;"
        >简介：{{ groupDetail.description ? groupDetail.description : "无简介" }}</p>
      </div>
    </div>

    <div style="margin-top:15px;">
      <i-card
        post
        postTitle="高小白"
        time="2019-12-12 10:24"
        thumb="../../../static/images/avatar.png"
      >
        <view slot="content">
          <span>耐克zoom，799有人喜欢吗？</span>
          <div style="display:flex;height:100px;width:120px;">
            <image :src="imageUrl" style="padding:5px;max-width:100%;max-height:100%;" />
          </div>
        </view>
        <view slot="footer">
          <div style="text-align:center;margin-top:10px;">
            <i-row>
              <i-col span="12">
                <div @click="handleComment">
                  <i-icon size="30" type="message" />
                  <span style="font-size=50px;">5566</span>
                </div>
              </i-col>
              <i-col span="12">
                <i-icon size="30" type="dislike" />
                <span style="font-size=50px;">5566</span>
              </i-col>
            </i-row>
          </div>
        </view>
      </i-card>
    </div>
    <div style="margin-top:15px;">
      <i-card
        post
        postTitle="高小白"
        time="2019-12-12 10:24"
        thumb="../../../static/images/avatar.png"
      >
        <view slot="content">
          <span>耐克zoom，799有人喜欢吗？</span>
          <div style="display:flex;height:100px;width:120px;">
            <image :src="imageUrl" style="padding:5px;max-width:100%;max-height:100%;" />
          </div>
        </view>
        <view slot="footer">
          <div style="text-align:center;margin-top:10px;">
            <i-row>
              <i-col span="12">
                <div @click="handleComment">
                  <i-icon size="30" type="message" />
                  <span style="font-size=50px;">5566</span>
                </div>
              </i-col>
              <i-col span="12">
                <i-icon size="30" type="dislike" />
                <span style="font-size=50px;">5566</span>
              </i-col>
            </i-row>
          </div>
        </view>
      </i-card>
    </div>
    <div style="margin-top:15px;">
      <i-card
        post
        postTitle="高小白"
        time="2019-12-12 10:24"
        thumb="../../../static/images/avatar.png"
      >
        <view slot="content">
          <span>耐克zoom，799有人喜欢吗？</span>
          <div style="display:flex;height:100px;width:120px;">
            <image :src="imageUrl" style="padding:5px;max-width:100%;max-height:100%;" />
          </div>
        </view>
        <view slot="footer">
          <div style="text-align:center;margin-top:10px;">
            <i-row>
              <i-col span="12">
                <div @click="handleComment">
                  <i-icon size="30" type="message" />
                  <span style="font-size=50px;">5566</span>
                </div>
              </i-col>
              <i-col span="12">
                <i-icon size="30" type="dislike" />
                <span style="font-size=50px;">5566</span>
              </i-col>
            </i-row>
          </div>
        </view>
      </i-card>
    </div>

    <i-button
      type="primary"
      shape="circle"
      style="position:fixed;bottom:0;right:0;"
      @click="handlePost"
    >发帖</i-button>
  </div>
</template>

<script>
import img from "../../../static/images/shoe.png";
import getQuery from '../../utils/getPage';

export default {
  data() {
    return {
      imageUrl: img,
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
      postList: []
    };
  },
  mounted() {
    this.groupId = getQuery.getQuery().groupId;
    this.userId = getQuery.getQuery().userId;

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
      }else{
        wx.showToast({
          title: resp.msg
        })
      }
    });

    //请求小组底下所有帖子
    this.$wxhttp.get({
      url: "/post/listGroupPost?groupId=" + this.groupId
    }).then(resp => {
      
    })
  },
  methods: {
    handleComment() {
      wx.navigateTo({
        url: "../comment/main"
      });
    },
    handlePost() {
      wx.navigateTo({
        url: "../createPost/main"
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