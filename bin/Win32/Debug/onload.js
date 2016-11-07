var root = GetByName("window");
var tool = GetByName("tool");
var BrowserTabHead = GetByName("BrowserTabHead");
var BrowserTab = GetByName("BrowserTab");
GetByName("ctl").WindowCtl_clos.onclick="clos_onclick();";
tool.other.onclick="other_onclick();"

AddBrowserTab("http://www.baidu.com");

function AddBrowserTab(url){
	var TabHead = new Control("Option");
	TabHead.minwidth=60;
	TabHead.maxwidth=130;
	TabHead.group=true;
	BrowserTabHead.AddAt(TabHead,BrowserTabHead.count-1);
	TabHead.selected=true;

	var Browser = new Control("Browser");
	Browser.url=url;
	BrowserTab.Add(Browser);
	
	BrowserTab.selectitem=BrowserTab.GetItemIndex(Browser);
}
function other_onclick(){
	print("aa");
}
function clos_onclick(){
	exit();
}