;(function(){
  'use strict';

  angular.module('todoApp', ['ngRoute', 'mgcrea.ngStrap'])
    .config(function($routeProvider){
      $routeProvider
      .when('/', {
        templateUrl: 'views/table.html',
        controller: 'TodoController',
        controllerAs: 'todo'
      })
      .when('/new', {
        templateUrl: 'views/form.html',
        controller: 'TodoController',
        controllerAs: 'todo'
      })
      .when('/:id', {
        templateUrl: 'views/show.html',
        controller: 'ShowController',
        controllerAs: 'show'
      })
      .when('/:id/edit', {
        templateUrl: 'views/form.html',
        controller: 'EditController',
        controllerAs: 'todo'
      })
      .otherwise({redirectTo: '/'});
    })
    .factory('todoFactory', function($http, $location){

      function getTodo(id, cb){
        var url = 'https://omgttt.firebaseio.com/list/' + id + '.json';

        $http.get(url)
        .success(function(data){
          cb(data);
        })
        .error(function(err){
          console.log(err);
        });
      }

      function editTodo(id, todo){
        var url = 'https://omgttt.firebaseio.com/list/' + id + '.json';
        $http.put(url, todo)
          .success(function(data){
            $location.path('/')
          })
          .error(function(err){
            console.log(err);
          });
        };

        function getAllTodos(cb){
          $http.get('https://omgttt.firebaseio.com/list.json')
          .success(function(data){
            cb(data);
          })
          .error(function(err){
            console.log(err);
          });
        }

        function createTodo(task, cb){
          $http.post('https://omgttt.firebaseio.com/list.json', task)
          .success(function(data){
            cb(data)
          })
          .error(function(err){
            console.log(err);
          });
        }

      return {
        getTodo: getTodo,
        editTodo: editTodo,
        getAllTodos: getAllTodos,
        createTodo: createTodo
      };
    })
    .controller('ShowController', function($routeParams, todoFactory){
      var vm = this;
      var id = $routeParams.id;
      todoFactory.getTodo(id, function(data){
        vm.task = data;
      });
    })
    .controller('EditController', function($routeParams, todoFactory){
      var vm = this;
      var id = $routeParams.id;

      todoFactory.getTodo(id, function(data){
        vm.newTask = data;
      });

      vm.addNewTask = function(){
        todoFactory.editTodo(id, vm.newTask)
      };

      vm.priorityOptions = {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        whocares: 'Whatev'
      };

    })
    .controller('TodoController', function($http, todoFactory){
      var vm = this;

      todoFactory.getAllTodos(function(data){
        vm.tasks = data;
      });

      vm.addNewTask = function(){
        todoFactory.createTodo(vm.newTask, function(data){
          vm.tasks[data.name] = vm.newTask;
          vm.newTask = _freshTask();
        });
      };

      vm.removeTodo = function(todoId){
        var url = 'https://omgttt.firebaseio.com/list/' + todoId + '.json';
        $http.delete(url)
          .success(function(){
            delete vm.tasks[todo];
          })
          .error(function(err){
            console.log(err);
          });
      };

      vm.newTask = _freshTask();

      vm.priorityOptions = {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        whocares: 'Whatev'
      };

      function _freshTask(){
        return {
          priority: 'low'
        }
      }

    });

}());
