//'use strict';
var dataLi = ['分类列表', '书籍列表', '专题列表','检查书籍','搜索排行','多听资源', '版权列表', '书籍分类推荐'];
angular.module('myApp', ['ui.router'])
    .controller('GetNavLi',function($scope){
        $scope.items = dataLi;
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/state1");
        $stateProvider
        .state('state1', {
            url: "/state1",
            templateUrl: "partials/state1.html",
            controller: ['$scope', '$http', '$window', '$filter',
                function($scope, $http, $window, $filter) {
                    var url = "data_bookList.json",
                        req = {
                            method: 'GET',
                            url: url,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };
                    $http(req).success(function(response) {
                        $scope.list = response.list;
                    }).error(function(response, status, headers, config) {
                        console.log(response);
                    });

                    $scope.popEvent = function(){
                        alert(123)
                    }
                }]
        })
        .state('stateAddBook', {
            url: "/addbook",
            templateUrl: "partials/stateAddBook.html"//,
            //controller: function ($scope){
            //
            //}
        })
        .state('state1.list',{
            url:'/list',
            templateUrl: "partials/state1.list.html",
            controller: function($scope){
                $scope.items = ['A' ,'List', 'Of', 'Items'];
            }
        })
        .state('state2', {
            url: "/state2",
            templateUrl: "partials/state2.html"
        })
        .state('state2.list', {
            url: "/list",
            templateUrl: "partials/state2.list.html",
            controller: function($scope) {
                $scope.items = ["A", "Set", "Of", "Things"];
            }
        })
    })
    .controller('ModalDemoCtrl', function($scope, $uibModal, $log){

    })

