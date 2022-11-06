'use strict'
/**
*  @param str is expected Type String
*/
function reverseString(str) {
    return str.split("").reverse().join("")
}

/** 
*  @param decimal is expected Type Integer and should be higher then 255
*/
function int32BitToByteStr(decimal) {
    var rest = 0;
    var binStr = "";
    binStr = decimal.toString(2);
    binStr = reverseString(binStr);
    let splittedStr = binStr.split("");
    if (splittedStr.length < 8) {
        let fullByte = []
        for (var i = 0; i < 8; i++) {
            if (splittedStr[i]) {
                fullByte.push(splittedStr[i]);
            } else {
                fullByte.push("0");
            }
        }
        binStr = ""
        binStr = reverseString(fullByte.join(""));
    }
    return binStr
}

class SubnetCalc {
    constructor (ipv4Input, netmaskInput) {
        this.ipv4Input = ipv4Input;
        this.netmaskInput = netmaskInput;
        this.ipv4 = this.convertIpv4StrToBinStr(this.ipv4Input);
        this.ipv4Address = this.convertIpv4BinStrToIpv4(this.ipv4);
        this.netmask = this.convertNetmaskToBinStr(this.netmaskInput);
        this.netmaskAddress = this.convertIpv4BinStrToIpv4(this.netmask);
        this.wildcard = this.invertBinStr(this.netmask);
        this.wildcardAddress = this.convertIpv4BinStrToIpv4(this.wildcard);
        this.network = this.logicalAnd(this.ipv4, this.netmask);
        this.networkAddress = this.convertIpv4BinStrToIpv4(this.network);
        this.broadcast = this.getBroadcast(this.network, this.netmask);
        this.broadcastAddress = this.convertIpv4BinStrToIpv4(this.broadcast);
        this.hostMin = this.getMinHost(this.network);
        this.hostMinAddress = this.convertIpv4BinStrToIpv4(this.hostMin);
        this.hostMax = this.getMaxHost(this.broadcast);
        this.hostMaxAddress = this.convertIpv4BinStrToIpv4(this.hostMax);
        this.hosts = this.getMaxHosts(this.netmaskInput);
        this.class = this.detectClass(this.ipv4);

    }

    convertNetmaskToBinStr(netmask) {
        var netmaskArr = [];
        netmaskArr.length = 32;
        for (var i = 0; i < netmaskArr.length; i++) {
            if (i < netmask) {
                netmaskArr[i] = "1";
            } else {
                netmaskArr[i] = "0";
            }
        }
        return netmaskArr.join("")
    }


    convertIpv4StrToBinStr(ipv4Str) {
        var ipv4Parts = ipv4Str.split(".");
        let ipv4PartsAsBinStr = [];

        ipv4Parts.forEach(function (item, index) {
            ipv4PartsAsBinStr.push(int32BitToByteStr(parseInt(item)));
            //console.log(item, index);
        });

        return ipv4PartsAsBinStr.join("")
    }

    /**
    *  @param bits is expected Type String
    *  @param moreBits expected Type String
    */
    logicalAnd(bits, moreBits) {
        let bitArrA = bits.split("")
        let bitArrB = moreBits.split("")
        var result = []
        if (bitArrA.length == bitArrB.length) {
            for (var i = 0; i < bitArrA.length; i++) {
                if (bitArrA[i] == bitArrB[i]) {
                    result.push(bitArrA[i]);
                } else {
                    result.push("0");
                }
            }
        }
        return result.join("")
    }

    /**
    *  inverts every single Bit
    */
    invertBinStr(binStr) {
        let binStrArr = binStr.split("")
        let inverted = []
        binStrArr.forEach(function (item, index) {
            if (item === "1") {
                inverted.push("0")
            } else {
                inverted.push("1")
            }
        })
        return inverted.join("")
    }

    /**
    * detects IP-Class
    */
    detectClass(binStr) {
        let binStrArr = binStr.split("")
        for (var i = 0; i < binStrArr.length; i++) {
            if (binStrArr[i] === "0") {
                switch (i) {
                    case 0:
                        return "A"
                    case 1:
                        return "B"
                    case 2:
                        return "C"
                    case 3:
                        return "D"
                    case 4:
                        return "E"
                }
                break;
            }
        }
    }

    convertBinToDecimal(binStr) {
        return parseInt(binStr, 2);
    }

    /**
    * converts Byte String to IPv4 String
    */
    convertIpv4BinStrToIpv4(binStr) {
        let binStrArr = [];
        let ipv4Parts = []
        binStrArr = binStr.match(/.{1,8}/g);
        binStr = ""
        for (var i = 0; i < binStrArr.length; i++) {
            ipv4Parts.push(this.convertBinToDecimal(binStrArr[i]));
        }
        ipv4Parts.forEach(function (item, index) {
            if (index < ipv4Parts.length - 1) {
                binStr = binStr + item + "."
            } else {
                binStr = binStr + item
            }
        })
        return binStr
    }

    /**
    * calculates the Broadcast IP-Address for current network
    */
    getBroadcast(netAddr, netmask) {
        let netmaskArr = netmask.split("")
        let netAddrArr = netAddr.split("")
        let broadcast = []
        netmaskArr.forEach(function (item, index) {
            if (item === "0") {
                broadcast.push("1")
            } else {
                broadcast.push(netAddrArr[index])
            }
        })
        return broadcast.join("")
    }

    getMinHost(netAddr) {
        return netAddr.slice(0, -1) + '1'
    }

    getMaxHost(broadcast) {
        return broadcast.slice(0, -1) + '0'
    }

    getMaxHosts(netmaskInput) {
        return Math.pow(2, (32 - netmaskInput)) - 2
    }

    /**
    * Adds a dot every byte to be easy on the eyes
    */
    addDots(binStr) {
        let binStrArr = [];
        binStrArr = binStr.match(/.{1,8}/g);
        binStr = ""
        binStrArr.forEach(function (item, index) {
            if (index < binStrArr.length - 1) {
                binStr = binStr + item + "."
            } else {
                binStr = binStr + item
            }
        })
        return binStr
    }

    removeDots(binStrWithDots) {
        let binStrArr = binStrWithDots.split(".")
        return binStrArr.join("")
    }
}