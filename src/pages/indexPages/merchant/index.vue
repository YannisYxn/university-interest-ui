<template>
  <div>
    <div v-if="current === 'interestgroup'">
      <div class="head">
        <i-input
          v-model="searchKey"
          placeholder="请输入学校名称查看其校的校趣"
          maxlength="50"
          confirmType="search"
          mode="wrapped"
          style="width: 100%"
          @confirm="handleSearch"
          @change="handleSearchChange"
        />
        <i-icon
          type="delete_fill"
          size="25"
          style="margin-right: 5px"
          color="#ececec"
          @click="handleClearSearch"
        />
      </div>
      <div class="label">
        <span style="margin: 5px; color: #ffffff">{{ barTitle }}</span>
      </div>

      <!-- 兴趣组列表 -->
      <div style="margin-top: 5px">
        <i-cell-group>
          <i-cell
            v-for="group in groupList"
            :key="group.id"
            :title="group.name"
            @click="handleInterestGroup(group.id)"
          >
            <view slot="icon">
              <i-avatar :src="group.logo"></i-avatar>
            </view>
            <view slot="badge">
              <div style="margin-right: 10px">
                <div style="width: 50px">
                  <i-icon size="25" type="barrage_fill" color="#67ddd3" />
                  <span style="color: #67ddd3; float: right">{{
                    group.postCount > 999 ? "999+" : group.postCount
                  }}</span>
                </div>
              </div>
            </view>
          </i-cell>
        </i-cell-group>
      </div>
    </div>

    <div v-else>
      <div v-for="ticket in ticketList" :key="ticket.id" style="margin-top:20px;width:100%;">
        <exchange-card v-if="ticket.type == 1" :background="normalExchange">
          <view slot="content">
            <i-row>
              <i-col span="15">
                <div style="border-right: solid white 1px;padding:6px;">
                  <p style="font-size:25px;line-height:30px;color:white;font-weight:bold;">{{ ticket.money }}元</p>
                  <p style="font-size:20px;line-height:25px;color:white;">{{ ticket.sellerName }}</p>
                  <p style="font-size:10px;line-height:20px;color:white;">{{ ticket.description }}</p>
                  <p style="font-size:10px;line-height:15px;color:white;">使用有效日期：兑换时间{{ ticket.deadline }}前</p>
                </div>
              </i-col>
              <i-col span="9">
                <div style="text-align:center;">
                  <p style="font-size:18px;line-height15px;color:white;margin:10px;font-weight:bold;">{{ ticket.needCreditNum }}积分</p>
                  <p style="font-size:10px;line-height:15px;color:white;">剩余：{{ ticket.remainingNum }}张</p>
                </div>
              </i-col>
            </i-row>
          </view>
        </exchange-card>
        <exchange-card v-else group :background="groupExchange">
          <view slot="content">
            <i-row>
              <i-col span="15">
                <div style="border-right: solid white 1px;padding:6px;">
                  <p style="font-size:25px;line-height:30px;color:white;font-weight:bold;">{{ ticket.money }}元</p>
                  <p style="font-size:20px;line-height:25px;color:white;">{{ ticket.sellerName }}</p>
                  <p style="font-size:10px;line-height:20px;color:white;" v-html="ticket.description">{{  }}</p>
                </div>
              </i-col>
              <i-col span="9">
                <div style="text-align:center">
                  <p style="font-size:18px;line-height15px;color:white;margin:10px;font-weight:bold;">{{ ticket.needCreditNum }}积分</p>
                  <p style="font-size:10px;line-height:15px;color:white;">剩余：{{ ticket.remainingNum }}张</p>
                </div>
              </i-col>
            </i-row>
          </view>
        </exchange-card>
      </div>

      <div style="margin-top:25px;">
        <i-load-more v-if="ticketList.length === 0" tip="当前无优惠券" :loading="false" />
        <i-load-more v-else :loading="false" />
      </div>
    </div>

    <div>
      <i-tab-bar :current="current" color="#14d0b6" fixed @change="handleTabChange">
        <i-tab-bar-item
          key="interestgroup"
          title="兴趣组"
          :img="university"
          :current-img="universityActive"
        ></i-tab-bar-item>
        <i-tab-bar-item
          key="exchange"
          title="兑换"
          :img="corpus"
          :current-img="corpusActive"
        ></i-tab-bar-item>
      </i-tab-bar>
    </div>
  </div>
</template>

<script>
import getQuery from "../../../utils/getPage";
import normalExchange from "../../../../static/images/normal_exchange.png";
import groupExchange from "../../../../static/images/group_exchange.png";
import university from "../../../../static/tabs/university.png";
import universityActive from "../../../../static/tabs/university-active.png";
import corpus from "../../../../static/tabs/corpus.png";
import corpusActive from "../../../../static/tabs/corpus-active.png";

export default {
  data() {
    return {
      groupList: [],
      ticketList: [],
      searchKey: "",
      barTitle: "厦门大学",
      current: "interestgroup",
      normalExchange: normalExchange,
      groupExchange: groupExchange,
      university: university,
      universityActive: universityActive,
      corpus: corpus,
      corpusActive: corpusActive
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
    this.searchKey = "";
    this.userId = getQuery.getQuery().userId;
    this.barTitle = "厦门大学";

    this.$wxhttp
      .post({
        url: "/group/getGroupsByUniversity?universityName=" + "厦门大学",
      })
      .then((resp) => {
        if (resp.code === 0) {
          this.groupList = resp.data;
          wx.setNavigationBarTitle({
            title: "厦门大学兴趣组",
          });
          this.getTicketList();
        }
      });
  },
  methods: {
    handleSearchChange(event) {
      console.log(event);
      this.searchKey = event.mp.detail.detail.value;
    },
    handleSearch() {
      // 根据学校名搜索该校校区兴趣组
      this.getGroupList();
      
      wx.setNavigationBarTitle({
        title: "厦门大学兴趣组",
      });
    },
    getGroupList() {
      this.$wxhttp
        .post({
          url: "/group/getGroupsByUniversity?universityName=" + this.searchKey,
        })
        .then((resp) => {
          if (resp.code === 0) {
            this.groupList = resp.data;
            this.barTitle = this.searchKey;
            wx.setNavigationBarTitle({
              title: this.searchKey + "兴趣组",
            });
            this.getTicketList();
          }
        });
    },
    handleClearSearch() {
      this.$wxhttp
        .post({
          url: "/group/getGroupsByUniversity?universityName=" + "厦门大学",
        })
        .then((resp) => {
          if (resp.code === 0) {
            this.groupList = resp.data;
            this.barTitle = "厦门大学";
            wx.setNavigationBarTitle({
              title: "厦门大学兴趣组",
            });
          }
        });
      this.searchKey = "";
      this.barTitle = "厦门大学";
      wx.setNavigationBarTitle({
        title: "厦门大学兴趣组",
      });
      this.getTicketList();
    },
    handleInterestGroup(groupId) {
      wx.navigateTo({
        url:
          "../interestGroup/main?groupId=" + groupId + "&userId=" + this.userId,
      });
    },
    handleTabChange() {
      this.current = this.current === "interestgroup" ? "exchange" : "interestgroup";
    },
    getTicketList() {
      wx.showLoading({
        title: "加载中"
      });
      this.$wxhttp.get({
        url: "/ticket?userId=" + this.userId + "&universityName=" + this.barTitle
      }).then(resp => {
        if(resp.code === 0){
          this.ticketList = resp.data.map(item => {
            return {
              ...item,
              deadline: this.$moment(item.deadline).format("YYYY-MM-DD")
            }
          });
        }else{
          wx.showToast({
            title: resp.msg,
            icon: "none",
            duration: 3000
          });
        }
      })
    },
  },
};
</script>

<style>
.head {
  display: flex;
  align-items: center;
  padding: 5px;
  background-image: linear-gradient(to bottom, #14d0b6, #0ed4d6);
}
.label {
  margin-top: 10px;
  background-image: linear-gradient(to right, #14d0b6, #0ed4d6);
  height: 35px;
  display: flex;
  align-items: center;
  width: 60%;
  border-bottom-right-radius: 50px;
  border-top-right-radius: 50px;
}
</style>