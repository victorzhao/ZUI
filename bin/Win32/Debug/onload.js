var a = GetByName("head");
a.height=80;
a.bkcolor=0xF00FFF00;
a.drag=true;
a.padding="10,5,20,6";
a.ctl.bkcolor=0xF00FFFFF;
print(a.height);
function onclick(){
	exit();
}
