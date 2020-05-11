import moment from 'moment';

function isEmailValid(email) {
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(String(email).toLowerCase())
}

function profileImageName() {
    const imagePrefix = "IMG_";
    const imageSufix  = moment().format('YYYYMMDD_hhmmss')
    return `${imagePrefix}${imageSufix}`
}

function generateGroupID() {
    const groupIdPrefix = "TB_GR_";
    const groupIdSufix  = moment().format('YYYYMMDD_hhmmss')
    return `${groupIdPrefix}${groupIdSufix}`
}

export {
    isEmailValid,
    profileImageName,
    generateGroupID
}