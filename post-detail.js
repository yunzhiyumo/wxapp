<html>
<image wx:if="{{collected}}" catchtap="clickstore" src="/images/a.png"></image>
<image wx:else catchtap="clickstore" src="/images/b.png"></image>
</html>





js
Page({
  var stroage_list = {
    "1":ture;
    "2":false;
  }
  
  onLoad function(options){
    var postId = options.id;
    this.data.current = postId;
    var postscollect = wx.getStorageSync("stroage_list");
    if(postscollect){
     var postcollect = postscollect[postId];
     this.setData({
        collected:postcollect;
     })
    }
    else{
      var postscollect = {};
      postscollect[postId] = false;
      wx.setStorageSync("stroage_list",postscollect);
    }
  }
  
  
  clickstore function(event){
    var postscollect = wx.getStorageSync("stroage_list");
    var postcollect = postscollect[this.data.current];
    postcollect = !postcollect;
    postscollect[this.data.current] = postcollect;
    wx.setStorageSync("stroage_list",postscollect);
    this.setData({
      collected:postcollect;
    })
  }
  
})
