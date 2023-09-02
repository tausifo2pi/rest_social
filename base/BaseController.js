class BaseController {
    constructor(service){
        this.service = service
    }

    async create(req){
        return await this.service.create(req.body)
    }

    async read(req){
        return await this.service.read(req.query)
    }

    async readById(req){
        return await this.service.readById(req.query)
    }

    async updateById(req){
        return await this.service.update(req.query, req.body)
    }
}

module.exports = BaseController