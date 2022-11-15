const joi=require('joi')
const city_schema=joi.string().required().error(new Error('城市信息有误'))
module.exports.cityschema={
    city:city_schema
}