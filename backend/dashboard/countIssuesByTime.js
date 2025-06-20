const {IssueModel} = require('../models.js')

async function countIssuesByTime() {
  try{
    const currentYear = new Date().getFullYear()
    const allMonths = Array.from({length: 12}, (_, index) => ({
      year: currentYear,
      month: index + 1,
      count: 0
    }))

    // mongoDB aggregation pipeline to group issues by month and year
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
          _id:{ // specify criteria for grouping documents
            year: {$year: "$time"},// extract year component from "time" field
            month: {$month: "$time"}
          },
          count: {$sum: 1} // calculate count of documents for each group (increment by 1)
        }
      },

      {
        $sort: { // sort grouped documents by year & month in ascending order
          "_id.year": 1,
          "_id.month": 1
        }
      },

      {
        $project: {
          _id: 0, // exclude _id field from output
          year: "$_id.year",// Include a new field 'year' with the value from '_id.year'
          month: "$_id.month",
          count: 1
        }
      }
    ])

    // results of issue counts of an entire year
    const combinedResult = allMonths.map(month => {
      const found = result.find(item => item.year === month.year && item.month === month.month)
      return found || month;
    })

    return combinedResult
  }catch (error) {
    console.error(error)
  } 
}

module.exports = { countIssuesByTime }