const AWS = require('aws-sdk')
const AdmZip = require('adm-zip')
const path = require('path')

const functionName = process.argv[2]
if (!functionName) {
    console.error("Usage: " + path.basename(process.argv[1]) + " <function-name>")
    process.exit(-1)
}

console.log("Creating function: " + functionName)

const awsProfile = process.env.AWS_PROFILE
if (!awsProfile) {
    console.error("Set AWS_PROFILE environment variable")
    process.exit(-1)
}
console.log("PROFILE: " + process.env.AWS_PROFILE)

const awsRegion = process.env.AWS_REGION
if (!awsRegion) {
    console.error("Set AWS_REGION environment variable")
    process.exit(-1)
}
console.log("REGION: " + process.env.AWS_REGION)

const awsRole = process.env.AWS_LAMBDA_ROLE
if (!awsRole) {
    console.error("Set AWS_LAMBDA_ROLE environment variable")
    process.exit(-1)
}
console.log("Lambda role: " + process.env.AWS_LAMBDA_ROLE)

const credentials = new AWS.SharedIniFileCredentials({profile: awsProfile})
AWS.config.credentials = credentials

const lambda = new AWS.Lambda({apiVersion: '2015-03-31', region: awsRegion})

// NOTE: Change code as needed here
//
const handlerCode = "exports.handler = async (event) => { const response = {statusCode: 200, body: {message: 'Hi, from lambda NodeJS CLI!'}}; return response; };"

const zip = new AdmZip()
zip.addFile('index.js', Buffer.from(handlerCode))
const zippedBuffer = zip.toBuffer()

const params = {
    Code: { ZipFile: zippedBuffer },
    FunctionName: functionName,
    Handler: 'index.handler',
    Role: awsRole,
    Runtime: 'nodejs14.x',
    Description: 'Test lambda function'
}

lambda.createFunction(params, function(err, data) {
    if (err) {
        console.error("Error from createFunction: " + err)
    } else {
        console.log("Lambda create function success!")
    }
})
