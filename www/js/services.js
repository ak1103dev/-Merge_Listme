angular.module('ListMe.service', [])
.factory('Projects', function($http) {
  var host = 'http://research27.ml:1103'
  return {
    // get: function() {
    //   $http.get('https://s3.amazonaws.com/codecademy-content/courses/ltp4/photos-api/photos.json')
    //     .success(function(data) {
    //       console.log(data);
    //       window.localStorage.mydata = angular.toJson(data);
    //       return;
    //     });
    // },


    // get: function() {
    //   $http.get('https://s3.amazonaws.com/codecademy-content/courses/ltp4/photos-api/photos.json')
    //     .success(function(data) {
    //       return data;
    //     });
    // },

    getFacebookData: function() {
      return $http.get("https://graph.facebook.com/v2.2/me", { params: { 
        access_token: window.localStorage.accessToken, 
        fields: "id,first_name,email", 
        format: "json" 
      }}).then(function(result) {
          return result;
      }, function(error) {
          alert("There was a problem getting your profile.  Check the logs for details.");
          console.log(error);
      });
    },

    sendFacebookData: function() {
      return $http.post(host + '/fb-login', {
        "id": window.localStorage.id,
        "password": {
            "email": window.localStorage.email,
            "name": window.localStorage.username
        }
      }).success(function(data) {
        return data;
      });
    },

    logout: function() {
      // console.log("logout");
      window.localStorage.clear();
      window.location.href = "login.html";
      // return window.localStorage.username = "xxxxx";

      // return $http.get(host + '/logout')
      //   .success(function(data) {
      //     return data;
      //   });
    },

    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
      $http.post(host + '/save', projects)
      .success(function(data) {
        // console.log(data);
        return;
      });
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: [],
        numFinishedTask: 0,
        active:true
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
      // $http.post(host + '/setLastActiveIndex', index)
      // .success(function(data) {
      //   // console.log(data);
      //   return;
      // });
    }
  }
});
