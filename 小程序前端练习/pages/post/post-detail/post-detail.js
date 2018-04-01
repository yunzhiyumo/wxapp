// pages/post/post-detail/post-detail.js
var postsData = require("../../../data/posts-data.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.setData({
      postId: postId
    })
    if (app.globalsData.g_isPlayingMusic && app.globalsData.g_postId === this.data.postId){
      this.setData({
        isPlayingMusic: true
      })
    }
    
    var postData = postsData.postList[postId];
    this.setData({
      posts_key: postData
    })
    var postsconnect = wx.getStorageSync("storage_key");
    if (postsconnect) {
      var postconnect = postsconnect[postId];
      this.setData({
        collected: postconnect
      })
    }
    else {
      var postsconnect = {};
      postsconnect[postId] = false;
      wx.setStorageSync("storage_key", postsconnect);
    }
    var that = this
    wx.onBackgroundAudioPlay(function(){
      that.setData({
        isPlayingMusic: true
      })
      app.globalsData.g_isPlayingMusic = true;
      app.globalsData.g_postId = that.data.postId;
    })
    var that = this
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalsData.g_isPlayingMusic = false;
      app.globalsData.g_postId = null;
    })
    var that = this
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalsData.g_isPlayingMusic = false;
      app.globalsData.g_postId = null;
    })
  },
  onCollectionTap: function (event) {
    var postsconnect = wx.getStorageSync("storage_key");
    var postconnect = postsconnect[this.data.postId];
    postconnect = !postconnect;
    postsconnect[this.data.postId] = postconnect;
    this.onshowModal(postsconnect, postconnect);
  },
  onshowModal: function (postsconnect, postconnect) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postconnect ? '收藏本文章?' : "取消收藏？",
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("storage_key", postsconnect)
          that.setData({
            collected: postconnect
          })
          that.onshowToast(postconnect)
        }
        else if (res.cancel) {
        }
      }
    })
  },
  onshowToast: function (postconnect) {
    wx.showToast({
      title: postconnect ? "收藏成功" : "取消成功",
    })
  },
  onShare: function () {
    var itemList = [
      "分享到微信",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
        })
      }
    })
  },
  onMusicTap: function (event) {
    var isPlayingMusic = {}
    if (!this.data.isPlayingMusic) {
      var musicurl = postsData.postList[this.data.postId].music.dataUrl
      wx.playBackgroundAudio({
        dataUrl: musicurl,
      })
      this.setData({
        isPlayingMusic: true
      })
    }
    else {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})