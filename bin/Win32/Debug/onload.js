var root = GetByName("window");//取根对象
var tool = GetByName("tool");//取工具条对象
var BrowserTabHead = GetByName("BrowserTabHead");//取游览框选择夹头部对象
var BrowserTab = GetByName("BrowserTab");//取游览框选择夹对象
var UrlEdit = GetByName("UrlEdit");//取地址框选择夹对象
var bookmark = GetByName("bookmark");//书签栏
var BrowserTabSelectIndex=1;//当前选择的选择夹
var otherlayout=LayoutLoad("file:other.xml");
var downloadlayout=LayoutLoad("file:download.xml");
GetByName("ctl").WindowCtl_clos.onclick=function (c){exit();};//设置关闭按钮回调

tool.other.onclick=other_onclick;//

BrowserTabHead.AddTab.onmouseenter=tabhead_onmouseenter;
BrowserTabHead.AddTab.onmouseleave=tabhead_onmouseleave;
BrowserTabHead.AddTab.onclick=tabhead_onclick;
	
//AddBrowserTab("http://www.baidu.com");//添加默认标签
//AddBrowserTab("http://127.0.0.1");//添加默认标签

GetByName("书签").onclick=function (c){
	
};
GetByName("ctl_home").onclick=function (c){
	if(BrowserTab.count==3 || BrowserTab.count-2 == BrowserTabSelectIndex){
			//创建新页面
		AddBrowserTab("www.baidu.com");
	}else{
		//在当前页面打开
		if(BrowserTabSelectIndex<BrowserTab.count-2){
			BrowserTab.GetItemAt(BrowserTabSelectIndex-1).url="www.baidu.com";
		}
	}
};
UrlEdit.onchar = function(c,ch){
	if(ch=='\r'){//回车键
		if(BrowserTab.count==3){
			//创建新页面
			AddBrowserTab(c.text);
		}else{
			//在当前页面打开
			if(BrowserTabSelectIndex<BrowserTab.count-2){
				BrowserTab.GetItemAt(BrowserTabSelectIndex-1).url=c.text;
			}
		}
	}
}

GetByName("user").onclick=BrowserTabUserPage;//设置用户按钮回调
tool.other2.onclick=BrowserTabMusicPage;
function BrowserTabSelect(Index){
	var old = BrowserTabHead.GetItemAt(BrowserTabSelectIndex*2-1);
	if(old)
		old.bkcolor=0;
	var c = BrowserTabHead.GetItemAt(Index*2-1);
	c.bkcolor=0xFFF4F8FF;
	BrowserTabSelectIndex=Index;
	BrowserTab.selectitem=Index-1;
}
function BrowserTabUserPage(){
	var old = BrowserTabHead.GetItemAt(BrowserTabSelectIndex*2-1);
	if(old)
		old.bkcolor=0;
	BrowserTab.selectitem=BrowserTab.count-2;
	BrowserTabSelectIndex=0;
}
function BrowserTabMusicPage(){
	var old = BrowserTabHead.GetItemAt(BrowserTabSelectIndex*2-1);
	if(old)
		old.bkcolor=0;
	BrowserTab.selectitem=BrowserTab.count-1;
	BrowserTabSelectIndex=0;
}
function AddBrowserTab(url){
	var TabHead = new Control("HorizontalLayout");
	TabHead.minwidth=60;
	TabHead.maxwidth=170;
	TabHead.onmouseenter=tabhead_onmouseenter;
	TabHead.onmouseleave=tabhead_onmouseleave;
	TabHead.onclick=tabhead_onclick;
	
	var img = new Control("NULL");
	img.bkimage="file:favicon.ico"
	img.width=16;
	img.height=16;
	img.padding="8,8,8,8"
	TabHead.Add(img);
	var title = new Control("Label");
	title.name="title";//设置名字,方便直接以成员方式操作
	TabHead.Add(title);
	var clos = new Control("Button");
	clos.width=16;
	clos.height=16;
	clos.padding="8,8,8,8";
	clos.normalimage="file:clos.png:type='img':src='0,0,18,18'" 
	clos.hotimage="file:clos.png:type='img':src='0,18,18,18'" 
	clos.pushedimage="file:clos.png:type='img':src='0,36,18,18'"
	clos.onclick=function(c){
		var a=c.parent;
		var i =BrowserTabHead.GetItemIndex(a);
		BrowserTabHead.GetItemAt(i+1).clos();
		c.parent.clos();
		BrowserTab.GetItemAt((i-1)/2).clos();
		BrowserTabSelect(i-1);
	}//关闭标签
	TabHead.Add(clos);
	
	BrowserTabHead.AddAt(TabHead,BrowserTabHead.count-2);//添加到父控件
	
	var fg = new Control("NULL");
	fg.width=1;
	fg.bkcolor=0xFFB2BCCB;
	BrowserTabHead.AddAt(fg,BrowserTabHead.count-2);
	

	
	var Browser = new Control("Browser");
	Browser.url=url;
	Browser.newwindow=function (c,url){
		return AddBrowserTab(url);
	};//打开新窗口事件
	Browser.titlechanged=function (c,t){
		print("aa");
		BrowserTabHead.GetItemAt(BrowserTab.GetItemIndex(c)*2+1).title.text=t;
	};//标题被改变事件	
	Browser.urlchanged=function (c,u){
		print("aa");
		UrlEdit.text=u;
	};//url被改变事件
	BrowserTab.AddAt(Browser,BrowserTab.count-3);
	BrowserTabSelect(BrowserTab.count-3);
	//BrowserTab.selectitem=BrowserTab.GetItemIndex(Browser);
	return Browser;
}

function tabhead_onmouseenter(c){
	if((BrowserTabHead.GetItemIndex(c)+1)/2!=BrowserTabSelectIndex){
		c.bkcolor=0xFFDAE4F2;
	}
};//鼠标进入事件
function tabhead_onmouseleave(c){
	if((BrowserTabHead.GetItemIndex(c)+1)/2!=BrowserTabSelectIndex){
		c.bkcolor=0;
	}	
};//鼠标离开事件
function tabhead_onclick(c){
	var Index=(BrowserTabHead.GetItemIndex(c)+1)/2;
	if(Index!=BrowserTabSelectIndex){
		BrowserTabSelect(Index);
	}
};//鼠标单击事件
function other_onclick(c){
	otherlayout.Popup();
}
