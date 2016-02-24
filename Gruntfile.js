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
          src:['**/*.{png,jpg,jpeg}'], //�Ż� img Ŀ¼������ png/jpg/jpeg ͼƬ
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
    concat: {//css�ļ��ϲ�
      css: {
        src: ['public_min/css/*.css','!public_min/css/base.css','!public_min/css/layout.css'],//��ǰgrunt��Ŀ��·���µ�public_min/cssĿ¼�µ�����css�ļ�
        dest: 'public_min/css/all.min.css'  //���ɵ�grunt��Ŀ·���µ�dist�ļ�����Ϊall.css
      }
    }
  });
  // ���ذ��� "uglify" ����Ĳ����
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');

  //grunt.loadNpmTasks('grunt-contrib-watch');
  // Ĭ�ϱ�ִ�е������б�
  grunt.registerTask('default', ['uglify', 'imagemin', 'cssmin', 'concat']);

};