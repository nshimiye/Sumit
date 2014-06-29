Template.postSubmit.events({
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

	//create a post with user info
        var post = {
            title: $(e.target).find('[name=title]').val(),
            message: $(e.target).find('[name=message]').val(),
            tags: newTags
        }

        Meteor.call('post', post, function(error, id) {
            if (error) {
                //display the error to the user
                Errors.throw(error.reason);

                if (error.error === 302)
                    Router.go('postPage', {_id: error.details})
            } else {
            
            	$( "#for_psubmit" ).animate({
    		height: "toggle"
  		}, 2000, function() {
    		// Animation complete.
    		Session.set("show_post_form", false);
  		});
            
                Router.go('postPage', {_id: id});
            }
        });
    },
    "click .cancel_new_post" : function(e){
		e.preventDefault();
		console.log("yes yes here ...")
		
		if(Session.get("show_post_form")){
		 $( "#for_psubmit" ).animate({
    		height: "toggle"
  		}, 2000, function() {
    		// Animation complete.
    		Session.set("show_post_form", false);
  		});
  		}
		
	},
	"click .attach_new" : function(e){
		e.preventDefault();
		$("#attach").trigger("click");
		
	},
	"change #attach": function(event, template){
   var func = this;
   //var files = event.currentTarget.files;
     console.log("--------------------%%%%%%%%%%%%%%%%%%5_____________-----------------");
     $.each(event.currentTarget.files, function(i, file){
     	console.log(file.name);
     })
         
        console.log("--------------------%%%%-----------------%%%%%%%%%%%%%%5_____________-----------------");
   
   /*     
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
      Meteor.call('file-upload', file, reader.result);
   };
   reader.readAsBinaryString(file);
   
   */
   
}
	
});
