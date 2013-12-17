
var PopupTxt = {
    txtBoxHolder:null,
    txtBox:null,
    TOP_LEFT_X: "20px",
    TOP_LEFT_Y: "20px",
    
    TOP_RIGHT_X: "20px",
    TOP_RIGHT_Y: "20px",
    
    BTM_LEFT_X: "20px",
    BTM_LEFT_Y: "20px",
    
    BTM_RIGHT_X: "20px",
    BTM_RIGHT_Y: "20px",
    
    TXTBOX_HOLDER_W:null
}
PopupTxt.init = function(){
    this.txtBoxHolder = document.createElement("div");
    $(this.txtBoxHolder).addClass("popupTxtHolder");
    $(Main.imageHolderDiv).append(this.txtBoxHolder);
    
    this.txtBox = document.createElement("div");
    $(this.txtBox).addClass("popupTxt");
    $(this.txtBoxHolder).append(this.txtBox);
    
    this.TXTBOX_HOLDER_W = parseInt($(this.txtBoxHolder).width());
    $(this.txtBoxHolder).css("width", 0);
}
PopupTxt.hideTxtBox = function(){
    $(PopupTxt.txtBoxHolder).css("width", "0px");
}
PopupTxt.showTxtBox = function(){
    //$(PopupTxt.txtBoxHolder).css("width", "300px");
    //var originStr = (PopupTxt.TXTBOX_HOLDER_W/2 + "px " + "0px");
    //console.log("originStr: <%s>", originStr);
    TweenLite.to(PopupTxt.txtBoxHolder, .3, {css:{width:PopupTxt.TXTBOX_HOLDER_W + "px",
                                        overwrite:"all"},
                                        ease:Power3.easeOut});  
}
PopupTxt.resetQuadrants = function(){ 
    var OFFSET = 140;
    this.TOP_LEFT_X = OFFSET + "px";
    this.TOP_LEFT_Y = OFFSET + "px";
    
    this.TOP_RIGHT_X = $(Main.imageHolderDiv).width() - this.TXTBOX_HOLDER_W - OFFSET + "px";
    this.TOP_RIGHT_Y = OFFSET + "px";
    
    this.BTM_LEFT_X = OFFSET + "px";
    //this.BTM_LEFT_Y = $(Main.imageHolderDiv).height() - $(this.txtBox).height() - OFFSET + "px";
    this.BTM_LEFT_Y = $(Main.imageHolderDiv).height() - 50 - OFFSET + "px";
    console.log(">>>>>>%d", $(this.txtBox).height());
    this.BTM_RIGHT_X = $(Main.imageHolderDiv).width() - this.TXTBOX_HOLDER_W - OFFSET + "px";
    //this.BTM_RIGHT_Y = $(Main.imageHolderDiv).height() - $(this.txtBox).height() - OFFSET + "px";
    this.BTM_RIGHT_Y = $(Main.imageHolderDiv).height() - 50 - OFFSET + "px";
}
PopupTxt.setTxt = function(_str, _coordArr){
    var xVal, yVal;
    console.log("str: %s", _str);
    this.txtBox.innerHTML = _str;
    // txtBox height has changed
    this.resetQuadrants();
    var xywh_obj = Main.get_xywh(_coordArr);
    switch(Main.getQuadrant(xywh_obj.xVal, xywh_obj.yVal, xywh_obj.wVal, xywh_obj.hVal))
    {
        case "left top":
            xVal = this.TOP_RIGHT_X;
            yVal = this.TOP_RIGHT_Y;
            break;
        case "right top":
            xVal = this.TOP_LEFT_X;
            yVal = this.TOP_LEFT_Y;
            break;
        case "right bottom":
            xVal = this.BTM_LEFT_X;
            yVal = this.BTM_LEFT_Y;
            break;
        case "left bottom":
            xVal = this.BTM_RIGHT_X;
            yVal = this.BTM_RIGHT_Y;
            break;
        case "center":
            xVal = this.TOP_RIGHT_X;
            yVal = this.TOP_RIGHT_Y;
            break;
    }
    console.log("xVal: %s; yVal: %s", xVal, yVal);
    $(this.txtBoxHolder).css("left", xVal);
    $(this.txtBoxHolder).css("top", yVal);
    //this.txtBoxHolder.top = yVal;
    
}


