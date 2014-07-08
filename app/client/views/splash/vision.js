
Template.vision.helpers({

	play_video : function(){
		return Session.get("play_video");
	}

});

Template.vision.events({
	"click .player_btn" : function(e){
		e.preventDefault();
		Session.set("play_video", true);
	}
});

Template.video.rendered = function() {
  var tag = document.createElement("script");

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var player;
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player("player", {
      videoId: "dRjE1JwdDLI",
      playerVars: {
        autohide: 1,
        modestbranding: 1,
        playsinline: 1,
        showinfo: 0,
        cc_load_policy: 1,
        rel: 0
      },
      events: {
        "onReady": onPlayerReady,
        "onStateChange": onPlayerStateChange
      }
    });
  };

  //Autoplays the video. Bad idea? great idea!!!
  function onPlayerReady(e) {
    e.target.playVideo();
  }

  function onPlayerStateChange(e) {
    if (e.data == YT.PlayerState.ENDED) {
      $.fn.fullpage.moveSectionDown();
    }
  }
};
