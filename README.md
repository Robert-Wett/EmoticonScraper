### [See a Live Demo](http://myemotions.herokuapp.com)
------
  
  
##### Example Screenshot:
![Example](https://raw.github.com/Robert-Wett/EmoticonScraper/master/public/img/Example.png)

### What is going on?
First, we are authenticating with [Twitters](http://api.twitter.com) new v1.1 API. We are using [ntwitter](https://github.com/AvianFlu/ntwitter) for the heavy lifting here. This is different than v1.0 because there is almost no such thing as a publicly available stream. Most of the important API calls are seriously rate-limited (15 reqs per hour.....damn). There used to be many public API endpoints that weren't authenticated or rate-limited in v1.0, but that went by the way-side when they had to scale. [Twitter](www.twitter.com) was nice enough to provide 3 streams with their v1.1 API that weren't rate-limited at all. These are called the [Public streams](https://dev.twitter.com/docs/streaming-apis/streams/public), which have 3 different options - 2 `GET` calls and 1 `POST` call. Obviously, the `GET`'s are just a simple siphon on the 'fire hose', but the `POST` call that allows input filter parameters is what we want to use here. To be honest, the traffic is so extreme with [Twitter](www.twitter.com) that you can just use the sample or firehose feed and programmatically (nodejs side) filter out any data that doesn't include an emoticon and it moves 'somewhat' slowly to the point where it might even be more informative. What this app uses is the [statuses/filter](https://dev.twitter.com/docs/api/1.1/post/statuses/filter) endpoint, that allows us to send [Twitter](www.twitter.com) a list of strings (in this case, emoticons) that we want them (*using their server power*) to filter public posts on. The list of 'strings' we filter for are defined in the [emoticons.js](https://github.com/Robert-Wett/EmoticonScraper/blob/master/modules/emoticons.js) file.


####Update:
I'm finally doing what I wanted to do all along with this thing, and convert it to an app that takes the socket.io data and updates the model data, which will be rendered in (near) real-time by angular. Check the `angular` branch for the latest, as of now. (2014/2/21)
