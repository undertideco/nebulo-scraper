module.exports = {
  SINGAPORE_URL: `http://api.nea.gov.sg/api/WebAPI?dataset=pm2.5_update&keyref=${process.env.NEA_API_KEY}`,
  SINGAPORE_MANUAL_URL: "http://www.haze.gov.sg/haze-updates/pollutant-concentrations/type/PM25-1Hr#pollutant",
  SINGAPORE_BACKUP_URL: "http://dev.neaaws.com/psi.xml",
  MALAYSIA_URL: "http://apims.doe.gov.my/v2/hour%d_%s.html",
  HONGKONG_URL:"http://www.aqhi.gov.hk/epd/ddata/html/out/24pc_Eng.xml",
  THAILAND_URL: "http://www.aqmthai.com/index.php?lang=en",
  TAIWAN_URL: "http://opendata.epa.gov.tw/ws/Data/REWXQA/?$orderby=SiteName&$skip=0&format=json"
}
