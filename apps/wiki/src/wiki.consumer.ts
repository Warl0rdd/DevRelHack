import {Injectable} from "@nestjs/common";
import {WikiService} from "./wiki.service";
import AddArticleDto from "./dto/add-article.dto";
import {MessagePattern} from "@nestjs/microservices";
import {WikiServiceMessagePattern} from "@app/common/enum/wiki-service.message-pattern.enum";

@Injectable()
export default class WikiConsumer {
    constructor(private readonly wikiService: WikiService) {}

    @MessagePattern(WikiServiceMessagePattern.addArticle)
    public async addArticle(dto: AddArticleDto) {

    }
}