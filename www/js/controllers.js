angular.module('ListMe.controllers', ['ui.bootstrap.datetimepicker'])


/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */


.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $ionicPopup, $filter, $cordovaLocalNotification, $ionicPlatform) {
  // if(window.localStorage.hasOwnProperty("accessToken") === true) {  
  //   Projects.getFacebookData().then(function(result) {
  //     window.localStorage.username = result.data.first_name;
  //     window.localStorage.email = result.data.email;
  //     window.localStorage.id = result.data.id;
  //     $scope.username = window.localStorage.username;
  //     Projects.sendFacebookData().success(function(data) {
  //       console.log(data);
  //     });
  //     console.log("in1");
  //   });
  //   console.log("after");
  // } else {
    $scope.username = window.localStorage.username || {};
  // }

  $scope.iddd = 0;
  $ionicPlatform.ready(function() {
    $scope.scheduleSingleNotification = function(dateTime, taskName) {
      var alert = new Date(dateTime);

      $cordovaLocalNotification.schedule({
        id: ++$scope.iddd,
        title: 'ListMe',
        text: 'You forget ' + '\"' + taskName + '\"',
        at: alert
      }).then(function (result) {
        console.log('Notification 1 triggered');
      });
    };
  });

  $scope.logout = function() {
    Projects.logout();
  };

  $scope.refresh = function() {
    window.location.href = "index.html";
  };

  // Projects.get();
  // $scope.get = window.localStorage.mydata;
  // Projects.get().success(function(data) {
  //   $scope.get = data;
  // });
  //map

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  }
  $scope.removeProject = function(id) {
    if ($scope.projects.length != 2) {
      $scope.projects.splice(id, 1);
      Projects.save($scope.projects);
      $scope.activeProject = $scope.projects[0];
      Projects.setLastActiveIndex($scope.projects.length - 1);
    }

  };
  // Load or initialize projects
  $scope.projects = Projects.all();

  $scope.editing = false;
  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  $scope.saveMap = function(minitask) {
    var x = JSON.parse(window.localStorage.map);
    minitask.map = x;
    console.log(minitask.map);
    Projects.save($scope.projects);
  }

  $scope.showMap = function(map) {
    console.log(map);
    window.localStorage.showmap = JSON.stringify(map);
    console.log(window.localStorage.showmap);
  } 
  // edit text
    $scope.editItem = function () {
        $scope.editing = true;
    }

    $scope.doneEditing = function () {
        $scope.editing = false;
        Projects.save($scope.projects);
        //dong some background ajax calling for persistence...
    };
  // $scope.activeProject.active =  true;
  $scope.showComplete = function() {
    $scope.activeProject.active = false;
  }
  $scope.showActive = function() {
      $scope.activeProject.active = true;
    }
    // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Group name');
    if (projectTitle) {
      createProject(projectTitle);
    }
  };


  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };
  if ($scope.projects.length == 0) {
    createProject("#Example");
  }


  // Create our modal

  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });
  $scope.removeTask = function(id) {
    $scope.activeProject.tasks.splice(id, 1);
    Projects.save($scope.projects);

  }
  $scope.createTask = function(task) {
    if(task.hour < 10){
      hourTemp = '0'+String(task.hour);
    }else {
      hourTemp = String(task.hour);
    };
    if(task.minute < 10){
      minuteTemp = '0'+String(task.minute);
    }else {
      minuteTemp = String(task.minute);
    };
    var useTo = false;
    var Dateformat = $filter('date')(task.date,'shortTime'); //string type
    var valDay = $filter('date')(task.date,'mediumDate');
    if (!$scope.activeProject || !task) {
      return;
    };

    for (var i = 0; i < $scope.activeProject.tasks.length; i++) {

      var StrTask = JSON.stringify($scope.activeProject.tasks[i].date);
      console.log(StrTask);
      console.log(valDay + " " + hourTemp + ":" + minuteTemp);
      if (JSON.stringify(valDay) == StrTask) {
        console.log('hit same day');
        $scope.activeProject.tasks[i].title.push({
          name: task.title,
          done: false,
          hour:hourTemp,
          minute:minuteTemp,
          map:{
            name:"no map",
            place_id:"",
            lat:13,
            lng:100
          }
        });
        useTo = true;
      }
    }

    if (!useTo) {
      $scope.activeProject.tasks.push({
        title: [{
          name: task.title,
          done: false,
          hour:hourTemp,
          minute:minuteTemp,
          map:{
            name:"no map",
            place_id:"",
            lat:13,
            lng:100
          }
        }],
        done: 0,
        date: valDay,
        dateSort:task.date
      });
    }
    $scope.taskModal.hide();
    Projects.save($scope.projects);
    $scope.activeProject.active = true;
    $scope.scheduleSingleNotification(valDay + " " + hourTemp + ":" + minuteTemp, task.title);
    task.title = "";
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }
  $scope.clearTaskComplete = function() {
    $scope.activeProject.numFinishedTask = 0;
    for (var i = 0; i < $scope.activeProject.tasks.length; i++) {
      for (var j = 0; j < $scope.activeProject.tasks[i].title.length; j++) {
            if($scope.activeProject.tasks[i].title[j].done == true){
              $scope.activeProject.tasks[i].done-=1;
            }
      }
      $scope.activeProject.tasks[i].title = $scope.activeProject.tasks[i].title.filter(function(item){
        return item.done == false;
      })
    }
    $scope.activeProject.tasks = $scope.activeProject.tasks.filter(function(task){
      return task.title.length != 0;
    })
    Projects.save($scope.projects);
    // location.reload();


  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.lengthActive = function() {
    var count = 0;
    for (var i = 0; i < $scope.activeProject.tasks.length; i++) {
      if ($scope.activeProject.tasks[i].done == false) {
        count += 1;
      }
    }
    return count;
  };

  var numFinishedTask = 0;
  $scope.checkboxToggleActive = function(idTasks, idTask) {
      $scope.activeProject.numFinishedTask += 1;
      console.log($scope.activeProject.tasks[idTasks].title[idTask].name);
      if ($scope.activeProject.tasks[idTasks].title[idTask].done == false) {
        $scope.activeProject.tasks[idTasks].title[idTask].done = true;
        $scope.activeProject.tasks[idTasks].done += 1;
      } else {
        $scope.activeProject.tasks[idTasks].title[idTask].done = false;
        $scope.activeProject.tasks[idTasks].done -= 1;

      }
      Projects.save($scope.projects);
    }
  $scope.checkboxToggleComplete = function(idTasks, idTask) {
      $scope.activeProject.numFinishedTask -= 1;   
      console.log($scope.activeProject.tasks[idTasks].title[idTask].name);
      if ($scope.activeProject.tasks[idTasks].title[idTask].done == false) {
        $scope.activeProject.tasks[idTasks].title[idTask].done = true;
        $scope.activeProject.tasks[idTasks].done += 1;
      } else {
        $scope.activeProject.tasks[idTasks].title[idTask].done = false;
        $scope.activeProject.tasks[idTasks].done -= 1;

      }
      Projects.save($scope.projects);
    }
    // A confirm dialog
  $scope.showConfirm = function(idTasks,idTask) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Cancel Task',
      template: 'Are you sure you want to cancel this task?'
    });
    confirmPopup.then(function(res, id) {
      if (res) {
        $scope.activeProject.tasks[idTasks].title.splice(idTask, 1);
        Projects.save($scope.projects);
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };
  $scope.showConfirmDeleteProject = function(id) {
    var confirmPopupDel = $ionicPopup.confirm({
      title: 'Delete Group',
      template: 'Are you sure you want to delete ' + $scope.projects[id].title + ' group?'
    });
    confirmPopupDel.then(function(res) {
      if (res) {
        if ($scope.projects.length != 1) {
          $scope.projects.splice(id, 1);
          Projects.save($scope.projects);
          $scope.activeProject = $scope.projects[0];
          Projects.setLastActiveIndex($scope.projects.length - 1);
        }
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };
  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly

  $timeout(function() {
    if ($scope.projects.length == 0) {
      while (true) {
        var projectTitle = prompt('Your first project title:');
        if (projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });
});
