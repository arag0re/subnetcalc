'use strict'

let hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
*  @param str is expected Type String
*/
function reverseString(str) {
    return str.split("").reverse().join("")
}

/** 
*  @param decimal is expected Type Integer and should be higher then 255
*/
function decTo8BitStr(decimal) {
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

function decTo16BitStr(decimal) {
    let binStr = decimal.toString(2);
    binStr = reverseString(binStr);
    let splittedStr = binStr.split("");
    if (splittedStr.length < 16) {
        let fullByte = []
        for (var i = 0; i < 16; i++) {
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
    constructor (ipv6Input, nicIDInput) {
        this.ipv6Input = ipv6Input;
        this.netmaskInput = nicIDInput;

        //this.ipv6 = this.ipv6Address = this.convertIpv4BinStrToIpv4(this.ipv4);
        /*this.netmask = this.convertNetmaskToBinStr(this.netmaskInput);
        this.netMaskAdress = this.convertIpv4BinStrToIpv4(this.netmask);
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
        this.class = this.detectClass(this.ipv4);*/

    }

    print() {
        console.log(this.ipv6ToBinStr("2001:0DB8:AC10:FE01"));
        console.log(this.decToHex(123))
        console.log(this.binStrToIpv6(this.ipv6ToBinStr("2001:0DB8:AC10:FE01")));
    }

    hexToDec(hexStr) {
        let reversedHexStrArr = reverseString(hexStr).split("")
        let result = 0;
        for (var i = 0; i < reversedHexStrArr.length; i++) {
            result = result + this.getIndexOfHexchar(reversedHexStrArr[i]) * Math.pow(16, i);
        }
        return result;
    }

    decToHex(decimal) {
        let hexStr = decimal.toString(16)
        let hexSplitted = reverseString(hexStr).split("");
        if (hexSplitted.length < 4) {
            let full16Bit = []
            for (var i = 0; i < 4; i++) {
                if (hexSplitted[i]) {
                    full16Bit.push(hexSplitted[i]);
                } else {
                    full16Bit.push("0");
                }
            }
            hexStr = reverseString(full16Bit.join(""));
        }
        return hexStr
    }

    hexToBinStr(hexStr) {
        return decTo16BitStr(this.hexToDec(hexStr));
    }

    ipv6ToBinStr(ipv6) {
        let ipv6Parts = ipv6.split(":")
        let result = ""
        for (var i = 0; i < ipv6Parts.length; i++) {
            result = result + this.hexToBinStr(ipv6Parts[i])
        }
        return result
    }

    ipv4StrToBinStr(ipv4Str) {
        var ipv4Parts = ipv4Str.split(".");
        let ipv4PartsAsBinStr = [];
        ipv4Parts.forEach(function (item, index) {
            ipv4PartsAsBinStr.push(int32BitToByteStr(parseInt(item)));

        });
        return ipv4PartsAsBinStr.join("")
    }

    netmaskToBinStr(netmask) {
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

    getIndexOfHexchar(hexChar) {
        let index = 0;
        for (var i = 0; i < hexChars.length; i++) {
            if (hexChars[i] == hexChar) {
                index = i;
            }
        }
        return index;
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
            //console.log(this.decToHex(this.convertBinToDecimal(binStrArr[i])))
            if (i < binStrArr.length - 1) {
                console.log(this.binToDecimal(binStrArr[i]))
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

    hexToDec(hexStr) {
        return parseInt(hexStr, 16);
    }

    /**
    * converts Byte String to IPv4 String
    */
    ipv4BinStrToIpv4(binStr) {
        let binStrArr = [];
        let ipv4Parts = []
        binStrArr = binStr.match(/.{1,8}/g);
        binStr = ""
        for (var i = 0; i < binStrArr.length; i++) {
            ipv4Parts.push(this.binToDecimal(binStrArr[i]));
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

readline.question('<IPv6>/<Netmask>', address => {
    const addressParts = address.split("/");
    let ipv6 = addressParts[0];
    let netmask = addressParts[1];
    const calc = new SubnetCalc(ipv6, netmask);
    calc.print()
    //console.log(`Here your Data ${JSON.stringify(calc)}!`);
    readline.close();
});
