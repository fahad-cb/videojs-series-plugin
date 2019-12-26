# videojs-series-plugin
This plugin creates a series episodes switch button very swiftly (just like netflix player)

## Usage

Add video js source and plugin source in your html
```html
<link href="http://vjs.zencdn.net/{version}/video-js.css" rel="stylesheet">
<link href="videojs.series.css" rel="stylesheet">
<script src="http://vjs.zencdn.net/{version}/video.js"></script>
<script src='videojs.series.js'></script>
```

Initialize your player and plugin
```javascript
var video = videojs('test_video');
//load the marker plugin
video.series({
  name : 'Series',
  seasons: [{
       'season_id' : '1',
       'episodes': [
            { thumb : "http:thumbnail link", id : "1", link : "http:video link" },
            { thumb : "http:thumbnail link", id : "2", link : "http:video link" }]
     },
     {
       'season_id' : '2',
       'episodes': [
            { thumb : "http:thumbnail link", id : "1", link : "http:video link" },
            { thumb : "http:thumbnail link", id : "2", link : "http:video link" }]
      
     }]
});
```


