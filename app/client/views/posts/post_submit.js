Template.postSubmit.helpers({
	initTag : function(){
		Session.set("nofoundtag", "Tags");

	},
	 attachments : function(){
	 	return Session.get(" attachments");
	 }

})

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
            tags: newTags,
            links: allLinks,
            files: allFiles
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
  		
  				//clean up here
  				allLinks = null; allFiles = null; newTags = null;
  				Session.set("attachments", []);
  				Session.set("links", []);
  				 
            
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
     	
     	
     	addFile(allFiles, file.name, "attachment");
     	
     	
     });
     
     var tmp = new Array();
     $.each(allFiles, function(i, fname){
     	tmp.push({attachment: fname});
     });
         Session.set("attachments", tmp);
        
        console.log("--------------------%%%%-----------------%%%%%%%%%%%%%%5_____________-----------------");
   
   /*     
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
      Meteor.call('file-upload', file, reader.result);
   };
   reader.readAsBinaryString(file);
   
   */
   
},
	"click .links_new" : function(e){
		e.preventDefault();
		 console.log("---------------------")
		$(".link_input").css({
			display: "block"
		});
		
	}
	
});


//================for files =====
var allFiles = new Array();
function addFile( array, fname, type){ 
	var fi = array.indexOf(fname);
	console.log(array);
	if(fi >=0) //avoid duplicates
		return false;
		
	
	array.push(fname);
		
	var tmp = new Array();
	if(type === "link"){
	
		$.each(array, function(i, fname){
     		tmp.push({link: fname});
     	});
     	console.log(tmp);
         Session.set("links", tmp);
	
	}else{
		$.each(array, function(i, fname){
     	tmp.push({link: fname});
     });
         Session.set("attachments", tmp);
	}
	//here we call meteor method that will save the data to server	
}

function removeFile(array, fname, type){ 

	var fi = array.indexOf(fname);
	console.log(array);
	if(fi <0) //avoid wrong input
		return false;

	array.splice(array.indexOf(fname), 1);
	
	 var tmp = new Array();
	if(type === "link"){
	
		$.each(array, function(i, fname){
     	tmp.push({link: fname});
     });
         Session.set("links", tmp);
	
	}else{
		 $.each(array, function(i, fname){
     	tmp.push({attachment: fname});
     });
         Session.set("attachments", tmp);
	}
	
}


// ===== for links ======

var allLinks = new Array();


//==========================

/* attachmentsView */
Template.attachmentsView.helpers({
	 attachments : function(){
	 	return Session.get("attachments");
	 }

});

Template.attachmentsView.events({
	 "click .sumit_attach_del" : function(e){
	 	e.preventDefault();
	 	console.log("--- ==== ----", this);
	 	removeFile(allFiles, this.attachment, "attchment");

	 }

});


//============links
Template.linksView.helpers({
	 links : function(){
	 	return Session.get("links");
	 }

});


Template.linksView.events({
"keyup .link_input" : function(e){
	e.preventDefault();
	if(e.which === 13){
	
		console.log("--- ==== ----", $(e.target).val());
		
		
		var lk = $(e.target).val();
		//do the savings in here 
		if(lk.trim() !== "")
			addFile(allLinks, lk.trim(), "link");
		
		console.log("--ggglink-", allLinks );
		
		$(e.target).val("");
		$(e.target).css({
			display: "none"
		});
		
	}
	console.log("--- ==== ----", $(e.target).val());
},

"keydown .link_input" : function(e){

	console.log("--- ==== ----", $(e.target).val());
 if(e.keyCode == 13) {
      e.preventDefault();
      return false;
    }

}


});

