

var Main = {
    jsonObj:null,
    imageObjs:null,
    mappedImage:null,
    imageHolderDiv:null,
    centerLine_x:null,
    centerLine_y:null,
    prevOriginPt:null,
    
    curScale:1,
    SCALE_UP:3,
    SCALE_DOWN:1
    
}
Main.onLoad = function(){
   $.get("./artifacts2.json", function(data){
        Main.handleData(data);
    }, "json");
}

/*
 <div class="imageHolder">
    <img id="mappedImage" src="selected.jpg" usemap="#artifactMap"><img>
    <map name="artifactMap">
      <area shape="rect" class="imageObj" zzz="goat" coords="0,0,82,126" alt="goat">
      <area shape="circle" class="imageObj" zzz="goat2" coords="100, 100, 222" alt="goat1">
      <area shape="circle" class="imageObj" coords="124,58,8" href="venus.htm" alt="Venus">
    </map>
</div>
*/

Main.handleData = function(_data){
    this.jsonObj = _data;
    //alert(jsonObj.objectsArr[2].descrip);
    //alert(_data[2].coords);
    this.imageHolderDiv = document.createElement("div");
    $(this.imageHolderDiv).addClass("imageHolder");
    $("body").append(this.imageHolderDiv);
    
    this.mappedImage = new Image();
    this.mappedImage.src = this.jsonObj.imageForMapping;
    this.mappedImage.id = "mappedImage";
    $(this.mappedImage).css("position", "relative");
   //mappedImage.usemap = "#objectMap";
    $(this.mappedImage).attr("usemap", "#objectMap");
    $(this.mappedImage).width("100%");
    $(this.mappedImage).width("100%");
    $(this.imageHolderDiv).append(this.mappedImage);
    

    
    var mapElem = document.createElement("map");
    mapElem.name = "objectMap";
    $(this.imageHolderDiv).append(mapElem);
    
    for(var i = 0; i < this.jsonObj.objectsArr.length; i++){
        //console.log($(jsonObj.objectsArr[i].coords));
        //var newStr = jsonObj.objectsArr[i].coords + 'class="imageObj"'
        
        var $areaElem = $(this.jsonObj.objectsArr[i].coords);
        $areaElem.addClass("imageObj");
        //$areaElem.addClass("zoomTarget");
        $areaElem.attr("descrip", this.jsonObj.objectsArr[i].descrip);
        $(mapElem).append($areaElem);
    }
    
    this.centerLine_x = ($(this.imageHolderDiv).width())/2;
    this.centerLine_y = ($(this.imageHolderDiv).height())/2;
    //console.log("in Main.imageHolderDiv %o: ", this.imageHolderDiv);
    //console.log("in Main - this %o: ", this);
    
    PopupTxt.init();
    
    this.imageObjs = $(".imageObj");
    /**
    imageObjs.mouseover(function(e){
        var $obj = $(e.target);
        //alert($obj.attr("zzz"));
        //alert($obj.attr("coords"));
        console.log("here it is: %s", $obj.attr("coords"));
        alert(e.target + "rolled over");
    });
    
    imageObjs.mouseout(function(e){
        var objId = imageObjs.index(e.target);
        
        alert(objId + "rolled out");
    });
    **/
    this.imageObjs.click(function(e){
        var $obj = $(e.target);
        PopupTxt.hideTxtBox();
        console.log("here it is: %s", $obj.attr("coords"));
        console.log("descrip: %s", $obj.attr("descrip"));
        
        var coordArr = $obj.attr("coords").split(',');
        //$(mappedImage).width(zoomPct);
        //$(mappedImage).height(zoomPct);
        
        var originPoint = Main.getZoomOrigin(coordArr);
        console.log("originPoint: %s", originPoint);
        if(Main.curScale == Main.SCALE_DOWN){
            Main.curScale = Main.SCALE_UP;
            TweenLite.to(mappedImage, .7, {css:{scale:Main.SCALE_UP,
                                        overwrite:"all",
                                        transformOrigin:originPoint},
                                        ease:Power3.easeOut,
                                        onComplete:PopupTxt.showTxtBox});  
        }
        else{
            Main.curScale = Main.SCALE_DOWN;
            //TweenLite.killTweensOf(PoputTxt.txtBoxHolder);
            TweenLite.to(mappedImage, .7, {css:{scale:Main.SCALE_DOWN,
                                        overwrite:"all",
                                        transformOrigin:prevOriginPt},
                                        ease:Power3.easeOut,
                                        onComplete:PopupTxt.hideTxtBox});  
        }
        prevOriginPt = originPoint;
        PopupTxt.setTxt($obj.attr("descrip"), coordArr);
    });

}
 Main.getQuadrant = function(_xVal, _yVal, _wVal, _hVal){
    //var centerLine_x = ($(this.imageHolderDiv).width())/2;
    //var centerLine_y = ($(this.imageHolderDiv).height())/2;
    console.log("centerLine_x: %d", this.centerLine_x);
   
    // object in the middle
    if(_xVal < this.centerLine_x
                    && _xVal + _wVal > this.centerLine_x
                    && _yVal < this.centerLine_y
                    && _yVal + _hVal > this.centerLine_y){
        return("center");
    }        
        
    if(_xVal < this.centerLine_x){
        if(_yVal < this.centerLine_y){
            return("left top");
        }
        else{
            return("left bottom");
        }
    }
    else{
        if(_yVal < this.centerLine_y){
            return("right top");
        }
        else{
            return("right bottom");
        }
    }
}
Main.get_xywh = function(_coordArr){
    return(
           {
                xVal:parseInt(_coordArr[0]),
                yVal:parseInt(_coordArr[1]),
                wVal:_coordArr[2] - _coordArr[0],
                hVal:_coordArr[3] - _coordArr[1]
           }
          )
}
Main.getZoomOrigin = function(_coordArr){
    //var centerLine_x = ($(this.imageHolderDiv).width())/2;
    //var centerLine_y = ($(this.imageHolderDiv).height())/2;
    //var xVal = parseInt(_coordArr[0]);
    //var yVal = parseInt(_coordArr[1]);
    //var wVal = _coordArr[2] - _coordArr[0];
    //var hVal = _coordArr[3] - _coordArr[1];
    //var viewPort_w = $(imageHolderDiv).width();
    //var viewPort_h = $(imageHolderDiv).height();
    var xywh_obj = Main.get_xywh(_coordArr);
    
    switch(Main.getQuadrant(xywh_obj.xVal, xywh_obj.yVal, xywh_obj.wVal, xywh_obj.hVal))
    {
        case "left top":
            xPixel = xywh_obj.xVal;
            yPixel = xywh_obj.yVal;
            break;
        case "right top":
            xPixel = xywh_obj.xVal + xywh_obj.wVal;
            yPixel = xywh_obj.yVal;
            break;
        case "right bottom":
            xPixel = xywh_obj.xVal + xywh_obj.wVal;
            yPixel = xywh_obj.yVal + xywh_obj.hVal;
            break;
        case "left bottom":
            xPixel = xywh_obj.xVal;
            yPixel = xywh_obj.yVal + xywh_obj.hVal;
            break;
        case "center":
            xPixel = this.centerLine_x;
            yPixel = this.centerLine_y;
            break;
    }
    //var xPct = xVal / viewPort_w;
    //var xPixel = xVal + wVal/2;
    //var yPixel = yVal + hVal/2
    return(xPixel + "px " + yPixel + "px");
    
    
    
    
    
    //console.log("x: %d; w: %d; h: %d", xVal, wVal, hVal);
    
    
    
    
    
}



















