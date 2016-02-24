/**
 * location 扩展
 */
location.params={};
/**
 * 解析url的参数
 */
location.parseUrl=function (path){
	path=decodeURI(path);
	var result = {}, param = /([^#?=&]+)=([^&]+)/ig, match;
	while (( match = param.exec(path)) != null) {
		result[match[1]] = match[2];
	}
	return result;
}
/**
 * 修改地址栏的参数
 * location.change('id=10&type=1');
 */
location.change=function (str){
	var obj={};
	var arr=str.split('&');
	for(var i=0;i<arr.length;i++){
		var temp=arr[i].split('=');
		obj[temp[0]]=temp[1]||'';
	}
	location.params=$.extend(location.params,obj);
	var pStr=location.paramsStr();
	var url=encodeURI(location.href.split('#')[0]+'#'+pStr);
	if(url!=location.href){
		location.href=url;
	}else{
		location.reload();
	}
}
/**
 *地址栏参数对象转化字符串
 *{id:100}变成id=100
 */
location.paramsStr=function() {
	var str='';
	for(var i in location.params){
		if(location.params[i]){
			str+=i+'='+location.params[i]+'&';
		}
	}
	return str.replace(/&$/g,'');
}
/**
 * 表单标签与地址栏参数同步
 */
location.syn=function (){
	for(var i in location.params){
		$('input[name='+i+'],select[name='+i+']').val(location.params[i]).filter('select').attr('data-value',location.params[i]);
	}
}

location.params=location.parseUrl(location.href);
location.syn();

/**
 * utils常用方法
 */
var utils={
	ajax:function (options){
		if(options&&options.url){
			options.cache=false;
			if(options.url.indexOf('yytingadmin')==-1){
				options.url='/yytingadmin/'+options.url;
			}
			parent.$('.ajax-remind-success,.ajax-remind-error').hide();
			if(options.type&&options.type.toUpperCase()=='POST'){
				$('button[data-post*="'+options.url.replace('/yytingadmin/','')+'"]').addClass('btn-posting');
				options.complete=function (xhr){
					if(xhr.status<400){
						var data=JSON.parse(xhr.responseText);
						if(data.status==0){
							utils.successRemind();
							if(data.msg){
								new Pop('<div style="width:300px;text-align:center">'+data.msg+'</div>','温馨提示');
								$('.btn-posting').removeClass('btn-posting');
							}else{
								setTimeout(function (){
									if($('.btn-posting').length==1){
										$('.btn-posting').removeClass('btn-posting');
										window.history.back();
									}
								},1000);
							}
						}else{
							$('.btn-posting').removeClass('btn-posting');
							if(data.msg){
								new Pop('<div style="width:300px;text-align:center">'+data.msg+'</div>','温馨提示');
							}
							utils.errorRemind();
						}
					}else{
						utils.errorRemind();
					}
				} 
			}
			$.ajax(options);
		}
	},
	post:function (url,success){
		utils.ajax({
			url:url.split('?')[0],
			data:location.parseUrl(url),
			type:'POST',
			success:function (data){
				if(data.status==0){
					if(success&&typeof success=='function'){
						success(data);
					}
				}
			}
		});
	},
	successRemind:function (){
		var successRemind=parent.$('.ajax-remind-success');
		if(successRemind.length==0){
			successRemind=parent.parent.$('.ajax-remind-success')
		}
		successRemind.fadeIn(100);
		setTimeout(function(){
			successRemind.fadeOut(100);
		},1500);
	},
	errorRemind:function (){
		var errorRemind=parent.$('.ajax-remind-error');
		if(errorRemind.length==0){
			errorRemind.parent.parent.$('.ajax-remind-error');
		}
		errorRemind.fadeIn(100);
		setTimeout(function(){
			errorRemind.fadeOut(100);
		},1500);
	}
};
window.ready=function (){};
/**
 * 分页视图
 */
var pageView={
	url:'',
	success:function (data){
		var data1=data.list||data.data||data.book;
		if(data.status==0){
			if(data1===undefined){
				//alert('返回的JSON数据格式不正确\n'+JSON.stringify(data));
			}
			data1.params=location.params;
			this.loader.html(doT.template(this.template)(data1));
			if(!/\.jsp$/.test(location.href)){
				this.loader.find('.btn-primary').html('保存');
			}
			if(data1.length>0){
				this.pagination(data);
			}
			this.initLoadSelect();
			if(this.initLoadTemplate){
				this.initLoadTemplate();
			}
			window.ready();
			window.ready=function (){};
		}
		if(this.listView){
			this.listView.removeClass('loading');
			if(data1.length==0){
				this.listView.html('<div class="not tc m30">没有查找到相关数据!</div>');
				return;
			}
		}
	},
	error:function (data){
		
	},
	ajax:function (){
		this.beforeSend();
		var self=this;
		utils.ajax({
			url:this.url+'?'+location.paramsStr(),
			success:function (data){
				self.success(data);
			},
			error:function (data){
				self.error(data);
			}
		});
	},
	beforeSend:function (){
		this.loader.html('');
		$('.pagination,.not').remove();
		if(this.listView){
			this.listView.addClass('loading');
		}
	},
	pagination:function (data){
		if(data.pageNum!==undefined){
			var html='<div class="pagination"><a href="#pageNum='+(data.pageNum==1?data.pageNum:data.pageNum-1)+'">上一页</a>'+(data.count?data.pageNum+'/'+Math.ceil(data.count/data.pageSize):data.pageNum)+
			'页'+(data.count?' 共'+data.count+'条':'')+'<a href="#pageNum='+(data.pageNum+1)+'">下一页</a><input name="pageNum" type="number" value="1" min="1"><a class="go" href="#pageNum=1">跳转</a></div>';
			this.listView.append(html);
		}
	},
	render:function (){
		var listView=this.listView=$('.list-view');
		if(listView[0]){
			this.url=listView.attr('data-get');
			if(!this.template){
				this.loader=listView.find('script').parent();
				this.template=listView.find('script').html();
				this.bind();
			}
			this.ajax();
		}
	},
	bind:function (){
		this.listView.on('keyup','.pagination input[type=number]',function (e){
			$(this).next().attr('href','#pageNum='+$(this).val());
			if(e.keyCode==13){
				$(this).next().click();
			}
		}).on('click','.pagination input[type=number]',function (){
			$(this).next().attr('href','#pageNum='+$(this).val());
		});
	},
	initLoadSelect:function (){
		var select=this.loader.find('select[data-get]');
		select.each(function (){
			new SelectView($(this));
		});
	}
	
};

/**
 * 下拉框查询
 */
function SelectView(el){
	this.el=el;
	this.ajax();
}
SelectView.prototype={
	ajax:function (){
		var self=this;
		utils.ajax({
			url:this.el.attr('data-get'),
			success:function (data){
				var valueName=self.el.attr('data-value-name');
				var textName=self.el.attr('data-text-name');
				var options=''
				if(data.status==0){
					for(var i=0;i<data.list.length;i++){
						options+='<option value="'+data.list[i][valueName]+'">'+data.list[i][textName]+'</option>';
					}
					self.el.append(options);
					var value=self.el.attr('data-value');
					if(value){
						self.el.val(value);
					}
				}
			}
		})	
	}
}

/**
 * 实体视图
 */
var view=$.extend({},pageView,{
	render:function (){
		var view=$('.view');
		if(view[0]){
			if(!this.template){
				this.loader=view.find('script').parent();
				this.template=view.find('script').html();
			}
			if(JSON.stringify(location.params)!='{}'){
				this.url=view.attr('data-get');
				this.ajax();
			}else{
				view.find('script').parent().html(doT.template(this.template)({}));
				this.initLoadSelect();
				this.initLoadTemplate();
				window.ready();
				window.ready=function (){};
				
			}
			this.bind();
		}
	},
	pagination:function (){},
	bind:function (){
		var self=this;
		$('.view').on('click','.btn-primary',function(){
			var data=self.getParams();
			if(self.validate(data)){
				utils.ajax({
					url:$(this).attr('data-post'),
					data:data,
					type:'POST',
					success:function (data){
						if(data.status==0){
							utils.successRemind();
						}else{
							utils.errorRemind();
						}
					},
					error:function (){
						utils.errorRemind();
					}
				});
			}
		});
	},
	getParams:function(){
		var obj={};
		$('.view').find('input,select,textarea').each(function (){
			var $this=$(this);
			if($this.attr('name')){
				if($this.attr('type')=='radio'){
					if($this.is(':checked')){
						obj[$this.attr('name')]=$.trim($this.val());
					}
				}else if($this.attr('type')=='checkbox'){
					if($this.is(':checked')){
						if(obj[$this.attr('name')]===undefined){
							obj[$this.attr('name')]=$.trim($this.val());
						}else{
							obj[$this.attr('name')]+=','+$.trim($this.val());
						}
					}
				}else{
					obj[$this.attr('name')]=$this.val();
				}
			}
		});
		return obj;
	},
	validate:function (data){
		return true;
	},
	initLoadTemplate:function(){
		var self=this;
		var template=$('body>script[type="text/template"]');
		if(template.length>0){
			var $this=template.eq(0);
			var url=$this.attr('data-get');
			var $parent=$('#'+$this.attr('data-append-id'));
			var inputChecked=$('#'+$this.attr('data-input-checked-id')).val();
			if($parent.length==1){
				utils.ajax({
					url:url,
					success:function(data){
						var data=data.list||data.data;
						$parent.html(doT.template($this.html())(data));
						$this.remove();
						if(inputChecked){
							var arr=inputChecked.split(',');
							for(var i=0;i<arr.length;i++){
								$parent.find('input[value="'+arr[i]+'"]').attr('checked',true);
							}
						}
						self.initLoadTemplate();
					}
				});
			}
		}
	}
});
/**
 * 弹出框
 */
function Pop(html,title,complete){
	this.html=html;
	this.title=title||'提示框'
	this.complete=complete||function (){}
	this.init();
}
Pop.prototype={
	init:function (){
		$('.pop').remove();
		this.showDialog();
		this.el=$('<div class="pop"><div class="pop-title">'+this.title+'</div><a class="pop-close">X</a><div class="pop-body"></div></div>');
		this.el.find('.pop-body').html(this.html);
		$('body').append(this.el);
		if(this.complete){
			this.complete();
		}
		var self=this;
		this.el.find('.pop-close').click(function (){
			self.close();
		});
		this.center();
	},	
	center:function (){
		var browser=navigator.appName
		var b_version=navigator.appVersion
		var version=b_version.split(";");
		if(version[1]){
			var trim_Version=version[1].replace(/[ ]/g,"");
			if(browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE7.0"||trim_Version=="MSIE6.0"||trim_Version=="MSIE8.0")){
				this.el.show().css({
					marginTop:'-'+(this.el.height()/2+20)+'px',
					marginLeft:'-'+(this.el.width()/2)+'px'
				});
	
			}else{
				this.el.animate({
					opacity:1,
					marginTop:'0px'
				},400);	
			}
		}else{
			this.el.animate({
					opacity:1,
					marginTop:'0px'
				},400);
		}
		
	},
	showDialog:function (){
		$('.dialog').remove();
		$('body').append('<div class="dialog"></div>');
		var self=this;
		$('.dialog').height($(document).height()).on('click',function(){
			self.close();
		});
	},
	close:function (){
		$('.dialog').remove();
		$('.pop').animate({
			opacity:0,
			marginTop:"-100px"
		},400,function(){
			$('.pop').remove();
		});
	}
}
/**
 * 确认框
 */
function Confirm(title,callback){
	var html='<div class="confirm"><p>'+title+'</p><div><button type="button" class="btn">确定</button><button type="button" class="btn">取消</button></div></div>';
	new Pop(html,'温馨提示',function (){
		var self=this;
		this.el.find('button:first').click(function (){
			if(callback&&typeof callback =='function'){
				self.close();
				callback();
			}
		});
		this.el.find('button:last').click(function (){
			self.close();
		});
	});
}
/**
 * 全局的事件绑定
 */
$(document).on('click','a[href^=#]',function (e){
	location.change($(this).attr('href'));
	e.preventDefault();
}).on('click','a[data-post-remove]',function (){
	var $this=$(this);
	var url=$this.attr('data-post-remove');
	if($this.attr('data-confirm')=='false'){
		utils.post(url,function (){
			$this.closest('tr').hide();
		});
	}else{
		new Confirm($this.attr('data-confirm')||'确认删除此记录吗?',function (){
			utils.post(url,function (){
				$this.closest('tr').hide();
			});
		});
	}
}).on('change','select[data-post]',function (){
	var $this=$(this);
	var url=$this.attr('data-post');
	utils.post(url+(url.indexOf('?')==-1?'?':'&')+$this.attr('name')+'='+$this.val());
}).on('change','select[data-syn-url]',function (e){
	var $this=$(this);
	location.change($this.attr('name')+"="+$this.val()+'&pageNum=1');
}).on('keyup','input[data-syn-url]',function(e){
	var $this=$(this);
	if(e.keyCode==13){
		location.change($this.attr('name')+"="+$this.val()+'&pageNum=1');
	}
}).on('keyup','input[data-post]',function (e){
	if(e.keyCode==13){
		$(this).blur();
	}
}).on('blur','input[data-post]',function (e){
	var $this=$(this);
	var url=$this.attr('data-post');
	utils.post(url+(url.indexOf('?')==-1?'?':'&')+$this.attr('name')+'='+$this.val());
}).on('click','a[data-pop-url]',function (e){
	var $this=$(this);
	var url=$this.attr('data-pop-url');
	var title=$this.attr('data-pop-title');
	var iframe=$('<iframe frameborder="0" src="'+url+'">');
	iframe.css({
		height:$this.attr('data-pop-height')||window.innerHeight*0.8,
		width:$this.attr('data-pop-width')||$(window).width()*0.65
	});
	new Pop(iframe,title);
	e.preventDefault();
}).on('click','.pimage,.list-view td>img',function (){
	new Pop('<div class="preview-image"><img src="'+$(this).attr('src')+'"/></div>','图片预览');
}).on('click','td a[title]',function (){
	new Pop($(this).attr('title'),'查看文字');
}).on('dblclick','.list-view tbody tr',function(){
	var $this=$(this);
	var th=$this.closest('table').find('th');
	var td=$this.find('td');
	var table=$('<div class="view-detail"><table class="view"><tbody></tbody></table></div>');
	for(var i=0;i<th.length;i++){
		if($.trim(th.eq(i).html())!='操作'){
			table.find('tbody').append('<tr><td>'+th.eq(i).html()+'：</td><td>'+td.eq(i).html()+'</td></tr>');
		}
	}
	new Pop(table,'预览表行');
});

$(function (){
	$('select[data-get]').each(function (){
		new SelectView($(this));
	});
});

window.onhashchange=function (){
	location.params=location.parseUrl(location.href);
	location.syn();
	pageView.ajax();
}

window.onload=function (){
	pageView.render();
	view.render();
}
