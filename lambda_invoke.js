const AWS = require('aws-sdk')
const path = require('path')

const functionName = process.argv[2]
if (!functionName) {
    console.error("Usage: " + path.basename(process.argv[1]) + " <function-name>")
    process.exit(-1)
}

console.log("Invoking function: " + functionName)

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

const credentials = new AWS.SharedIniFileCredentials({profile: awsProfile})
AWS.config.credentials = credentials

const lambda = new AWS.Lambda({apiVersion: '2015-03-31', region: awsRegion})

const invokeParams = {
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: '{ "dummy" : "somevalue" }'
}

lambda.invoke(invokeParams, function(err, data) {
    if (err) {
        console.error("Error from invokeFunction: " + err)
    } else {
        console.log("Lambda invoke function success, payload: " + data.Payload)
    }
})
