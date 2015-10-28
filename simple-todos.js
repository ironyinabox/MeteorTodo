if (Meteor.isClient) {


  Template.body.helpers({
    tasks: [
      {text: "My first task"},
      {text: "My second task"},
      {text: "My third task"}
    ]
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
