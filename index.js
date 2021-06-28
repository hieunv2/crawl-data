var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 5000;

app.timeout = 0;

app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

let axios = require("axios");
let HTMLParser = require("node-html-parser");

app.get("/data", async (req, res, next) => {
  const use_hash =
    req.query.a ||
    "BcFBG0IwAADQH-RgpRqHDixMNTUhdaNl1L4mZPj1vWfk8fUrDvKXL3YSMxSdJGG2x032g2IKo_Wb1nSsUtGspkepFIq1GZEmOzPgiXXQOW09UcA1nJXGM3xz4-Me9lAIdCuPYbikyWB102C4CWqBbBsIos8sYY0fJB6VyfgNNxbshh5dySiBZ-uDRlaLc4p2XpH5F73P70FSKJa4G3fpKFlU1Kodpt9fT5_3fiQxT_vc3P4B";
  const c4session = req.query.b || "dq3ru5lonkslnfjh643spi68kd1be2ni";

  const data = await getData(use_hash, c4session);
  res.json({
    message: "success",
    data,
  });
});

async function getData(use_hash, c4session) {
  // let j = 0;
  const data = [];
  let page = 1;
  try {
    while (1) {
      let config = {
        method: "get",
        url: "https://id.ego-play.com/history-matches/ranking?page=" + page,
        withCredentials: true,
        headers: {
          Cookie: `user_hash=${use_hash};c4session=${c4session}`,
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
  } catch (e) {
    console.log("error", e);
  }
  console.log(data);
  return data;
}

// getData();
