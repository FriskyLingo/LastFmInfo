	var lfmApiRootUrl = "http://ws.audioscrobbler.com/2.0/?";
	var userName = "FriskyLingo";
	var apiKey = "fc649436b9874100c0615546e3fba578";
	var lfmApiUserInfoUrl = '&user=' + userName + '&api_key=' + apiKey +'&format=json';
	
	var mostRecentTrack = {};

	setInterval(function() {
		//Get last.fm recent tracks for user
		jQuery.ajax({
		  url: lfmApiRootUrl + 'method=user.getRecentTracks' + lfmApiUserInfoUrl
			}).done(function(data){
				//console.log(data);
				var $recentTracks = $(data.recenttracks.track);
				//console.log($lfmUserRecentTracks2);

				var mostRecentTrack2 = $recentTracks[0];
				//console.log(mostRecentTrack);
				//console.log(mostRecentTrack2);
				
				if (mostRecentTrack2.name != mostRecentTrack.name) {
					//console.log("most recent track changed!");
					updateNowPlaying.onReady();
					recentlyPlayed.update($recentTracks);
				}
				//recentlyPlayed.update($recentTracks);
			});
	}, 5000);
	
	var recentlyPlayed = {
		onReady: function () {
			console.log("onready");
			
			$.ajax({
			  url: lfmApiRootUrl + 'method=user.getRecentTracks' + lfmApiUserInfoUrl
			}).done(function(data){
				var $recentTracks = $(data.recenttracks.track);
				$("#myDashboard").empty();
			
				$recentTracks.each(function(){
					//console.log($(this)[0]);
					
					var trackName = $(this)[0].name;
					var trackArtist = $(this)[0].artist['#text']
					var trackPlayDate = $(this)[0].date['#text'];
					
					$("#myDashboard").append('<li><span>' + trackName + ' <i>by</i> ' + trackArtist + ' <i>(played at ' + trackPlayDate + ')</i></span></li>');
				});
			});
		},
		update: function ($recentTracks) {
			//console.log("update");
			$("#myDashboard").empty();
			
			$recentTracks.each(function(){
				var trackName = $(this)[0].name;
				var trackArtist = $(this)[0].artist['#text']
				var trackPlayDate = $(this)[0].date['#text'];
				
				$("#myDashboard").append('<li><span>' + trackName + ' <i>by</i> ' + trackArtist + ' <i>(played at ' + trackPlayDate + ')</i></span></li>');
			});
		}
	}

	//Get last.fm recent tracks for user
	var updateNowPlaying = {
		onReady: function () {
	jQuery.ajax({
	  url: lfmApiRootUrl + 'method=user.getRecentTracks' + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data);
			var lfmUserRecentTracks = data.recenttracks;
			var $recentTracks2 = (data.recenttracks.track);
			//console.log(lfmUserRecentTracks);

			mostRecentTrack = lfmUserRecentTracks.track[0];
			//console.log(mostRecentTrack);

			//Check if a track is currently playing
			if (mostRecentTrack['@attr'] != undefined) {
				//If the most recent track has @attr, it is currently being played
				//console.log("Currently Playing Track: [" + mostRecentTrack.name + "] by [" + mostRecentTrack.artist['#text'] + "]");
				$('#spnStatusText').html(' is playing');
			} else {
				//If it doesn't have @attr, it's not currently playing
				//console.log("Most Recently Played Track: [" + mostRecentTrack.name + "] by [" + mostRecentTrack.artist['#text'] + "]");
				$('#spnStatusText').html(' just played');
			}
			
			
			
			$('.track-name')
				.text(mostRecentTrack.name)
				.attr('href', mostRecentTrack.url);
				
			$('.artwork')
				.attr('href', mostRecentTrack.url);

			var artistInfo = {}; 

			jQuery.ajax({
		  	  url: lfmApiRootUrl + 'method=artist.getInfo&artist=' + mostRecentTrack.artist['#text'] + lfmApiUserInfoUrl
				}).done(function(data){
					//console.log(data.artist);
					artistInfo = data.artist;
					$('.artist-name a')
						.text(mostRecentTrack.artist['#text'])
						.attr('href', data.artist.url);
						
						var imageUrl = "";
						var maxImageCount = 0;
			
						if (mostRecentTrack.album['#text'] != "") {
							//If the track DOES have an album, use the ALBUM artwork
							jQuery.ajax({
						  	  url: lfmApiRootUrl + 'method=album.getInfo&artist=' + mostRecentTrack.artist['#text'] + '&album=' + mostRecentTrack.album['#text'] + lfmApiUserInfoUrl
								}).done(function(data){
									//console.log(data.album);
						
									maxImageCount = mostRecentTrack.image.length - 1;
									imageUrl = mostRecentTrack.image[maxImageCount]['#text'];
						
									//console.log(imageUrl);
						
									$('.art').css('background-image', 'url(' + imageUrl + ')');
									$('.main-art').attr('src', imageUrl).attr('alt','Artwork for ' + mostRecentTrack.name);
							});
						} else {
							//If the track DOES NOT have an album, use ARTIST artwork
							maxImageCount = artistInfo.image.length - 1;
							
							imageUrl = artistInfo.image[maxImageCount]['#text'];
							$('.art').css('background-image', 'url(' + imageUrl + ')');
							$('.main-art').attr('src', imageUrl).attr('alt','Artwork for ' + mostRecentTrack.name);
						}
			});
		});
	}
};


function setUserInfo() {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getInfo' + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("userInfo", data.user);

			console.log(amplify.store("userInfo"));
	});
}

function setRecentTracks() {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getRecentTracks' + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("recentTracks", data.recenttracks);

			console.log(amplify.store("recentTracks"));
	});
}

function setWeeklyChartList() {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getWeeklyChartList' + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("weeklyChartList", data.weeklychartlist);

			console.log(amplify.store("weeklyChartList"));
	});
}

function setWeeklyTrackChart(beginDate, endDate) {
	var dateRange = "";
	
	if (beginDate != undefined) {
		dateRange = "&from='" + beginDate + "'&to='" + endDate + "'";
	}
	
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getWeeklyTrackChart' + dateRange + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("weeklyTrackChart", data.weeklytrackchart);

			console.log(amplify.store("weeklyTrackChart"));
	});
}

function setWeeklyArtistChart(beginDate, endDate) {
	var dateRange = "";
	
	if (beginDate != undefined) {
		dateRange = "&from='" + beginDate + "'&to='" + endDate + "'";
	}
	
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getWeeklyArtistChart' + dateRange + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("weeklyArtistChart", data.weeklyartistchart);

			console.log(amplify.store("weeklyArtistChart"));
	});
}

function setWeeklyAlbumChart(beginDate, endDate) {
	var dateRange = "";
	
	if (beginDate != undefined) {
		dateRange = "&from='" + beginDate + "'&to='" + endDate + "'";
	}
	
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getWeeklyAlbumChart' + dateRange + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("weeklyAlbumChart", data.weeklyalbumchart);

			console.log(amplify.store("weeklyAlbumChart"));
	});
}

function setTopTracks(period) {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getTopTracks' + '&period=' + period + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("topTracks", data.toptracks);

			console.log(amplify.store("topTracks"));
	});
}

function setTopArtists(period) {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getTopArtists' + '&period=' + period + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("topArtists", data.topartists);

			console.log(amplify.store("topArtists"));
			
			var $artists = $(data.topartists.artist);
			var graphData = [];
			var graphData2 = [];
			$artists.each(function (index, artist){
				console.log(artist);
				graphData.push({x: index, y: Math.floor(artist.playcount)});
				graphData2.push([Math.floor(artist.playcount), index]);
			});
			
			//console.log(graphData);
			
			var graph = new Rickshaw.Graph({
				element: document.querySelector("#chart"),
				renderer: 'bar',
				series: [{
					data: graphData,
					color: 'steelblue'
				}]
			});
			
			var xAxis = new Rickshaw.Graph.Axis.X({
				graph: graph
			});

			xAxis.render();
			
			var yAxis = new Rickshaw.Graph.Axis.Y({
				graph: graph
			});

			yAxis.render();
			
			var hoverDetail = new Rickshaw.Graph.HoverDetail( {
				graph: graph
			} );
			 
			graph.render();
			
			
			
			
			
			var data2 = [
			['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14], 
			['Out of home', 16],['Commuting', 7], ['Orientation', 9]
		  ];
		  var plot1 = $.jqplot ('chartdiv', [graphData2], 
			{ 
			  seriesDefaults: {
					renderer:$.jqplot.BarRenderer,
					// Show point labels to the right ('e'ast) of each bar.
					// edgeTolerance of -15 allows labels flow outside the grid
					// up to 15 pixels.  If they flow out more than that, they 
					// will be hidden.
					pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
					// Rotate the bar shadow as if bar is lit from top right.
					shadowAngle: 135,
					// Here's where we tell the chart it is oriented horizontally.
					rendererOptions: {
						barDirection: 'horizontal'
					}
				},
				axes: {
					yaxis: {
						renderer: $.jqplot.CategoryAxisRenderer
					}
				}
			}
		  );
	});
}

function setTopAlbums(period) {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getTopAlbums' + '&period=' + period + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("topAlbums", data.topalbums);

			console.log(amplify.store("topAlbums"));
	});
}


$(document).ready(function(){
	updateNowPlaying.onReady();
	recentlyPlayed.onReady();
	setUserInfo();
	setRecentTracks();
	setWeeklyChartList();
	//setWeeklyTrackChart();
	setTopTracks('overall');
	setTopArtists('overall');
	setTopAlbums('overall');
});

















//$('#myDashboard').html("adfgakdfhgakdjfg");