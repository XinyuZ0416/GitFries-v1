const {IssueModel} = require('../models.js')

async function countIssuesByLanguage() {
  try{
    const currentYear = new Date().getFullYear()

    // mongoDB aggregation pipeline to group issues by language and year
    const result = await IssueModel.aggregate([
      {
        $match: { // find data within current year
          time: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
          }
        }
      },
      
      {
        $group:{
          _id: "$language",
          count: {$sum: 1} // calculate count of documents for each group (increment by 1)
        }
      },

      {
        $sort: { // sort grouped documents by language in ascending order
          "_id.language": 1
        }
      },

      {
        $project: {
          _id: 0, // exclude _id field from output
          language: "$_id",
          count: 1
        }
      }
    ])

    return result
  }catch (error) {
    console.error(error)
  } 
}

module.exports = { countIssuesByLanguage }