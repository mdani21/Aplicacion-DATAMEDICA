// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
pragma experimental ABIEncoderV2;

contract Health_registry {

    event thereisanewhistory(string _userid);

    struct Health {
        string userid;
        string[] history;
    }

    mapping(string => Health) internal hh;

    function newHH(string memory _userid) public {
        string[] memory s;
        Health memory user_aux = Health(_userid, s);
        hh[_userid] = user_aux;
        emit thereisanewhistory(_userid);
    }

    function addnewevent(string memory _userid, string memory _evento, string memory _urloffile) public returns (bool OK) {
        bytes memory tempEmptyStringTest = bytes(hh[_userid].userid);
        if (tempEmptyStringTest.length != 0) {
            hh[_userid].history.push(string(abi.encodePacked(_evento, _urloffile)));
            //hh[_userid].history.push(_urloffile);
            return true;
        } else return false;
    }

    function getEvents(string memory _userid, uint numofchunk) view public returns (string[10] memory _history) {
        for (uint i = 0; i < 10; i++) {
            _history[i] = "";
        }
    
        if (hh[_userid].history.length > 0) {
            for (uint i = 0; i < 10; i++) {
                if (((numofchunk - 1) * 10) + i < hh[_userid].history.length)
                    _history[i] = hh[_userid].history[((numofchunk - 1) * 10) + i];
                else
                    _history[i] = "";
            }
            return _history;
        } else {
            return _history;
        }
    }
}


