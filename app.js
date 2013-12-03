var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , path = require('path')
  , twitter = require('ntwitter')
  , emo = require('./modules/emoticons.js')
  , _ = require('underscore');

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
  res.render('tweets');
});
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var twit = new twitter({
    consumer_key: 'your key here',
    consumer_secret: 'your secret here',
    access_token_key: 'your token key here',
    access_token_secret: 'your token secret here'
});

var opts = {
  rate: 10
}
var state = {
  topCount: 0,
  totalCount: 0,
  clientCount: 0,
  rateLimit: 0,
  topEmotion: {}
};

/* ----- Define Socket Events --------*/
io.sockets.on('connection', function(socket) {
  //console.log('Connected');
  state.clientCount++;
  var returnData = {
    symbol: state.topEmotion.symbol,
    count: state.topCount
  };
  socket.emit('initData', returnData);
});

io.sockets.on('disconnect', function(socket) {
  state.clientCount--;
});

var _clearState = function() {
  state.topCount = 0;
  state.totalCount = 0;
  state.clientCount = 0;
  state.rateLimit = 0;
  _.each(emo.list, function(elem) {
    elem.clear_state();
  });
};

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


(function startStream( twit ) {
  twit.stream('statuses/filter', { track: emo.symbols }, function(stream) {
    stream.on('data', handleTweet);
  });
})(twit);