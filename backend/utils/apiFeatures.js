class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        this.query = this.query.find({ ...keyword })
        return this
    }

    filter() {
        const queryCopy = { ...this.queryStr }

        //Removing Some Fields from the Query
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el => delete queryCopy[el])

        //Adding filter for Price and Ratings
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resPerPage*(currentPage - 1)

        this.query = this.query.limit(resPerPage).skip(skip)
        return this
    }
}


module.exports = APIFeatures