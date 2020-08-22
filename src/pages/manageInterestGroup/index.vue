<template>
  <div>
    <div class="head">
      <div style="margin:0 10px;">
        <i-row>
          <i-col span="6">
            <i-avatar size="avatar" src="../../../static/images/shoe.png" />
          </i-col>
          <i-col span="9">
            <p style="fong-size:15px;color:white;">球鞋狂人</p>
            <p style="font-size:10px;color:white;line-height:25px;">333个组员</p>
            <span style="font-size:11px;color:white;">2020-02-26(加入)</span>
          </i-col>
          <i-col span="9">
            <i-icon type="add" size="25" color="red" style="float:right;" />
            <span style="font-size:10px;color:white;">创建者：小火柴</span>
            <p style="font-size:10px;color:white;line-height:25px;">2010-11-25(建组)</p>
          </i-col>
        </i-row>
      </div>
      <div style="margin:10px;">
        <p style="font-size:12px;color:white;">介绍：为喜欢球鞋的同学，提供沟通交流！希望大家喜欢！</p>
      </div>
    </div>

    <div style="margin-top:10px;">
      <i-tabs :current="current" color="#14d0b6" @change="handleTabChange">
        <i-tab key="post" title="帖子列表"></i-tab>
        <i-tab key="member" title="组员列表"></i-tab>
      </i-tabs>
    </div>

    <div v-if="current === 'post'" style="background-color:#f3f4f5">
      <div style="margin-top:10px;">
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
      <div style="margin-top:10px;">
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
      <div style="margin-top:10px;">
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
    </div>

    <div style="margin-top:5px;" v-if="current === 'member'">
      <i-cell-group>
        <i-cell title="ZC">
          <view slot="icon">
            <i-avatar src="../../../static/images/comment-avatar.png" style="margin-right:10px;" />
          </view>
          <view slot="badge">
            <div style="margin-top:4%;">
              <span style="color:#9d9d9d;font-size:11px;">厦大思明 2019-12-12(加入)</span>
            </div>
          </view>
          <view slot="footer">
            <i-icon color="red" size="20" type="add" />
          </view>
        </i-cell>
        <i-cell title="花花">
          <view slot="icon">
            <i-avatar src="../../../static/images/comment-avatar.png" style="margin-right:10px;" />
          </view>
          <view slot="badge">
            <div style="margin-top:4%;">
              <span style="color:#9d9d9d;font-size:11px;">厦大思明 2019-12-12(加入)</span>
            </div>
          </view>
          <view slot="footer">
            <i-icon color="red" size="20" type="add" />
          </view>
        </i-cell>
      </i-cell-group>
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
export default {
  data() {
    return {
      imageUrl: img,
      current: "member"
    };
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
    },
    handleTabChange(detail) {
      this.current = detail.target.key;
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