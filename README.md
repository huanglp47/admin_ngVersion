# adminStaticPages
pages  
## 目前公司admin管理后台，前端使用的是陈旧的iframe模式，bootstrap+jQuery+doT.js。

##开发时缺点很多: 比如  
1.代码量太大，加载东西多且重复（css,js）;  

2.前进后退需要做专门兼容（H5 history.pushState）:由于使用ajax，需要模拟浏览器前进后退功能：  

 在url添加‘#’，建立全局对象location.params保存地址栏的请求参数，稍显麻烦。  

## 由于angular特别适合做后台管理系统这种单页面开发，因此考虑重构。
打算使用angular +ui-router + requirejs+ bootstrap  
# 预览地址：  
[管理后台](http://huanglp47.github.io/admin_ngVersion/webApp/index_ng_version.html#/state1)

