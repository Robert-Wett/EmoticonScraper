var _ = require('underscore');

function emoticon(symbol, count, positive, desc, wins) {
  this.symbol = symbol;
  this.count = count || 0;
  this.positive = positive || false;
  this.desc = desc || ':-X';
  this.roundWins = wins || [];
  this.tweets = [];
}

emoticon.prototype.print = function() {
  return this.symbol + '\n------\n' +
        "Count: " + this.count + '\n' +
        "Positive emotion?: " + this.positive + '\n' +
        "Description: " + this.desc + '\n';
};

emoticon.prototype.print_html = function() {
    var html = [];
    html.push('<div id="current"><h1>'+ this.symbol +'</h1>');
    html.push('<h6>Count: '+ this.count +'</h6>');
    html.push('</div></li>');
    return html.join('');
};

emoticon.prototype.print_tweets = function() {
  var html = [];
  _.each(this.tweets, function(elem) {
    html.push('<tr><td>' + elem + '</td></tr>');
  });
  return html.join("");
};

emoticon.prototype.print_sad_tweets = function() {
  if (this.symbol === ':( ') {
    var html = [];
    _.each(this.tweets, function(elem) {
      html.push('<tr><td>' + elem + '</td></tr>');
    });
    return html.join("");
  }
};

emoticon.prototype.clear_state = function() {
  this.count = 0;
  // We'll track wins for now via state, not DB
  //this.roundWins = [];
  this.tweets = [];
};

var emo_list = [];
var symbolList = [];

_.map([':-)', ':)', ':o)',
       ':]' , ':3', ':c)',
       ':>' , '=]', '8)' ,
       '=)' , ':}', ':^)',
       ':っ)'],
  function(entry) {
    emo_list.push(new emoticon(entry, 0, true, 'happy'));
    symbolList.push(entry);
});

_.map(['>:P', ':-P', ':P' ,
       'X-P', 'x-p', 'xp' ,
       'XP' , ':-p', ':p' ,
       '=p' , ':-Þ', ':Þ' ,
       ':þ' , ':-þ', ':-b',
       ':b'],
  function(entry) {
    emo_list.push(new emoticon(entry, 0, true, 'playful'));
    symbolList.push(entry);
});

_.map([':-D', ':D', '8-D', '8D',
       'x-D', 'xD', 'X-D', 'XD',
       '=-D', '=D', '=-3', '=3',
       'B^D'],
  function(entry) {
    emo_list.push(new emoticon(entry, 0, true, 'big smiles'));
    symbolList.push(entry);
 });

_.map([';-)', ';)' , '*-)',
       '*)' , ';-]', ';]' ,
       ';D' , ';^)', ':-,'],
  function(entry) {
    emo_list.push(new emoticon(entry, 0, true, 'happy/smiles/playful winks'));
    symbolList.push(entry);
});

_.map(['>:\\', '>:/', ':-/',
       ':-.' , ':/' , ':\\',
       '=/'  , '=\\', ':L' ,
       '=L'  , ':S' , '>.<' ],
  function(entry) {
    emo_list.push(new emoticon(entry, 0, false, 'annoyed'));
    symbolList.push(entry);
});

_.map(['>:[', ':-(', ':(' ,
       ':-c', ':c' , ':-<',
       ':っC', ':<' , ':-[',
       ':[' , ':{' ],
  function(entry) {
    emo_list.push(new emoticon(entry, 0, false, 'sad'));
    symbolList.push(entry);
});


var getSortedList = function( num, sortDesc, fullObject ) {
  var returnList;

  if (!num || num < 1) {
    // Default to just '10' entries to return.
    num = 10;
  }
  else if (num > emo_list.length) {
    num = emo_list.length;
  }

  if (!sortDesc || typeof sortDesc !== 'boolean') {
    // Default to 'Descending' type of sort.
    sortDesc = -1;
  }
  else {
    sortDesc = sortDesc === true ? -1 : 1;
  }

  if (typeof fullObject !== 'boolean') {
    fullObject = true;
  }

  returnList = _.chain(emo_list)
    .sortBy(function(emo) { return emo.count * sortDesc; })
    .first(num)
    ._wrapped;

  if (fullObject) {
    return returnList;
  }
  else {
    return _.map(returnList, function(emo) {
      return {name: emo.symbol, count: emo.count };
    });
  }
};

exports.emoticon = emoticon;
exports.list = emo_list;
exports.symbols = symbolList;
exports.getSortedList = getSortedList;