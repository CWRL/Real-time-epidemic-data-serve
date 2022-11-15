const axios=require('axios')
const db=require('./db/index')
const getAllInfo=async (req,res,next)=>{
    let m=await axios({
        methods:'GET',
        url:'https://voice.baidu.com/api/newpneumonia?from=page&callback=jsonp_1668154140712_83236'
    })
    // req.data=JSON.parse(m.data.split('jsonp_1668154140712_83236(')[1].split('})')[0]+'}').data.caseList
    let allInfo=JSON.parse(m.data.split('jsonp_1668154140712_83236(')[1].split('})')[0]+'}').data.caseList
    let curtime=JSON.parse(m.data.split('jsonp_1668154140712_83236(')[1].split('})')[0]+'}').data.upateTime
    for(let i=0;i<allInfo.length;i++){
        let mysql='SELECT * FROM epidemicone WHERE epidemicone.area=?'
        db.query(mysql,allInfo[i].area,(err,result)=>{
            if(err){
                return
            }
            if(result.length===0){
                let mysql='INSERT INTO epidemicone SET ?'
                const data={
                    area:allInfo[i].area,
                    confirmed:allInfo[i].confirmed-0,
                    died:allInfo[i].died-0,
                    confirmedRelative:allInfo[i].confirmedRelative-0,
                    nativeRelative:allInfo[i].nativeRelative-0,
                    curConfirm:allInfo[i].curConfirm-0,
                    asymptomaticLocalRelative:allInfo[i].asymptomaticLocalRelative-0,
                    asymptomatic:allInfo[i].asymptomatic-0,
                    crued:allInfo[i].crued-0,
                    time:curtime,
                    tworelative:i
                }
                db.query(mysql,data,(err,result)=>{
                    if(err){
                        return
                    }
                    if(result.affectedRows!==1){
                        return
                     }
                })
            }
            if(result.length===1){
                const data={
                    id:result[0].id,
                    area:allInfo[i].area,
                    confirmed:allInfo[i].confirmed-0,
                    died:allInfo[i].died-0,
                    confirmedRelative:allInfo[i].confirmedRelative-0,
                    nativeRelative:allInfo[i].nativeRelative-0,
                    curConfirm:allInfo[i].curConfirm-0,
                    asymptomaticLocalRelative:allInfo[i].asymptomaticLocalRelative-0,
                    asymptomatic:allInfo[i].asymptomatic-0,
                    crued:allInfo[i].crued-0,
                    time:curtime,
                    tworelative:i
                }  
                if(JSON.stringify(data)!==JSON.stringify(result[0])){
                    const mysql='UPDATE epidemicone SET ? WHERE epidemicone.area=?'
                    db.query(mysql,[data,data.area],(err,result)=>{
                        if(err){
                            return
                        }
                        if(result.affectedRows!==1){
                            return
                         }
                    })
                }
            }
        })
        for(let j=0;j<allInfo[i].subList.length;j++){
            const mysql='SELECT * FROM epidemictwo WHERE epidemictwo.city=? AND epidemictwo.tworelative=?'
            db.query(mysql,[allInfo[i].subList[j].city,i],(err,result)=>{
                if(err){
                    return
                }
                if(result.length===0){
                    const mysql='INSERT INTO epidemictwo SET ?'
                    const data={
                        city:allInfo[i].subList[j].city,
                        confirmed:allInfo[i].subList[j].confirmed-0,
                        died:allInfo[i].subList[j].died-0,
                        confirmedRelative:allInfo[i].subList[j].confirmedRelative-0,
                        nativeRelative:allInfo[i].subList[j].nativeRelative-0,
                        curConfirm:allInfo[i].subList[j].curConfirm-0,
                        asymptomaticLocalRelative:allInfo[i].subList[j].asymptomaticLocalRelative-0,
                        asymptomatic:allInfo[i].subList[j].asymptomatic-0,
                        crued:allInfo[i].subList[j].crued-0,
                        time:curtime,
                        tworelative:i,
                        threerelative:i*100+j
                    }
                    db.query(mysql,data,(err,result)=>{
                        if(err){
                            return
                        }
                        if(result.affectedRows!==1){
                            return
                        }
                    })
                }
                if(result.length===1){
                    const mysql='UPDATE epidemictwo SET ? WHERE epidemictwo.city=? AND epidemictwo.tworelative=?'
                    const data={
                        id:result[0].id,
                        city:allInfo[i].subList[j].city,
                        confirmed:allInfo[i].subList[j].confirmed-0,
                        died:allInfo[i].subList[j].died-0,
                        confirmedRelative:allInfo[i].subList[j].confirmedRelative-0,
                        nativeRelative:allInfo[i].subList[j].nativeRelative-0,
                        curConfirm:allInfo[i].subList[j].curConfirm-0,
                        asymptomaticLocalRelative:allInfo[i].subList[j].asymptomaticLocalRelative-0,
                        asymptomatic:allInfo[i].subList[j].asymptomatic-0,
                        crued:allInfo[i].subList[j].crued-0,
                        time:curtime,
                        tworelative:i,
                        threerelative:i*100+j
                    }
                    if(JSON.stringify(data)!==JSON.stringify(result[0])){
                        db.query(mysql,[data,data.city,i],(err,result)=>{
                            if(err){
                                return
                            }
                            if(result.affectedRows!==1){
                                return
                            }
                        })
                    }
                }
            })
            for(let z=0;z<allInfo[i].subList[j].dangerousAreas.subList.length;z++){
                const mysql='SELECT * FROM epidemicthree WHERE epidemicthree.area=? AND epidemicthree.threerelative=?'
                db.query(mysql,[allInfo[i].subList[j].dangerousAreas.subList[z].area,100*i+j],(err,result)=>{
                    if(err){
                        return
                    }
                    if(result.length===0){
                        const mysql='INSERT INTO epidemicthree SET ?'
                        const data={
                            area:allInfo[i].subList[j].dangerousAreas.subList[z].area,
                            level:allInfo[i].subList[j].dangerousAreas.subList[z].level,
                            isNew:allInfo[i].subList[j].dangerousAreas.subList[z].isNew,
                            threerelative:100*i+j
                        }
                        db.query(mysql,data,(err,result)=>{
                            if(err){
                                return
                            }
                            if(result.affectedRows!==1){
                                return
                            }
                        })
                    }
                    if(result.length===1){
                        const mysql='UPDATE epidemicthree SET ? WHERE epidemicthree.area=? AND epidemicthree.threerelative=?'
                        const data={
                            id:result[0].id,
                            area:allInfo[i].subList[j].dangerousAreas.subList[z].area,
                            level:allInfo[i].subList[j].dangerousAreas.subList[z].level,
                            isNew:allInfo[i].subList[j].dangerousAreas.subList[z].isNew,
                            threerelative:100*i+j
                        }
                        if(JSON.stringify(data)!==JSON.stringify(result[0])){
                            db.query(mysql,[data,data.area,data.threerelative],(err,result)=>{
                                if(err){
                                    return
                                }
                                if(result.affectedRows!==1){
                                    return
                                }
                            })
                        }
                    }
                })
            }
        }
    }

    next()
}
module.exports=getAllInfo