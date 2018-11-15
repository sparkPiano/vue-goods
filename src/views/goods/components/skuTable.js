function loadTable(gas){
	var b = true;
	var skuTypeArr =  [];
	var totalRow = 1;
	
	$(".SKU_TYPE3").each(function(){
		var skuTypeNode = $(this).children("li");
		var skuTypeObj = {};

		skuTypeObj.skuTypeTitle = $(skuTypeNode).attr("sku-type-name");
		var propid = $(skuTypeNode).attr("propid");
		skuTypeObj.skuTypeKey = propid;
		var is_required = $(skuTypeNode).attr("is_required");
		skuValueArr = [];
		var skuValNode = $(this).next();
	
		var skuValCheckBoxs = $(skuValNode).find("input[type='checkbox'][class*='sku_value']");
		var checkedNodeLen = 0 ;
		$(skuValCheckBoxs).each(function(){
			if($(this).is(":checked")){
				var skuValObj = {};
				skuValObj.skuValueTitle = $(this).val();
				skuValObj.skuValueId = $(this).attr("propvalid");
				skuValObj.skuPropId = $(this).attr("propid");
				skuValueArr.push(skuValObj);
				checkedNodeLen ++ ;
			}
		});
		if(is_required && "1" == is_required){
			if(checkedNodeLen <= 0){
				b = false;
				return false;
			}
		}
		if(skuValueArr && skuValueArr.length > 0){
			totalRow = totalRow * skuValueArr.length;
			skuTypeObj.skuValues = skuValueArr;
			skuTypeObj.skuValueLen = skuValueArr.length;
			skuTypeArr.push(skuTypeObj);
		}
	});

	var SKUTableDom = "";//sku表格数据

	if(b){//必选的SKU属性已经都选中了		
		SKUTableDom += "<table class='skuTable'><tr>";
	
		for(var t = 0 ; t < skuTypeArr.length ; t ++){
			SKUTableDom += '<th style="width:15%;">'+skuTypeArr[t].skuTypeTitle+'</th>';
		}
		SKUTableDom += '<th>原价</th><th>优惠价</th><th>库存</th>';
		SKUTableDom += "</tr>";
		//循环处理表体
		for(var i = 0 ; i < totalRow ; i ++){
			var currRowDoms = "";
			var rowCount = 1;
			var propvalidArr = [];
			var propIdArr = [];
			var propvalnameArr = [];
			var propNameArr = [];
			for(var j = 0 ; j < skuTypeArr.length ; j ++){
				var skuValues = skuTypeArr[j].skuValues;
				var skuValueLen = skuValues.length;
				rowCount = (rowCount * skuValueLen);
				var anInterBankNum = (totalRow / rowCount);
				var point = ((i / anInterBankNum) % skuValueLen);
				propNameArr.push(skuTypeArr[j].skuTypeTitle);
				if(0  == (i % anInterBankNum)){
					currRowDoms += '<td rowspan='+anInterBankNum+'>'+skuValues[point].skuValueTitle+'</td>';
					propvalidArr.push(skuValues[point].skuValueId);
					propIdArr.push(skuValues[point].skuPropId);
					propvalnameArr.push(skuValues[point].skuValueTitle);
				}else{
					//当前单元格为跨行
					propvalidArr.push(skuValues[parseInt(point)].skuValueId);
					propIdArr.push(skuValues[parseInt(point)].skuPropId);
					propvalnameArr.push(skuValues[parseInt(point)].skuValueTitle);
				}
			}
			
			var propvalids = propvalidArr.toString()
			var alreadySetSkuPrice = "";//已经设置的SKU原价
			var alreadySetSkuBestPrice = "";//已经设置的SKU优惠价
			var alreadySetSkuStock = "";//已经设置的SKU库存
			
			//赋值
			for(var t=0;t<gas.length;t++){
				if(gas[t].svids == propvalids){
					alreadySetSkuPrice = gas[t].goods_org_price/100;
					alreadySetSkuBestPrice = gas[t].goods_best_price/100;
					alreadySetSkuStock = gas[t].goods_stock;
				}
			}
			
			SKUTableDom += '<tr class="sku_table_tr">'+currRowDoms+'<td>'+alreadySetSkuPrice+'</td><td>'+alreadySetSkuBestPrice+'</td><td>'+alreadySetSkuStock+'</td></tr>';
		}
		SKUTableDom += "</table>";
	}
	$("#skuTable").html(SKUTableDom);
}