const db = require("../db")
const joi = require("joi")
const config = require('../config.js')
const maponeinfo_hander = (req, res) => {
    res.send('请求成功')
}
const getcurconfime_hander = (req, res) => {
    const mysql = "SELECT area,curConfirm FROM epidemicone"
    db.query(mysql, (err, result) => {
        if (err) {
            return res.send({
                state: 0,
                message: err.message
            })
        }
        if (result.length === 0) {
            return res.send({
                state: 0,
                message: '抱歉暂没资源'
            })
        }
        res.send({
            state: 1,
            message: result
        })
    })
}
const getTime_hander = (req, res) => {
    const mysql = 'SELECT time FROM epidemicone'
    db.query(mysql, (err, result) => {
        if (err) {
            return res.send({
                state: 0,
                message: '有误'
            })
        }
        if (result.length === 0) {
            return res.send({
                state: 0,
                message: '暂时没有数据'
            })
        }
        res.send({
            state: 1,
            message: result[0].time
        })
    })
}
const getcityinfo_hander = (req, res) => {
    const getcityschema = joi.object(config.cityschema)
    const getcityschema_handers = getcityschema.validate({ city: req.query.city })
    if (getcityschema_handers.error) {
        return res.send({
            state: 0,
            message: getcityschema_handers.error.message
        })
    }
    const mysql = 'SELECT tworelative FROM epidemicone WHERE epidemicone.area=?'
    db.query(mysql, req.query.city, (err, result) => {
        if (err) {
            return res.send({
                state: 0,
                message: err.message
            })
        }
        if (result.length === 0) {
            return res.send({
                state: 0,
                message: "暂时没有数据"
            })
        }
        const mysql = 'SELECT * FROM epidemictwo WHERE epidemictwo.tworelative=?'
        db.query(mysql, result[0].tworelative, (err, result) => {
            if (err) {
                return res.send({
                    state: 0,
                    message: err.message
                })
            }
            if (result.length === 0) {
                return res.send({
                    state: 0,
                    message: '暂时没有数据'
                })
            }
            res.send({
                state: 1,
                message: result
            })
        })
    })
}
const getareainfo_hander = (req, res) => {
    const areaschema = joi.object(config.cityschema)
    const areaschema_hander = areaschema.validate({ city: req.query.area })
    if (areaschema_hander.error) {
        return res.send({
            state: 0,
            message: areaschema_hander.error.message
        })
    }
    const mysql = 'SELECT * FROM epidemicone WHERE epidemicone.area=?'
    db.query(mysql, req.query.area, (err, result) => {
        if (err) {
            return res.send({
                state: 0,
                message: err.message
            })
        }
        if (result.length === 0) {
            return res.send({
                state: 0,
                message: '暂时没有数据'
            })
        }
        res.send({
            state: 1,
            message: result
        })
    })
}
const getdangerinfo_hander = (req, res) => {
    const dangerinfo = joi.object(config.cityschema)
    const dangerinfo_hander = dangerinfo.validate({ city: req.query.area })
    if (dangerinfo_hander.error) {
        return res.send({
            state: 0,
            message: dangerinfo_hander.error.message
        })
    }
    const mysql = 'SELECT tworelative FROM epidemicone WHERE epidemicone.area=?'
    db.query(mysql, req.query.area, async(err, result) => {
        if (err) {
            return res.send({
                state: 0,
                message: err.message
            })
        }
        if (result.length === 0) {
            return res.send({
                state: 0,
                message: '请求的资源暂时没有'
            })
        }
        const mysql = 'SELECT city,threerelative FROM epidemictwo WHERE epidemictwo.tworelative=?'
        db.query(mysql, result[0].tworelative, async(err, result) => {
            if (err) {
                return res.send({
                    state: 0,
                    message: err.message
                })
            }
            if (result.length === 0) {
                return res.send({
                    state: 0,
                    message: '暂时没有数据'
                })
            }
            let data = []
            result.forEach(element => {
                data.push({ city: element.city, danger: [], modeldanger: [] })
            });
            
           for(let i=0;i<result.length;i++){
                const mysql='SELECT area,level FROM epidemicthree WHERE epidemicthree.threerelative=? AND epidemicthree.isNew=1'
               await new Promise((resolve)=>{
                db.query(mysql,result[i].threerelative,(err,result)=>{
                    if(err){
                        return
                    }
                    if(result.length===0){
                        resolve()
                    }
                    else{
                        result.forEach((value)=>{
                            if(value.level==='高风险'){
                                data[i].danger.push(value)
                            }
                            if(value.level==='低风险'){
                                data[i].modeldanger.push(value)
                            }
                        })
                        resolve()
                    }
                })
               })
           }          
           res.send(data)
        })
    })
}
module.exports = {
    maponeinfo_hander,
    getcurconfime_hander,
    getTime_hander,
    getcityinfo_hander,
    getareainfo_hander,
    getdangerinfo_hander
}