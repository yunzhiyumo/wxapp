// pages/movies/movies.js
var util = require("../../utils/utils.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPannelShow: false,
    searchUrlType:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = app.globalsData.urlBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalsData.urlBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalsData.urlBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMoviesUrl(inTheatersUrl, "inTheaters", "正在热映");
    this.getMoviesUrl(comingSoonUrl, "comingSoon", "即将上映");
    this.getMoviesUrl(top250Url, "top250", "Top250");
  },

  getMoviesUrl: function (url, settedkey, movietype) {
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: "GET",
      header: {
        "Content-type": "json"
      },
      success: function (res) {
        console.log(res)
        that.uniformData(res.data, settedkey, movietype)
      }
    })
  },
  uniformData: function (thirtydata, settedkey, movietype) {
    var movieData = [];
    for (var i in thirtydata.subjects) {
      var tempdata = thirtydata.subjects[i];
      var title = tempdata.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: tempdata.rating.average,
        coverageUrl: tempdata.images.large,
        movieId: tempdata.id,
        star: util.convertToStarsArray(tempdata.rating.stars),
      }
      movieData.push(temp);
    }
    var postData = {};
    postData[settedkey] = {
      movietype: movietype,
      movieData: movieData
    };
    this.setData(postData)
  },
  onMoreTap: function (event) {
    var movietype = event.currentTarget.dataset.movietype;
    wx.navigateTo({
      url: '/pages/more-movie/more-movie?movietype=' + movietype,
    })
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

  },

  onBindChange: function (event) {
    var text = event.detail.value;  //表单都是类似方式获取到值
    console.log(text);
    var searchUrl = app.globalsData.urlBase + "/v2/movie/search?q=" + text;
    this.getMoviesUrl(searchUrl, "searchUrlType", "");
  },
  onBindFous: function (event) {
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      searchUrlType: {}
    })
  },
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPannelShow: true,
    })
  },
  //电影详情
  onMovieClick: function (event) {
    var movieid = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '/pages/movie-detail/movie-detail?movieid=' + movieid,
    })
  },
})