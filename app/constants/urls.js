module.exports = {
  SINGAPORE_URL: `http://api.nea.gov.sg/api/WebAPI?dataset=pm2.5_update&keyref=${process.env.NEA_API_KEY}`,
  SINGAPORE_MANUAL_URL: "http://www.haze.gov.sg/haze-updates/pollutant-concentrations/type/PM25-1Hr#pollutant",
  SINGAPORE_BACKUP_URL: "http://dev.neaaws.com/psi.xml",
  MALAYSIA_URL: "http://apims.doe.gov.my/data/public/CAQM/last24hours.json",
  HONGKONG_URL:"http://www.aqhi.gov.hk/epd/ddata/html/out/24pc_Eng.xml",
  THAILAND_URL: "http://www.aqmthai.com/index.php?lang=en",
  TAIWAN_URL: "http://opendata2.epa.gov.tw/AQI.json",
  USA_URL: `https://www.airnowapi.org/aq/data/?parameters=PM25&BBOX=-124.205070,28.716781,-75.337882,45.419415&dataType=A&format=application%2Fjson&verbose=0&API_KEY=${process.env.AIRNOW_KEY}`
}
