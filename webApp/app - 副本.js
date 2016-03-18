//'use strict';
//数组有重复值时ng-repeat不加track by $index会报错(加orderBy也可以)
//var dataLi = ['分类列表','分类列表', '书籍列表', '专题列表','检查书籍','搜索排行','多听资源', '版权列表', '书籍分类推荐'];
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
            controller: function($scope, $state) {
                var data = [{
                    'name': 'Billy Joel',
                    'zan':'75000',
                    'age':'30',
                    'id': 10001
                },{
                    'name': 'Paul McCartney',
                    'zan':'112000',
                    'age':'22',
                    'id': 10002
                },{
                    'name': 'Haul McCartney',
                    'zan':'1100',
                    'age':'20',
                    'id': 10003
                },{
                    'name': 'Ailly Joel',
                    'zan':'500',
                    'age':'25',
                    'id': 10004
                }];

                initData(data);
                function initData(data){
                    for(var i= 0,len=data.length;i<len;i++){
                        if(data[i]&&data[i].zan){
                            data[i].zan = transformNum(parseInt(data[i].zan));
                        }
                    }
                };
                function transformNum(n){
                    var num = null;
                    if(n>=0 && n<1000){
                        num = n;
                    }else if(n>=1000 && n<10000){
                        num = (n/1000).toFixed(2)+'k';
                    }else{
                        num = (n/10000).toFixed(2)+'w';
                    }
                    return num
                };
                $scope.items = data;

                $scope.delete = function($index){
                    if(confirm('确定要删除？')){
                        $scope.items.splice($index, 1);
                    }
                };

                //排序
                $scope.order = 'id';
                $scope.desc = 0;

                //编辑
                $scope.toProducer = function(prodecerId){
                    $state.go('editSinger', {
                        prodecerId: prodecerId
                    });
                }
            }
        }).state('editSinger', {
                url: "/editSinger/:prodecerId",
                templateUrl: "partials/editSinger.html",
                controller: function($scope, $state, $stateParams) {
                    //根据id获取数据
                    var producerId = $stateParams.prodecerId;

                    var data = { // 模拟返回
                        'name': 'Billy Joel',
                        'zan':'75000',
                        'age':'30',
                        'id': 10001
                    };

                    $scope.item = data;

                    $scope.reset = function(){
                        $state.go('state2.list');
                    };
                }
            })
    })
    .controller('ModalDemoCtrl', function($scope, $uibModal, $log){

    })

