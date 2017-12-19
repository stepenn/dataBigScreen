/**
 * Created by jljsj on 15/5/12.
 */
var jQuery = jQuery || {}, TweenMax = TweenMax || {};
(function ($, T) {
    var columnFun={
        c_w: 1920,
        c_h: 1080,
        num:0,
        init:function (){
            var self=this;
            self.title = $("#title");
            self.columnStyle=$(".column-style");
            self.columnBox=$('#column');
            self.column=$(".column-box");
            self.columnCirc=$(".column-circ");
            self.columnDate=$(".column-date");
            self.loadData();
            setInterval(function (){
                var d=new Date();
                if(d.getHours()==12){
                    self.loadData()
                }
            },3600000);
        },
        ajaxData: function (str, call,errorcall) {
            $.ajax({
                url: str,
                datatype:"json",
                type: "GET",
                success: call,
                error:errorcall
            })
        },
        loadData:function (){
            var self=columnFun;
            //console.log("jsonurl:"+jsonUrl)
            self.ajaxData(jsonUrl + "?r=" + Math.random(), function (data) {
                self.jsonData=data;
                //console.log(self.jsonData)
                self.start(self.jsonData);

            },function (jqXHR, textStatus, errorThrown){
                //如果加载不了再放一下前面这遍
                if(self.jsonData)
                    self.start(self.jsonData);
                else
                    alert("没有数据");
            });
        },
        start:function (_data){
            //获取最大值做刻度
            var self=this;
            var __data=_data[self.num];
            var data=__data.data;
            //替换标题和其他文案；
            if(__data.title) self.title.find("span").text(__data.title);
            if(__data.bluetext) self.columnStyle.find("li").eq(0).find("span").text(__data.bluetext);
            if(__data.redtext) self.columnStyle.find("li").eq(1).find("span").text(__data.redtext);
            if(__data.iconimg) self.title.find(".icon").find("div").css("background","url("+__data.iconimg+") center /cover");
            //计算刻度；
            self.lenNum=data.length;
            self.allmaxNum=0;
            self.allminNum=data[0].all;
            self.f_maxNum=0;
            self.f_minNum=data[0].farmer;
            for(var i=0;i<data.length;i++){
                if(Number(data[i].farmer)<self.f_minNum){
                    self.f_minNum=Number(data[i].farmer)
                }
                if(Number(data[i].all)<self.allminNum){
                    self.allminNum=Number(data[i].all)
                }
            }
            //这里是计算减去最小值后的最大数
            for(i=0;i<data.length;i++){
                if(Number(data[i].all)-self.allminNum>self.allmaxNum){
                    self.allmaxNum=Number(data[i].all)-self.allminNum;
                }
                if(Number(data[i].farmer)-self.f_minNum>self.f_maxNum){
                    self.f_maxNum=Number(data[i].farmer)-self.f_minNum;
                }
            }

            if(self.column.children().length<=0){

            }
            self.column.empty();
            self.columnDate.empty();
            //self.columnCirc.empty();
            for(var i=0;i<self.lenNum;i++){
                var mc=self.addColumn(data[i]);
                self.column.append(mc);
                var date=self.addDate(data[i].date);
                self.columnDate.append(date);
                //self.addCircAndLine(data[i].farmer,i)
                if(self.columnCirc.children().length<self.lenNum*2){
                    var n=$("<div class='circ' style='opacity: 0'></div>");
                    var l=$("<div class='line' style='opacity: 0' ></div>");
                    self.columnCirc.append([n,l]);
                }
                //var t1=new TimelineMax({delay:0.2*i,yoyo:true,repeat:1,repeatDelay:.5,onUpdate:self.drawCrircAndLineY,onUpdateParams:[n,l,i]});//
                //t1.add(T.from(mc.children(),.5,{top:"100%",ease:Circ.easeInOut}));
                //t1.add(T.to(mc.children(),.5,{delay:10,top:"100%",ease:Circ.easeInOut}));
                T.from(mc.children(),.5,{top:"100%",delay:0.2*i,yoyo:true,repeat:1,repeatDelay:10,onComplete:self.endTween,onCompleteParams:[i]})//,onUpdate:self.drawCrircAndLineY,onUpdateParams:[n,l,i]

            }
            //TweenMax的update在不动时不更新了，，导至线的右边角度没完成；注册个记时器；
            self.InterTimer=setInterval(self.drawCrircAndLineY,3);
//,onComplete:self.endTween,onCompleteParams:[i]
        },
        endTween:function (i){
            var self=columnFun;
            if(i>=self.lenNum-1){

                //self.num++;
                if(self.num>=self.jsonData.length){
                    self.num=0
                }
                clearInterval(self.InterTimer);
                self.start(self.jsonData);
            }

        },
        drawCrircAndLineY:function (){
            var self=columnFun;
            for(var i=0;i<self.lenNum;i++){
                var circ=self.columnCirc.find(".circ").eq(i),line=self.columnCirc.find(".line").eq(i);
                var r_h=self.column.height()-self.column.find("div").eq(i).find(".red").position().top,
                    s=40,
                    b=self.column.width()*.99/self.lenNum,
                    w=b*i+b/2,
                    ww=i<self.lenNum-1?b*(i+1)+b/2: w,
                    rr_h=i<self.lenNum-1?self.column.height()-self.column.find("div").eq(i+1).find(".red").position().top:r_h,
                    ss=8;
                //算两点距离
                var point={x:w,y:r_h},point1={x:ww,y:rr_h};
                var xx1=point1.x-point.x,yy1=point1.y-point.y;
                var line_w=Math.pow(Math.pow(xx1,2)+Math.pow(yy1,2),.5);
                //算角度；
                var angle=-Math.atan(yy1/xx1)/Math.PI*180;
                circ.css({"left":w-15,"bottom":r_h-s/2,opacity: 1});
                line.css({"left":w-ss/2,"bottom":r_h-ss/2,opacity: 1,"width":line_w+"px","transform":"rotate("+angle+"deg)"});
            }
        },
        addDate:function (date){
            var self=this;
            var n=$("<div class='fn-left' style='position:relative;height: 100%;width:"+ (.99/self.lenNum)*100+"%;line-height:"+self.columnDate.height()+"px'>" +date+"</div>")
            return n
        },
        addColumn:function (data){
            var self=this;
            //规则：取出最小值在柱状一半位置显示
            //console.log(self.allminNum.toString().length)
            //var scale=self.allminNum/Math.pow(10,self.allminNum.toString().length/2);
            //console.log(scale)
            //console.log(self.allmaxNum,self.f_maxNum)
            //算farmer是all的百分之多少；
            var scale=data.farmer/data.all*100;
            var h=(Number(data.all)-self.allminNum)/self.allmaxNum*80,
                r_h=(Number(data.farmer)-self.f_minNum)/self.f_maxNum*scale;
            var n=$("<div class='fn-left' style='position:relative;height: 100%;width:"+ (.99/self.lenNum)*100+"%' data-date="+data.date+">" +
            "<span class='column blue' style='bottom:"+(h-80)+"%'></span>"+
            "<span class='column red' style='bottom:"+(r_h-95)+"%'></span>"+
            "</div>");
            return n
        }
    };
    $().ready(function (){
        columnFun.init()
    })
})(jQuery, TweenMax);