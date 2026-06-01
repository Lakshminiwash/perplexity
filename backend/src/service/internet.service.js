import {tavily as Tavily} from "@tavily/core"

const tavily = Tavily({
    apiKey:process.env.TAVILY_API_KEY
})

// const response = await tavily.search("todays date and time")
// console.log(response)

export const searchInternet = async({query})=>{
    const results = await tavily.search(query,{
        maxResults:5,

    })
    console.log(JSON.stringify(results))

    return JSON.stringify(results)
}