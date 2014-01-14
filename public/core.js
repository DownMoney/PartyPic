// public/core.js
var scotchTodo = angular.module('Pics', []);
var temp=[];
function mainController($scope, $http, $timeout) {
	$scope.formData = {};
 	$scope.curPics = [];
	// when landing on the page, get all todos and show them
	$http.get('/api/michael')
		.success(function(data) {
			$scope.pics = data['Contents'].reverse();
			$scope.curPics = $scope.pics;

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$scope.setBackground = function (bg){
		return {background: 'url(http://partypic.s3.amazonaws.com/'+bg+')'};
	}


var modalOpened = null;
    function simpleModal() {
      // modals helper
      this.visible = false;
      this.cls = '';
      this.open = function(force) {
        if (modalOpened) {
          modalOpened.close();
          if (!force) return;
        }
        this.visible = true;
        $scope.blurred = true;
        modalOpened = this;
        var me = this;
        $timeout(function() {
          me.cls = 'open';
        }, 100);
      };
      this.close = function() {
        this.cls = '';
        $scope.blurred = false;
        modalOpened = null;
        var me = this;
        $timeout(function() {
          me.visible = false;
        }, 300);
      };
    };

$scope.previewModal = new simpleModal();
   $scope.pics=[];
	$scope.toggle = function(item) {

      if ($scope.previewModal.visible) {
        $scope.previewModal.close();
        return;
      }
      $scope.current = item.Key;
      $scope.previewModal.open();
    }


	setInterval(function(){
		$http.get('/api/michael')
		.success(function(data) {
			temp = data['Contents'].reverse();
			if($scope.pics.length != temp.length)
			{
				$scope.pics = temp;


			}
      stroll.bind( 'ul' );
		})
		.error(function(data) {
			;
		});
	}, 1000);
}
