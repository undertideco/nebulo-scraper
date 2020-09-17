const { AIRNOW_KEY } = process.env;

export const SINGAPORE_URL = 'https://api.data.gov.sg/v1/environment/psi';
export const SINGAPORE_MANUAL_URL =
  'http://www.haze.gov.sg/haze-updates/pollutant-concentrations/type/PM25-1Hr#pollutant';
export const SINGAPORE_BACKUP_URL = 'http://dev.neaaws.com/psi.xml';
export const MALAYSIA_URL =
  'http://apims.doe.gov.my/data/public/CAQM/last24hours.json';
export const HONGKONG_URL =
  'http://www.aqhi.gov.hk/epd/ddata/html/out/24pc_Eng.xml';
export const MACAU_URL = 'http://www.smg.gov.mo/smg/airQuality/ho_api.xml';
export const THAILAND_URL = 'http://www.aqmthai.com/index.php?lang=en';
export const TAIWAN_URL = 'http://opendata2.epa.gov.tw/AQI.json';
export const USA_URL = `https://www.airnowapi.org/aq/data/?parameters=PM25&BBOX=-124.205070,28.716781,-75.337882,45.419415&dataType=A&format=application%2Fjson&verbose=0&API_KEY=${AIRNOW_KEY}`;
export const NETHERLANDS_URL =
  'https://api.luchtmeetnet.nl/map/list_stations?component=PM25';
export const CHINA_URL = 'http://www.cnemc.cn/getIndexData.do';
