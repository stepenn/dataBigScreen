/**
 * Created by jljsj on 15/5/13.
 */
var jQuery = jQuery || {}, TweenMax = TweenMax || {};
(function ($, T) {
    function drawSector(point,r,angle,startAngle){
        angle=(Math.abs(angle) > 360) ? 360 : angle;
        var flag=angle>180?1:0;
        //var n=Math.ceil(Math.abs(angle)/45),
            //angleA=angle / n;
        //angleA = angleA * Math.PI / 180;
        startAngle = startAngle * Math.PI / 180;
        var str=""//"M"+point.x+" "+point.y;
        str+=" M"+(point.x + r * Math.cos(startAngle))+" "+(point.y+r * Math.sin(startAngle))
        var angleA,cx,cy;
        if(angle>=360){
            angleA=angle/2;
            angleA=angleA*Math.PI/180;
            angleA=angleA+startAngle;
            for(var i=0;i<2;i++){
                cx=point.x+r*Math.cos(angleA+i*Math.PI);
                cy=point.y+r*Math.sin(angleA+i*Math.PI);
                str+="A"+r+" "+r+" 0 1 1 "+cx+" "+cy;
            }
            str+=" Z";
            return str;
        }
        angle=angle*Math.PI/180;
        angleA=angle+startAngle;

        cx = point.x + r * Math.cos(angleA);
        cy = point.y + r * Math.sin(angleA);
        str+="A"+r+" "+r+" 0 "+flag+" 1 "+cx+" "+cy;
        if(angle<Math.PI*2){
            str+=" L"+point.x+" "+point.y
        }
        str+=" Z";
        return str
    }
    var chartFunc={
        jsonData:null,
        r:300,
        startAngle:-90,
        num:0,
        init:function (){
            this.leftFunc.init();
            this.rightFunc.init();
            this.addObj();
            this.loadData();
            var self=this;
            setInterval(function (){
                var d=new Date();
                if(d.getHours()==8){
                    self.loadData()
                }
            },3600000);
            setInterval(this.start,10000)
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
        addObj:function(){
            var self = this;
            for(var i=0;i<domCopy.length;i++){
                var n=$("#copy").clone().attr("id",domCopy[i].id).removeClass("hide").appendTo("body");
                n.find(".title span").text(domCopy[i].title);
                self.ajaxData(jsonUrl + "?r=" + Math.random(), function (data) {
                    console.log(data);
                    self.jsonData=data;
                    self.start();
                });
            }
            //$("#copy").remove();
        },
        loadData:function (){
            var self=chartFunc;
            self.ajaxData(jsonUrl + "?r=" + Math.random(), function (data) {
                self.JsonData=data;
                self.start();
            },function (jqXHR, textStatus, errorThrown){
                if(self.JsonData){
                    self.start();
                }
                else
                    alert("没有数据");
            });
        },
        start:function (){
            //替换文案；
            var self=chartFunc;
            self.jsonData=self.JsonData[self.num];
            console.log( self.jsonData);
            var obj=eval('('+ self.JsonData +')');
            self.jsonData=obj[self.num];
            if(self.jsonData.titleLeft) $(".title").eq(0).find("span").text(self.jsonData.titleLeft);
            if(self.jsonData.titleRight) $(".title").eq(1).find("span").text(self.jsonData.titleRight);
            if(self.jsonData.farmerLeftTxt) $("#f-leftTxt").text(self.jsonData.farmerLeftTxt);
            if(self.jsonData.farmerRightTxt) $("#f-rightTxt").text(self.jsonData.farmerRightTxt);
            if(self.jsonData.iconimg) $(".title").find(".icon div").css("background","url("+self.jsonData.iconimg+") center /cover")
            self.leftFunc.start();
            self.rightFunc.start();
            self.num++;
            if(self.num>=self.JsonData.length){
                self.num=0
            }
        },
        leftFunc:{
            parent:null,
            xy:{x:550,y:550},
            init:function(){
                var self=this;
                self.parent=chartFunc;
                self.man=$("#man");
                self.girl=$("#girl");
                self.manText=$("#manText");
                self.girlText=$("#girlText");
                self.manIcon=$("#manIcon");
                self.girlIcon=$("#girlIcon");
                if(!self.manObj){
                    self.manObj={num:0};
                }
                if(!self.girlObj){
                    self.girlObj={num:0};
                }
            },
            iconMatrix:function (num,startAngle,r,angleP){
                angleP=angleP>=360?angleP-360:angleP;
                startAngle=startAngle*Math.PI/180;
                var self=chartFunc.leftFunc;
                var angle=num*Math.PI/180;
                var angleA=angle+startAngle;
                r=self.parent.r+r;//半径加上图标高度；
                var cx = self.xy.x + r * Math.cos(angleA),
                    cy = self.xy.y + r * Math.sin(angleA);
                var str="translate("+cx+","+cy+")rotate("+(num+angleP)+")";
                return str
            },
            start:function (){
                var self=this,
                    manToNum=Number(self.parent.jsonData.man),
                    girlToNum=Number(self.parent.jsonData.girl);

                if(!self.manObj.num&&!self.girlObj.num){
                    self.manIcon.attr("opacity",1);
                    var t=self.mcTween(self.manObj,manToNum,self.man,self.manText,self.manIcon,Power2.easeIn,self.parent.startAngle,30,0);
                    t.vars.onComplete=function (){
                        self.mcTween(self.girlObj,girlToNum,self.girl,self.girlText,self.girlIcon,Power2.easeOut,self.parent.startAngle+manToNum*3.6,30,manToNum*3.6)
                    };

                }else{
                    self.mcTween(self.manObj,manToNum,self.man,self.manText,self.manIcon,Power2.easeInOut,self.parent.startAngle,30,0);
                    T.to(self.girlObj,.5,{num:girlToNum,ease:Power2.easeInOut,onUpdate:function (){
                        self.girlText.text(Math.round(self.girlObj.num));
                        self.girl.attr("d",drawSector(self.xy,self.parent.r,self.girlObj.num*3.6,self.parent.startAngle+self.manObj.num*3.6));
                        self.girlIcon.attr("transform",self.iconMatrix(self.girlObj.num*3.6/2,self.parent.startAngle+self.manObj.num*3.6,30,self.manObj.num*3.6));
                    }})
                }
            },
            mcTween:function (obj,num,mc,mcText,mcIcon,ease,startAngle,r,angleP){
                var self=this;
                var t= T.to(obj,.5,{num:num,ease:ease,onStart:function(){
                    mcIcon.attr("opacity",1);
                },onUpdate:function (){
                    mc.attr("d",drawSector(self.xy,self.parent.r,obj.num*3.6,startAngle));
                    mcText.text(Math.round(obj.num));
                    mcIcon.attr("transform",self.iconMatrix(obj.num*3.6/2,startAngle,r,angleP))
                }});
                return t
            }
        },
        rightFunc:{
            xy:{x:1500,y:550},
            parent:null,
            init:function(){
                var self=this;
                self.parent=chartFunc;
                self.farmer=$("#farmer");
                self.farmerText=$("#farmerText");
                if(!self.farmerObj){
                    self.farmerObj={num:0};
                }
            },
            start:function (){
                var self=this,
                    farmerToNum=Number(self.parent.jsonData.farmer);
                T.to(self.farmerObj,.5,{num:farmerToNum,ease:Power2.easeInOut,onUpdate:function (){
                    self.farmer.attr("d",drawSector(self.xy,self.parent.r-4,self.farmerObj.num*3.6,self.parent.startAngle));
                    self.farmerText.text(Math.round(self.farmerObj.num))
                }})
            }
        },
    };
    $().ready(function (){
        chartFunc.init();

    })
})(jQuery, TweenMax);