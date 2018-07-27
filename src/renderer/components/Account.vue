<template>
  <div id="account">
    <h1>Account Settintg and Network Status</h1>
    <p>
      Settings and Networks
    </p>

    
  </div>
</template>

<script>
export default {

}
</script>

<style>
/*
*  Authorisation views
*
*/
#authorisation {
	display:none;
	margin:40px;

}

#signed-in {
	display:none;
	margin:40px;

}

#ethereum-api {
	margin:40px;


}

/**
*
* Dapps API connetivity status
*
*/

#connectivity {
	margin-top: 4em;
	text-align:left;
	display: none;

}

.D-apis {
	display:inline-block;
	width:90px;
	vertical-align:middle;
}

#science-api
 {
	display:block;
	padding-top:40px;
	text-align:left;
	vertical-align:middle;
}

#science-api header {
	font-size: 2em;
	font-weight: bold;

}

#storage-api
 {
	display:block;
	padding-top:40px;
	text-align:left;
	vertical-align:middle;
}

#storage-api header {
	font-size: 2em;
	font-weight: bold;

}

#dapp-api-status ul li {
	margin-top: 2em;
	list-style-type: none;
}

/**
*
* Governance API
*
*/
#ptopscience-governance {
	display:none;
	margin:40px;

}

#dhtkad-api,#governance-api {
	float: left;
	margin-left: 10px;
}

.ptopscience-gov {

	margin: 20px;

}

.ptopscience-gov header {

	font-weight: bold;

}
/**
*
* status color api
*
*/
#bitcoin-api-status, #Dsensor-api-status, #ethereum-api-status, #maidsafe-api-status, #bigchain-api-status, #ipfs-api-status, #dat-api-status, #truebit-api-status, #webassembly-api-status,  #buysycyle-api-status,  #swarm-api-status, #quotes-api-status,  #ether-api-status, #safecoin-api-status, #datacredits-api-status {
	display:block;
	vertical-align:middle;
	background: grey;
}
</style>
