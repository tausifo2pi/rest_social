
const { isObject, isRealPositiveNumber } = require("../../lib/isAnything")


class Paginate {

    constructor(Model) {
        this.Model = Model
    }

    async prepare(filter = [], facet = []) {
        const pipeLine = []

        //filter stage
        pipeLine.push(...filter)

        //facet stage
        const facetStage = {
            $facet: {
                page: [
                    {
                        $group: {
                            _id: null,
                            totalIndex: { $sum: 1 },
                        }
                    },

                    {
                        $unset: ["_id"]
                    },
                ],
                ...facet

            }
        }
        pipeLine.push(facetStage)
        return pipeLine


    }


    async exec(filter, facet, formatOptions) {


        const prepare = await this.prepare(filter, facet)
        let response = await this.Model.aggregate(prepare)

        const result = response[0]
        let page = result.page[0]

        if (isObject(page)) {
            page.sortOrder = formatOptions.sortOrder === 1 ? "ASC" : "DESC" || "ASC"
            page.sortBy = formatOptions.sortBy ? formatOptions.sortBy : "createdAt"
            page.currentPage = formatOptions.page
            page.totalPage = Math.ceil(page?.totalIndex / formatOptions.limit)
            page.perPage = formatOptions.limit
        }
        else {
            page = {}
            // page.sortOrder = formatOptions.sortOrder === 1 ? "ASC" : "DESC" || "ASC"
            // page.sortBy = formatOptions.sortBy ? formatOptions.sortBy : "createdAt"
            // page.currentPage = formatOptions.page
            // page.totalPage = 1
            // page.perPage = formatOptions.limit
        }
        result.page = page
        return result


    }
}

module.exports = Paginate