var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 5000;

app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

let axios = require("axios");
let HTMLParser = require("node-html-parser");

app.get("/data", async (req, res, next) => {
  const data = await getData();
  res.json({
    message: "success",
    data,
  });
});

async function getData() {
  // let j = 0;
  const data = [];
  let page = 1;
  while (1) {
    let config = {
      method: "get",
      url: "https://id.ego-play.com/history-matches/ranking?page=" + page,
      withCredentials: true,
      headers: {
        Cookie:
          "user_hash=BcHdGkIwAADQB3LRCFsXXWCzfkgssu7IJ1YtpeXn6Tun_cFvYiMKjp_xNYQd1Ew1t88qDSIFrxuPTrIgXEKCsY8Dn6w8137k5-HNTBaWO67svdYIZViqrIu5EyeDZj_dTPwmOaKhtmK3UoR7aUr7mWEk-8u43RGju2EmRV4u6KICsmiyJhcTiOMshQcxlWY_7rWPuIias4JVkCPHOC3h1nH0qL2HAfmGreS-DiY3TyJgofUf;c4session=n0k00c158nkbp5nuobnt7uom47o5kefs;",
      },
    };

    let res = await axios(config);
    let htmlDoc = HTMLParser.parse(res.data);
    let table = htmlDoc.querySelectorAll(".lastmatch-table")[0];
    if (page === 2) {
      break;
    }
    let list = table.querySelectorAll("tr");
    for (let i = 1; i < list.length; i++) {
      let tr = list[i].querySelectorAll("td")[1]?.textContent;
      // .firstChild.querySelectorAll("a")[0]
      // .firstChild.toString();

      if (tr === undefined) {
        let tr2 = list[i]
          .querySelectorAll("td")[0]
          .querySelectorAll("ul")[0]
          .querySelectorAll("ul")[0]
          .querySelectorAll("li");

        let obj = {};
        obj.name = tr2[8].textContent.trim();
        obj.team = tr2[9].textContent.trim();
        obj.army = tr2[10].textContent.trim();
        obj.halberd = tr2[11].textContent.trim();
        obj.kill = tr2[12].textContent.trim();
        obj.technology = tr2[13].textContent.trim();
        obj.result = tr2[14].textContent.trim();
        obj.rank = tr2[15]?.textContent.trim();

        data.push(obj);
      }
    }
    page += 1;
    // break;
  }
  console.log(data);
  return data;
}

// getData();
