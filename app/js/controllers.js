'use strict';

/* Controllers */

angular.module('app.controllers', [])
    .controller('MyCtrl1', [function() {}])
    .controller('MyCtrl2', [function() {}]);

app.controller('SocketController', ['$scope', 'socket']) {
    socket.on('tweet', function(data) {
        //Code......
        /*
            We are going to basically just spit this out to our main 
            $scope.model - let the angular sweetness take care of the 
            binding/realtime updates and sweetness.
         */
         $scope.html   = data.html;
         $scope.total  = data.total;
         $scope.tweets = data.tweets;
    });
    socket.on('topEmoticon', function(data) {
        $scope.topSymbol = data.symbol;
        $scope.topCount  = data.count;
    });
};


/*
var handleTweet = function( tweet ) {
  if (state.rateLimit === opts.rate) {
    _.each(emo.list, function(elem) {
      _.each(tweet.text.split(" "), function(word) {
        if (elem.symbol === word && !_.contains(elem.tweets, word)) {
          elem.count++;
          elem.tweets.push(tweet.text);
          state.totalCount++;
          emitTweetEvent(elem);
          if (elem.count > state.topCount) {
            emitTopEmoticonEvent(elem);
          }
          if (state.totalCount >= 200) {
            _clearState();
          }
        }
      });
    });
    state.rateLimit =  0;
  } else {
    state.rateLimit++;
  }

};


var emitTweetEvent = function(elem){
  var returnData = {
    html: elem.print_html(),
    total: state.totalCount,
    tweets: elem.print_tweets()
  };
  io.sockets.volatile.emit('tweet', returnData);
};

var emitTopEmoticonEvent = function(elem){
  var returnData = {
    symbol: elem.symbol,
    count: elem.count
  };
  state.topCount = elem.count;
  state.topEmotion = elem;
  io.sockets.emit('topEmoticon', returnData);
};

 */