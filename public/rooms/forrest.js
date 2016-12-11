var forrest = {};

forrest.init = function() {

  var room = {
    trees: trees,
    width: 1920,
    height: 1920
  };

  for (var i = 0; i < room.trees.length; i++) {
    var tree = room.trees[i];

    obj_pinetree.create({
      x: tree.x,
      y: tree.y,
      sections: tree.sections,
    });
  }


}


var trees = [
  {
    "id": 0,
    "angle": 308,
    "x": 120,
    "y": 133,
    "sections": 4
  },
  {
    "id": 1,
    "angle": 192,
    "x": 136,
    "y": 205,
    "sections": 5
  },
  {
    "id": 2,
    "angle": 193,
    "x": 109,
    "y": 410,
    "sections": 8
  },
  {
    "id": 3,
    "angle": 322,
    "x": 123,
    "y": 654,
    "sections": 8
  },
  {
    "id": 4,
    "angle": 283,
    "x": 28,
    "y": 744,
    "sections": 6
  },
  {
    "id": 5,
    "angle": 77,
    "x": 101,
    "y": 858,
    "sections": 7
  },
  {
    "id": 6,
    "angle": 71,
    "x": 221,
    "y": 1048,
    "sections": 8
  },
  {
    "id": 7,
    "angle": 145,
    "x": 25,
    "y": 1193,
    "sections": 3
  },
  {
    "id": 8,
    "angle": 116,
    "x": 41,
    "y": 1434,
    "sections": 7
  },
  {
    "id": 9,
    "angle": 34,
    "x": 100,
    "y": 1457,
    "sections": 7
  },
  {
    "id": 10,
    "angle": 323,
    "x": 109,
    "y": 1616,
    "sections": 5
  },
  {
    "id": 11,
    "angle": 114,
    "x": 146,
    "y": 1813,
    "sections": 4
  },
  {
    "id": 12,
    "angle": 291,
    "x": 165,
    "y": 23,
    "sections": 7
  },
  {
    "id": 13,
    "angle": 182,
    "x": 282,
    "y": 263,
    "sections": 7
  },
  {
    "id": 14,
    "angle": 146,
    "x": 375,
    "y": 448,
    "sections": 3
  },
  {
    "id": 15,
    "angle": 226,
    "x": 260,
    "y": 517,
    "sections": 8
  },
  {
    "id": 16,
    "angle": 272,
    "x": 260,
    "y": 622,
    "sections": 4
  },
  {
    "id": 17,
    "angle": 283,
    "x": 247,
    "y": 947,
    "sections": 8
  },
  {
    "id": 18,
    "angle": 147,
    "x": 343,
    "y": 1045,
    "sections": 5
  },
  {
    "id": 19,
    "angle": 20,
    "x": 202,
    "y": 1219,
    "sections": 6
  },
  {
    "id": 20,
    "angle": 117,
    "x": 198,
    "y": 1293,
    "sections": 3
  },
  {
    "id": 21,
    "angle": 233,
    "x": 372,
    "y": 1459,
    "sections": 8
  },
  {
    "id": 22,
    "angle": 82,
    "x": 241,
    "y": 1700,
    "sections": 4
  },
  {
    "id": 23,
    "angle": 151,
    "x": 268,
    "y": 1758,
    "sections": 6
  },
  {
    "id": 24,
    "angle": 206,
    "x": 418,
    "y": 34,
    "sections": 7
  },
  {
    "id": 25,
    "angle": 59,
    "x": 322,
    "y": 268,
    "sections": 7
  },
  {
    "id": 26,
    "angle": 317,
    "x": 383,
    "y": 393,
    "sections": 5
  },
  {
    "id": 27,
    "angle": 69,
    "x": 477,
    "y": 640,
    "sections": 5
  },
  {
    "id": 28,
    "angle": 305,
    "x": 520,
    "y": 734,
    "sections": 6
  },
  {
    "id": 29,
    "angle": 70,
    "x": 411,
    "y": 871,
    "sections": 8
  },
  {
    "id": 30,
    "angle": 22,
    "x": 530,
    "y": 913,
    "sections": 4
  },
  {
    "id": 31,
    "angle": 317,
    "x": 327,
    "y": 1073,
    "sections": 8
  },
  {
    "id": 32,
    "angle": 322,
    "x": 403,
    "y": 1279,
    "sections": 8
  },
  {
    "id": 33,
    "angle": 31,
    "x": 446,
    "y": 1553,
    "sections": 5
  },
  {
    "id": 34,
    "angle": 156,
    "x": 399,
    "y": 1537,
    "sections": 7
  },
  {
    "id": 35,
    "angle": 20,
    "x": 526,
    "y": 1884,
    "sections": 3
  },
  {
    "id": 36,
    "angle": 72,
    "x": 579,
    "y": 43,
    "sections": 7
  },
  {
    "id": 37,
    "angle": 73,
    "x": 512,
    "y": 372,
    "sections": 5
  },
  {
    "id": 38,
    "angle": 341,
    "x": 468,
    "y": 381,
    "sections": 3
  },
  {
    "id": 39,
    "angle": 330,
    "x": 555,
    "y": 576,
    "sections": 3
  },
  {
    "id": 40,
    "angle": 120,
    "x": 586,
    "y": 819,
    "sections": 5
  },
  {
    "id": 41,
    "angle": 199,
    "x": 581,
    "y": 801,
    "sections": 6
  },
  {
    "id": 42,
    "angle": 94,
    "x": 546,
    "y": 1004,
    "sections": 6
  },
  {
    "id": 43,
    "angle": 91,
    "x": 608,
    "y": 1108,
    "sections": 6
  },
  {
    "id": 44,
    "angle": 273,
    "x": 600,
    "y": 1434,
    "sections": 5
  },
  {
    "id": 45,
    "angle": 307,
    "x": 660,
    "y": 1526,
    "sections": 8
  },
  {
    "id": 46,
    "angle": 161,
    "x": 569,
    "y": 1629,
    "sections": 6
  },
  {
    "id": 47,
    "angle": 125,
    "x": 555,
    "y": 1720,
    "sections": 4
  },
  {
    "id": 48,
    "angle": 110,
    "x": 831,
    "y": 222,
    "sections": 3
  },
  {
    "id": 49,
    "angle": 153,
    "x": 837,
    "y": 243,
    "sections": 7
  },
  {
    "id": 50,
    "angle": 84,
    "x": 746,
    "y": 425,
    "sections": 5
  },
  {
    "id": 51,
    "angle": 156,
    "x": 663,
    "y": 576,
    "sections": 4
  },
  {
    "id": 52,
    "angle": 307,
    "x": 663,
    "y": 721,
    "sections": 3
  },
  {
    "id": 53,
    "angle": 45,
    "x": 686,
    "y": 989,
    "sections": 7
  },
  {
    "id": 54,
    "angle": 24,
    "x": 641,
    "y": 987,
    "sections": 5
  },
  {
    "id": 55,
    "angle": 193,
    "x": 611,
    "y": 1131,
    "sections": 6
  },
  {
    "id": 56,
    "angle": 348,
    "x": 644,
    "y": 1412,
    "sections": 6
  },
  {
    "id": 57,
    "angle": 82,
    "x": 737,
    "y": 1443,
    "sections": 3
  },
  {
    "id": 58,
    "angle": 43,
    "x": 791,
    "y": 1565,
    "sections": 8
  },
  {
    "id": 59,
    "angle": 206,
    "x": 728,
    "y": 1734,
    "sections": 6
  },
  {
    "id": 60,
    "angle": 141,
    "x": 1297,
    "y": 229,
    "sections": 7
  },
  {
    "id": 61,
    "angle": 203,
    "x": 1238,
    "y": 348,
    "sections": 5
  },
  {
    "id": 62,
    "angle": 221,
    "x": 1287,
    "y": 410,
    "sections": 3
  },
  {
    "id": 63,
    "angle": 21,
    "x": 1300,
    "y": 555,
    "sections": 3
  },
  {
    "id": 64,
    "angle": 69,
    "x": 1361,
    "y": 823,
    "sections": 4
  },
  {
    "id": 65,
    "angle": 350,
    "x": 1231,
    "y": 796,
    "sections": 6
  },
  {
    "id": 66,
    "angle": 99,
    "x": 1264,
    "y": 936,
    "sections": 4
  },
  {
    "id": 67,
    "angle": 4,
    "x": 1303,
    "y": 1203,
    "sections": 3
  },
  {
    "id": 68,
    "angle": 121,
    "x": 1257,
    "y": 1407,
    "sections": 4
  },
  {
    "id": 69,
    "angle": 111,
    "x": 1249,
    "y": 1451,
    "sections": 8
  },
  {
    "id": 70,
    "angle": 55,
    "x": 1342,
    "y": 1631,
    "sections": 6
  },
  {
    "id": 71,
    "angle": 315,
    "x": 1374,
    "y": 1748,
    "sections": 5
  },
  {
    "id": 72,
    "angle": 264,
    "x": 1412,
    "y": 198,
    "sections": 7
  },
  {
    "id": 73,
    "angle": 115,
    "x": 1368,
    "y": 293,
    "sections": 6
  },
  {
    "id": 74,
    "angle": 9,
    "x": 1443,
    "y": 374,
    "sections": 6
  },
  {
    "id": 75,
    "angle": 217,
    "x": 1425,
    "y": 546,
    "sections": 4
  },
  {
    "id": 76,
    "angle": 51,
    "x": 1406,
    "y": 748,
    "sections": 8
  },
  {
    "id": 77,
    "angle": 4,
    "x": 1429,
    "y": 789,
    "sections": 7
  },
  {
    "id": 78,
    "angle": 37,
    "x": 1457,
    "y": 1011,
    "sections": 8
  },
  {
    "id": 79,
    "angle": 26,
    "x": 1497,
    "y": 1179,
    "sections": 8
  },
  {
    "id": 80,
    "angle": 332,
    "x": 1530,
    "y": 1344,
    "sections": 7
  },
  {
    "id": 81,
    "angle": 22,
    "x": 1362,
    "y": 1541,
    "sections": 6
  },
  {
    "id": 82,
    "angle": 154,
    "x": 1434,
    "y": 1574,
    "sections": 7
  },
  {
    "id": 83,
    "angle": 285,
    "x": 1479,
    "y": 1747,
    "sections": 7
  },
  {
    "id": 84,
    "angle": 189,
    "x": 1649,
    "y": 218,
    "sections": 8
  },
  {
    "id": 85,
    "angle": 291,
    "x": 1599,
    "y": 207,
    "sections": 4
  },
  {
    "id": 86,
    "angle": 349,
    "x": 1635,
    "y": 391,
    "sections": 8
  },
  {
    "id": 87,
    "angle": 63,
    "x": 1529,
    "y": 573,
    "sections": 4
  },
  {
    "id": 88,
    "angle": 29,
    "x": 1588,
    "y": 701,
    "sections": 7
  },
  {
    "id": 89,
    "angle": 357,
    "x": 1451,
    "y": 854,
    "sections": 4
  },
  {
    "id": 90,
    "angle": 133,
    "x": 1477,
    "y": 918,
    "sections": 8
  },
  {
    "id": 91,
    "angle": 134,
    "x": 1629,
    "y": 1219,
    "sections": 8
  },
  {
    "id": 92,
    "angle": 27,
    "x": 1516,
    "y": 1287,
    "sections": 4
  },
  {
    "id": 93,
    "angle": 350,
    "x": 1560,
    "y": 1506,
    "sections": 4
  },
  {
    "id": 94,
    "angle": 28,
    "x": 1682,
    "y": 1605,
    "sections": 3
  },
  {
    "id": 95,
    "angle": 18,
    "x": 1638,
    "y": 1726,
    "sections": 7
  },
  {
    "id": 96,
    "angle": 332,
    "x": 1742,
    "y": 232,
    "sections": 8
  },
  {
    "id": 97,
    "angle": 295,
    "x": 1755,
    "y": 245,
    "sections": 5
  },
  {
    "id": 98,
    "angle": 58,
    "x": 1664,
    "y": 384,
    "sections": 3
  },
  {
    "id": 99,
    "angle": 340,
    "x": 1756,
    "y": 497,
    "sections": 6
  },
  {
    "id": 100,
    "angle": 27,
    "x": 1722,
    "y": 668,
    "sections": 7
  },
  {
    "id": 101,
    "angle": 257,
    "x": 1679,
    "y": 965,
    "sections": 8
  },
  {
    "id": 102,
    "angle": 277,
    "x": 1632,
    "y": 1074,
    "sections": 4
  },
  {
    "id": 103,
    "angle": 41,
    "x": 1701,
    "y": 1056,
    "sections": 5
  },
  {
    "id": 104,
    "angle": 165,
    "x": 1762,
    "y": 1348,
    "sections": 6
  },
  {
    "id": 105,
    "angle": 177,
    "x": 1764,
    "y": 1387,
    "sections": 8
  },
  {
    "id": 106,
    "angle": 282,
    "x": 1696,
    "y": 1631,
    "sections": 6
  },
  {
    "id": 107,
    "angle": 162,
    "x": 1828,
    "y": 1756,
    "sections": 6
  },
  {
    "id": 108,
    "angle": 250,
    "x": 1968,
    "y": 28,
    "sections": 6
  },
  {
    "id": 109,
    "angle": 295,
    "x": 1918,
    "y": 153,
    "sections": 6
  },
  {
    "id": 110,
    "angle": 262,
    "x": 1836,
    "y": 346,
    "sections": 5
  },
  {
    "id": 111,
    "angle": 335,
    "x": 1916,
    "y": 592,
    "sections": 6
  },
  {
    "id": 112,
    "angle": 255,
    "x": 1830,
    "y": 669,
    "sections": 8
  },
  {
    "id": 113,
    "angle": 315,
    "x": 1846,
    "y": 849,
    "sections": 4
  },
  {
    "id": 114,
    "angle": 22,
    "x": 1877,
    "y": 1109,
    "sections": 5
  },
  {
    "id": 115,
    "angle": 113,
    "x": 1922,
    "y": 1249,
    "sections": 4
  },
  {
    "id": 116,
    "angle": 271,
    "x": 1813,
    "y": 1335,
    "sections": 5
  },
  {
    "id": 117,
    "angle": 22,
    "x": 1816,
    "y": 1483,
    "sections": 4
  },
  {
    "id": 118,
    "angle": 287,
    "x": 1854,
    "y": 1550,
    "sections": 3
  },
  {
    "id": 119,
    "angle": 60,
    "x": 1929,
    "y": 1683,
    "sections": 7
  }
]