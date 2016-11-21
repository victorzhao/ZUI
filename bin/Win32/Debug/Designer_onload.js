var root = GetByName("window");//取根对象
var DesignTabHead = GetByName("designtabhead");//取设计区选择夹头部对象
var DesignTab = GetByName("designtab");//取设计区选择夹对象


GetByName("ctl").WindowCtl_clos.onclick=function (c){exit();};//设置关闭按钮回调

//------------设计区
var DesignTabSelectIndex=0;//当前选择的选择夹
function DesignTabSelect(Index){
	var old = DesignTabHead.GetItemAt(DesignTabSelectIndex-1);
	if(old){
		old.bkcolor=0;
		old.closbut.visible=false;
	}
	var c = DesignTabHead.GetItemAt(Index-1);
	if(c){
		c.bkcolor=0xFFFFF29D;
		c.closbut.visible=true;
	}
	DesignTabSelectIndex=Index;
	DesignTab.selectitem=Index-1;
}
function AddDesignTab(){
	var TabHead = new Control("HorizontalLayout");
	TabHead.height=22;
	TabHead.minwidth=60;
	TabHead.maxwidth=170;
	TabHead.onmouseenter=function(c){
		if(DesignTabHead.GetItemIndex(c)+1!=DesignTabSelectIndex){
			c.bkcolor=0xFF5B7199;
			c.closbut.visible=true;
		}
	};
	TabHead.onmouseleave=function(c){
		if(DesignTabHead.GetItemIndex(c)+1!=DesignTabSelectIndex){
			c.bkcolor=0;
			c.closbut.visible=false;
		}	
	};
	TabHead.onclick=function(c){
		var Index=DesignTabHead.GetItemIndex(c)+1;
		if(Index!=DesignTabSelectIndex){
			DesignTabSelect(Index);
		}
	};
	

	var title = new Control("Label");
	title.name="title";//设置名字,方便直接以成员方式操作
	TabHead.Add(title);
	var clos = new Control("Button");
	clos.width=16;
	clos.height=16;
	clos.padding="3,3,3,3";
	clos.normalimage="file:clos.png:type='img':src='0,0,18,18'" 
	clos.hotimage="file:clos.png:type='img':src='0,18,18,18'" 
	clos.pushedimage="file:clos.png:type='img':src='0,36,18,18'"
	clos.name="closbut";
	clos.onclick=function(c){
		var a=c.parent;
		var i =DesignTabHead.GetItemIndex(a);
		c.parent.clos();
		DesignTab.GetItemAt(i).clos();
		if(i+1<=DesignTabSelectIndex)
			DesignTabSelectIndex--;
		DesignTabSelect(DesignTabSelectIndex);
	}//关闭标签
	clos.visible=false;
	TabHead.Add(clos);
	
	DesignTabHead.AddAt(TabHead);//添加到父控件
	
	
	var Edit = new Control("CodeEdit");
	DesignTab.Add(Edit);
	DesignTabSelect(DesignTab.count);
	return Edit;
}


//------------属性区



//------------工具区



//------------初始化代码
AddDesignTab();
AddDesignTab();
AddDesignTab();
AddDesignTab();




