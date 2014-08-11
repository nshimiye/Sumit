// Fixture data

//create three users
var tomId = Meteor.users.insert({
    profile: { name: 'Tom Coleman' }
});
var tom = Meteor.users.findOne(tomId);

var sachaId = Meteor.users.insert({
    profile: { name: 'Sacha Greif'}
});
var sacha = Meteor.users.findOne(sachaId);

var nielsId = Meteor.users.insert({
    profile: { name: 'Niels Bantilan' }
});
var niels = Meteor.users.findOne(nielsId)

var marsId = Meteor.users.insert({
    profile: { name: 'Marcellin Nshimiyimana' }
});
var mars = Meteor.users.findOne(marsId);

if (Posts.find().count() === 0) {
    var now = new Date().getTime();

    //==========Inserting Quora data==============
    //a smaller subset of the data
    var issues = [developmentPracticeJson];

    // var issues = [
    //     agricultureJson, 
    //     americanRedCrossNationalSocietyJson, 
    //     charityAndCharitiesJson,
    //     complexityScienceJson,
    //     corporateSocialResponsibilityJson,
    //     developmentPracticeJson,
    //     disasterReliefJson,
    //     distributionOfWealthJson,
    //     economicDevelopmentJson,
    //     environmentalEconomicsJson,
    //     environmentalScienceJson,
    //     femaleEmpowermentJson,
    //     foreignAidJson,
    //     foreignDirectInvestmentJson,
    //     genderEqualityJson,
    //     globalGovernanceJson,
    //     globalizationJson,
    //     governmentJson,
    //     healthPolicyJson,
    //     healthJson,
    //     humanitarianAidJson,
    //     inequalityJson,
    //     internationalDevelopmentJson,
    //     internationalMonetaryFundJson,
    //     internationalTradeJson,
    //     maternalHealthJson,
    //     medicineAndHealthcareJson,
    //     microfinanceJson,
    //     nongovernmentalOrganizationsNgosJson,
    //     organizationForEconomicCooperationAndDevelopmentJson,
    //     povertyJson,
    //     publicHealthAndSafetyJson,
    //     publicPolicyJson,
    //     socialEntrepreneurshipJson,
    //     socialFinanceJson,
    //     sustainabilityJson,
    //     sustainableEnergyJson,
    //     thirdWorldJson,
    //     unitedNationsJson,
    //     urbanDevelopmentJson];

    var data, issue;
    for (var i=0; i < issues.length; i++){
        issue = issues[i];
        for (var j=0; j < issue.length; j++){
            data = issue[j];
            var postId = Posts.insert({
                title: data.title,
                userId: niels._id,
                source: 'Quora',
                url: data.link,
                submitted: now - (j%14) * 3600 * 1000,
                commentsCount: 0,
                upvoters: [], votes: 0
            });
        }
    }

    // var telescopeId = Posts.insert({
    //     title: 'Introducing Telescope',
    //     userId: sacha._id,
    //     author: sacha.profile.name,
    //     url: 'http://sachagreif.com/introducing-telescope/',
    //     submitted: now - 7 * 3600 * 1000,
    //     commentsCount: 0,
    //     upvoters: [], votes: 0
    // });

    // Comments.insert({
    //     postId: telescopeId,
    //     userId: tom._id,
    //     author: tom.profile.name,
    //     submitted: now - 5 * 3600 * 1000,
    //     body: 'Interesting project Sacha, can I get involved?',
    //     upvoters: [], votes: 54
    // });

    // Comments.insert({
    //     postId: telescopeId,
    //     userId: sacha._id,
    //     author: sacha.profile.name,
    //     submitted: now - 5 * 3600 * 1000,
    //     body: 'You sure can Tom!',
    //     upvoters: [], votes: 54
    // });

    // Comments.insert({
    //     postId: telescopeId,
    //     userId: niels._id,
    //     author: niels.profile.name,
    //     submitted: now - 4 * 3600 * 1000,
    //     body: 'How about me! I want to contribute!',
    //     upvoters: [], votes: 54
    // });

    // Posts.insert({
    //     title: 'Meteor',
    //     userId: tom._id,
    //     author: tom.profile.name,
    //     url: 'http://meteor.com',
    //     submitted: now - 10 * 3600 * 1000,
    //     commentsCount: 0,
    //     upvoters: [], votes: 0,
        
    // });

    // Posts.insert({
    //     title: 'The Meteor Book',
    //     userId: tom._id,
    //     author: tom.profile.name,
    //     url: 'http://themeteorbook.com',
    //     submitted: now - 12 * 3600 * 1000,
    //     commentsCount: 0,
    //     upvoters: [], votes: 0
    // });

    // for (var i = 0; i < 10; i++) {
    //     Posts.insert({
    //         title: 'Test post #' + i,
    //         author: sacha.profile.name,
    //         userId: sacha._id,
    //         url: 'http://google.com/?g=test-' + i,
    //         submitted: now - i * 3600 * 1000,
    //         commentsCount: 0,
    //         upvoters: [], votes: 0
    //     });
    // }
    
    // var postId = Posts.insert({
    //     title: 'Difficulties of improving crop yields due to prohibitive land use policies',
    //     message: 'We would like researcher in agricultural fields to help us with this -'+
    //     ' we have a land that is  serves about 8000000 people, but it not fertile now ',
    //     userId: mars._id,
    //     author: mars.profile.name,
    //     url: 'http://nshimiye.com',
    //     submitted: now - 7 * 3600 * 1000,
    //     commentsCount: 0,
    //     upvoters: [], votes: 54321
    // });
    
    // var postId = Posts.insert({
    //     title: 'Low adoption rate of sexual health behaviors because of gaps in communication and local involvement',
    //     message: 'how do you make couple stay attached without cheating - if they live far away from each other',
    //     userId: mars._id,
    //     author: mars.profile.name,
    //     url: 'http://nshimiye.com',
    //     submitted: now - 7 * 3600 * 1000,
    //     commentsCount: 0,
    //     upvoters: [], votes: 1256
    // });


    // var postId = Posts.insert({
    //     title: 'Limited and unreliable bednet distribution channels in malaria prevention programs',
    //     message: 'Malaria is still a problem in developing countries, and the nowadays prevention is not enough',
    //     userId: mars._id,
    //     author: mars.profile.name,
    //     url: 'http://nshimiye.com',
    //     submitted: now - 7 * 3600 * 1000,
    //     commentsCount: 0,
    //     upvoters: [], votes: 1233
    // });
    
    
    // var postId = Posts.insert({
    //     title: 'Reduce potency of vaccines due to logical factors that prevent proper cold chain maintenance',
    //     message: 'vaccines are bad for environment and yet they really help in preventing a lot of desease',
    //     userId: mars._id,
    //     author: mars.profile.name,
    //     url: 'http://nshimiye.com',
    //     submitted: now - 7 * 3600 * 1000,
    //     commentsCount: 0,
    //     upvoters: [], votes: 230020
    // });

    // for (var i = 0; i < 10; i++) {
    //     var cid = Comments.insert({
    //     postId: postId,
    //     userId: sacha._id,
    //     author: sacha.profile.name,
    //     submitted: now - 5 * 3600 * 1000,
    //     upvoters: [], votes: 0,
    //     body: 'Interesting project ---, can I get involved? counting ' + i
    // });

    // Posts.update(postId, {$inc: {commentsCount: 1}});
    
    // if(i%2 === 0){
    //     var eid = Evidences.insert({
    //     postId: postId,
    //     userId: sacha._id,
    //     author: sacha.profile.name,
    //     submitted: now - 5 * 3600 * 1000,
    //     upvoters: [], votes: 0,
    //     body: 'Report '+ i +': Cold Chain management power outage strategies'
    //     });
    //     Posts.update(postId, {$inc: {evidencesCount: 1}});
    // }

var Categories1 = ["THEMATIC GROUPS","CROSS-CUTTING ISSUES","Others"];
   
var category1 =  Categories.insert({
    userId: niels._id,
    submitted: now - 4 * 3600 * 1000,
    cname: 'THEMATIC GROUPS',
    nid: 'tg'
});

var TG = [
"Macroeconomics, Population Dynamics, and Planetary Boundaries",
"Reducing Poverty and Building Peace in Fragile Regions",
"Challenges of Social Inclusion: Gender, Inequalities, and Human Rights",
"Early Childhood Development, Education, and Transition to Work",
"Health for All",
"Deep Decarbonization Pathways",
"Sustainable Agriculture and Food Systems",
"Forests, Oceans, Biodiversity, and Ecosystem Services",
"Sustainable Cities: Inclusive, Resilient, and Connected",
"Good Governance of Extractive and Land Resources",
"Global Governance and Norms for Sustainable Development",
"Redefining the Role of Business for Sustainable Development"
];


TG.forEach(function(item){
 
  var i=  Tags.insert({
        userId: niels._id,
        categoryId : category1,
        author: niels.profile.name,
        submitted: now - 4 * 3600 * 1000,
        tagname: item,
        themeGroup: item
    });

});

var category2 =   Categories.insert({
    userId: niels._id,
    submitted: now - 4 * 3600 * 1000,
    cname: 'CROSS-CUTTING ISSUES',
    nid: 'cci'
});
   
   
var CCI = [
    "Logistics",
    "Physical Infrastructure",
    "Social Context",
    "Communications",
    "Politics",
    "Legislation",
    "Human Resources",
    "Project Management",
    "Monitoring and Evaluation",
    "Accountability",
    "Data Infrastructure",
    "Knowledge Management",
    "Grant Writing",
    "Finances",
    "Capacity Building",
    "Local Partnership"
];
        
CCI.forEach(function(item){  
 
    var t = Tags.insert({
        userId: niels._id,
        categoryId : category2,
        author: niels.profile.name,
        submitted: now - 4 * 3600 * 1000,
        tagname: item,
        ccissue: item
    });
    
    var tts = Posts.findOne(postId);
    
    if(!tts.tags){
        tts = {tags: [t]}
    }
    tts.tags.push(t);
    Posts.update(postId, {tags: tts.tags});
});

var category3 =   Categories.insert({
    userId: niels._id,
    submitted: now - 4 * 3600 * 1000,
    cname: 'Others',
    nid: 'other'
});



}
   
//============== tags here static generation =============
   




   



// if (ArticlesFS.find().count() === 0) {
//   for (i = 0; i < 5; i++) {
//     var fs = Npm.require("fs");
//     var startId = 10000;
//     var readStream, localFile;
//     s3key = (startId + i).toString();
//     console.log(s3key);
//     readStream = s3Store.adapter.createReadStreamForFileKey(s3key);
//     localFile = fs.createWriteStream('/' + s3key + '.html');
//     readStream.pipe(localFile);
//     ArticlesFS.insert('/' + s3key + '.html');
//   }
// }
