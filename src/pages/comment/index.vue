<template>
  <div>
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

    <div style="background-color:#f3f4f5;height:10px;margin-top:5px;"></div>

    <div>
      <i-cell-group>
        <i-comment-cell
          title="ZC"
          label="厦大思明"
          time="2km 2019-12-12 10:22"
          content="好久不见，我去你学校找你玩亚"
        >
          <view slot="icon">
            <i-avatar src="../../../static/images/comment-avatar.png" style="margin-right:10px;" />
          </view>
          <view slot="footer">
            <i-icon type="add" color="red" size="15" />
          </view>
        </i-comment-cell>
        <i-comment-cell
          title="ZC"
          label="厦大思明"
          time="2km 2019-12-12 10:22"
          content="好久不见，我去你学校找你玩亚"
        >
          <view slot="icon">
            <i-avatar src="../../../static/images/comment-avatar.png" style="margin-right:10px;" />
          </view>
          <view slot="footer">
            <i-icon type="add" color="red" size="15" />
          </view>
        </i-comment-cell>
      </i-cell-group>
    </div>

    <div style="position:absolute;bottom:0;width:100%">
      <i-row>
        <i-col span="18">
          <i-input placeholder="评论" :maxlength="33" comment />
        </i-col>
        <i-col span="6">
          <i-button size="small" type="primary" shape="circle">发送</i-button>
        </i-col>
      </i-row>
    </div>
  </div>
</template>

<script>
import img from "../../../static/images/shoe.png";
export default {
  data() {
    return {
      imageUrl: img
    }
  }
}
</script>

<style>
</style>