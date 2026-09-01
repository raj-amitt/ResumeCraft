const mongoose =  require ("mongoose") 

/**
 * -job description : string
 * -resume text  : string //we will extract this from the uploaded pdf 
 * -self description : string
 * 
 * -matchScore : number
 * 
 * -Technical Questions:
 *             [{
 *              question:"",
 *              intention:"",
 *              answer:""
 *              }]
 * -Behavioral Questions:
 *              [{
 *              question:"",
 *              intention:"",
 *              answer:""
 *              }]
 * -Skill Gaps:[{
 *              skill:"",
 *              severity:{  //this will determine that we can close the skill gap in given time or not
 *                      type:string,
 *                      enum:["low","medium","high"]
 *                          }
 *              }]
 * -preparation plan :[{
 *                     day:number,
 *                      focus: String,
 *                      tasks:[String] 
 *                      }]
 */



//Creating Sub schemas below to ensure that the main Report Schema does not get cluttered
const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required:[true,"Technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is Required"]
    }
},{
    _id:false
})
const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required:[true,"Technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is Required"]
    }
},{
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"Severity is required"]
    }
},{
    _id:false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"focus is required"]
    },
    tasks:[{
        type:String,
        required:[true,"Task is required"]
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required:[true,"Job description is required"],
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
},{timestamps:true})

const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema)
module.exports = interviewReportModel;