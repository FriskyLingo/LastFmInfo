	var lfmApiRootUrl = "http://ws.audioscrobbler.com/2.0/?";
	var userName = "FriskyLingo";
	var apiKey = "fc649436b9874100c0615546e3fba578";
	var lfmApiUserInfoUrl = '&user=' + userName + '&api_key=' + apiKey +'&format=json';
	var lfmApiUsernameInfoUrl = '&username=' + userName + '&api_key=' + apiKey +'&format=json';
	
	var mostRecentTrack = {};
	var currentlyPlayingTrack = {};

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
				}
			});
	}, 5000);

	//Get last.fm recent tracks for user
	var updateNowPlaying = {
		onReady: function () {
	jQuery.ajax({
	  url: lfmApiRootUrl + 'method=user.getRecentTracks' + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data);
			var lfmUserRecentTracks = data.recenttracks;

			var $recentTracks2 = $(data.recenttracks.track);
			//console.log(lfmUserRecentTracks);

			mostRecentTrack = lfmUserRecentTracks.track[0];
			//console.log(mostRecentTrack);
			
			$('.scrobbles-subtext-track').html();
			$('.scrobbles-subtext-artist').html();
			$('.scrobbles-subtext-album').html();

			//Check if a track is currently playing
			if (mostRecentTrack['@attr'] != undefined) {
				//If the most recent track has @attr, it is currently being played
				//console.log("Currently Playing Track: [" + mostRecentTrack.name + "] by [" + mostRecentTrack.artist['#text'] + "]");
				currentlyPlayingTrack = mostRecentTrack;
				setTrackInfo(mostRecentTrack.artist['#text'], mostRecentTrack.name, userName);
				setArtistInfo(mostRecentTrack.artist['#text'], userName);
				setAlbumInfo(mostRecentTrack.artist['#text'], mostRecentTrack.album['#text'], userName);
				$('#spnStatusText').html(' is playing');
			} else {
				//If it doesn't have @attr, it's not currently playing
				//console.log("Most Recently Played Track: [" + mostRecentTrack.name + "] by [" + mostRecentTrack.artist['#text'] + "]");
				currentlyPlayingTrack = {};
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

			//console.log(amplify.store("userInfo"));
	});
}

function setRecentTracks() {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getRecentTracks' + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("recentTracks", data.recenttracks);

			//console.log(amplify.store("recentTracks"));
	});
}

function setWeeklyChartList() {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getWeeklyChartList' + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("weeklyChartList", data.weeklychartlist);

			//console.log(amplify.store("weeklyChartList"));
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

			//console.log(amplify.store("weeklyTrackChart"));
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

			//console.log(amplify.store("weeklyArtistChart"));
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

			//console.log(amplify.store("weeklyAlbumChart"));
	});
}

function setTopTracks(period) {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getTopTracks' + '&period=' + period + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("topTracks", data.toptracks);

			//console.log(amplify.store("topTracks"));
	});
}

function setTopArtists(period) {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getTopArtists' + '&period=' + period + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("topArtists", data.topartists);

			//console.log(amplify.store("topArtists"));
	});
}

function setTopAlbums(period) {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=user.getTopAlbums' + '&period=' + period + lfmApiUserInfoUrl
		}).done(function(data){
			//console.log(data.album);
			
			amplify.store("topAlbums", data.topalbums);

			//console.log(amplify.store("topAlbums"));
	});
}

function setTrackInfo(artist, track, username) {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=track.getInfo' + '&artist=' + artist + '&track=' + track + lfmApiUsernameInfoUrl
		}).done(function(data){
			if (data) {
				if (data.track) {
					amplify.store("trackInfo", data.track);
					
					if (data.track.userplaycount) {
						var playCount = data.track.userplaycount;
						$('.scrobbles-subtext-track').html('Track plays: <b>' + playCount + '</b>');
					}
				}
			}
	});
}

function setArtistInfo(artist, username) {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=artist.getInfo' + '&artist=' + artist + lfmApiUsernameInfoUrl
		}).done(function(data){
			if (data) {
				if (data.artist) {
					amplify.store("artistInfo", data.artist);
				
					if (data.artist.stats.userplaycount) {
						var playCount = data.artist.stats.userplaycount;
						$('.scrobbles-subtext-artist').html('<a href="http://www.last.fm/user/FriskyLingo/library/music/' + artist + '?sortBy=plays&sortOrder=desc" class="inherit">Artist plays: <b>' + playCount + '</b></a>');
					}
				}
                else {
                    amplify.store("artistInfo", "");
                    $('.scrobbles-subtext-artist').html();
                }
			}
	});
}

function setAlbumInfo(artist, album, username) {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=album.getInfo' + '&artist=' + artist + '&album=' + album + lfmApiUsernameInfoUrl
		}).done(function(data){
			if (data) {
				if (data.album) {
					amplify.store("albumInfo", data.album);
					
					if (data.album.userplaycount) {
						var playCount = data.album.userplaycount;
						$('.scrobbles-subtext-album').html('<a href="http://www.last.fm/user/FriskyLingo/library/music/' + artist + '/' + album + '?sortBy=plays&sortOrder=desc" class="inherit">Album plays: <b>' + playCount + '</b></a>');
					}
				}
                else {
                    amplify.store("albumInfo", "");
                    $('.scrobbles-subtext-album').html();
                }
			}
	});
}

function getLibraryTracks() {
	$.ajax({
  	  url: lfmApiRootUrl + 'method=library.getTracks' + '&user=FriskyLingo' + lfmApiUsernameInfoUrl
		}).done(function(data){
            if (data) {
                    if (data.tracks){
                        var totalNumberOfPages = data.tracks['@attr'].totalPages;
                        
                        for (i = totalNumberOfPages; i >= 1; i--) {
                            //console.log('Processing page [' + i + '] of [' + totalNumberOfPages + ']');
                            
                            $.ajax({
                                  url: lfmApiRootUrl + 'method=library.getTracks' + '&user=FriskyLingo' + '&page=' + i + lfmApiUsernameInfoUrl
                                    }).done(function(data2){
                                        if (data2) {
                                                if (data2.tracks){
                                                    var $tracks = $(data2.tracks.track);
                                                    
                                                    var artist, name, album, playCount;

                                                    $tracks.each(function () {
                                                        artist = $(this)[0].artist.name;
                                                        name = $(this)[0].name;
                                                        album = $(this)[0].album.name;
                                                        playCount = $(this)[0].playcount;
                                                        
                                                        console.log(name + "|" + artist + "|" + album +  "|" + playCount);
                                                    });
                                                }
                                        }
                                });
                        }
                    }
            }
	});
}


$(document).ready(function(){
	updateNowPlaying.onReady();
	setUserInfo();
	setRecentTracks();
	//setWeeklyChartList();
	//setTopTracks('overall');
	//setTopArtists('overall');
	//setTopAlbums('overall');
    //getLibraryTracks();
});

















//$('#myDashboard').html("adfgakdfhgakdjfg");