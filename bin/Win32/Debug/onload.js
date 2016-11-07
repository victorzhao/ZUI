var root = GetByName("window");//取根对象
var tool = GetByName("tool");//取工具条对象
var BrowserTabHead = GetByName("BrowserTabHead");//取游览框选择夹头部对象
var BrowserTab = GetByName("BrowserTab");//取游览框选择夹对象
var BrowserTabSelectIndex=1;//当前选择的选择夹

GetByName("ctl").WindowCtl_clos.onclick=function (c){exit();};//设置关闭按钮回调
tool.other.onclick=other_onclick;//
BrowserTabHead.AddTab.onclick=function (c){print("aa");AddBrowserTab("http://www.baidu.com");};

AddBrowserTab("http://www.baidu.com");//添加默认标签
//AddBrowserTab("http://127.0.0.1");//添加默认标签


function BrowserTabSelect(Index){
	var old = BrowserTabHead.GetItemAt(BrowserTabSelectIndex*2-1);
	old.bkcolor=0;
	var c = BrowserTabHead.GetItemAt(Index*2-1);
	c.bkcolor=0xFFF4F8FF;
	BrowserTabSelectIndex=Index;
	BrowserTab.selectitem=Index-1;
}
function AddBrowserTab(url){
	var TabHead = new Control("HorizontalLayout");
	TabHead.minwidth=60;
	TabHead.maxwidth=130;
	TabHead.onmouseenter=function (c){
		if((BrowserTabHead.GetItemIndex(c)+1)/2!=BrowserTabSelectIndex){
			c.bkcolor=0xFFDAE4F2;
		}
	};//鼠标进入事件
	TabHead.onmouseleave=function (c){
		if((BrowserTabHead.GetItemIndex(c)+1)/2!=BrowserTabSelectIndex){
			c.bkcolor=0;
		}
		
	};//鼠标离开事件
	TabHead.onclick=function (c){
		var Index=(BrowserTabHead.GetItemIndex(c)+1)/2;
		if(Index!=BrowserTabSelectIndex){
			BrowserTabSelect(Index);
		}
	};//鼠标单击事件
	
	var img = new Control("AA");
	img.bkimage="file:favicon.ico"
	img.width=16;
	img.height=16;
	img.padding="8,8,8,8"
	TabHead.Add(img);
	var title = new Control("AA");
	title.name="title";//设置名字,方便直接以成员方式操作
	TabHead.Add(title);
	var clos = new Control("AA");
	TabHead.Add(clos);
	
	BrowserTabHead.AddAt(TabHead,BrowserTabHead.count-2);//添加到父控件
	
	var fg = new Control("AA");
	fg.width=1;
	fg.bkcolor=0xFFB2BCCB;
	BrowserTabHead.AddAt(fg,BrowserTabHead.count-2);
	

	
	
	
	var Browser = new Control("Browser");
	Browser.url=url;
	Browser.newwindow=function (c,url){
		return AddBrowserTab(url);
	};//打开新窗口事件
	Browser.titlechanged=function (c,title){
		print(title)
	};//标题被改变事件	
	BrowserTab.Add(Browser);
	BrowserTabSelect(BrowserTab.count);
	//BrowserTab.selectitem=BrowserTab.GetItemIndex(Browser);
	return Browser;
}
function other_onclick(c){
	print(c.text);
	print("aa");
	print("a"+1);
}
