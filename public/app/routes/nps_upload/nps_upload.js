(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.admin.nps_upload', {
    url: '/nps-upload',
    templateUrl: 'routes/nps_upload/nps_upload.html',
    controller: 'NpsUploadCtrl',
    title: 'Admin | NPS Upload'
  });
}])
.controller('NpsUploadCtrl', ['$scope', '$timeout', 'Notification', 'NPS',
function ($scope, $timeout, Notification, NPS) {

  $scope.fileContainer = {};

  /**
   * @param {Bolean} setLoading Defaults to true
   */
  function getFiles(setLoading) {
    $scope.isLoading = !_.isUndefined(setLoading)
      ? setLoading
      : true;

    NPS.get()
    .then(function (files) {
      $scope.files = files;
      $scope.isLoading = false;
    })
    ['catch'](function (err) {
      console.log(err);
      $scope.isLoading = false;
    });

  }

  $scope.upload = function () {

    $scope.isUploading = true;

    NPS.upload($scope.fileContainer.uploadFiles)
    .then(function (files) {
      $scope.files = files;
      Notification.success('Files uploaded!');
      $scope.isUploading = false;
    })
    ['catch'](function (err) {
      console.log(err);
      Notification.error('Could not upload files, something went wrong.');
      $scope.isUploading = false;
    })

    $scope.fileContainer.newFiles = null;
    $scope.fileContainer.uploadFiles = null;
  }

  /**
   * Adds files to the upload list
   */
  $scope.addFiles = function () {

    // Ensure $scope.fileContainer.uploadFiles exists
    if (!$scope.fileContainer.uploadFiles) {
      $scope.fileContainer.uploadFiles = [];
    }

    // Iterate over selected files and push .xls files to fileContainer.uploadFiles
    _.forEach($scope.fileContainer.newFiles, function (file) {

      if (!/\.xls(x)?$/i.test(file.name)) {
        Notification('Only .xls or .xlsx files are allowed. Will not upload {file}'.replace('{file}', file.name));
      } else {
        $scope.fileContainer.uploadFiles.push(file);
      }
    });

    // Empty newFiles array
    $scope.fileContainer.newFiles = null;

  }

  /**
   * Removes the file from the upload list.
   *
   * @param {Object|File}
   */
  $scope.removeFromUpload = function (file) {
    $scope.fileContainer.uploadFiles = _.filter($scope.fileContainer.uploadFiles, function (_file) {
      return file != _file;
    });
  }

  getFiles();

}]);

})();