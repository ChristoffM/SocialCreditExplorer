/* txFee must be based proportional to the number of new nodes (w/whout balance?)
 * 
 * 
 * 
 */

var balance=[0,0,0,1000000];
var totalcoins;
var dividents=0;
var txFee=1;//100%
var j;

function transferNoGrowth(fromwho,towho,amount){
  if (balance[fromwho-1]<amount)
    alert("not enough funds");
  else{
    balance[fromwho-1]-=amount;
    balance[towho-1]+=parseInt(amount);
    updateBalances();
  }
}

/*function transferGrowthSenderExcluded(fromwho,towho,amount){
  if (balance[fromwho-1]<amount)
    alert("not enough funds");
  else{
    dividents=amount/(balance.length-1);
    balance[fromwho-1]-=amount;
    balance[towho-1]+=parseInt(amount);
    balance[fromwho-1]-=dividents;
    for (j=0;j<balance.length;j++)
      balance[j]+=dividents;
    updateBalances();
  }
}

function transferGrowth(fromwho,towho,amount){
  if (balance[fromwho-1]<amount)
    alert("not enough funds");
  else{
    dividents=amount/(balance.length-2);
    balance[fromwho-1]-=amount;
    balance[towho-1]+=parseInt(amount);
    balance[fromwho-1]-=dividents;
    balance[towho-1]-=dividents;
    for (j=0;j<balance.length;j++)
      balance[j]+=dividents;
    updateBalances();
  }
}
*/

function transferGrowthPercentage(fromwho,towho,amount){
  if (balance[fromwho-1]<amount)
    alert("not enough funds");
  else{
    dividents=txFee*amount/totalcoins;
    balance[fromwho-1]-=amount;
    balance[towho-1]+=parseInt(amount);
    for (j=0;j<balance.length;j++){
      if ((j!=fromwho-1)&&(j!=towho-1))
        balance[j]*=(1+dividents);
    }
    updateBalances();
  }
}

function transferCostPercentage(fromwho,towho,amount){
  if (balance[fromwho-1]<(1+txFee)*amount)
    alert("not enough funds");
  else{
    dividents=txFee*amount/(totalcoins-balance[towho-1]-balance[fromwho-1]);
    balance[fromwho-1]-=amount*(1+txFee);
    balance[towho-1]+=parseInt(amount);
    for (j=0;j<balance.length;j++){
      if ((j!=fromwho-1)&&(j!=towho-1))
        balance[j]*=(1+dividents);
    }
    updateBalances();
  }
}


function updateBalances(){
  totalcoins=0;
  for (j=0;j<balance.length;j++)
    totalcoins+=balance[j];
  $("#total").html(Math.floor(totalcoins)/100);
  $("#b1").html(Math.floor(balance[0])/100);
  $("#b2").html(Math.floor(balance[1])/100);
  $("#b3").html(Math.floor(balance[2])/100);
  $("#b4").html(Math.floor(balance[3])/100);
  $("#p1").html((100*balance[0]/totalcoins).toFixed(2));
  $("#p2").html((100*balance[1]/totalcoins).toFixed(2));
  $("#p3").html((100*balance[2]/totalcoins).toFixed(2));
  $("#p4").html((100*balance[3]/totalcoins).toFixed(2));
}

$("#send").click(function(){
  switch ($("input[name=type]:checked").val()){
    case "normal":
      transferNoGrowth($("#fromwho").val(),$("#towho").val(),$("#amount").val()*100);
      break;
    case "growPh":
      txFee=1;
      transferGrowthPercentage($("#fromwho").val(),$("#towho").val(),$("#amount").val()*100);
	break;
    case "growPt":
	  txFee=0.1;
      transferGrowthPercentage($("#fromwho").val(),$("#towho").val(),$("#amount").val()*100);
    break;
    case "growPo":
	  txFee=0.01;
      transferGrowthPercentage($("#fromwho").val(),$("#towho").val(),$("#amount").val()*100);
    break;
    case "costP":
      txFee=0.1;
      transferCostPercentage($("#fromwho").val(),$("#towho").val(),$("#amount").val()*100);
    break;
  }
});

window.onload=function(){
	updateBalances();
};
