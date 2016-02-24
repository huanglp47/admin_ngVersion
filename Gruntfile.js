module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      my_target: {
        files: [{
          expand: true,
          cwd: 'public/js',
          src: '**/*.js',
          dest: 'public_min/js'
        }]
      }
    },
    imagemin:{
      dist:{
        options:{
          optimizationLevel: 3,
          progressive: true
        },
        files:[{
          expand: true,
          cwd: 'public/images/',
          src:['**/*.{png,jpg,jpeg}'], //优化 img 目录下所有 png/jpg/jpeg 图片
          dest: 'public_min/images/'
        }]
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/css',
          src: '*.css',
          dest: 'public_min/css',
          ext: '.css'
        }]
      }
    },
    concat: {//css文件合并
      css: {
        src: ['public_min/css/*.css','!public_min/css/base.css','!public_min/css/layout.css'],//当前grunt项目中路径下的public_min/css目录下的所有css文件
        dest: 'public_min/css/all.min.css'  //生成到grunt项目路径下的dist文件夹下为all.css
      }
    }
  });
  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');

  //grunt.loadNpmTasks('grunt-contrib-watch');
  // 默认被执行的任务列表。
  grunt.registerTask('default', ['uglify', 'imagemin', 'cssmin', 'concat']);

};