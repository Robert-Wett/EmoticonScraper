//               _   _   _              __
//              | | | | | |            / _|
// __      _____| |_| |_| | ___   __ _| |_
// \ \ /\ / / _ \ __| __| |/ _ \ / _` |  _|
//  \ V  V /  __/ |_| |_| | (_) | (_| | |
//   \_/\_/ \___|\__|\__|_|\___/ \__,_|_|
//
//

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , path = require('path')
  , twitter = require('ntwitter')
  , emo = require('./modules/emoticons.js')
  , _ = require('underscore')
  , events = require('events')
  , eventEmitter = events.EventEmitter();

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger());
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
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});


var opts = {
  rate: 0,
  resetCount: 100000000000000,
  throttleNum: 150,
  tweetLimit: 25,
  getLocation: false
};

var state = {
  topCount: 0,
  totalCount: 0,
  clientCount: 0,
  topEmoticon: {},
  roundNumber: 1
};

/* ----- Define Socket Events --------*/
io.sockets.on('connection', function(socket) {
  state.clientCount++;
  var returnData = {
    symbol: state.topEmoticon.symbol,
    count: state.topCount,
    list: emo.list
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
  state.rateLimit = 1;
  _.each(emo.list, function(elem) {
    elem.clear_state();
  });
};

var addTweetToEmoticon = function(tweetArray, tweet) {
  if (tweetArray.length >= opts.tweetLimit) {
    tweetArray.shift();
    tweetArray.push(tweet);
  } else {
    tweetArray.push(tweet);
  }
};

var handleTweet = function( tweet ) {
  /*
  if (opts.getLocation && tweet.place) {
    handleLocations(tweet);
  }
  */
  _.each(emo.list, function(elem) {
    _.each(tweet.text.split(" "), function(word) {
      if (elem.symbol === word && !_.contains(elem.tweets, tweet.text)) {
        elem.count++;
        state.totalCount++;
        addTweetToEmoticon(elem.tweets, tweet.text);
        emitTweetEvent(elem);
        if (elem.count > state.topCount) {
          emitTopEmoticonEvent(elem);
        }
        if (state.totalCount >= opts.resetCount) {
          elem.roundWins.push(state.roundNumber);
          state.roundNumber++;
          _clearState();
        }
      }
    });
  });
};

var consoleLogTweet = function( tweet ) {
  if (tweet.place !== null) {
    console.log(tweet);
  }
};

var emitTweetEvent = function(elem){
  var returnData = {
    html: elem.print_html(),
    total: state.totalCount,
    tweets: elem.print_tweets()
    //emo: elem
  };
  io.sockets.volatile.emit('tweet', returnData);
};

var emitTopEmoticonEvent = function(elem){
  var returnData = {
    symbol: elem.symbol,
    count: elem.count
  };
  state.topCount = elem.count;
  state.topEmoticon = elem;
  io.sockets.emit('topEmoticon', returnData);
};


// Start the stream
(function startStream( twit, throttleNum ) {
  twit.stream('statuses/filter', { track: emo.symbols }, function(stream) {
    stream.on('data', _.throttle(handleTweet, throttleNum));
  });
})(twit, opts.throttleNum);