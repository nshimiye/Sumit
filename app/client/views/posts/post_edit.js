Template.postEdit.helpers({
	getpostTags : function(){
		var currentPostId = this._id;
		var thispost = this;
	}
});

Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();
        
                var myTags = $(e.target).find('[name=sumit_tag]').children(".sumit_tag_body");
        var newTags = new Array();
        
        //parse the tagContainer to get all input tags
        myTags.each(function(i, mytag){
        	console.log(mytag);
        	newtag = $(mytag).children(".sumit_tag_in").text()
        	
        	if(newtag.trim() !== "")
        		if(newTags.indexOf() <= -1)
        			newTags.push(newtag.trim());
        });

console.log(newTags);

        var currentPostId = this._id;
        var postProperties = {
            title: $(e.target).find('[name=title]').val(),
            message: $(e.target).find('[name=message]').val(),
            tags: newTags
        }

        Posts.update(currentPostId, {$set: postProperties}, function(error) {
            if (error) {
                //display the error to the user
                Errors.throw(error.reason);
            } else {
                Router.go('postPage', {_id: currentPostId});
            }
        });
    },

    'click .delete': function(e) {
        e.preventDefault();
        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('home');
        }
    },	"click .edit_sumit_tag" :function() {
	
	

            }
});
