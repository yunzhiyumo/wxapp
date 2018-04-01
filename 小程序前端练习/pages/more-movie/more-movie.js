// pages/more-movie/more-movie.js
var app = getApp();
var util = require("../../utils/utils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{},
    navigateTitle:"",
    requestUrl:"",
    totalCount:0,
    isEmpty:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movietype = options.movietype;
    this.setData({
      navigateTitle: movietype
    })
    var urlBase = app.globalsData.urlBase;
    switch (movietype){
      case "正在热映":
        var url = urlBase + "/v2/movie/in_theaters";
      break;
      case "即将上映":
        var url = urlBase + "/v2/movie/coming_soon";
      break;
      case "Top250":
        var url = urlBase + "/v2/movie/top250";
      break;
    };
    this.setData({
      requestUrl:url
    })
    this.getMoviesUrl(url);

  },

  //下拉刷新
  onPullDownRefresh:function(event){
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movie = {};
    this.data.isEmpty = true;
    this.data.totalCount=0;
    this.getMoviesUrl(refreshUrl);
    wx.showNavigationBarLoading();
  },

  getMoviesUrl: function (url) {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: "GET",
      header: {
        "Content-type": "json"
      },
      success: function (res) {
        console.log(res.data)
        that.uniformData(res.data)
      }
    })
  },
  uniformData: function (thirtydata) {
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
    var totalMovies = {};
    if(!this.data.isEmpty){
      totalMovies = this.data.movieData.concat(movieData);
    }
    else{
      totalMovies = movieData;
      this.data.isEmpty = false;
    }
    this.setData({
      movieData: totalMovies
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },

  //下拉刷新
  onReachBottom:function(event){
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    this.getMoviesUrl(nextUrl);
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
  onMovieClick: function (event) {
    var movieid = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '/pages/movie-detail/movie-detail?movieid=' + movieid,
    })
  }
})