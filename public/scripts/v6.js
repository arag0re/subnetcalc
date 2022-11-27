'use strict'
/**
*  @param str is expected Type String
*/
function reverseStr(str) {
    return str.split("").reverse().join("")
}

function hex2bin(hex) {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

function ipv6ToBinStr(hex) {
    var result = []
    var returnArray = []
    hex.split(":").forEach(str => {
        result.push(hex2bin(str))
    });
    for (var n = 0; n < result.length; n++) {
        var splitted = reverseStr(result[n]).split("")
        if (splitted.length < 16) {
            let fullByte = []
            for (var i = 0; i < 16; i++) {
                if (splitted[i]) {
                    fullByte.push(splitted[i]);
                } else {
                    fullByte.push("0");
                }
            }
            returnArray.push(reverseStr(fullByte.join("")));
        } else {
            returnArray.push(reverseStr(splitted.join("")))
        }
    }
    return returnArray.join("")
}

class V6 {
    constructor (ipv6Input, netmaskInput) {
        this.ipv6Input = ipv6Input;
        this.ipv6BinStr = ipv6ToBinStr(ipv6Input);
        this.ipv6Address = this.binStrToIpv6(this.ipv6BinStr);
        this.netmaskInput = netmaskInput;
        this.netmask = this.netmaskToBinStr(this.netmaskInput);
        this.netmaskAddress = this.binStrToIpv6(this.netmask);
        this.network = this.logicalAnd(this.ipv6BinStr, this.netmask);
        this.networkAddress = this.binStrToIpv6(this.network);
        this.wildcard = this.invertBinStr(this.netmask);
        this.wildcardAddress = this.binStrToIpv6(this.wildcard);
        this.broadcast = this.getBroadcast(this.network, this.netmask);
        this.broadcastAddress = this.binStrToIpv6(this.broadcast);
        this.hostMin = this.getMinHost(this.network);
        this.hostMax = this.getMaxHost(this.broadcast);
        this.hostMinAddress = this.binStrToIpv6(this.hostMin);
        this.hostMaxAddress = this.binStrToIpv6(this.hostMax);
        this.hosts = this.getMaxHosts(parseInt(this.netmaskInput));
        this.class = this.detectClass(this.ipv6BinStr);

    }

    decToHex(decimal) {
        let hexStr = decimal.toString(16)
        let hexSplitted = reverseStr(hexStr).split("");
        if (hexSplitted.length < 4) {
            let full16Bit = []
            for (var i = 0; i < 4; i++) {
                if (hexSplitted[i]) {
                    full16Bit.push(hexSplitted[i]);
                } else {
                    full16Bit.push("0");
                }
            }
            hexStr = reverseStr(full16Bit.join(""));
        }
        return hexStr
    }

    netmaskToBinStr(netmask) {
        var netmaskArr = [];
        netmaskArr.length = 128;
        for (var i = 0; i < netmaskArr.length; i++) {
            if (i < netmask) {
                netmaskArr[i] = "1";
            } else {
                netmaskArr[i] = "0";
            }
        }
        return netmaskArr.join("")
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

    binStrToIpv6(binStr) {
        let binStrArr = binStr.match(/.{1,16}/g);
        let result = ""
        for (var i = 0; i < binStrArr.length; i++) {
            if (i < binStrArr.length - 1) {
                result = result + this.decToHex(this.binToDecimal(binStrArr[i])) + ":"
            } else {
                result = result + this.decToHex(this.binToDecimal(binStrArr[i]))
            }
        }
        return result.toUpperCase()
    }

    binToDecimal(binStr) {
        return parseInt(binStr, 2);
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
        return (2n ** (128n - BigInt(netmaskInput))) - 2n
    }

    /**
    * Adds a dot every byte to be easy on the eyes
    */
    addDots(binStr) {
        let binStrArr = [];
        binStrArr = binStr.match(/.{1,16}/g);
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
