Template.innovationSubmit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var $body = $(e.target).find('[name=body]');
        var innovation = {
            body: $body.val(),
            postId: template.data._id
        };

        Meteor.call('innovation', innovation, function(error, innovationId) {
            if (error){
                Error.throw(error.reason);
            } else {
                $body.val('');
            }
        });
    }
});
