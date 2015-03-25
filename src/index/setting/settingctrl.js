/**
 * settingmodule Module
 *
 * 设置功能模块
 */
var settingmodule = angular.module('settingmodule', ['ionic', 'starter.services', 'starter.directives']);
settingmodule.controller('settingCtrl', ['$scope', '$ionicPopup', 'myCookie', 'loginCheck',function($scope, $ionicPopup, myCookie, loginCheck) {

	$scope.logout = function() {
		var myPopup = $ionicPopup.show({
			template: '你确定要退出？',
			title: '提示',
			buttons: [{
				text: '取消'
			}, {
				text: '<b>确定</b>',
				type: 'button-energized',
				onTap: function(e) {
					myCookie.delete("orgName");
					loginCheck();
				}
			}]
		});
	};

}]);